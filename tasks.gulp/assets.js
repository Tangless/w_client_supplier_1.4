module.exports = function (c) {
    var rename = require("gulp-rename");
    return function () {
        return c.gulp.src([c.src + '/assets/**/*.*','!'+c.src + '/assets/'+c.unsite+'/**/*.*'])
            .pipe(rename(function (path) {
                var arr = path.dirname.split(/[\\/]/);
                arr.splice(1,0,'assets');
                path.dirname = arr.join('/');
            }))
            .pipe(c.gulp.dest(c.dist));
    };
};
