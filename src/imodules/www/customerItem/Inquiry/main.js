define(['/iscripts/imodules/_InquiryPublic.js'],function(module) {
    var baseIModules = project.baseIModules;
    var Module = (function(){
        var CON = function(dom){
            module.call(this, dom);
            this.initInfo();
            var _this = this;
            amap_ip_in_city({
                succ:function(city){
                    _this.thisCity(city);
                }
            })
            $('input').focus(function(){
                $('.errorTip').addHide();
                return false;
            })
        };
        potato.createClass(CON, module);
        return CON;
    })();
    return Module;
});

