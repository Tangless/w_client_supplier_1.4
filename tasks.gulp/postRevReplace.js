module.exports = function (cfg) {
	// 说明参照preRevReplace.js
	// 将 "jquery.shim-${md5}.js" 中的".js"抹掉
    var replace = require('gulp-replace');
    return function () {
		var dir = cfg.distSite + '/global/iscripts/';
        return cfg.gulp.src([dir + '*.js'])
            .pipe(replace(/(jquery.shim-[\S]+)(.js)/g, '$1'))
            .pipe(cfg.gulp.dest(dir))
    };
};
