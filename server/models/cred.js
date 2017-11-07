// NOTE: this is defunct until I figure out a better way to have it run one every request to check if the the access token is valid
const mongoose = require('mongoose')

const CredSchema = new mongoose.Schema({
  access: String,
  refresh: String,
  expire: Date
})

module.exports = mongoose.model('Credentials', CredSchema)
