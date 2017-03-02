module.exports = function (c) {
    return function () {
        c.gulp.src([c.distSite + '/**/*.css'])
            .pipe(c.plugins.cleanCss({debug: true}, function(details) { //, compatibility: 'ie8'  不需要加这段代码，否则识别不了ie8的hack
// 				console.log(details.name + ': ' + details.stats.originalSize);
// 				console.log(details.name + ': ' + details.stats.minifiedSize);
			}))
            .pipe(c.gulp.dest(c.distSite))
    };
};
