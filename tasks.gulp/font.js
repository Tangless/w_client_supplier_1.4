module.exports = function (c) {
    var rename = require("gulp-rename");

    return function () {
        return c.gulp.src([c.src+'/sass/*/font/**/*','!'+c.src+'/sass/'+c.unsite+'/font/**/*'])
            .pipe(rename(function (path) {
                var arr = path.dirname.split(/[\\/]/);
                arr.splice(1,0);
                path.dirname = arr.join('/');
            }))
            .pipe(c.gulp.dest(c.dist));
    };
};
