define(function () {
    var baseIModules = project.baseIModules;
    var Module = (function () {
        var CON = function (dom) {
            baseIModules.BaseIModule.call(this, dom);
            this.about = this.find("[class^='about-']");
            this.report = this.find(".about-sina");
            //记录文字本身高度
            this.Height = this.find('.words').height();
            var that = this;
            if (location.hash && location.hash == "#report") {
                that.report.addClass("report");
            }
            that.about.each(function (i, o) {
                var _this = $(this);
                var currentHeight;
                _this.on("click", function () {
                    //alert(i);
                    //点击时当前文字高度
                    currentHeight = _this.find(".words").height();
                    if (i == 0 || i == 3) {
                        that.Height = 74;
                    } else if (i == 1) {
                        that.Height = 115;
                    } else if (i == 2) {
                        that.Height = 94;
                    } else if (i == 4) {
                        that.Height = 85;
                    }
                    if (currentHeight > that.Height) {
                        //当前为展开状态，将执行收回动画
                        //收回动画
                        _this.find('.words').height(currentHeight).animate({height: that.Height}, 500, function () {
                            _this.find('.icon-circle-up').css('display', 'none');
                            _this.find('.icon-circle-down').css('display', 'block');
                            _this.find('.words').css('overflow', 'hidden');

                        });
                    } else {
                        //当前为收回状态，将执行展开动画
                        autoHeight = _this.find('.words').css('height', 'auto').height();
                        _this.find('.icon-circle-down').css('display', 'none');
                        _this.find('.words').height(that.Height).animate({height: autoHeight},
                            500, function () {
                                _this.find('.icon-circle-up').css('display', 'block');
                                _this.find('.words').css('overflow', 'auto');
                            }
                        );
                    }
                });
              /*  //展开事件监听
                _this.find(".icon-circle-down").on('click', function (e) {
                    var Open = $(this);
                    autoHeight = _this.find('.words').css('height', 'auto').height();
                    _this.find('.icon-circle-down').css('display', 'none');
                    _this.find('.words').height(that.Height).animate({height: autoHeight},
                        500, function () {
                            _this.find('.icon-circle-up').css('display', 'block');
                            _this.find('.words').css('overflow', 'auto');
                        }
                    );
                });
                //收回事件监听
                _this.find(".icon-circle-up").on('click', function (e) {
                    if (i == 0 || i == 3) {
                        that.Height = 74;
                    } else if (i == 1) {
                        that.Height = 115;
                    } else if (i == 2) {
                        that.Height = 94;
                    } else if (i == 4) {
                        that.Height = 85;
                    }
                    var furl = $(this);
                    curHeight = _this.find('.words').height();
                    //收回动画
                    _this.find('.words').height(curHeight).animate({height: that.Height}, 500, function () {
                        _this.find('.icon-circle-up').css('display', 'none');
                        _this.find('.icon-circle-down').css('display', 'block');
                        _this.find('.words').css('overflow', 'hidden');

                    });
                });*/

            });
        };
        potato.createClass(CON, baseIModules.BaseIModule);

        return CON;
    })();
    return Module;
});
