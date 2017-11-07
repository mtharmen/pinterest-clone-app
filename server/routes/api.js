const router = require('express').Router()
const Board = require('../models/board')
const User = require('../models/user')
const CONFIG = require('../config')
const my = require('./../helper')
const CustomError = my.CustomError
const myRequest = require('request-promise-native').defaults({ json: true })

function setHeaders () {
  if (!process.env.access_token) {
    console.log('access token not found, defaulting to anonymous upload')
    return { headers: { 'Authorization': 'Client-ID ' + CONFIG.imgurClientID } }
  }
  return { headers: { 'Authorization': 'Bearer ' + process.env.access_token } }
}

router.get('/allBoards/:username?', my.verifyToken, (req, res, next) => {
  const query = req.params.username ? { owner: req.params.username } : {}
  Board.find(query, '-deleteHash -srcImage -__v').exec()
    .then(boards => {
      if (req.params.username && !boards.length) {
        req.userCheck = true
        return User.findOne({ username: req.params.username }).exec()
      }
      return boards
    })
    .then(doc => {
      if (req.userCheck && !doc) {
        throw new CustomError(req.params.username + ' not found', 404)
      }
      if (doc.length) {
        const user = req.payload ? req.payload.username : ''
        res.json(convertLikes(doc, user))
      } else {
        res.json([])
      }
    })
    .catch(err => {
      return next(err)
    })
})

router.get('/likedBoards', my.verifyToken, my.UserGuard, (req, res, next) => {
  const user = req.user.username
  const query = { likes: user }
  // query.owner = { '$ne': user }
  Board.find(query, '-deleteHash -srcImage -__v', (err, boards) => {
    if (err) { return next(err) }
    res.json(convertLikes(boards, user))
  })
})

// TODO: directly save the image to the database?
router.post('/addBoard', my.verifyToken, my.UserGuard, (req, res, next) => {
  const srcImage = req.body.image
  const description = req.body.description
  const owner = req.user.username
  const likes = []

  if (!srcImage || !description) {
    const errorMsg = srcImage ? 'Description Required' : 'Image Required'
    return next(new CustomError(errorMsg, 400))
  }

  const board = {
    // image: srcImage,
    description,
    owner,
    likes: 0
  }

  // const newBoard = new Board(board)
  // newBoard.save((err, board) => {
  //   if (err) { return next(err) }
  //   res.json(board)
  // }
  
  // TODO: add option to upload directly?
  const form = { type: 'url', image: srcImage, title: description, description: req.user.username }
  if (process.env.access_token) {
    form.album = 'CWCQv'
  }
  myRequest.post('https://api.imgur.com/3/image/', setHeaders()).form(form)
    .then(response => {
      const deleteHash = response.data.deletehash
      const image = response.data.link
      const newBoard = new Board({ image, srcImage, description, owner, deleteHash, likes })
      return newBoard.save()
    })
    .then(saved => {
      board._id = saved._id
      board.image = saved.image
      res.json(board)
    })
    .catch(err => {
      console.error(err)
      res.send('error')
    })
})

router.delete('/removeBoard/:id', my.verifyToken, my.UserGuard, (req, res, next) => {
  const _id = req.params.id

  Board.findById(_id).exec()
    .then(board => {
      if (board.owner !== req.user.username) {
        throw new CustomError('Only the owner of this board may delete it', 401)
      }
      req.deleteHash = board.deleteHash
      return Board.findByIdAndRemove(_id).exec()
    })
    .then(result => {
      myRequest.delete('https://api.imgur.com/3/image/' + req.deleteHash, setHeaders())
    })
    .then(result => {
      res.send('removed')
    })
    .catch(err => {
      return next(err)
    })
})

router.put('/updateLikes/:id', my.verifyToken, my.UserGuard, (req, res, next) => {
  const _id = req.params.id

  Board.findById(_id, '-__v').exec()
    .then(board => {
      // Checking if the user has already liked the board
      const index = board.likes.indexOf(req.user.username)
      req.plusOne = index < 0
      if (req.plusOne) { // +1
        board.likes.push(req.user.username)
      } else { // -1
        board.likes.splice(index, 1)
      }
      return board.save()
    })
    .then(saved => {
      res.send(req.plusOne)
    })
    .catch(err => {
      return next(err)
    })
})

// TODO: Admin route to move anonymous uploads to album?

function convertLikes (boards, user) {
  const copy = JSON.parse(JSON.stringify(boards))
  return copy.map(board => {
    board.liked = board.likes.indexOf(user) > -1
    board.likes = board.likes.length
    return board
  })
}

module.exports = router
