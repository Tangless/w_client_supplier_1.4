module.exports = function (c) {
    var customInclude = require('./customInclude/lib/index');
    
    return function () {
		var src_dir = c.src + '/imodules/m/home/test/Include/';

        return c.gulp.src([src_dir + '*.pgx.html'])
			.pipe(customInclude({basepath: src_dir, context: {sex_: "boy"}}))
			.pipe(c.gulp.dest(c.dist));
    }
};
