module.exports = function (c) {
   	return function () {
        var rename = require("gulp-rename");
        var combiner = require('stream-combiner2');

		var combined = combiner.obj([
			c.gulp.src([c.distSite + '/**/*.js', '!' + c.distSite + '**/*min*.js']),
//             rename(function(path) {
// 				path.dirname += "/org";
// 			}),
// 			c.gulp.dest(c.distSite),
			c.plugins.uglify({mangle:false}),
			c.gulp.dest(c.distSite)
		]);
		combined.on('error', console.error.bind(console));
    }
};

