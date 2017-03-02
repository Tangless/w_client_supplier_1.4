// AUTHOR:   SongErwei
// ROLE:    	
// CREATED:  2016-08-19 13:20:05
 
module.exports = function (c) {
	var replace = require('gulp-replace-task');

	// for what:
	// 因IE对CORS的支持不完善，故仅本地调试时用api.wanpinghui.com（就不能调IE了），线上环境用www(m).wanpinghui.com
    return function () {
		var dir = c.distSite + '/global/iscripts/';
		return c.gulp.src(dir + 'common.js')
			.pipe(replace({
				patterns: [
					{
						match: /gulp_make_api_origin/,
						replacement: function() {
							return c.which_api.trim();
						}
					}
				]
			}))
			.pipe(c.gulp.dest(dir));
	}
}
