// NOTE: this is defunct until this is reworked so that it can run more than once
const CONFIG = require('./config')

// Setting Imgur access token
const myRequest = require('request-promise-native').defaults({ json: true })
const Cred = require('./models/cred')

Cred.findOne({}).exec()
  .then(cred => {
    if (!cred) {
      throw { message: 'no credentials found' }
    }
    if (cred.expire < Date.now()) {
      return cred.refresh
    }
    process.env.access_token = cred.access
    throw { skip: true }
  })
  .then(refresh => {
    return myRequest
      .post('https://api.imgur.com/oauth2/token')
      .form({
        refresh_token: refresh,
        client_id: CONFIG.imgurClientID,
        client_secret: CONFIG.imgurClientSecret,
        grant_type: 'refresh_token'
      })
  })
  .then(response => {
    console.log('access token set')
    process.env.access_token = response.access_token
    return response
  })
  .then(info => {
    Cred.findOne({}, (err, cred) => {
      if (err) {
        throw err
      }
      cred.access = info.access_token
      cred.refresh = info.refresh_token
      const expire = +info.expires_in
      cred.expire = new Date(Date.now() + expire)
      cred.save()
    })
  })
  .catch(err => {
    if (err.skip) {
      console.log('access token set')
    } else {
      console.error(err.message)
    }
  })
