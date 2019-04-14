var gulp = require('gulp');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var sass = require('gulp-sass');
var minifycss = require('gulp-minify-css');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

gulp.task('images', function() {
  gulp.src('src/images/**/*')
    .pipe(cache(imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images/'));
});

gulp.task('styles', function() {
  gulp.src(['src/styles/style.scss'])
    .pipe(plumber({
      errorHandler: function(error) {
        console.log(error.message);
        this.emit('end');
      }
    }))
    .pipe(sass())
    .pipe(autoprefixer('last 10 versions'))
    .pipe(gulp.dest('dist/styles/'))
    .pipe(browserSync.reload({
      stream: true
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/styles/'))
});


gulp.task('scripts', function() {
  return gulp.src(['./src/scripts/plugins.js', './src/scripts/main.js'])
    .pipe(plumber({
      errorHandler: function(error) {
        console.log(error.message);
        this.emit('end');
      }
    }))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/scripts/'))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts/'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: "./"
    }
  });
});

gulp.task('bs-reload', function() {
  browserSync.reload();
});

gulp.task('default', ['browser-sync', 'styles', 'scripts', 'images'], function() {
  gulp.watch("src/styles/**/*.scss", ['styles']);
  gulp.watch("src/scripts/**/*.js", ['scripts']);
  gulp.watch("src/images/**/*.js", ['images']);
  gulp.watch("*.html", ['bs-reload']);
});

gulp.task('deploy', ['styles-deploy', 'scripts-deploy', 'images']);
