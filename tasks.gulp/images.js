module.exports = function (c) {
    var rename = require("gulp-rename");
    return function () {
        return c.gulp.src([c.src + '/images/**/*.*','!'+c.src + '/images/'+c.unsite+'/**/*.*'])
            .pipe(rename(function (path) {
                var arr = path.dirname.split(/[\\/]/);
                arr.splice(1,0,'images');
                //console.log(path.dirname, '=>', arr.join('/'));
                path.dirname = arr.join('/');
            }))
            .pipe(c.gulp.dest(c.dist))
    };
};
