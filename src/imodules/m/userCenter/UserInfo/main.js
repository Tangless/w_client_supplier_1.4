define(function() {
    var baseIModules = project.baseIModules;
    var Module = (function(){
        var CON = function(dom){
            baseIModules.BaseIModule.call(this, dom);
            this.defineAvatar=this.find(".icon-user4-51px");
            this.Avatar=this.find(".image-sm-avatar");
            if(project.data.user.avatar){
                this.defineAvatar.css("display","none");
                this.Avatar.attr("src",project.data.user.avatar);
                this.Avatar.css("display","inline-block");
            }
            this.VPresenter = new potato2.WholeVPresenter($(dom));
            var aside = $("<div style='width:54px;height:100%;'></div>");
            var that = this;
            aside.on("click",function(){
                that.VPresenter.parent.close();
            });
            this.VPresenter.getAside = function(){
                return aside;
            }
            var user = project.data.user;
            $(this._els.nick).html(user.nick);
            $(this._els.phone).html(user.phone);
            $(this._els.balance).html('￥'+std_money_format(user.balance));
            if(user.user_type==100){
                $(this._els.supplier).show();
                $(this._els.enduser).hide();
            }else{
                $(this._els.supplier).hide();
                $(this._els.enduser).show();
            }            
        };
        potato.createClass(CON, baseIModules.BaseIModule);

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

        CON.prototype._ievent_modifySupplierData = function (data,obj) {
            var that = this;
            project.getIModule("imodule://ModifySupplierData",null,function(ModifySupplierData){
                that.VPresenter.parent.appendChild(ModifySupplierData.VPresenter);
            });
        }
        CON.prototype._ievent_wallet= function (data,obj) {
            var that = this;
            project.getIModule("imodule://MyBalance",null,function(MyBalance){
                that.VPresenter.parent.appendChild(MyBalance.VPresenter);
            });
        }
        CON.prototype._ievent_valueAddService= function (data,obj) {
            var that = this;
            project.getIModule("imodule://ValueAddService",null,function(ValueAddService){
                that.VPresenter.parent.appendChild(ValueAddService.VPresenter);
            });
        }
        //同步更新头像
        CON.prototype.avatarUpdate = function (url) {
            this.Avatar.attr("src",url);
        }
        return CON;
    })();
    return Module;
});

