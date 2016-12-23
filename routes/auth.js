var User = require('../config/models/user');

module.exports = function(app, passport) {

  	// SERVER SIDE REDIRECTS
	app.get('/new', isLoggedIn);
	app.get('/profile', isLoggedIn);

	app.get('/auth/user', function(req, res) {
		res.json(req.user);
	});

	// LOGOUT
	app.get('/auth/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	// TWITTER LOGIN
	app.get('/auth/twitter', passport.authenticate('twitter'));

	app.get('/auth/twitter/callback',
		passport.authenticate('twitter', {
			successRedirect : '/',
			failureRedirect : '/'
		}
	));

	// UNLINK TWITTER
	app.get('/unlink/twitter', isLoggedIn, function(req, res) {
		var user           = req.user;
		user.twitter.token = undefined;
		req.logout();

		user.save(function(err) {
			if (err) { return next(err); }
			res.send('Account Unlinked');
		});
	});

};

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/');
}