const mongoose = require('mongoose')

const boardSchema = new mongoose.Schema({
  image: String,
  srcImage: String,
  description: String,
  owner: String,
  deleteHash: String, // NOTE: could save space by just using image ID from the image
  likes: [String]
})

module.exports = mongoose.model('Board', boardSchema)
