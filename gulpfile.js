const gulp = require('gulp');
//объединение файлов
const concat = require("gulp-concat");
// добавление префиксов
const autoprefixer = require("gulp-autoprefixer");
// оптимизация стилей
const cleanCSS = require("gulp-clean-css");
// оптимизация скриптов
const uglify = require("gulp-uglify");
// удаление файлов
const del = require('del');
// синхронизация с браузером
const browserSync = require('browser-sync').create();
// нужен для less
const sourcemaps = require('gulp-sourcemaps');
// подключение less
const less = require('gulp-less');


const imagemin = require('gulp-imagemin');
//стили css
/* const cssFiles = [
    './src/css/main.css',
    './src/css/header.css'
]; */
const cssFiles = [
    './src/css/main.less',
    './src/css/header.less'
];
const jsFiles = [
    './src/js/lib.js',
    './src/js/main.js'
];
function styles(){  
    return gulp.src(cssFiles)
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(concat('style.css'))
    .pipe(autoprefixer({
        overrideBrowserslist:['last 2 versions'],
        cascade: false
    }))
   
    //минификация
    .pipe(cleanCSS({level:2}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.stream())
}
//на скрипты
function scripts(){
    return gulp.src(jsFiles)
    .pipe(concat('script.js'))
    //минификация
    .pipe(uglify())
    .pipe(gulp.dest('./build/js'))
    .pipe(browserSync.stream())
}
function clean(){
    return del(['build/*'])
}

gulp.task('img-compress', ()=>{
    return gulp.src('./src/img/**')
    .pipe(imagemin({
        progressive:true
    }))
    .pipe(gulp.dest('./build/img/'))
})
function watch(){
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch('./src/img/**', gulp.series('img-compress'))
    //обновление css файлов
    //gulp.watch('./src/css/**/*css styles)
    gulp.watch('./src/css/**/*less', styles)

    //обновление js файлов
    gulp.watch('./src/js/**/*js', scripts)

    gulp.watch("./*.html").on('change', browserSync.reload);
}

gulp.task('styles', styles);
gulp.task('scripts', scripts);

gulp.task('del', clean);
gulp.task('watch',watch);
gulp.task('build', gulp.series(clean, gulp.parallel(styles,scripts)));
gulp.task('dev', gulp.series('build','watch'));
gulp.task('default', gulp.series('del', gulp.parallel('styles','scripts','img-compress'), 'watch'));