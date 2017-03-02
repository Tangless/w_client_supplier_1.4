define(function() {
    var baseIModules = project.baseIModules;
    var baseIWidgets = project.baseIWidgets;
    var Module = (function(){
        var CON = function(dom){
            baseIModules.BaseIPage.call(this, dom);
            this._els = this._getElements();
            this._mloader = new baseIWidgets.IWidgetLoader(this._els.mloader[0], this);
            var args = $.parseUrl(window.location.href);
            if(args.Query && args.Query.id){
                this.loadIModule(args.Query.id);
            }
        };
        potato.createClass(CON, baseIModules.BaseIPage);

        CON.prototype.loadIModule = function (imid) {
            var that = this;
            var imodule = project.getIModule("imodule://"+imid);
            if(imodule instanceof potato.Proxy){
                imodule.addSuccessCaller(function (imodule) {
                    that._showIModule(imodule)
                });
            }else{
                that._showIModule(imodule)
            }
        };
        CON.prototype._showIModule = function (imodule) {
            imodule.find("img.lazy").lazyload();
            this._mloader.load(imodule);
        };
        return CON;
    })();

    return Module;
});