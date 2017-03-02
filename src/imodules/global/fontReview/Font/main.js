define(function() {
    var baseIModules = project.baseIModules;
    var Module = (function(){
        var CON = function(dom){
            baseIModules.BaseIPage.call(this, dom);

            var href = window.location.href;
            if(href.indexOf('www') >= 0){
                $('.www').removeClass('hide')
            }else{
                $('.m').removeClass('hide')
            }
        };
        potato.createClass(CON, baseIModules.BaseIPage);
        return CON;
    })();

    return Module;
});

