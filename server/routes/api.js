const router = require('express').Router()
const Board = require('../models/board')
const User = require('../models/user')
const CONFIG = require('../config')
const my = require('./../helper')
const CustomError = my.CustomError

const request = require('request-promise-native')
const myRequest = request.defaults({
  json: true,
  baseUrl: 'https://api.imgur.com/3/image',
  headers: { 'Authorization': 'Client-ID ' + CONFIG.imgurClientID }
})

router.get('/allBoards/:username?', my.verifyToken, (req, res, next) => {
  const query = req.params.username ? { owner: req.params.username } : {}
  Board.find(query, '-deleteHash -__v').exec()
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
  const query = { 'owner': { '$ne': user }, likes: user }
  Board.find(query, (err, boards) => {
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

  myRequest.post('/').form({ type: 'url', image: srcImage })
    .then(response => {
      const deleteHash = response.data.deletehash
      const image = response.data.link
      const newBoard = new Board({ image, description, owner, deleteHash, likes })
      return newBoard.save()
    })
    .then(saved => {
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
      myRequest.delete('/' + req.deleteHash)
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

function convertLikes (boards, user) {
  const copy = JSON.parse(JSON.stringify(boards))
  return copy.map(board => {
    board.liked = board.likes.indexOf(user) > -1
    board.likes = board.likes.length
    return board
  })
}

module.exports = router
