module.exports = function (c) {
    var rename = require("gulp-rename");
    var autoprefixer = require('gulp-autoprefixer');

    return function () {
        return c.gulp.src([c.src + '/sass/**/*.*','!'+c.src + '/sass/'+c.unsite+'/**/*.*','!'+c.src+'/sass/*/font/**/*.*'])
            .pipe(c.plugins.sass({includePaths: [c.src + '/sass']}).on('error', c.plugins.sass.logError))
            .pipe(autoprefixer({browsers: ['last 5 version', 'safari >= 5','ie >= 8', 'opera 12.1', 'ios >= 7', 'android >= 4']}))
            .pipe(rename(function (path) {
                var arr = path.dirname.split(/[\\/]/);
                arr.splice(1,0,'sass');
                // console.log(path.dirname, '=>', arr.join('/'));
                path.dirname = arr.join('/');
            }))
            .pipe(c.gulp.dest(c.dist));
    };
};
