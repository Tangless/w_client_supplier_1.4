module.exports = function (c) {
	var stub_dir = c.src + '/iscripts/global/test/stub/';
    return function () {
        return c.gulp.src([stub_dir + 'stub.js'])
            .pipe(c.plugins.fileInclude({basepath: stub_dir}))
            .pipe(c.gulp.dest(c.dist + '/global/temp/'))
    };
};
