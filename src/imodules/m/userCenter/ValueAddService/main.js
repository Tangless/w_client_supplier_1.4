define(function() {
    var baseIModules = project.baseIModules;
    var Module = (function(){
        var CON = function(dom){
            baseIModules.BaseIModule.call(this, dom);
            var that = this;


            this.VPresenter = new potato2.WholeVPresenter($(dom));

            this.VPresenter.getAside = function(){
                return that.aside.VPresenter.view;
            }
            this.VPresenter._installTo = function(parent){
                potato2.VPresenter.prototype._installTo.call(this, parent);
                that.aside.setBody(this,"ValueAddService");
            }

        };
        potato.createClass(CON, baseIModules.BaseIModule);

        CON.prototype._update = function(){
            var that = this;
            return project.getIModule("imodule://UserCenterNav",null,function(UserCenterNav){
                that.aside = UserCenterNav;
            });
        };
        return CON;
    })();
    return Module;
});

