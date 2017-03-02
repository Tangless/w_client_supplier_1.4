define(function() {
    var baseIModules = project.baseIModules;
    var Module = (function(){
        var CON = function(dom){
            baseIModules.BaseIModule.call(this, dom);
            
        };
        potato.createClass(CON, baseIModules.BaseIModule);
         CON.prototype._ievent_aboutUs = function(){
             document.body.style.overflow="hidden";
             document.body.style.height="100%";
             $('html').css("height","100%");
             $('html').css("overflow","hidden");
         	project.getIModule("imodule://AboutUs",null,function(AboutUs){
         		document.body.appendChild(AboutUs.dom);
         	})
        }
        return CON;
    })();
    return Module;
});

