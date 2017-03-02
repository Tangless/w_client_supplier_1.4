module.exports = function (c) {
	var gulpif = require('gulp-if');
	var sprity = require('sprity');
 
	return function () {
		// generate sprite.png and _sprite.scss 
// 		return c.gulp.src([c.src + '/images/**/*.*','!'+c.src + '/images/'+c.unsite+'/**/*.*'])
// 			.pipe(sprite({
// 				name: 'sprite',
// 				style: '_sprite.scss',
// 				cssPath: './img',
// 				processor: 'scss'
// 			}))
// 			.pipe(gulpif('*.png', gulp.dest(c.distSite + '/sprite/img/'), gulp.dest(c.distSite + '/sprite/scss/')))

		return sprity.src({
			src: c.src + '/**/*icon*.{png,jpg}',
			style: './sprite.scss',
			// ... other optional options 
			// for example if you want to generate scss instead of css 
			processor: 'sass', // make sure you have installed sprity-sass 
		  })
		  .pipe(gulpif('*.png', c.gulp.dest(c.distSite + '/sprity/img/'), c.gulp.dest(c.distSite + '/sprity/css/')))
	};
};
