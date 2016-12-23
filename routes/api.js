var request = require('request-promise-native');
var fs      = require('fs');

var Board  = require('../config/models/board');
var User  = require('../config/models/user');

module.exports = function(app) {

	app.get('/api/testing', function(req, res, next) {
		res.json(mockData)
	});

	app.get('/api/allBoards/:user?', function(req, res, next) {

		var query = req.params.user ? { owner: req.params.user } : {};

		Board.find(query, '-__v', function(err, boards) {
			if (err) { return next(err); }

			var user = req.user ? req.user.username : ''
			res.json(convertLikes(boards, user));
		});
	});

	app.post('/api/checkImage/', function(req, res, next) {

		var query = req.body.imgUrl;

		// Check image
		res.send('checked');
	});

	app.post('/api/addBoard', function(req, res, next) {

		var imageUrl    = req.body.imageUrl;
		var description = req.body.description;
		var owner       = req.user.username;

		var imgID = generateID(4);
		var path = './public/imgs/' + imgID + '.png';

		request(imageUrl)
			.pipe(fs.createWriteStream(path))
			.on('error', function(err) { return next(err); })
			.on('close', function() { 
				var newBoard = new Board({
					image       : 'imgs/' + imgID + '.png',
					description : description,
					owner       : owner,
					likes       : []
				});

				newBoard.save(function(err) {
					if (err) { return next(err); }
					res.json(newBoard);
				});
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
				console.log(plusOne)
				res.send(plusOne);
			});
		});
	});

	app.get('/api/removeBoard/:id', function(req, res, next) {
		var id = req.params.id;

		Board.findOneAndRemove({ _id: id }, function(err) {
			if (err) { return next(err); }
			res.send('removed');
		});
	});
};

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
		board.liked = found > 0;
		board.likes = board.likes.length;
		return board;
	});
};

var mockData = [ 
	  { _id: '58532e193dbc6906d8298934',
	    image: 'http://placehold.it/100x90',
	    description: 'Blah blah blah',
	    owner: '@Admin',
	    likes: 4,
	    liked: false },
	  { _id: '58532e5cd6397617807c6dbf',
	    image: 'http://placehold.it/100x60',
	    description: 'Blah blah blah',
	    owner: '@Admin',
	    likes: 3,
	    liked: false },
	  { _id: '58532e609454330324995bb2',
	    image: 'http://placehold.it/100x80',
	    description: 'Blah blah blah',
	    owner: '@Admin',
	    likes: 3,
	    liked: false },
	  { _id: '58532e6292ed661e547e6f07',
	    image: 'http://placehold.it/100x90',
	    description: 'Blah blah blah',
	    owner: '@Admin',
	    likes: 1,
	    liked: false },
	  { _id: '58532e64d8c9830db44bcc37',
	    image: 'http://placehold.it/100x120',
	    description: 'Blah blah blah',
	    owner: '@Admin',
	    likes: 3,
	    liked: false },
	  { _id: '58532e670da5551654be5753',
	    image: 'http://placehold.it/100x70',
	    description: 'Blah blah blah',
	    owner: '@Admin',
	    likes: 1,
	    liked: false },
	  { _id: '585330ddb431840dcce7ced0',
	    image: 'http://placehold.it/100x50',
	    description: 'Blah blah blah',
	    owner: '@Admin2',
	    likes: 2,
	    liked: false },
	  { _id: '585330df46d0be21d4c09619',
	    image: 'http://placehold.it/100x110',
	    description: 'Blah blah blah',
	    owner: '@Admin2',
	    likes: 1,
	    liked: false },
	  { _id: '585330e03e7e3319bc2aef65',
	    image: 'http://placehold.it/100x130',
	    description: 'Blah blah blah',
	    owner: '@Admin2',
	    likes: 2,
	    liked: false },
	  { _id: '585330e6e49c4a1dd867c94f',
	    image: 'http://placehold.it/100x100',
	    description: 'Blah blah blah',
	    owner: '@Admin3',
	    likes: 2,
	    liked: false },
	  { _id: '585330e828b45d0c685373b4',
	    image: 'http://placehold.it/100x60',
	    description: 'Blah blah blah',
	    owner: '@Admin3',
	    likes: 1,
	    liked: false } 
]