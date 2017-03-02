define(["/iscripts/iwidgets/Audio.js"], function (Audio) {
    var baseIModules = project.baseIModules;
    var Module = (function () {
        var CON = function (dom) {
            baseIModules.BaseIModule.call(this, dom);
            this.tpl = this._els.tpl[0].text;
            var _this = this;
            //监听项目编辑事件,更改项目信息
            potato.application.addListener('demandUpdate',function (event) {
                var demand_info = event.data.demand;
                _this.initTpl(demand_info);
            })

        };
        potato.createClass(CON, baseIModules.BaseIModule);


        //读取数据
        CON.prototype.initTpl = function (demand_info) {
            this.find('#detInfo').html('');
            var _this = this;
            var json = demand_info;
            var tpl = _this.tpl;
            _this.formatData(json);
            _this.isNone(json, _this);

            //等请求成功再渲染页面,防止页面元素闪动
            var dom = Mustache.render(tpl, {'demand_info':json.demand_info,'util':{
                loc: function(){
                    return api_dict.demand.loc[this.location];
                },
                type: function(){
                    return api_dict.demand.type[this.type];
                },
                color: function(){
                    return api_dict.demand.color[this.color];
                }
            }});
            this.find('#detInfo').html(dom);
            this._els = _this._getElements();
            _this.audio = new Audio(this.find('#audioPane')[0]);

            this.tplLoad(json);
            
        }

        //转化数据
        CON.prototype.formatData = function (json) {
            var info = json.demand_info;
            info.audioShow = 'hide';
            info.imgShow = 'hide';
            info.statusHide = 'hide';
        }

        //tpl内容加载后需要判断一些内容，否则打开多个弹窗时会出现bug
        CON.prototype.tplLoad = function(json){
            //如果有图片
            if (json.demand_info.image) {
                $(this._els.drawPic).removeHide();
            } else {
                $(this._els.drawPic).addHide();
            } 

            //如果有音频
            if (json.demand_info.audio) {
                this.find('#audioTag').attr('src', json.demand_info.audio);
                this.find('#audioPane').removeHide();
            }


            //判断项目是否结束
            if (json.demand_info.status == 60) {
                $(this._els.overStatus).removeHide();
            } else {
                $(this._els.overStatus).addHide();
            }
            var userid = project.data.user.user_id;

            
            //如果是自己的订单
            if (userid == parseInt(json.demand_info.client_id)) {
                $(this._els.tourProsess).addHide();
                $(this._els.yourProsess).removeHide();
                $(this._els.myUp).removeHide();
                if (json.demand_info.status != 60) { //编辑按钮只有在项目进行中并且是自己的才可以显示
                    $(this._els.myEdit).removeHide();
                }

            }
        }

        //判断某些数据是否为空
        CON.prototype.isNone = function (json, _this) {

            //预算的格式
            var money = std_money_format_in_th(json.demand_info.budget);
            var moneyUnit = money.unit;
            if (money.budget == "" || money.budget == 0) {
                money = "议价";
            } else {
                money = money.budget;
            }

            json.demand_info.whether = money;
            json.demand_info.unit = moneyUnit;

            //判断备注是否为空
            if (json.demand_info.note == '') {
                json.demand_info.dHide = 'hide';
            } else {
                json.demand_info.dHide = '';
            }

            //判断显示预算还是显示议价
            if (json.demand_info.budget == 0 || json.demand_info.budget == '') {
                json.demand_info.havePrice = 'hide';
            } else {
                json.demand_info.nonePrice = 'hide';
            }
           
        }

        CON.prototype._ievent_slideUp = function () {
            $(this._els.putContent).addHide();
            $(this._els.yourDetail).removeHide();

            $('.chat-pane').css('height', '475px');
            $('.demand-info').css('height', '122px');
        }
        CON.prototype._ievent_slideDown = function () {
            $(this._els.putContent).removeHide();
            $(this._els.yourDetail).addHide();
            $('.demand-info').css('height','460px');
            $('.chat-pane').css('height','135px');
        }

        

        CON.prototype._ievent_EditSelf = function () {
            var success = function (EditCurrentItem) {
                EditCurrentItem._init();
                $('.edit-project').removeClass('hide');
                $('.demand-info').addClass('hide');
                $('.chat-pane').addClass('hide');
                $('.input-pane').addClass('hide');
            };
            //标示此时是编辑标书状态,不是新建
            project.getIModule('imodule://EditCurrentItem',null, success);

        };


        return CON;
    })();


    return Module;
});

