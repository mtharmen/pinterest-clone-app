const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: String,

  twitter: {
    id: String,
    token: String,
    displayName: String
  }
})

module.exports = mongoose.model('User', userSchema)
