const gulp = require('gulp');
const browserSync = require('browser-sync').create();
//const pug = require('gulp-pug');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const rimraf = require('rimraf');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const cache = require('gulp-cache');
const babel = require('gulp-babel');
 
// babel. Compele ES6 to ES5
gulp.task('default', () =>
    gulp.src('src/app.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(gulp.dest('dist'))
);

/* -------- Server  -------- */
gulp.task('server', function() {
  browserSync.init({
    server: {
      port: 9000,
      baseDir: "build"
    }
  });
  gulp.watch('build/**/*').on('change', browserSync.reload);
});


gulp.task('html:build', function () {
  return gulp.src('source/*.html') //Выберем файлы по нужному пути
      .pipe(gulp.dest('build')) //Выплюнем их в папку build
      .pipe(browserSync.reload({stream: true})); //И перезагрузим наш сервер для обновлений
});

/* ------------ Styles compile ------------- */
gulp.task('styles:compile', function () {
  return gulp.src('source/styles/main.sass')
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(autoprefixer({browsers: ['last 15 versions'], cascade: false}))
    .pipe(cleanCSS())
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest('build/css'))
    .pipe(browserSync.stream());
});

/* ------------ Compress image ------------- */
gulp.task('compress', function() {
  return gulp.src('source/img/**/*.+(png|jpg|gif|svg)')
  .pipe(cache(imagemin({ // Сжимаем их с наилучшими настройками
      interlaced: true,
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    })))
    .pipe(gulp.dest('build/img'))
    .pipe(browserSync.reload({stream: true}));
});


/* ------------ JS compile ------------- */
gulp.task('js', function () {
  return gulp.src([
      'source/js/main.js'
    ])
  .pipe(sourcemaps.init())
  .pipe(concat('main.min.js')) // для конкатенации файлов
  .pipe(uglify()) // Минимизировать весь js 
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('build/js'))
  .pipe(browserSync.reload({stream: true}));  
});

/* ------------ Delete ------------- */
gulp.task('clean', function del(cb) {
  return rimraf('build', cb);
});

/* ------------ Copy fonts ------------- */
gulp.task('copy:fonts', function() {
  return gulp.src('./source/fonts/**/*.*')
    .pipe(gulp.dest('build/fonts'));
});

/* ------------ Copy images ------------- */
// gulp.task('copy:images', function() {
//   return gulp.src('./source/img/**/*.*')
//     .pipe(gulp.dest('build/img'));
// });

/* ------------ Copy ------------- */
gulp.task('copy', gulp.parallel('copy:fonts'/*, 'copy:images'*/));

/* ------------ Watchers ------------- */
gulp.task('watch', function() {
  gulp.watch('source/**/*.html', gulp.series('html:build'));
  gulp.watch('source/styles/**/*.sass', gulp.series('styles:compile'));
  //gulp.watch('source/img/**/*.*', gulp.series('copy:images'));
  gulp.watch('source/img/**/*.*', gulp.series('compress'));
  gulp.watch('source/js/**/*.js', gulp.series('js'));
});

gulp.task('default', gulp.series(
  'clean',
  gulp.parallel('html:build', 'styles:compile', 'compress', 'js',/*'copy'*/),
  gulp.parallel('watch', 'server')
  )
);
