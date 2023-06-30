const gulp = require('gulp');
const cleancss = require('gulp-clean-css');
const rename = require('gulp-rename');
const minify = require('gulp-minify');
const sass = require('gulp-sass')(require('sass'));

function styles() {
  return gulp.src('assets/globaltab.scss')
      .pipe(sass())
      .pipe(cleancss())
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest('assets/'));
}

function scripts() {
  return gulp.src('assets/globaltab.js')
      .pipe(minify({
        ext: {
          min: '.min.js',
        },
        preserveComments: 'some',
        noSource: true,
      }))
      .pipe(gulp.dest('assets/'));
}

function watch() {
  gulp.watch('assets/globaltab.scss', styles);
  gulp.watch('assets/globaltab.js', scripts);
}

exports.styles = styles;
exports.scripts = scripts;
exports.watch = watch;

gulp.task('default', watch);
