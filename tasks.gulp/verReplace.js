module.exports = function (cfg) {
    var replace = require('gulp-replace');

    return function () {
        return cfg.gulp.src([cfg.distSite+'/**/*.+(html|js)'])
            .pipe(replace(/(['"])(\/[^'"]+?)(\.html)/gm, function($0,$1,$2,$3){return $1+(cfg.ver?'/':'')+cfg.ver+$2+$3}))
            .pipe(replace('/{{VERSION}}', function () {return cfg.ver?'/'+cfg.ver:'';}))
            .pipe(cfg.gulp.dest(cfg.distSite))
    };
};