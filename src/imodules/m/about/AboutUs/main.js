define(function () {
    var baseIModules = project.baseIModules;
    var Module = (function () {
        var CON = function (dom) {
            baseIModules.BaseIModule.call(this, dom);
            this.contentList = this.find(".content-list");
            this.contentAll = this.find(".content-all");
            var listHeight;
            //判断动画执行完成标志
            var flag = 0;
            //初始化content-all高度:可视页面高度减去关闭按钮高度
            var cHeight = window.innerHeight - this.find(".line-close").outerHeight(true);
            this.cHeight = cHeight;
            this.contentAll.height(cHeight);
            //记录点击时滚动条位置,初始化为0
            var sTop = 0;
            //文字内容初始化高度
            var wHeight = this.find(".words").height();
            this.wHeight = wHeight;
            //为每一个添加监听事件
            this.contentList.each(function (i, o) {
                var that = $(this);
                //点击事件监听
                that.find(".details").on('click', function (e) {
                    var my = $(this);
                    //防止动画未执行完成时就触发点击事件
                    if (flag == 0) {
                        flag = 1;
                        //获取content-list的paddingTop高度，去掉px
                        var listPadding = $(".content-list").css('padding-top').substring(0, 2);
                        //设置当前一块距离顶部的位置，收回后默认当前块在顶部
                        listHeight=that.offset().top-listPadding;
                        console.log("listHeight:::"+listHeight);
                        //记录滚动条位置
                        var scrollH = $(".content-all").scrollTop();
                        if (scrollH != 0) {
                            sTop = scrollH;
                        }
                        //点击第一个内容时的特殊处理
                        if (i == 0) {
                            sTop = 0;
                        }
                        sTop=sTop+listHeight;
                        console.log("sTop:::"+sTop);
                        //文字展开
                        curHeight = that.find('.words').height();
                        autoHeight = that.find('.words').css('height', 'auto').height();
                        if (parseInt(curHeight) <= wHeight) {
                            that.find('.cover').fadeOut(800);
                            //全部隐藏，被点击块渐变出现
                            $(".content-list").css('display', 'none');
                            $(".line").css('display', 'none');
                            that.css('display', 'block');

                            //展开动画
                            var setHeight = cHeight - that.find(".logo").outerHeight(true) - that.find(".title").outerHeight(true) - my.outerHeight(true) - listPadding;
                            that.find('.words').height(curHeight).animate({height: setHeight},
                                500, function () {
                                    that.find('.words').css('overflow', 'auto');
                                    $('#AboutUs').css('overflow', 'hidden');
                                    flag=0;
                                }
                            );
                            that.find('.see').text('收起');
                            $(this).find('.grab-open').addClass('rotate');
                        } else {
                            //收回时该块隐藏后再全部显示
                            //that.fadeOut(400);
                            that.find('.cover').fadeIn(500);
                            //收回动画
                            that.find('.words').height(curHeight).animate({height: wHeight}, 500, function () {
                                    that.find('.words').css('overflow', 'hidden');
                                    $('#AboutUs').css('overflow', 'auto');

                                });
                            $(".content-list").fadeIn(800);
                            $(".line").fadeIn(800, function () {flag = 0;});
                            $(".content-all").scrollTop(sTop);
                            that.find('.see').text('查看详细');
                            $(this).find('.grab-open').removeClass('rotate');

                        }
                    }
                });
            });
        };
        potato.createClass(CON, baseIModules.BaseIModule);
        // 关闭弹窗
        CON.prototype._ievent_close = function (data, target) {
            //收起内容
            this.find('.cover').fadeIn(1000);
            this.find('.words').height(this.wHeight);
            this.find('.words').css('overflow', 'hidden');
            this.find('.see').text('查看详细');
            this.find('.grab-open').removeClass('rotate');
            this.find(".content-all").height(this.cHeight);
            this.find(".content-list").css('display', 'block');
            this.find(".line").css('display', 'block');
            this.find(".content-all").scrollTop(0);
            project.getIModule("imodule://AboutUs", null, function (AboutUs) {
                document.body.style.overflow = "visible";
                $('html').css("overflow", "auto");
                document.body.removeChild(AboutUs.dom);
            });
        }
        return CON;
    })();

    return Module;
});
