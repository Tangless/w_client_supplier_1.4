define(function() {
    var baseIModules = project.baseIModules;
    var Module = (function(){
        var CON = function(dom){
            baseIModules.BaseIModule.call(this, dom);
            this.name = this.find(".input-name");
            this.phone = this.find(".input-phone");
            this.maleMark=this.find(".male-mark");
            this.femaleMark=this.find(".female-mark");
            this.avatar=this.find(".avatar");

            this.avatar.css("backgroundImage","url("+project.data.user.avatar+")");
            //if(this.avatar.attr("src")!=""){
            //    this.avatar.css("display","block");
            //}else{
            //    this.avatar.css("display","none");
            //}
            //监听input变化
            $('input').bind("input propertychange", function() {
                if($(this).val().length!=0){
                    $(this).css("color","#212022");
                }
            });
            this.redata='';
            this.sex = 1;
            this.nick = '';
            var that = this;
            var data = project.data.user;
            $(that._els.phone).html(data.phone);
            that.sex = data.sex;
            that.nick = data.nick;
            that.name.val(data.nick);
            $(this._els.address[0]).val(data.address);
            $(this._els.company[0]).val(data.company_name);
            $(this._els.position[0]).val(data.position);

            $(that._els.phone).html(data.phone);
            this.redata=data.nick;
            if(that.sex == 1){
                that._ievent_choiceMale();
            }else{
                that._ievent_choiceFemale();
            }

            this.VPresenter = new potato2.WholeVPresenter($(dom));

            this.VPresenter.getAside = function(){
                return that.aside.VPresenter.view;
            }
            this.VPresenter._installTo = function(parent){
                potato2.VPresenter.prototype._installTo.call(this, parent);
                that.aside.setBody(this,"ModifySupplierData");
            }

            
        };

        potato.createClass(CON, baseIModules.BaseIModule);
        
        CON.prototype._update = function(){
            var that = this;
            return project.getIModule("imodule://UserCenterNav",null,function(UserCenterNav){
                that.aside = UserCenterNav;
            });
        };
        
        CON.prototype._ievent_addAvatar = function(data,target) {
            var avatar=this.avatar;
            var _this=this;
            project.getIModule('imodule://AvatarUploader', null, function (modal) {
                project.open(modal, '_blank', 'maxWidth');


                modal.setParams({
                    // 图片有跨域问题，无法显示。故暂不支持裁剪老头像
                    //orgAvatar: project.data.user.avatar,
                    orgAvatar: "",
                    post: function (json) {
                        tlog('new image: ' + json.image);
                        todo('使用新头像');
                        avatar.css("backgroundImage","url("+json.image+")");
                        _this.aside.avatarUpdate(json.image);
                        project.getIModule("imodule://UserInfo",null,function(UserInfo){
                            UserInfo.avatarUpdate(json.image);
                        });
                    }
                })
            });

        };

        //点击保存按钮
        CON.prototype._ievent_btnSave = function(data,target){
            var nick;
            if(this.name.val().length==0){
                nick=this.redata;
            }else{
                nick = this.name.val();
            }
            if(!all_hanzi(nick)){
                alert('称呼含有特殊字符，请使用中文输入');
                return false;
            }
            var company_name = this._els.company[0].value;
            var position = this._els.position[0].value;
            var address = this._els.address[0].value;
            var sex = this.sex;
            var that = this;
            var postData = {sex:sex};
            var target = $(target);
            postData.nick = nick || '';
            postData.address = address || '';
            postData.position = position || '';
            postData.company_name = company_name || '';
            potato.application.addLoadingItem(target);
            a_profile_save(postData, {
                succ : function(){
                    potato.application.removeLoadingItem(target);
                    location.reload();
                },
                fail : function(error){
                    potato.application.removeLoadingItem(target);
                    alert(error.msg);
                }
            })
        }
        //性别选择
        CON.prototype._ievent_choiceMale = function(data,target){
            this.maleMark.css("display","block");
            this.femaleMark.css("display","none");
            this.sex = 1;
        }
        //女
        CON.prototype._ievent_choiceFemale = function(data,target){
            this.maleMark.css("display","none");
            this.femaleMark.css("display","block");
            this.sex = 0;
        }
        return CON;
    })();

    return Module;
});
