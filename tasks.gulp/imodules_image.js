module.exports = function (c) {
    var rename = require("gulp-rename");
    return function () {
        return c.gulp.src([c.src + '/imodules/**/images/*.*','!'+c.src + '/imodules/'+c.unsite+'/**/images/*.*'])
            .pipe(rename(function (path) {
                var arr = path.dirname.split(/[\\/]/);
                path.dirname = [arr[0], 'images', 'imodules', arr[arr.length - 2]].join('/');

            }))
            .pipe(c.gulp.dest(c.dist));
    }
};