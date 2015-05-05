var gulp = require('gulp'),
 gutil = require('gulp-util'),
 coffee = require('gulp-coffee'),
 concat = require('gulp-concat'),
 compass = require('gulp-compass'),
 connect = require('gulp-connect'),
 gulpif = require('gulp-if'),
 gulpuglify= require('gulp-uglify'),
 browserify = require('gulp-browserify');

var env, coffeeSources, jsSources, sassSources, htmlSources,jsonSources, outputDir, sassStyle;

if(env ==='development'){

	outputDir='builds/development/';
	sassStyle= 'expanded';

} else {
	outputDir='builds/production/';
	sassStyle='compressed';

}

env = process.env.NODE_ENV || 'development';

 coffeeSources = ['components/coffee/tagline.coffee'];

 jsSources = ['components/scripts/rclick.js','components/scripts/pixgrid.js','components/scripts/tagline.js','components/scripts/template.js']

 sassSources=['components/sass/style.scss']

 htmlSources=['builds/development/*.html'];

 jsonSources=['builds/development/js/*.json'];

gulp.task('coffee', function(){
	gulp.src(coffeeSources).pipe(coffee( { bare:true } ).on('error',gutil.log)).pipe(gulp.dest('components/scripts'))

});

gulp.task('js', function(){

	gulp.src(jsSources).pipe(concat('script.js')).pipe(browserify()).pipe(gulpif(env==='production',gulpuglify())).pipe(gulp.dest('builds/development/js')).pipe(connect.reload())
});


gulp.task('compass', function(){

	gulp.src(sassSources).pipe(compass({ sass: 'components/sass', image: 'builds/development/images', style: sassStyle})).on('error',gutil.log).pipe(gulp.dest('builds/development/css')).pipe(connect.reload())
});


gulp.task('watch', function () {

	gulp.watch(coffeeSources,['coffee']);
	gulp.watch(jsSources,['js']);
	gulp.watch('components/sass/*.scss',['compass']);
	gulp.watch(htmlSources,['html']);
	gulp.watch(jsonSources,['json']);

});

gulp.task('connect', function(){

	connect.server({
		root: 'builds/development/',
		livereload: true
	});

});

gulp.task('html', function(){

	gulp.src(htmlSources).pipe(connect.reload())
});

gulp.task('json', function(){

	gulp.src(jsonSources).pipe(connect.reload())
});


gulp.task('default',['html','json','coffee','js','compass','connect','watch' ]);