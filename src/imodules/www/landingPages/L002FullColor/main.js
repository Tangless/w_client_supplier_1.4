define(function() {
    var baseIModules = project.baseIModules;
    var Module = (function(){
        var CON = function(dom){
            baseIModules.BaseIModule.call(this, dom, {container:false});
            // $(this._els.aaa)
            $(this._els.carousel).carousel();
            this._form = this._els.form[0];
            this._alert = $(this._els['alert']);
            var that = this;



        };

        potato.createClass(CON, baseIModules.BaseIModule);


        // //显示按钮与隐藏按钮
        // CON.prototype._showBox = function(){
        //     var user = $(this._form.username).val();
        //     var _val = $(this._form.password).val();
        //     if(user != '' && _val != '' ){
        //         $(btnfull).css({"opacity":1});
        //         $(btnfull).removeAttr('disabled');
        //     }else {
        //         $(btnfull).css({"opacity":0.4});
        //         $(btnfull).attr('disabled','disabled');
        //     }
        // }

        //校验手机号
        CON.prototype._cheackTel = function(){
            var regstr = /^(13[0-9]|14[0-9]|15[0-9]|18[0-9]|17[0-9])\d{8}$/i;
            return regstr.test($(this._form.password).val());
        }

        //校验中文
        CON.prototype._isChina = function(){
             var reg = /[^\u4E00-\u9FA5]+/g;
                if(reg.test($(this._form.username).val())){
                    return false;
                }
                return true;
        }




        //提交
        CON.prototype._ievent_btnactive= function (data,target) {
            var username = $(this._form.username).val();
            var phone = $(this._form.password).val();
            var user = this._isChina();
            var pass = this._cheackTel();
            var that = this;
            project.getIModule('imodule://Track').trackSubmitPhone(phone);

            if(username.length > 10) {
                $(that._alert).find('p').text('姓名不能超过10个字符');
                that._alert.addClass('action');
                setTimeout(function(){
                    that._alert.removeClass('action');
                },2000);
                return false;
            }

            var successCallback = function (json) {
                console.log(json)
                project.getIModule('imodule://Track').trackSubmitPhoneSucc(phone);

                $(that._alert).find('p').text('操作成功');
                $(that._alert).find('span').addClass('active');
                that._alert.addClass('action');
                 setTimeout(function(){
                    that._alert.removeClass('action');
                    $(that._form.username).val('');
                    $(that._form.password).val('');

                },2000);
                 setTimeout(function(){
                    $(that._alert).find('span').removeClass('active');
                },2500);

            };
            if(!user) {
                $(that._alert).find('p').text('请输入中文');
                that._alert.addClass('action');
                setTimeout(function(){
                    that._alert.removeClass('action');
                },2000);
                return false;
            }
            if(username == '') {
                $(that._alert).find('p').text('请输入姓名');
                that._alert.addClass('action');
                setTimeout(function(){
                    that._alert.removeClass('action');
                },2000);
                return false;
            }
            if(!pass) {
                $(that._alert).find('p').text('请输入正确的电话号码');
                that._alert.addClass('action');
                setTimeout(function(){
                    that._alert.removeClass('action');
                },2000);
                return false;
            }
            if(user && pass && username!= '' && phone != '') {
                server.send_landing_phone({who:username + '-L002',phone:phone}, successCallback,failCallback);
            }
            var failCallback = function(){
                $(that._alert).find('p').text('操作失败，请稍后再试');
                that._alert.addClass('action');
                setTimeout(function(){
                    that._alert.removeClass('action');
                },2000);
                return false;
            }
        };


        return CON;
    })();

    return Module;
});
