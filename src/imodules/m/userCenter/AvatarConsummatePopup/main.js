define(function() {
    var baseIModules = project.baseIModules;
    var Module = (function(){
        var CON = function(dom){
            baseIModules.BaseIModule.call(this, dom);
            this.avatar=this.find(".avatar");
            this.title=this.find(".title");
        };
        potato.createClass(CON, baseIModules.BaseIModule);
        //上传头像
        CON.prototype._ievent_addAvatar = function(data,target) {
            var avatar=this.avatar;
            var title=this.title;
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
                        title.css("display","none");
                    }
                })
            });

        };
        return CON;
    })();
    return Module;
});

