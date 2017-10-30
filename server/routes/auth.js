const router = require('express').Router()
const OAuth = require('oauth').OAuth

const User = require('./../models/user')
const CONFIG = require('./../config')
const my = require('./../helper')
const CustomError = my.CustomError

router.get('/test', (req, res) => {
  res.send('Auth Test')
})

// ****************************************************************************************************
//                                                TWITTER LOGIN
// ****************************************************************************************************
// https://github.com/ciaranj/node-oauth/blob/master/examples/twitter-example.js for Oauth/Twitter reference
let oa = new OAuth(
  'https://api.twitter.com/oauth/request_token',
  'https://api.twitter.com/oauth/access_token',
  CONFIG.TWITTER_CONSUMER_KEY,
  CONFIG.TWITTER_CONSUMER_SECRET,
  '1.0A',
  CONFIG.CALLBACK_URL,
  'HMAC-SHA1'
)

const successRedirectUrl = CONFIG.successRedirectUrl || 'http://google.ca'
const failureRedirectUrl = CONFIG.failureRedirectUrl || 'http://youtube.com'

// Getting Request Token + Secret
router.get('/twitter/', (req, res, next) => {
  oa.getOAuthRequestToken((err, oauthToken, oauthTokenSecret, result) => {
    if (err) {
      console.error('Error getting OAuth request token')
      req.session.error = err
      res.redirect(failureRedirectUrl)
      return
    }
    req.session.oauthRequestToken = oauthToken
    req.session.oauthRequestTokenSecret = oauthTokenSecret
    if (req.session.oauthAccessToken) {
      return verifyCredentials(req, res)
    }
    return getAuthorization(req, res)
  })
})

function getAuthorization (req, res) {
  const authorizationUrl = 'https://api.twitter.com/oauth/authorize?oauth_token=' + req.session.oauthRequestToken
  res.redirect(authorizationUrl)
}

// Getting Access Token + Secret => Finding/Making User
router.get('/callback', (req, res, next) => {
  const oauthRequestToken = req.session.oauthRequestToken
  const oauthRequestTokenSecret = req.session.oauthRequestTokenSecret
  const oauthVerifier = req.query.oauth_verifier

  if (!req.query.oauth_verifier) {
    console.error('Authorization Request denied')
    req.session.err = new CustomError('Authorization Request denied', 401)
    res.redirect(failureRedirectUrl)
    return
  }

  oa.getOAuthAccessToken(oauthRequestToken, oauthRequestTokenSecret, oauthVerifier,
    (err, oauthAccessToken, oauthAccessTokenSecret, result) => {
      if (err) {
        console.error('Error getting OAuth access token: ' + err.message)
        req.session.error = err
        res.redirect(failureRedirectUrl)
        return
      }

      delete req.session.oauthRequestToken
      delete req.session.oauthRequestTokenSecret

      req.session.oauthAccessToken = oauthAccessToken
      req.session.oauthAccessTokenSecret = oauthAccessTokenSecret
      req.twitterID = '' + result.user_id
      // Checking if user is already in database
      return pullUserInfo(req, res)
    })
})

function pullUserInfo (req, res) {
  const twitterID = req.twitterID || req.profile.twitter.id
  User.findOne({ 'twitter.id': twitterID }).exec()
    .then(user => {
      if (!user) {
        if (req.profile) {
          // Already have user info => make new user
          return makeNewTwitterUser(req, res)
        }
        // Don't have user info => get from verfiyCredentials
        req.noUser = true
        return verifyCredentials(req, res)
      }
      req.session.user = user
      console.log('success1')
      return res.redirect(successRedirectUrl)
    })
    .catch(err => {
      req.session.err = err
      return res.redirect(failureRedirectUrl)
    })
}

function verifyCredentials (req, res) {
  const verifyUrl = 'https://api.twitter.com/1.1/account/verify_credentials.json'
  const oauthAccessToken = req.session.oauthAccessToken
  const oauthAccessTokenSecret = req.session.oauthAccessTokenSecret

  oa.get(verifyUrl, oauthAccessToken, oauthAccessTokenSecret, (err, userInfo, response) => {
    if (err) {
      console.error('Error verifying token: ' + err.message)
      return getAuthorization(res, req)
    }
    const data = JSON.parse(userInfo)
    req.profile = {
      username: data.screen_name,
      twitter: {
        id: data.id_str,
        // token: oauthAccessToken,
        // tokenSecret: oauthAccessTokenSecret
        displayName: data.name
      }
    }
    if (req.noUser) {
      // Already checked the database if the user exists => skip to making a new user
      return makeNewTwitterUser(req, res)
    }
    // Check if user is in database already
    return pullUserInfo(req, res)
  })
}

function makeNewTwitterUser (req, res) {
  let newUser = new User()
  newUser.username = req.profile.username
  newUser.twitter.id = req.profile.twitter.id
  // newUser.twitter.token = req.profile.twitter.token
  // newUser.twitter.tokenSecret = req.profile.twitter.tokenSecret
  newUser.twitter.displayName = req.profile.twitter.displayName
  newUser.role = 'member'

  newUser.save()
    .then(user => {
      req.session.user = user
      console.log('success2')
      return res.redirect(successRedirectUrl)
    })
    .catch(err => {
      req.session.error = err
      delete req.session.user
      return res.redirect(failureRedirectUrl)
    })
}

// Route for client to call to get user after twitter login
router.get('/get-user', getUser, my.sendToken)

function getUser (req, res, next) {
  if (req.session.user) {
    req.user = req.session.user
    delete req.session.user
    return next()
  } else {
    return next(new CustomError('No User Found', 404))
  }
}

// Route for unlinking Twitter info
router.get('/unlink', my.verifyToken, my.UserGuard, (req, res, next) => {
  delete req.session.oauthAccessToken
  delete req.session.oauthAccessTokenSecret
  User.findByIdAndRemove(req.user._id).exec()
    .then(removed => {
      res.send('removed')
    })
    .catch(err => {
      next(err)
    })
})

module.exports = router
