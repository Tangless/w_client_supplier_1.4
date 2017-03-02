module.exports = function (c) {
   	return function () {
		//@@ref: https://www.npmjs.com/package/gulp-imagemin
		var imagemin = require('gulp-imagemin');
		return c.gulp.src([c.src + '/**/*.+(jpg|png|gif)'])
			.pipe(imagemin([imagemin.gifsicle(), imagemin.jpegtran(), imagemin.optipng(), imagemin.svgo()],{verbose:true}))
			.pipe(c.gulp.dest(c.src));
    }
};

