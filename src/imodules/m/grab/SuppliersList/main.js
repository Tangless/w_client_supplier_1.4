define(['/iscripts/imodules/_SupplierPublic.js'],function(list) {
    var baseIModules = project.baseIModules;
    var Module = (function(){
        var CON = function(dom){
            list.call(this, dom);

            this.loading = true;
            this.initData();
        };

        potato.createClass(CON, list);
        CON.prototype.initData = function(){
            var _this = this;
            var city_id = "";
            var url = location.pathname;
            if(url=="/single.html"){
                _this.find('.nationwide .where').text("附近");
                city_id = "151";
            }
            this.paging(city_id)
        }
        return CON;
    })();
    return Module;
});

