module.exports = function (cfg) {
    var revReplace = require('./revReplace/index');

    return function () {

        return cfg.gulp.src([cfg.distSite+"/rev/**/*.json", cfg.distSite+'/**/*.+(html|css|js)'])
            .pipe( revReplace({
                cdn: cfg.cdn
            }) )
            .pipe(cfg.gulp.dest(cfg.distSite))
    };
}; 
