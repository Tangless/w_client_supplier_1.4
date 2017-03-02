define(function () {
    var baseIModules = project.baseIModules;
    var Module = (function () {
        var CON = function (dom) {
            baseIModules.BaseIModule.call(this, dom);
            this.totalAmount = this.find(".total-amount");
            this.price = '';
            this.payType = "";
            this.cityId = "";
        };
        potato.createClass(CON, baseIModules.BaseIModule);
        //参数传入
        CON.prototype.setBlance = function (str, price, pay_type, city_id) {
            this.totalAmount.text(str);
            this.price = price;
            this.payType = pay_type;
            this.cityId = city_id;

        }
        //支付取消
        CON.prototype._ievent_pCancel = function () {
            this.parent.close();
        };
        //支付：调支付宝弹窗
        CON.prototype._ievent_Pay = function () {
            var my = this;
            var price = {'deposit': this.price};
            var pay_type = this.payType;
            var city_id = this.cityId;
            //开通短信请求发送;
            a_auth_charge_sms_open(city_id, pay_type, price.deposit, {

                succ: function (json) {
                    my.parent.close();
                    project.tip("开通成功", "succ", "", true);
                    setTimeout(function () {
                        //刷新
                        location.reload();
                    },2000)


                },
                fail: function (json) {
                    if (json) {
                        var status = json.status;
                        //失败原因判断;
                        if (status == 1) {
                            my.parent.close();
                            project.tip("权限不足", "tipfail", "请升级成为工程商", true);
                            setTimeout(function () {
                                //刷新
                            },2000)
                        } else if (status == 2) {
                            //余额不足 调支付宝充值
                            var getSucc = function (BalanceLowModal) {
                                potato.application.removeLoadingItem($("#ensure-pay"));
                                project.open(BalanceLowModal, "_blank", "maxWidth");
                            };
                            var getFail = function () {
                                potato.application.removeLoadingItem($("#ensure-pay"));
                            };
                            var BalanceLowModal = project.getIModule('imodule://BalanceLowModal', null, getSucc, getFail);
                        }
                    }
                    potato.application.removeLoadingItem($("#ensure-pay"));
                }
            });

        };


        return CON;
    })();
    return Module;
});

