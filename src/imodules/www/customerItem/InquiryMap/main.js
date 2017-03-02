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
            })
        };
        potato.createClass(CON, module);
        CON.prototype._ievent_hide = function(){
            this.find('.container').addHide();
            this.find('.hideCli').removeHide();
        }
        CON.prototype._ievent_show = function(){
            this.find('.container').removeHide();
            this.find('.hideCli').addHide();
        }
        return CON;
    })();
    return Module;
});

