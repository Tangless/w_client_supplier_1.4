module.exports = function (c) {
    var rename = require("gulp-rename");
    var customInclude = require('./customInclude/lib/index');
    
    
    return function () {
        return c.gulp.src([c.src + '/imodules/**/main.js','!'+c.src + '/imodules/'+c.unsite+'/**/main.js'])
        .pipe(customInclude({basepath: c.includePath,context: {ver: c.ver}}))
        .pipe(rename(function (path) {
            var arr = path.dirname.split(/[\\/]/);
            path.dirname = [arr[0], 'iscripts' , 'imodules'].join('/');
            path.basename = arr[arr.length-1];
        }))
        .pipe(c.gulp.dest(c.dist));
    }
};