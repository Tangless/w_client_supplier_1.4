module.exports = function (c) {
    var rename = require("gulp-rename");
    var customInclude = require('./customInclude/lib/index');
    
    return function () {
        return c.gulp.src([c.src+'/imodules/**/*.pg.html','!'+c.src+'/imodules/'+c.unsite+'/**/*.pg.html'])
        .pipe(customInclude({basepath: c.includePath,context: {site: c.site,ver: c.ver,wph: true}, record:"pages"}))
        .pipe(rename(function (path) {
            if(path.extname==".json"){return true;}
            var arr = path.dirname.split(/[\\/]/);
            var site = arr[0];
            var arr = path.basename.replace(".pg","").split("@");
            arr.unshift(site);
            path.basename = arr.pop();
            path.dirname = arr.join("/");
        }))
        .pipe(c.gulp.dest(c.dist));
    }
};
