module.exports = function (c) {
    var rename = require("gulp-rename");
    var customInclude = require('./customInclude/lib/index');

    return function () {
        return c.gulp.src([c.src + '/imodules/**/main.md.html','!'+c.src + '/imodules/'+c.unsite+'/**/main.md.html'])
        .pipe(customInclude({basepath: c.includePath,context: {site: c.site,ver: c.ver}, record:"imodules"}))
        .pipe(rename(function (path) {
            if(path.extname==".json"){return true;}
            var arr = path.dirname.split(/[\\/]/);
            path.dirname = [arr[0], 'imodules'].join('/');
            path.basename = arr[arr.length-1];
        }))
        .pipe(c.gulp.dest(c.dist));
    }
};