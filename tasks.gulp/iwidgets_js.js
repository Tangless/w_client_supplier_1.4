module.exports = function (c) {
    var rename = require("gulp-rename");
    var customInclude = require('./customInclude/lib/index');
    
    
    return function () {
        return c.gulp.src([c.src + '/iwidgets/**/main.js','!'+c.src + '/iwidgets/'+c.unsite+'/**/main.js'])
        .pipe(customInclude({basepath: './src/iwidgets',context: {ver: c.ver}}))
        .pipe(rename(function (path) {
            var arr = path.dirname.split(/[\\/]/);
            path.dirname = [arr[0], 'iscripts' , 'iwidgets'].join('/');
            path.basename = arr[arr.length-1];
        }))
        .pipe(c.gulp.dest(c.dist));
    }
};