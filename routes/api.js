var request = require('request-promise-native');
var fs      = require('fs');

var Board  = require('../config/models/board');
var User  = require('../config/models/user');

module.exports = function(app) {

	app.get('/api/allBoards/:user?', function(req, res, next) {

		var query = req.params.user ? { owner: req.params.user } : {};

		Board.find(query, '-__v', function(err, boards) {
			if (err) { return next(err); }

			var user = req.user ? req.user.username : '';
			res.json(convertLikes(boards, user));
		});
	});

	app.get('/api/userCheck/:user', function(req, res, next) {

		var query = req.params.user ? { username: req.params.user } : {};

		User.findOne(query, '-__v', function(err, user) {
			if (err) { return next(err); }

			res.send(!!user);
		});
	});

	// Doesn't work with Heroku since the server spins up based on what's on github
	app.post('/api/addBoardOld', function(req, res, next) {

		var imageUrl    = req.body.image;
		var description = req.body.description;
		var owner       = req.user.username;

		var imgID = generateID(4);
		var path = './dist/imgs/' + imgID + '.png';

		request(imageUrl)
			.pipe(fs.createWriteStream(path))
			.on('error', function(err) { return next(err); })
			.on('close', function() { 
				var newBoard = new Board({
					image       : '/imgs/' + imgID + '.png',
					description : description,
					owner       : owner,
					likes       : []
				});

				newBoard.save(function(err) {
					if (err) { return next(err); }
					res.json(convertLikes([newBoard], owner));
				});
			});
	});

	app.post('/api/addBoard', function(req, res, next) {

		var imageUrl    = req.body.image;
		var description = req.body.description;
		var owner       = req.user.username;

		var newBoard = new Board({
			image       : imageUrl,
			description : description,
			owner       : owner,
			likes       : []
		});

		newBoard.save(function(err) {
			if (err) { return next(err); }
			res.json(convertLikes([newBoard], owner));
		});
	});

	app.get('/api/removeBoard/:id', function(req, res, next) {
		var id = req.params.id;

		Board.findOneAndRemove({ _id: id }, function(err) {
			if (err) { return next(err); }
			res.send('removed');
		});
	});

	app.get('/api/updateLikes/:id', function(req, res, next) {
		var id = req.params.id;

		Board.findOne({ _id: id }, '-__v', function(err, board) {
			if (err) { return next(err); }

			var index = board.likes.indexOf(req.user.username);
			var plusOne = index < 0;
			if (plusOne) { // +1
				board.likes.push(req.user.username);
			} else { // -1
				board.likes.splice(index, 1);
			}

			board.save(function(err) {
				if (err) { return next(err); }
				res.send(plusOne);
			});
		});
	});
};


// Defunct with Heroku
var generateID = function(num) {
	var length = num || 4;
	var letter = 'aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ0123456789';
	var id = '';

	while(id.length < length) {
		var i = Math.floor(Math.random()*letter.length);
		id += letter[i];
	}
	var path = './public/imgs/' + id + '.png';

	if (!fs.existsSync(path)) {
		return id;
	} else {
		generateID(num);
	}
};

var convertLikes = function(boards, user) {
	var copy = JSON.parse(JSON.stringify(boards));
	return copy.map(function(board) {
		var found = board.likes.indexOf(user);
		board.liked = found > -1;
		board.likes = board.likes.length;
		return board;
	});
};
