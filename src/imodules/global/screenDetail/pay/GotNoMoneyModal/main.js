define(function() {
    var Module = (function() {
		var baseIModules = project.baseIModules;
        var CON = function(dom) {
            baseIModules.BaseIModule.call(this, dom);

            //如果是抢单页充值,则修改文案
            var href = window.location.href;
            if(href.indexOf('grab')>0){
                $(this._els.payFail).text('重新充值');
            }
        };
        potato.createClass(CON, baseIModules.BaseIModule);
		
		CON.prototype._ievent_repay = function(data, target, hit) {
            var pay = project.getIModule('imodule://AlipayModal');
            if(pay.parent){
                pay.parent.close();
            }
            project.open('imodule://AlipayModal','_blank',"maxWidth");
		};
        
        return CON;
    })();

    return Module;
});
