var gulp = require('gulp'),
	wiredep = require('wiredep').stream,
	jade = require('gulp-jade'),
	sass = require('gulp-sass'),
	prettify = require('gulp-prettify'),
	autoprefixer = require('gulp-autoprefixer'),
	browserSync = require('browser-sync'),
	del = require('del'),
	strip = require('gulp-strip-comments'),
	htmlmin = require('gulp-htmlmin'),
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-clean-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant');


//делаем сервер
gulp.task('server', function(){
	browserSync({
		server: {
			baseDir: 'src'
		},
		notify: false
	})
});


//компилируем sass
gulp.task('sass', function(){
	return gulp.src('src/scss/**/*.scss')
		.pipe(sass()).on('error', log)
		.pipe(autoprefixer('last 5 versions', '>1%', 'ie 11'))
		.pipe(gulp.dest('src/css'))
		.pipe(browserSync.reload({stream:true}));
});
//компилируем jade
//gulp.task('jade', ['wiredep'], function() {
gulp.task('jade', function() {
	return gulp.src('src/jade/pages/*.jade')
		.pipe(jade({
			pretty: true
	    })).on('error', log) 
		.pipe(gulp.dest('src'))
		.pipe(browserSync.reload({stream:true}));
});

gulp.task('js', function(){
	return gulp.src('src/js/**/*.js')
	.pipe(browserSync.reload({stream:true}));
})

gulp.task('img', function(){
	return gulp.src('src/img/**/*')
	.pipe(imagemin({
		interlaced: true,
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		une: [pngquant()]
	}))
	.pipe(gulp.dest('dist/img'));
})


//вставляем стандартные компоненты
gulp.task('wiredep', function() {
	gulp.src('src/*.html')
	.pipe(wiredep().on('error', log))
	.pipe(gulp.dest('src'))
});
//{ignorePath: /^(\.\.\/)*\.\./}

//создаем слежку
gulp.task('watch', ['jade', 'sass', 'wiredep'], function(){
	browserSync({
		server: {
			baseDir: 'src'
		},
		notify: false
	})
	gulp.watch('src/jade/**/*.jade', ['jade']);
	gulp.watch('src/scss/**/*.scss', ['sass']);
	gulp.watch('src/js/**/*.js', ['js']);
	gulp.watch('bower.json', ['wiredep']);
});

//запускаем действие по умолчанию
gulp.task('default', ['server', 'watch']);

//очистка
gulp.task('clean', function(){
	return del.sync('dist')
});















//компиляция
gulp.task('build', ['clean', 'img'], function(){
	// var buildCss = gulp.src([
	// 	'src/css/main.css'
	// ]).pipe(gulp.dest('dist/css'));

	var buildImg = gulp.src('src/img/**/*')
	.pipe(gulp.dest('dist/img'));

	var buildFonts = gulp.src('src/fonts/**/*')
	.pipe(gulp.dest('dist/fonts'));

	// var buildJs = gulp.src('src/js/**/*')
	// .pipe(gulp.dest('dist/js'));
	
	var optimizeCSSJS = gulp.src('src/*.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulp.dest('dist'));


	/*var buildHtml = gulp.src('src/*.html')
	.pipe(strip({safe: true}))
	.pipe(htmlmin({collapseWhitespace: true}))
	.pipe(gulp.dest('dist'));*/

	console.log("Скомпилировано!");
});



function log(error) {
    console.log([
        '',
        "----------ERROR MESSAGE START----------",
        ("[" + error.name + " in " + error.plugin + "]"),
        error.message,
        "----------ERROR MESSAGE END----------",
        ''
    ].join('\n'));
    this.end();
}