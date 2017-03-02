define(function () {
    var baseIModules = project.baseIModules;
    var Module = (function () {
        var CON = function (dom) {
            baseIModules.BaseIPage.call(this, dom);

            $('#Header').find('.top-left').click(function () {
                window.location.href = 'index.html'
            });

            this.biddRule();
            this.isShow();

            //如果是"立即咨询"跳转过来,直接展开洽谈室
            var isFromInvite = qs('isFromInvite');
            if(isFromInvite){
                $('#inRoom').trigger('click');
                $('#demand-info').hide();
                $('#BiddingRule').hide();
            }
            
        };
        potato.createClass(CON, baseIModules.BaseIPage);

        //操作洽谈室和详情页的显示
        CON.prototype.isShow = function(){
            var _this = this;
            var demand = $('#demand-info');
            var BiddingRule = $('#BiddingRule');
            BiddingRule.css('paddingBottom','0.5rem');

            //点击进入洽谈室
            $('#inRoom').click(function(){
                $('.statusText').text('正在洽谈');
                $('.statusIcon').removeClass('icon-Tender').addClass('icon-message02');

                $('.qiatan-info').show().addClass('detailFadeInUp detanimated');
                $('.grab-chat').removeHide();
                demand.slideUp();
                BiddingRule.hide();
            });
            //点击收起洽谈室
            $('#barDown').click(function(){
                var statusText = $('.statusText');
                var text = statusText.attr('changeText');
                statusText.text(text);
                $('.statusIcon').removeClass('icon-message02').addClass('icon-Tender');

                demand.slideDown();
                $('.qiatan-info').removeClass('detailFadeInUp detanimated').hide();
                setTimeout(function(){
                    $('.grab-chat').addHide();
                },500);
                _this.biddRule();
            })
        };

        //延迟显示竞标规则
        CON.prototype.biddRule = function(){
            var timer = null;
            clearTimeout(timer);
            timer = setTimeout(function(){
                $('#BiddingRule').show();
            },10)
        };

        return CON;
    })();

    return Module;
});

