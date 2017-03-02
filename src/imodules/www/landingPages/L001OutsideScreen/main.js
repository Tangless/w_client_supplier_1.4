define(function() {
    var baseIModules = project.baseIModules;
    var Module = (function(){
        var CON = function(dom){
            baseIModules.BaseIPage.call(this, dom, {container:false});
            // $(this._els.aaa)
            $(this._els.carousel1).carousel();
            $(this._els.carousel2).carousel();
        };

        potato.createClass(CON, baseIModules.BaseIPage);

        CON.prototype._ievent_postPhone= function (data,target) {
            var phone = $(target).parents('.collect-numbers').find('.form-control').val();
            project.getIModule('imodule://Track').trackSubmitPhone(phone);

            if(phone.length != 11){
                //验证手机号,不正确则显示提示信息
                $(target).parents('.collect-numbers').find(this._els.errorTip).addClass('show-tip');
            }else{
                //验证手机号,正确则隐藏提示信息
                $(target).parents('.collect-numbers').find(this._els.errorTip).removeClass('show-tip');

                var data = {
                    'who': 'L001',
                    'phone': phone
                };
                var _this = this;
                server.send_landing_phone(data,function (json,date) {
                    _this._succ(json,date,phone)
                });
                $(target).parents('.collect-numbers').find('.form-control').val('');
            }

        };
        //提交手机成功后,显示弹窗提示
        CON.prototype._succ = function(json,date,phone) {
            project.getIModule('imodule://Track').trackSubmitPhoneSucc(phone);

            $(this._els.succTip).addClass('fadeInBottom');
            var _this = this ;
            setTimeout(function () {
                $(_this._els.succTip).removeClass('fadeInBottom');
            },3000);
        };
        CON.prototype._ievent_hideTip = function (data, target) {
            $(target).parents('.collect-numbers').find(this._els.errorTip).removeClass('show-tip');
        };
        return CON;
    })();

    return Module;
});


