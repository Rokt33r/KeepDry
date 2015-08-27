var gulp = require('gulp')
var stylus = require('gulp-stylus')
var livereload = require('gulp-livereload')
var jade = require('gulp-jade')
var watch = require('gulp-watch')
var plumber = require('gulp-plumber')
var exec = require('child_process').exec
var merge = require('merge-stream')

var buildHtml = function () {
  return gulp.src('example_src/index.jade')
    .pipe(plumber())
    .pipe(jade())
    .pipe(gulp.dest('example_dist/'))
    .pipe(livereload())
}
var buildCss = function () {
  return gulp.src('example_src/style.styl')
      .pipe(plumber())
      .pipe(stylus())
      .pipe(gulp.dest('example_dist'))
      .pipe(livereload())
}

gulp.task('build', function () {
  return merge(buildHtml(), buildCss())
})

gulp.task('default', ['build'], function (cb) {
  watch(['example_src/**/*.jade', 'example_src/**/*.styl', 'lib/**/*.styl'], function (file) {
    switch (file.extname) {
      case '.jade':
        buildHtml()
        break
      case '.styl':
        buildCss()
    }
  })

  livereload.listen()

  exec('node_modules/.bin/hs example_dist', function (err, stdout, stderr) {
    console.log(stdout)
    console.log(stderr)
    cb(err)
  })

  exec('open http://localhost:8080', function (err, stdout, stderr) {
    if (err) return console.error(err)
    console.log('Browser opened')
  })
})
