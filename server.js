require('dotenv').config();
var http     = require('http');
var app      = require('express')();
var passport = require('passport');

// Config
require('./config/setup')(app, __dirname);

// Routes
require('./routes/auth')(app, passport);
require('./routes/api')(app);
require('./routes/index')(app);

var port = process.env.PORT || 8080;

http.createServer(app).listen(port, function() {
	console.log('Listening on port', port);
});