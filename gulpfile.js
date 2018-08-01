const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const annotate = require('gulp-annotate');
const plumber = require('gulp-plumber');

gulp.task('js', () =>
  gulp
    .src('./public/js/**/*.js')
    .pipe(plumber())
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('./public'))
);

gulp.task('watch', () => {
  gulp.watch('./public/js/**/*.js', ['js']);
});

gulp.task('default', ['js', 'watch']);
