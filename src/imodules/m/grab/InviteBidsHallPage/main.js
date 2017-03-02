define(function () {
    var baseIModules = project.baseIModules;
    var Module = (function () {
        var CON = function (dom) {
            baseIModules.BaseIPage.call(this,dom,{container:false});
            $('.header').css('position','fixed')
            //$('.header').css('box-shadow','none')
            //$('.header .title').removeClass('can_click');
            //this.find('#Header .logo').css('opacity',0);
        };
        potato.createClass(CON, baseIModules.BaseIPage);
        CON.prototype.initData = function(){
            var _this = this;
        	var screenH = $(window).height();
            var bodyH = $('body').height();
            
            if(bodyH<screenH){
            	$('#Footer .footer').css('position','fixed');
            	$('#Footer .footer').css("bottom",'0')
            }

        	$(window).scroll(function() {
                var scroll = $(this).scrollTop();
                var top = $(_this.find('.pBtn')).offset().top-18;
                if(scroll>=top){
                    _this.find('.icon-arrow').removeHide();
                }else{
                    _this.find('.icon-arrow').addHide();
                }
            })
            $('.icon-arrow').click(function(){
                $('html,body').animate({ scrollTop: 0 }, 800);
            })
            
            $('.back').click(function(){
                _this.find('#MyInviteBidsInfo').addHide();
            })
            $('.myBids').click(function(){
                can_click = false;
            })
        }
        CON.prototype._ievent_goTo = function(data,obj){
            var that = this;
            if(!project.data.user.user_type){
                project.open('imodule://ClientLoginForm', "_blank", "maxWidth");
            }else{
                var screenH =window.innerHeight|| $(window).height();
                $(window).resize(function(){
                    screenH =window.innerHeight||$(window).height();
                    var hei = $('.height').height();
                    $('.back').css("height",screenH);
                    $('.myBids').css("height",screenH-hei);
                    $('.noInfo').css("height",screenH-hei);
                })
                $('.back').css("height",screenH)
                that.find('#MyInviteBidsInfo').removeHide();
                var hei = $('.height').height();
                $('.myBids').css("height",screenH-hei);
                $('.noInfo').css("height",screenH-hei);
            }
        }
        CON.prototype.setMsgs = function(msgs){
            this.find('.my-invite .my-msgs').html(msgs).removeHide();
        }
        CON.prototype.setLength = function(length){
            this.find('.my-invite .my-info').html(length).removeHide();
        }
        return CON;
    })();

    return Module;
});

