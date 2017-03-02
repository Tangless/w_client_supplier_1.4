define(["/iscripts/iwidgets/RadarAnimation.js"],function () {
    var baseIModules = project.baseIModules;
    var Module = (function () {
        var CON = function (dom) {
            baseIModules.BaseIPage.call(this, dom);
            this.setIsLogin();
            this._returnType();

        };
        potato.createClass(CON, baseIModules.BaseIPage);

        //返回led类型按钮
        CON.prototype._returnType = function(){
            $('.icon-return').click(function(){
                window.location.href = 'call-type.html';
            })
        }

        CON.prototype.setIsLogin = function(){
           var succ = function(loginquick) {
                //loginquick.open(loginquick,'_blank','maxWidth');
                loginquick._comeFromCall();
           }
           var loginquick = project.getIModule("imodule://ClientLoginForm",null,succ);

        }
        
        return CON;
    })();

    return Module;
});

