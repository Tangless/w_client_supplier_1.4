module.exports = function (c) {
	var spritesmith = require('gulp.spritesmith');
	var merge = require('merge-stream');
	 
    return function () {
		var src = [c.src + '/**/images/**/icon*.png', '!' + c.src + '/**/images/**/icon*@*.png'];
		var spriteData = c.gulp.src(src).pipe(spritesmith({
			imgName: 'sprite.png',
 			imgPath: '/images/sprite.png',
//			cssName: 'sprite.css',
 			cssName: 'sprite.scss',
			cssTemplate: './tasks.gulp/spritesmith.handlebars'
		}));

		var css = spriteData.css.pipe(c.gulp.dest(c.src + '/sprite/sass/'));
		var img = spriteData.img.pipe(c.gulp.dest(c.distSite + '/images/'));

		return merge(css, img); 
    };
}; 
