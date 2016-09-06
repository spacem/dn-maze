var gulp = require('gulp'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    git = require('gulp-git'),
    bump = require('gulp-bump'),
    tag = require('gulp-tag-version');

var fs = require('fs');

var css_src = './public/scss/*.scss';
var js_src = [
  './public/lib/maze.js',
  './public/lib/skill.js',
  './public/lib/description.js',
  './public/lib/tech.js',
  './ui/ng-app.js',
  './services/**/*.js',
  './ui/**/*.js',
];

gulp.task('css', function () {
  gulp.src(css_src)
      .pipe(concat('maze.scss'))
      .pipe(sass({outputStyle: 'compressed'}))
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest('./public/css'));
});

gulp.task('js', function() {
  return gulp.src(js_src)
    .pipe(concat('maze.js'))
    .pipe(rename({suffix: '.min'}))
    // .pipe(uglify())
    .pipe(gulp.dest('./public/js'))
});

gulp.task('watch', function() {
  gulp.watch(css_src, ['css']);
  gulp.watch(js_src, ['js']);
});

// html templates
var templateCache = require('gulp-angular-templatecache');
// var htmlmin = require('gulp-htmlmin');

gulp.task('html', function () {
  return gulp.src('ui/**/*.html')
    // .pipe(plumber())
    // .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(templateCache({root: 'ui/', filename: 'templates.min.js'}))
    .pipe(gulp.dest('public/js'));
});

gulp.task('watch', ['default'], function() {
  var watcher = gulp.watch(['services/**/*.js', 'ui/**/*.js', 'ui/**/*.html', 'views/**/*.js', 'public/scss/*.scss'], ['default']);
  watcher.on('change', logChange);
})

function logChange(event) {
  console.log('*************************************************');
  console.log('*** ' + event.path + ' was ' + event.type + ' ***');
}

gulp.task('default', ['css', 'js', 'html'], function() {});
