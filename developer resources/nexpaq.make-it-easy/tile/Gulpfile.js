var gulp = require('gulp');
var sass = require('gulp-sass');
var zip = require('gulp-zip');

gulp.task('styles', function() {
    gulp.src('sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./css/'));
});

gulp.task('zip', function () {
    return gulp.src(['**', '!*.zip', '!*.sublime-project', '!*.sublime-workspace', '!package.json', '!Gulpfile.js', '!{bourbon,node_modules,jade,sass,svg}/**', '!{bourbon,node_modules,jade,sass,svg}'])
        .pipe(zip('nexpaq.devmod.app.zip'))
        .pipe(gulp.dest('./'));
});

//Watch task
gulp.task('default',function() {
    gulp.watch('sass/**/*.scss',['styles']);
    gulp.watch('js/export.js', ['fileinclude']);
});
