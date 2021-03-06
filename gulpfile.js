var gulp        = require('gulp');
var babel       = require('gulp-babel')
var gutil       = require('gulp-util');
var nodemon     = require('gulp-nodemon');
var source      = require('vinyl-source-stream');
var babelify    = require('babelify');
var watchify    = require('watchify');
var browserify  = require('browserify');
var browserSync = require('browser-sync').create();

watchify.args.debug = true;

var html    = './views/**/*.html';
var scripts = './src/js/components/*.js';
var css     = './src/css/*.css';

var langs = ["es2015", "react"];
var wsApp = false;

/////// BUNDLE STUFF
var bundler = watchify(browserify('./src/js/scripts.js', watchify.args));

// transpile presets to use
bundler.transform(babelify.configure({
  presets: langs
}));

bundler.on('update', bundle);

function bundle() {

  gutil.log('Bundling...');

  return bundler.bundle()
    .on('error', function (err) {
	    gutil.log(err.message);
	    this.emit("end");
    })
    .pipe(source('bundle.js')) // the bundled file is passed along...
    .pipe(gulp.dest('dist/js')) // ...then spit out into the dist directory
    .pipe(browserSync.stream({ once: true })); // update the browser
}

// Optional command to manually bundle
gulp.task('bundle', ['css', 'font'], function () {
  	return bundle();
});

////// CSS STUFF
gulp.task('css', function() {
	return gulp.src('src/css/*.css')
		.pipe(gulp.dest('dist/css'))
		.pipe(browserSync.stream({ once: true }));
})

///// FONTS
gulp.task('font', function() {
	return gulp.src('src/fonts/*.*')
		.pipe(gulp.dest('dist/fonts'))
})


//////// JSX -> JS Transpile Stuff
gulp.task('babel', function() {
	gutil.log('Transpiling...');

	return gulp.src('src/js/scripts.js')
		.on('error', function (err) {
		    gutil.log(err.message);
		    this.emit("end");
	    })
		.pipe(babel({
			presets: langs
		}))
		.pipe(gulp.dest('dist/js/'))
		.pipe(browserSync.stream({ once: true }));
});


///// SERVER STUFF
gulp.task('nodemon', function (cb) {
	var started = false;
	nodemon({
		script: 'server.js',
		watch: ['server.js', 'routes/*.js', 'config/*.js'],
		env: {
			'NODE_ENV': 'development'
		}
	})
		.on('start', function() {
			if (!started) {
				cb()
				started = true;
			}
		})
		.on('change', ['bundle'], function() {
			if (!started) {
				cb()
				started = true;
			}
		})
		.on('restart', function () {
		  	console.log('restarted!');
		});
});

gulp.task('browser-sync', ['nodemon'], function() {
	browserSync.init(null, {
		proxy: 'http://localhost:8080',
	  	host: '192.168.1.6',
	  	port: '8080',
	  	open: 'external',
        files: ["views/*.html"],
        browser: "chrome",
        port: 3000
	});
});

gulp.task('build', ['bundle'])

gulp.task('default', ['bundle', 'browser-sync'], function() {

	gulp.watch(html, function() {
	 	browserSync.reload();
	})

	gulp.watch(scripts, ['bundle'])

	gulp.watch(css, ['css'], function() {
	 	browserSync.reload();
	})
})