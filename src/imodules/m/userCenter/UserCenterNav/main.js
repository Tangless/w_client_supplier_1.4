define(function() {
    var baseIModules = project.baseIModules;
    var Module = (function(){
        var CON = function(dom){
            baseIModules.BaseIModule.call(this, dom);
            this.VPresenter = new potato2.VPresenter($(dom));
            this.defineAvatar=this.find(".icon-user3－26px");
            this.Avatar=this.find(".image-sm-avatar");
            if(project.data.user.avatar){
                this.defineAvatar.css("display","none");
                this.Avatar.attr("src",project.data.user.avatar);
                this.Avatar.css("display","block");
            }
        };
        potato.createClass(CON, baseIModules.BaseIModule);

        CON.prototype._ievent_supplierData = function (data,obj) {
            var that = this;
            var dialog = this.body.parent;
            project.getIModule("imodule://ModifySupplierData",null,function(ModifySupplierData){
                dialog.appendChild(ModifySupplierData.VPresenter);
            });
        }
        CON.prototype._ievent_userInfo = function (data,obj) {
            var that = this;
            var dialog = this.body.parent;
            project.getIModule("imodule://UserInfo",null,function(UserInfo){
                dialog.appendChild(UserInfo.VPresenter);
            });
        }
        CON.prototype._ievent_wallet = function (data,obj) {
            var that = this;
            var dialog = this.body.parent;
            project.getIModule("imodule://MyBalance",null,function(MyBalance){
                dialog.appendChild(MyBalance.VPresenter);
            });
        }
        CON.prototype._ievent_valueAdd = function (data,obj) {
            var that = this;
            var dialog = this.body.parent;
            project.getIModule("imodule://ValueAddService",null,function(ValueAddService){
                dialog.appendChild(ValueAddService.VPresenter);
            });
        }

        CON.prototype._ievent_logout = function (data,obj) {
            a_auth_logout({
                succ: function(json){
                    location.reload();
                },
                fail: function(json) {
                    alert('Sorry: ' + json.msg);
                }
            })
        }
        CON.prototype.setBody = function(body,type){
            this.body = body;
            this.find(".curTab").removeClass("curTab");
            if(type=="MyBalance"){
                this.find(".wallet").addClass("curTab");
            }else if(type=="ModifySupplierData"){
                this.find(".supplierData").addClass("curTab");
            }else if(type=="ValueAddService"){
                this.find(".valueAdd").addClass("curTab");
            }
        }
        //同步更新头像
        CON.prototype.avatarUpdate = function (url) {
            this.Avatar.attr("src",url);
    }
        return CON;
    })();
    return Module;
});

