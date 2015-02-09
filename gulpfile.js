var gulp      =  require('gulp'),
    imagemin  =  require('gulp-imagemin'),
    htmlmin   =  require('gulp-minify-html'),
    uglify    =  require('gulp-uglify'),
    cssmin    =  require('gulp-cssmin');


var config = {
  "build": "dist",
  "images": {
    "source": "images/*",
    "target": "/images"
  },
  "css": {
    "source": "css/*",
    "target": "/css"
  },
  "js": {
    "source": "js/*",
    "target": "/js"
  },
  "html": {
    "source": "*.html",
    "target": "/"
  },
  "sounds": {
    "source": "sounds/*",
    "target": "/sounds"
  }
};

gulp.task('css', function () {
  return gulp.src(config.css.source)
  .pipe(cssmin())
  .pipe(gulp.dest(config.build + config.css.target));
});

gulp.task('html', function () {
  return gulp.src(config.html.source)
  .pipe(htmlmin())
  .pipe(gulp.dest(config.build + config.html.target));
});

gulp.task('js', function () {
  return gulp.src(config.js.source)
  .pipe(uglify())
  .pipe(gulp.dest(config.build + config.js.target));
});

gulp.task('sounds', function () {
  return gulp.src(config.sounds.source)
  .pipe(gulp.dest(config.build + config.sounds.target));
});

gulp.task('img', function() {
  return gulp.src(config.images.source)
  .pipe(imagemin({
    progressive: true,
  }))
  .pipe(gulp.dest(config.build + config.images.target));
});

gulp.task('build', ['html','css','js','img','sounds']);

gulp.task('default', ['build']);
