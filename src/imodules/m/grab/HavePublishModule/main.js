define(function() {
    var baseIModules = project.baseIModules;
    var Module = (function(){
        var CON = function(dom){
            baseIModules.BaseIModule.call(this, dom);
            this.pid = 1; //led供应商类型，1为门头招牌
        };

        potato.createClass(CON, baseIModules.BaseIModule);
        CON.prototype._ievent_cancelBtn = function(data,target,hit){
            var _this = this;
            if($(hit).attr("hit")=="cancel"){
                this.parent.close();
            }else if($(hit).attr("hit")=="new"){
                this.parent.close();
                //由于修改逻辑，下面这条注释
                //project.open("imodule://PublishInviteModule","_blank","maxWidthHeight");
                
                var callback = function(module){
                        window.location.href = "call-demand.html?classify="+_this.pid+"";
                    }
                project.getIModule("imodule://CallEngineerTypeModule",null,callback); 
            }
        }

        //此方法是获取上一个页面（类型页面）点击事件时候的typeId
        CON.prototype.setType=function(id){
            var that=this;
            that.pid = id;
        }
        
        return CON;
    })();
    return Module;
});

