const mongoose = require('mongoose')

const CredSchema = new mongoose.Schema({
  access: String,
  refresh: String,
  expire: Date
})

module.exports = mongoose.model('Credentials', CredSchema)
