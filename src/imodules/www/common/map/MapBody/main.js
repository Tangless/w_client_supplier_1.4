define(function() {
    var baseIModules = project.baseIModules;
    var Module = (function(){
        var CON = function(dom){
            baseIModules.BaseIModule.call(this, dom);
            
            //IE8兼容的输入框提示
            if($.fn.placeholder){
                this.find('input, textarea').placeholder({customClass:'my-placeholder'});
            }
        };

        potato.createClass(CON, baseIModules.BaseIModule);
        return CON;
    })();
    return Module;
});