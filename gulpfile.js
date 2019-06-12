const gulp = require('gulp'),
inject = require('gulp-inject-template'),
runSequence = require('run-sequence'),
less = require('gulp-less'),
sass = require('gulp-sass'),
path = require('path'),
concat = require('gulp-concat'),
babel = require('gulp-babel'),
plumber = require('gulp-plumber'),
merge = require('merge-stream'),
clearReadOnly = require('gulp-clear-readonly'),
del = require('del');

gulp.task('layouts', () =>
    gulp.src('./src/layouts/*.html')
    .pipe(gulp.dest('./dist' ))
)

gulp.task('less:customLess', function () {
    return gulp.src('./src/less/**/*.less')
    .pipe(plumber())
    .pipe(concat('custom-less.css'))
    .pipe(less({
        paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('./dist/css'))
})

gulp.task('sass:customSass', function () {
    return gulp.src('./src/sass/**/*.scss')
    .pipe(plumber())
    .pipe(concat('custom-sass.css'))
    .pipe(sass({
        paths: [ path.join(__dirname, 'sass', 'includes') ]
    }))
    .pipe(gulp.dest('./dist/css'))
})

gulp.task('css', function () {
  return gulp.src(['./node_modules/bootstrap/dist/css/bootstrap.min.css', 
  'node_modules/@fortawesome/fontawesome-free/css/all.min.css',
  'node_modules/@fortawesome/fontawesome-free/css/v4-shims.min.css',
  './src/css/*.css'])
  .pipe(concat('vendor.css'))
    .pipe(gulp.dest('./dist/css'))
})

gulp.task('inject:js', function () {
    return gulp.src('./src/routes.js', {buffer:false})
    .pipe(inject())
    .pipe(gulp.dest('./dist'))
})

gulp.task('js:custom', function () {
    return gulp.src([ './src/js/**/*.js', '!./src/routes.js'])
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(concat('custom.js'))
    .pipe(gulp.dest('./dist/js'))
})

gulp.task('js:vendor', function () {
    return gulp.src(['node_modules/lodash/lodash.min.js',
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/angular/angular.min.js',
    'node_modules/@uirouter/angularjs/release/angular-ui-router.min.js',   
    'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
    ])
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('./dist/js'))
})

gulp.task('js:lib', function () {
    return gulp.src(['./src/lib/mask-ssn-input-jquery-plugin.js',
    ])
    .pipe(concat('lib.js'))
    .pipe(gulp.dest('./dist/js'))
})

gulp.task('js', ['js:vendor', 'js:custom','js:lib'])
gulp.task('less', ['less:customLess'])
gulp.task('sass', ['sass:customSass'])

gulp.task('assets', function () {
    var img = gulp.src('./src/img/**/*')
    .pipe(gulp.dest('./dist/img'))

    var fonts = gulp.src(['node_modules/@fortawesome/fontawesome-free/webfonts/*',
    'src/font/*'])
    .pipe(gulp.dest('./dist/webfonts'))

    return merge(img, fonts)
})

gulp.task('watch', function(){
    return gulp.watch('./src/**/*', ['layouts', 'inject:js', 'js', 'css', 'assets', 'less', 'sass'])
})

gulp.task('clear-ro', function(){
    return clearReadOnly("./dist/routes.js" );
});

gulp.task('clean', function () {
    return del('./dist')
})

gulp.task('default', function () {
    return runSequence('clean', ['layouts', 'inject:js', 'js', 'css', 'assets', 'less', 'sass'])
});