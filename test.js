var fs = require('fs');
var request = require('request-promise-native');

var Board  = require('./config/models/board');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/testDB');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log('Connected to testDB');
});

// var download = function(uri, filename, callback){
//   request.head(uri, function(err, res, body){
//     if (res.headers['content-length'] > 5000000) {
//     	console.log('too big');
//     } else {
//     	request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
//     }
//   });
// };

// download('http://i.imgur.com/aXCE8O345.png', 'google.png', function(){
//   console.log('done');
// });


var generateBoard = function(random) {
	var names = ['@Testing', '@Tested', '@Tester', '@User', '@Person'];
	if (random) {
		var start = Math.floor(Math.random()*names.length);
		var len = Math.floor(Math.random()*(names.length - start) + 1);
		var users = names.splice(start, len);
	}

	var likes = random ? users : []; 
	var image = 'http://placehold.it/100x';
	image += random ? Math.floor(Math.random()*10)*10 + 50 : '150';

	var newBoard = new Board({
		image       : image,
		description : 'Blah blah blah',
		owner       : '@Admin1',
		likes       : likes
	});

	newBoard.save(function(err) {
		if (err) console.error(err);
		console.log('new board made');
	});

};

var convertLikes = function(boards) {
	return boards.map(function(board) {
		var found = board.likes.indexOf(user);
		board.liked = found > 0;
		board.likes = board.likes.length;
		return board;
	});
};

var getBoards = function(user) {
	var query = user ? {owner: user} : {};

	Board.find(query, '-__v', function(err, boards) {
		if (err) console.error(err);

		var copy = JSON.parse(JSON.stringify(boards));
		console.log(convertLikes(copy));
	});
};

// generateBoard(true);
var user = '';
//getBoards(user);

var image = 'http://placehold.it/200x500';

var newBoard = new Board({
	image       : image,
	description : 'Blah blah blah',
	owner       : '@MrKarmaCow',
	likes       : []
});

newBoard.save(function(err) {
	if (err) console.error(err);
	console.log('new board made');
});

