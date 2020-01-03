/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
var gulp = require('gulp');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var minify = require('gulp-clean-css');
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var del = require('del');

var prefixerOptions = {
    overrideBrowserslist: ['last 2 versions']
};

gulp.task('clean', function () {
    return del(['./Kepler'], {force: true});
});

// CSS
gulp.task('css', function () {
    return gulp.src('./assets/kepler.scss')
        .pipe(sass())
        .pipe(prefix(prefixerOptions))
        .pipe(minify())
        .pipe(rev())
        .pipe(gulp.dest('./Kepler/assets/'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./temp/rev/css'));
});

//JS
gulp.task('js', function () {
    return gulp.src(['./assets/kepler.js'])
        .pipe(concat('kepler.js'))
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest('./Kepler/assets/'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./temp/rev/js'));
});

gulp.task('md5', function () {
    return gulp.src(['./temp/rev/**/*.json', './templates/**/*ml'])
        .pipe(revCollector())
        .pipe(gulp.dest('./Kepler/templates/'));
});

gulp.task('move', function () {
    gulp.src(['./assets/statics/**/*'], {base: './assets/statics/'})
        .pipe(gulp.dest('./Kepler/assets/'));
    gulp.src(['./locale/*'])
        .pipe(gulp.dest('./Kepler/locale/'));
    return gulp.src(['./utils.py', './__init__.py', './LICENSE', './README.md'])
        .pipe(gulp.dest('./Kepler/'));
});

gulp.task('default', gulp.series('clean', gulp.parallel('css', 'js'), 'md5', 'move'));
