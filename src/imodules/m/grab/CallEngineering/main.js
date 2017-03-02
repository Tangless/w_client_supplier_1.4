define(function() {
    var baseIModules = project.baseIModules;
    var Module = (function(){
        var CON = function(dom,parent,option){
            baseIModules.BaseIModule.call(this, dom, parent, option);
            
        };

        potato.createClass(CON, baseIModules.BaseIModule);


        return CON;
    })();
    return Module;
});

