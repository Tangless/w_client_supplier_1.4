define(function() {
    var baseIModules = project.baseIModules;
    var Module = (function(){
        var CON = function(dom){
            baseIModules.BaseIModule.call(this, dom);


        };
        potato.createClass(CON, baseIModules.BaseIModule);

        return CON;
    })();

    return Module;
});
