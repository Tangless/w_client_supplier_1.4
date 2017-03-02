module.exports = function (cfg) {
	// 因requeryjs的paths不能带上js，故文件名加md5时得费一番周折：替换前先加上js，替换后再抹去
	// 这里是替换前的处理：将js中的 jquery.shim => jquery.shim.js
	// 配对操作见postRevReplace.js
    var replace = require('gulp-replace');
    return function () {
		var dir = cfg.distSite + '/global/iscripts/';
        return cfg.gulp.src([dir + '*.js'])
            .pipe(replace('jquery.shim', 'jquery.shim.js'))
            .pipe(cfg.gulp.dest(dir))
    };
};
