const gulp = require('gulp');
const jison = require('gulp-jison');
const babel = require('gulp-babel');
const jasmine = require('gulp-jasmine');
const watch = require('gulp-watch');

gulp.task('test', () => {
    return gulp.src('./tmp/spec/**/*.spec.js')
        .pipe(jasmine());
});

gulp.task('watch', function() {
    gulp.watch(['./src/**/*.js', './test/**/*.js', './src/**/*.jison'], ['build']);
});

gulp.task('build-src', () => {
    return gulp.src('./src/**/*.js')
        .pipe(babel())
        .pipe(gulp.dest('./lib'));
});

gulp.task('build-test', () => {
    return gulp.src('./test/**/*.spec.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('./tmp/spec'));
});

gulp.task('jison', () => {
  return gulp.src('./src/**/*.jison')
        .pipe(jison({
            moduleType: 'commonjs'
        }))
        .pipe(gulp.dest('./lib'));
});

gulp.task('build', ['jison', 'build-src', 'build-test'], () => {
    gulp.start('test');
});

gulp.task('serve', ['build'], () => {
    gulp.start('watch');
});
