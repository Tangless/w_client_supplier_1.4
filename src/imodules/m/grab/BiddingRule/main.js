define(["/iscripts/iwidgets/GrabRule.js"], function(GrabIntroduces) {
    var baseIModules = project.baseIModules;
    var Module = (function(){
        var CON = function(dom){
            baseIModules.BaseIModule.call(this, dom, {container:false});
            //调用iwidgets的js

            $('ul li[idom=toggleList]').each(function (i,o) {
                new GrabIntroduces(o);
            });
        };
        potato.createClass(CON, baseIModules.BaseIModule);
        
        //根据不同页面状态切换竞标规则显示
        CON.prototype.setRuleStatus=function(status){
            $('.r-doubt').removeClass('curr');
            switch (status){
                case 1:
                    $(this._els.statusInit).show();
                    break;
                case 2:
                    //$(this._els.statusWait).show();
                    $(this._els.statusInit).show();
                    break;
                case 3:
                    //$(this._els.statusDone).show();
                    $(this._els.statusInit).show();
                    break;
            }
        };
        
        
        return CON;
    })();
    

    return Module;
});
