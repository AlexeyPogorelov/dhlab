var gulp = require('gulp'),
	browserSync = require('browser-sync'),
	reload = require('browser-sync').reload;

var serverConfig = {
	server: {
		baseDir: "./www/src"
	},
	tunnel: true,
	host: 'localhost',
	port: 63341,
	logPrefix: "DH_lab"
};

// SERVER
gulp.task('browser-sync', function() {
	browserSync.init(serverConfig);
	gulp.watch('www/**/*.*').on('change', reload);
});

// RELOAD
gulp.task('browser-reload', function() {
	gulp.dest('www/src/css')
		.pipe(reload({stream:true}));
});

gulp.task('default', ['browser-sync', 'watch']);

// WATCH
gulp.task('watch', function(){
});