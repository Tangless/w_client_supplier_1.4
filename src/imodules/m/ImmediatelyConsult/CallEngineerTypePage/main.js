define(function () {
    var baseIModules = project.baseIModules;
    var Module = (function () {
        var CON = function (dom) {
            baseIModules.BaseIPage.call(this, dom);

        };
        potato.createClass(CON, baseIModules.BaseIPage);

        
        return CON;
    })();

    return Module;
});

