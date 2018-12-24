'use strict';

var gulp = require('gulp');
var bs = require('browser-sync');
var sass = require('gulp-sass');
var gutil = require( 'gulp-util' );
var ftp = require( 'vinyl-ftp' );
var concatCss = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');
var htmlmin = require('gulp-htmlmin');
var cleanCSS = require('gulp-clean-css');
var fontmin = require('gulp-fontmin');
var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var uglify = require('gulp-uglify');
var pump = require('pump');
var concatCss = require('gulp-concat-css');
var concat = require('gulp-concat');
var htmlhint = require('htmlhint');
var rev = require('gulp-rev-append');

// Gulp plumber error handler
//function errorLog(error) {
    //console.error.bind(error);
    //this.emit('end');
//}

gulp.task('concat', function() {
  return gulp.src('src/styles/*.css')
    .pipe(concat('style.css'))
    .pipe(gulp.dest('src/styles'));
});

// Minify JS - Minifies JS
gulp.task('uglify', function (cb) {
  pump([
        gulp.src('src/js/main.js'),
        uglify(),
        gulp.dest('dist/js')
    ],
    cb
  );
});


gulp.task('minify', () => {
  return gulp.src('src/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'));
});

gulp.task('cleanCSS', () => {
  return gulp.src('src/css/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('imagemin', function () {
    return gulp.src('src/img/dev/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}]
        }))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('fontmin', function () {
    return gulp.src('src/fonts/*.ttf')
    	.pipe(gulp.src('src/fonts/*.eot'))
    	.pipe(gulp.src('src/fonts/*.svg'))
    	.pipe(gulp.src('src/fonts/*.woff'))
    	.pipe(gulp.src('src/fonts/*.woff2'))
        .pipe(fontmin({
            text: '天地玄黄 宇宙洪荒',
        }))
        .pipe(gulp.dest('dist/fonts'));
});



// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {

    bs.init({
        server: "./src"
    });

    gulp.watch("src/sass/*.sass", ['sass']);
    gulp.watch("src/*.html").on('change', bs.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("src/sass/*.sass")
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 15 versions'],
            cascade: false
        }))
        .pipe(concatCss("main.css"))
        .pipe(gulp.dest("src/css"))
        .pipe(bs.stream());
});

// Htmlhint - Validate HTML
gulp.task('htmlhint', function() {
    gulp.src('src/*.html')
        .pipe(htmlhint())
        .pipe(htmlhint.reporter())
        .pipe(htmlhint.failReporter({ suppress: true }))
});

//очищает кэш
gulp.task('rev', function() {
  gulp.src('src/index.html')
    .pipe(rev())
    .pipe(gulp.dest('.'));
});

gulp.task('default', ['serve']);

gulp.task( 'deploy', function () {

	var conn = ftp.create( {
		host:     '88.99.93.73',
		user:     'name',
		password: 'gjgjgjgj',
		log:      gutil.log
	} );

	var globs = [
		'./src/**',
	];

	// using base = '.' will transfer everything to /public_html correctly
	// turn off buffering in gulp.src for best performance

	return gulp.src( globs, { base: '.', buffer: false } )
		.pipe( conn.newer( '/www/front-end.info/myPortfolio' ) ) // only upload newer files
		.pipe( conn.dest( '/www/front-end.info/myPortfolio' ) );

} );