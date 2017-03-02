module.exports = function (cfg) {
    var del = require('del');
    var vinylPaths = require('vinyl-paths');
    var rev = require('./customRev/index');

    return function () {
        return cfg.gulp.src([cfg.distSite+'/**/*.+('+cfg.rev+')'])
            .pipe(vinylPaths(del))
            .pipe(rev())
            .pipe(cfg.gulp.dest(cfg.distSite))
            .pipe(rev.manifest())
            .pipe(cfg.gulp.dest(cfg.distSite+"/rev"));

    };
}; 
