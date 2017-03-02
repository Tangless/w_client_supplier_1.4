define(function() {
    var baseIModules = project.baseIModules;
    var Module = (function(){
        var CON = function(dom){
            baseIModules.BaseIModule.call(this, dom);
            this.entity;
            //this.initTender();
            this.initClient();
            this.userId; //这是当前登录用户的id
            this.demanderId; //这是发标者的id
            this.pid = undefined;
            this.user_type = '1';
        };
        potato.createClass(CON, baseIModules.BaseIModule);
        
        CON.prototype._renderMessageList = function(){

            var that = this;
            var demand_id = qs('demand_id');
            var tpl = this._els.tpl[0].text;
            a_demand_comment_supplier(demand_id,{
                succ:function(json){
                    if(json.comments.length <= 0){
                        $(that._els.Title).hide();
                    }else{
                        that.rebuildJson(json);
                        var o = Mustache.render(tpl, json);
                        $(o).prependTo('#Message');
                    }
                    $(that._els.mCount).text(json.totals);
                    that.entity = json.entity; 
                },
                fail:function(json){

                }
            })
        }

        
        CON.prototype.rebuildJson = function(json){
            var that=this;

            // 这个标是我发布的吗？（发标人和当前登录用户id相同，则是我的）
            var is_my_demand = (this.userId == this.demanderId);

            for(var i=0;i<json.comments.length;i++){

                //给名片传值-user_id
                json.comments[i].user_id = json.comments[i].authorId;

                //判断留言后面是否应该显示删除按钮
                json.comments[i].show_del = (that.userId == json.comments[i].authorId && json.comments[i].disabled == 0) ? "show" : "hide";

                //设置被删除后的占位文字的颜色
                json.comments[i].already_del = parseInt(json.comments[i].disabled) == 1 ? "aDel" : "";
               

                var can_reply = false;
                if(json.comments[i].children){
                    // 先给true，如果后续遍历“回复”时发现已经有我回复过，那就再改为false
                    can_reply = true;

                    for(var j=0;j<json.comments[i].children.length;j++){
                        var child = json.comments[i].children[j];

                        // 如果是我的标，且我已回复过，那就不能再回复了
                        if(is_my_demand && that.userId == json.comments[i].children[j].authorId){
                            can_reply = false;
                        }

                        if(!is_my_demand){
                            can_reply = false;
                        }

                        //判断回复后面是否应该显示删除按钮
                        if((that.userId == json.comments[i].children[j].authorId) && (json.comments[i].children[j].disabled == 0)) {
                            json.comments[i].children[j].show_del = "show";
                        }else {
                            json.comments[i].children[j].show_del = "hide";
                        }

                        //设置被删除后的回复占位文字的颜色
                        json.comments[i].children[j].already_del = parseInt(json.comments[i].children[j].disabled) == 1 ? "aDel" : "";

                        //判断回复时的四种角色，authorType 为 1:客户；100:工程商；150:客户代表；200:万屏汇官方(平台代表)
                        switch(parseInt(child.authorType))
                        {
                        case 1:
                            child.authorName = '客户回复';
                            break;
                        case 100:
                            child.authorName = '客户回复';
                            break;
                        case 150:
                            child.authorName = '客户代表回复';
                            break;
                        case 200:
                            child.authorName = '万屏汇官方回复';
                            break;
                        }
                    }
                }else{
                    // 当前登录用户就是发标的人，那就可以回复
                    if(is_my_demand){
                        can_reply = true;
                    } else {
                        can_reply = false;
                    }
                }

                json.comments[i].show_reply = (can_reply ? "show" : "hide");
            }
        }

        //判断发布招标的id是否和userid相同,如果相同则不可以自己给自己留言
        CON.prototype.clientReplay = function(){
            var that=this;
            if(that.userId == that.demanderId)
            {
                $('#goRelease').attr('disabled','disabled').removeAttr('ievent');
            }
        }


        CON.prototype._rebuild_json =function(json) {
            //将json数据改一下显示形式
            for(var i=0;i<json.comments.length;i++){
                json.comments[i].authorName = json.comments[i].authorName.substring(0,1) + '经理';
            }    
        }

        //发布留言按钮
        CON.prototype._ievent_Leave=function(){
            potato.application.addLoadingItem($("#goRelease"));
            var that=this;
            var parentId = 0;

            //如果没有登录信息
            if(that.user_type == '0') {
                that._openLoginModal($("#goRelease"));
            } else{
                //用户 ==> 升级工程商弹框
                if(that.user_type == '1'){
                    that._openUpgradeModal($("#goRelease"));

                //工程商 ==> 留言框
                }else if(that.user_type == '100'){

                    var getSucc = function (SendMessage) {
                        potato.application.removeLoadingItem($("#goRelease"));
                        SendMessage.setPid(parentId);
                        project.open(SendMessage,"_blank","maxWidth");
                    };
                    var getFail = function () {
                        potato.application.removeLoadingItem($("#goRelease"));
                    };
                    var SendMessage = project.getIModule('imodule://MessageCommentPop',{parentId:parentId},getSucc,getFail);
                }
            }
            
        }

        //请求c03-获取user_id
        CON.prototype.initClient=function(){
            var that = this;
            a_profile_req({
                succ:function(json){
                    that.userId = json.user_id;
                    that.user_type = json.user_type;
                    that.initTender();
                },
                fail:function(json){
                    that.user_type = '0';
                    that.initTender(); //此时再调用一次是因为游客身份也要看见留言
                }
            })
        }

        //请求b11-获取client_id
        CON.prototype.initTender=function(){
            var _this = this;
            var demand_id = qs('demand_id');
            a_demand_req_info(demand_id,{
                succ:function(data){
                    _this.demanderId = data.demand_info.client_id;
                    _this.clientReplay();
                    _this._renderMessageList();
                }
            })
        }

        
        //客户回复
        CON.prototype._ievent_customerBtn=function(data,target){
            var parentId = parseInt($(target).closest('.comment').attr('id').split("-")[1]);
            var getSucc = function (SendMessage) {
                SendMessage.setPid(parentId);
                if(SendMessage.parent){
                    SendMessage.parent.close();
                }
                project.open(SendMessage,"_blank","maxWidth",{});
            };
            var SendMessage = project.getIModule('imodule://MessageCommentPop',{parentId:parentId},getSucc);
        }

        //回复删除
        CON.prototype._ievent_childDel=function(data,target){
            var id=$(target).attr('data-comment-id');
            a_discuss_comment_delete(id,{
                succ:function(json){
                    window.location.reload();
                },
                fail:function(json){
                    alert(json.msg)
                }
            })
        }

        //留言删除
        CON.prototype._ievent_messageDel=function(data,target){
            var id=$(target).attr('data-comment-id');
            a_discuss_comment_delete(id,{
                succ:function(json){
                    window.location.reload();
                },
                fail:function(json){
                    alert(json.msg)
                }
            })
        }

        //点击头像出现名片
        CON.prototype._ievent_busCard=function(){

        }

        //打开升级弹窗
        CON.prototype._openUpgradeModal = function (obj) {
            //获取升级弹窗
            var loginModal = function (UpgradeToSupplier) {
                potato.application.removeLoadingItem(obj);
                project.open(UpgradeToSupplier,"_blank","maxWidth");
            };
            //获取失败
            var openModalFail = function () {
                potato.application.removeLoadingItem(obj);
            };
            project.getIModule('imodule://UpgradeToSupplier',null,loginModal,openModalFail);
        };
        //打开登录弹窗
        CON.prototype._openLoginModal = function (obj) {
            var loginModal = function (loginModal) {
                potato.application.removeLoadingItem(obj);
                project.open(loginModal,"_blank","maxWidth");
            };
            var openModalFail = function () {
                potato.application.removeLoadingItem(obj);
            };
            project.getIModule('imodule://ClientLoginForm',null,loginModal,openModalFail);
        };

        
        return CON;
    })();
    

    return Module;
});
