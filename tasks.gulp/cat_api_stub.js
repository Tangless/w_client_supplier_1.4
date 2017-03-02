module.exports = function (c) {
    return function () {
		var dist = c.dist + '/global/iscripts/';
		var temp = c.dist + '/global/temp/';
		return c.gulp.src([dist + 'common.js', temp + 'stub.js'])
			.pipe(c.plugins.concat('common.js'))
			.pipe(c.gulp.dest(dist));
    };
};
