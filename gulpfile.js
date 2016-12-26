var gulp = require('gulp');
var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
gulp.task('clean', function(cb) {
	rimraf('./build', cb);
});




gulp.task('default', function() {
	if(!fs.existsSync(path.join(__dirname,'uploads'))){
		fs.mkdirSync(path.join(__dirname,'uploads'))
	}
	if(!fs.existsSync(path.join(__dirname,'logs'))){
		fs.mkdirSync(path.join(__dirname,'logs'))
	}
	if(!fs.existsSync(path.join(__dirname,'files'))){
		fs.mkdirSync(path.join(__dirname,'files'))
	}
	if(!fs.existsSync(path.join(__dirname,'files/analysis'))){
		fs.mkdirSync(path.join(__dirname,'files/analysis'))
	}
	if(!fs.existsSync(path.join(__dirname,'files/validate'))){
		fs.mkdirSync(path.join(__dirname,'files/validate'))
	}

	gulp.src(['package.json', 'process.production.json','uploads','files','logs'])
		.pipe(gulp.dest('build'));

	gulp.src(['files/*/**'])
		.pipe(gulp.dest('build/files'));

	fs.writeFileSync(path.join(__dirname,'logs/logs.txt'),'');

	gulp.src(['logs/*'])
		.pipe(gulp.dest('build/logs'));


	// gulp.src(['logs/*'])
	// 	.pipe(gulp.dest('build/logs'));


});

