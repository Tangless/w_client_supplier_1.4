module.exports = function (c) {
    var rename = require("gulp-rename");
    var cleanCSS = require('gulp-clean-css');
    var autoprefixer = require('gulp-autoprefixer');
    var customInclude = require('./customInclude/lib/index');
    
    return function () {
        return c.gulp.src([c.src + '/imodules/**/*.scss','!'+c.src + '/imodules/'+c.unsite+'/**/*.scss'])
            .pipe(customInclude({basepath: c.includePath,context: {site: c.site}}))
            .pipe(c.plugins.sass({includePaths: [c.src + '/sass']}).on('error', c.plugins.sass.logError))
            .pipe(autoprefixer({browsers: ['last 3 version', 'safari >= 5','ie >= 8', 'opera 20', 'Firefox >= 30','chrome >= 30','ios >= 7', 'android >= 4']}))
            .pipe(rename(function (path) {
                path.extname += ".min";
            }))
            .pipe(cleanCSS({compatibility: 'ie8'}))
            .pipe(c.gulp.dest(c.src + '/imodules/'));
    };
};