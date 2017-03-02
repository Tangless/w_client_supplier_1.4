module.exports = function (c) {
    var rename = require("gulp-rename");
    var htmlmin = require('gulp-htmlmin');
    var customInclude = require('./customInclude/lib/index');
    
    return function () {
        return c.gulp.src([c.xsrc + '/iwidgets/**/*.mus.html','!'+c.xsrc + '/iwidgets/'+c.unsite+'/**/*.mus.html'])
            .pipe(customInclude({basepath: c.includePath,context: {site: c.site,ver: c.ver}}))
            .pipe(rename(function (path) {
                path.extname += ".min";
            }))
            .pipe(htmlmin({
                removeComments: true,//清除HTML注释
                collapseWhitespace: true//压缩HTML
            }))
            .pipe(c.gulp.dest(c.xsrc + '/iwidgets/'))
    };
};