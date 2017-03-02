define(function() {
    var baseIModules = project.baseIModules;
    var Module = (function(){
        var CON = function(dom){
            baseIModules.BaseIPage.call(this, dom, {container:false});
            $(this._els.carousel1).carousel();
            $(this._els.carousel2).carousel();
        };

        potato.createClass(CON, baseIModules.BaseIPage);

        CON.prototype._ievent_submitPhone= function (data,target) {
            var phone = $('.user-input').val();
            project.getIModule('imodule://Track').trackSubmitPhone(phone);

            if(phone.length != 11){
                $('.error-tip').css("display","block");
            }else{
                var data = {
                    'who': 'L005',
                    'phone': phone
                };

                server.send_landing_phone(data, function() {
                    project.getIModule('imodule://Track').trackSubmitPhoneSucc(phone);
                });

                this._done();
            }
        };
        CON.prototype._ievent_userInput= function (data,target) {
            $('.error-tip').css("display","none");
            //$('.input-div').css('border-color',"#44DCBA");
        };
        CON.prototype._ievent_goTalk= function (data,target) {
            document.getElementById("QQTalk").click()
        };

        //提交手机后,显示弹窗提示(无论是否成功)
        CON.prototype._done = function(json,date) {
            $('#inputSuccess').val('');

            $('.succ-tip').addClass('fadeInBottom');
            setTimeout(function () {
                $('.succ-tip').removeClass('fadeInBottom');
            },5000);
        };

        return CON;
    })();

    return Module;
});
