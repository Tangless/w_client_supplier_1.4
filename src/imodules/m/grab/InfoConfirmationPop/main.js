define(function() {
    var baseIModules = project.baseIModules;
    var Module = (function(){
        var CON = function(dom){
            baseIModules.BaseIModule.call(this, dom);
            this._getData();
            this._getInfoData();
            this.notEnough = $(this._els.notEnough);
            this._isLoading();
            this.isTrue;
            this.vation;

        };
        potato.createClass(CON, baseIModules.BaseIModule);

        //c3接口-请求身份是否激活,身份信息和钱包余额
        CON.prototype._getData=function(){
            var that = this;
            a_profile_req({
                succ: function(json){
                    that._judgmentData(json);
                },
                fail: function(json){
                    console.log('请求失败')
                }
            })
        };

        //b11接口-押金
        CON.prototype._getInfoData=function(){
            var that = this;
            var demand_id = qs('demand_id');
            a_demand_req_info(demand_id,{
                succ: function(json){
                    that._initData(json);
                },
                fail: function(json){
                    console.log('请求失败')
                }
            })
        };

        //渲染数据
        CON.prototype._initData=function(json){
            var that = this;
            var grabdepo = json.demand_info.grabdepo;//押金
            var balance = json.balance; //钱包余额

            if (parseInt(balance) >= parseInt(grabdepo)){
                $(this._els.iwallet).removeClass('icon-error');
                $(this._els.iwallet).addClass('icon-Correct-complete');
                that.isTrue = true;
            }else {
                $(this._els.iwallet).removeClass('icon-Correct-complete');
                $(this._els.iwallet).addClass('icon-error');
                that.isTrue = false;
            }
        };

        //判断是否激活
        CON.prototype._judgmentData=function(json){
            var that = this;
            $(this._els.iName).text(json.nick);
            $(this._els.iPhone).text(json.phone);
            $(this._els.iYue).text(std_money_format(json.balance));
            if(json.activated == 1){ //1为激活状态
                $(this._els.idMark).removeClass('icon-error');
                $(this._els.idMark).addClass('icon-Correct-complete');
                that.vation = true;
            }else {
                $(this._els.idMark).removeClass('icon-Correct-complete');
                $(this._els.idMark).addClass('icon-error');
                that.vation = false;
            }
        };

        //信息确认完成
        CON.prototype._isLoading=function(){
            var timer; //第一个loading延时两秒显示
            var vatTimer; //第二个loading延时4秒显示
            var turnTimer; //信息激活并且余额充足延时0.5s跳转下一个模块
            var that = this;
            
            clearTimeout(timer);
            clearTimeout(vatTimer);

            //2s第一个loading结束
            timer=setTimeout(function(){
                $(that._els.iLoadOne).fadeOut(500);
            },1000);

            //4s后第二个loading结束
            vatTimer=setTimeout(function(){
                $(that._els.iLoadYu).fadeOut(500);

                //当《钱包余额》loading完之后再显示充足还是不足-isTrue=true代表充足
                $(that._els.moneyDefault).hide();
                if(that.isTrue){
                    $(that._els.adequate).removeHide();
                }else{
                    $(that._els.notEnough).removeHide();
                    $(that._els.toRecharge).removeHide();
                }

                if(that.isTrue && that.vation){
                    //查看排队情况
                    turnTimer=setTimeout(function(){
                        a_demand_req_status(demand_id,{
                            succ:function (json) {
                                var status;
                                var rank = json.demand_info.rank;
                                var grabStatus = json.demand_info.status;
                                //正在进行中
                                if(parseInt(grabStatus) < 60){
                                    //获取客户信息
                                    if(parseInt(rank) <= 3){
                                        status = "3"
                                    }else if(parseInt(rank) > 3){
                                        //排队
                                        status = "2"
                                    }
                                }else if(parseInt(grabStatus) >= 60){
                                    //来晚了,订单已完成
                                    status = "4"
                                }
                                //调用GrabDetails模块的_transferTo方法;
                                var getSucc = function (GrabDetails) {
                                    
                                    //刷新页面
                                    if(status == "3"){
                                        window.location.href = 'index.html?demand_id='+demand_id;
                                    }else{
                                        window.location.reload();
                                    }
                                };
                                var GrabDetails = project.getIModule('imodule://GrabDetails',null,getSucc);
                                
                            },
                            fail:function () {
                                tlog("===抢单失败===");
                                window.location.href = 'index.html?demand_id='+demand_id;
                            }
                        })
                    },500)
                }
            },2000)
        };
        
        //充值按钮点击事件
        CON.prototype._ievent_goCharge = function () {
            potato.application.addLoadingItem($("#doCharge"));

            var getSucc = function (BalanceLowModal) {
                potato.application.removeLoadingItem($("#doCharge"));
                project.open(BalanceLowModal,"_blank","maxWidth");
            };
            var getFail = function () {
                potato.application.removeLoadingItem($("#doCharge"));
            };
            var BalanceLowModal = project.getIModule('imodule://BalanceLowModal',null,getSucc,getFail);
        };
        
        
        return CON;
    })();

    return Module;
});
