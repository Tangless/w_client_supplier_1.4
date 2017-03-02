/**
 * Created by jacques on 16/10/20.
 */
define(function() {
    var baseIModules = project.baseIModules;
    var Module = (function(){
        var CON = function(dom){
            baseIModules.BaseIModule.call(this, dom);
            
        };
        potato.createClass(CON, baseIModules.BaseIModule);

        //确认按钮点击
        CON.prototype._ievent_ensure = function () {
            potato.application.addLoadingItem($(".ensure"));

            var getSucc = function (ActivateSupplier) {
                potato.application.removeLoadingItem($(".ensure"));
                project.open(ActivateSupplier,"_blank","maxWidth");
            };
            var getFail = function () {
                potato.application.removeLoadingItem($(".ensure"));
            };
            var ActivateSupplier = project.getIModule('imodule://ActivateSupplier',null,getSucc,getFail);
        };

        //取消按钮点击
        CON.prototype._ievent_closeModal = function () {
            this.parent.close();
        };

        return CON;
    })();

    return Module;
});
