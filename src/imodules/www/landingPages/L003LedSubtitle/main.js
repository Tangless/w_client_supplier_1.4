define(function() {
    var baseIModules = project.baseIModules;
    var Module = (function(){
        var CON = function(dom){
            baseIModules.BaseIModule.call(this, dom);
        };

        potato.createClass(CON, baseIModules.BaseIModule);

        CON.prototype._ievent_postPhone= function (data,target) {
            var phone = $(target).parents('.lsub-form').find('.lsub-put-shadow').val();
            project.getIModule('imodule://Track').trackSubmitPhone(phone);

            if(phone.length != 11){
                //验证手机号,不正确则显示提示信息
                $(target).parents('.lsub-form').find(this._els.errorTip).removeClass('hide');
                $(target).parents('.lsub-form').find('.form-control').addClass('lsub-put-error');
            }else{
                //验证手机号,正确则隐藏提示信息
                $(target).parents('.lsub-form').find(this._els.errorTip).addClass('hide');
                $(target).parents('.lsub-form').find('.form-control').removeClass('lsub-put-error');

                var data = {
                    'who': 'L003',
                    'phone': phone
                };
                var _this = this;
                server.send_landing_phone(data,function (json,date) {
                    _this._succ(json,date,phone)
                });
            }
        };
        CON.prototype._succ = function(json,date,phone) {
            project.getIModule('imodule://Track').trackSubmitPhoneSucc(phone);

            $(this._els.succTip).addClass('fadeInTop');
        };

        CON.prototype._ievent_layerClose= function (data,target) {
            $(target).parents('.lsub-alert-con').removeClass('fadeInTop');
            $(this._els.phoneText).val('');
        };


        return CON;
    })();

    return Module;
});


