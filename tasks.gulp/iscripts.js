module.exports = function (c) {
    var rename = require("gulp-rename");

    return function () {
        return c.gulp.src([c.src + '/iscripts/**/*.*',
						  '!' + c.src + '/iscripts/' + c.unsite+'/**/*.*', 
						  '!' + c.src + '/iscripts/global/test/**/*.*'])
            .pipe(c.plugins.fileInclude({basepath: c.iscriptsPath,context: {site: c.site}}))
            .pipe(rename(function (path) {
            var arr = path.dirname.split(/[\\/]/);
            arr.splice(1,0,'iscripts');
            //console.log(path.dirname, '=>', arr.join('/'));
            path.dirname = arr.join('/');
            if (path.extname != '.htc' && path.extname != '.css') {
                path.extname = ".js";
            }
        }))

        .pipe(c.gulp.dest(c.dist));

    };
}; 
