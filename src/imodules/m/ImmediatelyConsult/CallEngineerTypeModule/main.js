define(["/iscripts/iwidgets/RadarAnimation.js"],function() {
    var baseIModules = project.baseIModules;
    var Module = (function(){
        var CON = function(dom,parent,option){
            baseIModules.BaseIModule.call(this, dom, parent, option);
            this.callType = $(this._els.callType);
            this.callLogin = $(this._els.callLogin);
            this.callDemand = $(this._els.callDemand);
        };

        potato.createClass(CON, baseIModules.BaseIModule);

        //led类型处理
        CON.prototype._ievent_ledType = function(data,target){
            var callBack;
            var _this = this;
            var typeId = $(target).attr('typeId');

            //如果已经登录，要判断是否有未结束的标
            if(project.isLogin()){
                callBack = function(module){
                    project.open(module,"_blank","maxWidthHeight");
                    // module.initModule();
                }
                a_auth_demand_c22unfinish({
                    succ: function(json){
                        if(json.list.length==0){
                            //project.getIModule("imodule://PublishInviteModule",null,callBack);
                            window.location.href = "call-demand.html?classify="+typeId+"";
                        }else{
                            //project.open('imodule://HavePublishModule','_blank',"maxWidth");

                            var getSucc = function (RepeatedRelease) {
                                RepeatedRelease.setType(typeId);
                                project.open(RepeatedRelease,"_blank","maxWidth");
                            };
                            var RepeatedRelease = project.getIModule('imodule://HavePublishModule',null,getSucc);
                                }
                    },
                    fail: function(json){

                    }
                })
                
            }else{ //如果没有登录，那么先登录
               window.location.href = 'call-login.html?classify='+typeId+'';
            }
        }
        return CON;
    })();
    return Module;
});

