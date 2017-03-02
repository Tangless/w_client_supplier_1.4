define(function() {
    var baseIModules = project.baseIModules;
    var Module = (function(){
        var CON = function(dom){
            baseIModules.BaseIModule.call(this, dom);
            var user = project.data.user;
            //现版本此城市暂时写死为郑州，注释以备后用
            // $(this._els.cityName).html(user.city_name);
            if (user.user_type == 100 && user.activated == 0) {         
                project.getIModule("imodule://ActivateSupplier",null,function(ActivateSupplier){
                    project.open(ActivateSupplier,"_blank",{type:"maxWidth",controls:[],closeAble:false});
                });
            }
            this.rightPanel = new pdom.CommonDialog({
                className: "rightPanel",
                effect: pdom.DialogEffect.slideLeft,
                bodyEffect: pdom.TurnEffect.slid,
                asideEffect: pdom.TurnEffect.slid,
                size : {width : 300, height : "100%"},
                position : { x: potato2.DialogPosition.Top, y: potato2.DialogPosition.Right }
            });
            potato2.application.appendChild(this.rightPanel);
            this.menuL=$(this._els.menuList);
            this._menuPosition();
        };
        potato.createClass(CON, baseIModules.BaseIModule);

        CON.prototype._ievent_goBack = function(){
            window.history.go(-1);
            return false;
        };
        CON.prototype._ievent_showUserInfo = function (data,obj) {
            var that = this;
            // 曾经用 if(!xxxx.user_type) 来判断，不妥。
            // 原因: !0 is true，BUT !'0' is false。而赋值的地方往往不区分0和'0'  --SongErwei
            if(0 == project.data.user.user_type){
                project.open('imodule://ClientLoginForm', "_blank", "maxWidth");
            }else{
                project.getIModule("imodule://UserInfo",null,function(UserInfo){
                    that.rightPanel.appendChild(UserInfo.VPresenter);
                    that.rightPanel.focus();
                });
            }
        }

        CON.prototype._ievent_aboutUs = function(){
            this.find('.menu').css("display","none");
            $(this._els.circleDown).removeClass('rotate');
            $('.menu-mask').remove();
            document.body.style.overflow="hidden";
            document.body.style.height="100%";
            $('html').css("height","100%");
            $('html').css("overflow","hidden");
            project.getIModule("imodule://AboutUs",null,function(AboutUs){
                document.body.appendChild(AboutUs.dom);
            })
        }

        CON.prototype._ievent_logoMenu = function(data,target){
            var _this = this;
            var html = '<div class="menu-mask" style="width: 100%;height: 100%;background-color: #000;position: absolute;top: 0.48rem;left: 0;z-index: 98;opacity: 0.6;-ms-filter: "progid:DXImageTransform.Microsoft.Alpha(opacity=60)";"></div>';
            
            //if判断是控制在招标大厅的时候logo隐藏的时候不可以点击
            if($(target).find('.title').hasClass('pubshadow') || $(target).find('.title').hasClass('can_click')) {
                if (_this.menuL.is(':hidden')) {
                    _this.menuL.slideDown();
                    $(_this._els.circleDown).addClass('rotate');
                    $('body').append(html);
                    $('.menu-mask').css('height',$(document).height())
                } else {
                    _this.menuL.slideUp();
                    $(_this._els.circleDown).removeClass('rotate');
                    $('.menu-mask').remove();
                }
            }

            $('.menu-mask').click(function(){
                $(this).remove();
                $(_this._els.circleDown).removeClass('rotate');
                _this.menuL.hide();
            })
        };

        CON.prototype._ievent_menuBtn = function(data,target){
            var _this = this;
            _this.menuL.find('p').removeClass('active');
            $(target).addClass('active');
        }

        CON.prototype._menuPosition = function(){
            var menup = qs('menu');
            if(qs('demand_id')){
               this.menuL.find('p').removeClass('active'); 
            }
            switch(menup) {
                case '1': //代表是首页
                    this.menuL.find('p').removeClass('active');
                    this.menuL.find('p').eq(0).addClass('active');
                    break;
                case '3': //代表是附近的工程商
                    this.menuL.find('p').removeClass('active');
                    this.menuL.find('p').eq(1).addClass('active');
                    break;
            }
        }
        return CON;
    })();
    return Module;
});

