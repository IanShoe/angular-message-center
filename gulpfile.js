var concat = require('gulp-concat');
var del = require('del');
var es = require('event-stream');
var gulp = require('gulp');
var html2js = require('gulp-ng-html2js');
var cssnano = require('gulp-cssnano');
var htmlmin = require('gulp-htmlmin');
var ngAnnotate = require('gulp-ng-annotate');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');

var pkg = {
  name: 'message-center',
  bower: 'bower_components/',
  dist: 'dist',
  build: 'build'
};

pkg.paths = {
  bowerDirectory: 'bower_components',
  bowerFile: 'bower.json',
  dist: {
    css: pkg.dist + '/css',
    js: pkg.dist + '/js'
  },
  js: ['src/js/*.js'],
  css: ['src/css/*.scss'],
  templates: ['src/html/*.html']
};

gulp.task('clean', function() {
  return del([pkg.dist]);
});

gulp.task('clean-js', function() {
  return del([pkg.paths.dist.js]);
});

gulp.task('clean-css', function() {
  return del([pkg.paths.dist.css]);
});

gulp.task('build-js', ['clean-js'], function() {
  var templateStream = gulp.src(pkg.paths.templates)
    .pipe(htmlmin())
    .pipe(html2js({
      moduleName: pkg.name + '.templates',
      prefix: 'templates/message-center/',
      stripPrefix: 'src/html/'
    }));

  var jsStream = gulp.src(pkg.paths.js);

  return es.merge(templateStream, jsStream)
    .pipe(ngAnnotate())
    .pipe(concat(pkg.name + '.js'))
    .pipe(gulp.dest(pkg.paths.dist.js))
    .pipe(rename(pkg.name + '.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(pkg.paths.dist.js));
});

gulp.task('build-css', ['clean-css'], function() {
  return gulp.src(pkg.paths.css)
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(rename(pkg.name + '.css'))
    .pipe(gulp.dest(pkg.paths.dist.css))
    .pipe(rename(pkg.name + '.min.css'))
    .pipe(cssnano({
      zindex: false
    }))
    .pipe(gulp.dest(pkg.paths.dist.css));
});

gulp.task('watches', function() {
  gulp.watch([pkg.paths.js, pkg.paths.templates], ['build-js']);
  gulp.watch([pkg.paths.css], ['build-css']);
});

// Build tasks
gulp.task('build', ['build-js', 'build-css']);

// Dev tasks
gulp.task('default', ['build', 'watches']);
