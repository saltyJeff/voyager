var ts = require('gulp-typescript');
var tsproj = ts.createProject('tsconfig.json');
var all = require('gulp-all');
var gulp = require('gulp');
var fs = require('fs');
gulp.task('default', function () {
	return all (
		tsproj.src()
        	.pipe(tsproj())
        	.js.pipe(gulp.dest('dist'))
	)
}) 
