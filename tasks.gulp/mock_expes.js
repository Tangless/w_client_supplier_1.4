module.exports = function (c) {
	var shell = require('gulp-shell');
    return function () {
		var js = './my-mock-responses.js'
		var cmd = 'node ' + js + ' --origin=http://' + c.local_server.host + ':' + c.local_server.port;
		return c.gulp.src('./my-mock-responses.js').pipe(shell([
			'echo ' + cmd, cmd	
		]));
    };
}; 
