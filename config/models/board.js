var mongoose = require('mongoose');

var boardSchema = new mongoose.Schema({
	image       : String,
	description : String,
	owner       : String,
	likes       : [String]
});

module.exports = mongoose.model('Board', boardSchema);