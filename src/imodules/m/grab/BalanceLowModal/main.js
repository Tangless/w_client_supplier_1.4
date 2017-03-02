define(function() {
    var baseIModules = project.baseIModules;
    var Module = (function(){
        var CON = function(dom){
            baseIModules.BaseIModule.call(this, dom);


        };
        potato.createClass(CON, baseIModules.BaseIModule);
        CON.prototype._ievent_chooseMoney = function(data,target,hit){
        	var select = $(hit).parents('.select');
            select.addClass('choosed').removeClass('select');
            select.siblings().removeClass('choosed').addClass('select');
        };
        CON.prototype._ievent_payMoney = function(){
            potato.application.addLoadingItem($("#ensure-charge"));
            
            var price = {'deposit':this.find('.choosed span').text()};
            //充值订单请求发送;
            a_auth_charge_order(price.deposit,{
                succ:function (json) {
                    //获取订单号;
                    var transnum = json.transnumber;
                    var chooseSucc = function(payModule){
                        payModule.setCtx(price,transnum);
                        project.open(payModule,'_blank','maxWidth');
                        potato.application.removeLoadingItem($("#ensure-charge"));
                    };

                    project.getIModule('imodule://AlipayModal',null,chooseSucc);
                },
                fail:function () {
                    potato.application.removeLoadingItem($("#ensure-charge"));
                }
            });
        };
        return CON;
    })();

    return Module;
});
