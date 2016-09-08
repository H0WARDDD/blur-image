var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var csscomb = require('gulp-csscomb');
var cssnano = require('gulp-cssnano');
var rename = require("gulp-rename");
var sass = require('gulp-sass');
var sequence = require('gulp-sequence');
var uglify = require('gulp-uglify');

gulp.task('csscomb', function() {
	return gulp.src('src/*.scss')
		.pipe(csscomb())
		.pipe(gulp.dest('src'));
});
gulp.task('sass', function() {
	return gulp.src('src/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: [
				'last 2 versions',
				'Explorer >= 9',
				'Android >= 4'
			]
		}))
		.pipe(gulp.dest('dist'));
});

gulp.task('cssminify', function() {
	return gulp.src(['*.css', '!*.min.css'], { cwd: 'dist' })
		.pipe(cssnano())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('dist'));
});

gulp.task('jsminify', function() {
	return gulp.src(['*.js', '!*.min.js'], { cwd: 'src' })
		.pipe(uglify())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('dist'));
});

gulp.task('css', sequence('csscomb', 'sass', 'cssminify'));

gulp.task('build', ['css', 'jsminify']);

gulp.task('watch', function() {
	gulp.watch('src/*.scss', ['css']);
	gulp.watch('src/*.js', ['jsminify']);
});
