var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var open = require('gulp-open');
var license = require('gulp-license');

function isArray (arr) {
	return typeof path == 'object' && path.hasOwnProperty('length');
}

function genFile (path, filename, shouldUglify, dist) {
	var fileList = [];
	if (isArray(path)) {
		fileList = path;
	} else {
		fileList.push(path);
	}
	var file = gulp.src(fileList);
	if (shouldUglify) {
		file
		.pipe(concat(filename.replace('.js', '.min.js')))
		.pipe(uglify())
		.pipe(gulp.dest(dist));
	}
	file
	.pipe(concat(filename))
	.pipe(gulp.dest(dist));
}

gulp.task('build', function () {
    genFile('./src/angular-json-explorer.js', 'angular-json-explorer.js', true, './dist');
    genFile('./src/angular-json-explorer.css', 'angular-json-explorer.css', false, './dist');
});

gulp.task('run', function () {
	gulp.src('./demo/demo.html')
	.pipe(open('<%file.path%>'));
});

gulp.task('default', ['build', 'run']);