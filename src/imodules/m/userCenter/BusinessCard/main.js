define(function() {
    var baseIModules = project.baseIModules;
    var Module = (function(){
        var CON = function(dom){
            baseIModules.BaseIModule.call(this, dom);
        };
        potato.createClass(CON, baseIModules.BaseIModule);

        CON.prototype._update = function(uid){
            var that = this;
            var proxy = new potato.Proxy();
            b_supplier_card(uid,{
                succ : function(data){
                    that._els.nick[0].innerHTML = data.user.nick;
                    that._els.position[0].innerHTML = data.user.company_name+data.user.position;
                    that._els.address[0].innerHTML = data.user.address;
                    that._els.phone[0].innerHTML = data.user.phone; 
                    proxy.success(true);
                },
                fail : function(){
                    proxy.failure(new potato.Error("b3.2"));
                }
            });
            return proxy;
        };
        return CON;
    })();
    return Module;
});

