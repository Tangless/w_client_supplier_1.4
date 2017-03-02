define(function () {
    var baseIModules = project.baseIModules;
    var Module = (function() {
        var CON = function (dom) {
            baseIModules.BaseIModule.call(this, dom);
            this._loginToPage = '';
            this.nav=this.find('.nav');
            this.userNick=this.find(".user-nick");
            var that=this;
            var data = project.data.user;
            if(data.succ==1){
                that.nav.removeClass("login-out");
                that.nav.addClass("login-in");
                that.userNick.text(data.nick);

                //登录获取客户当前的项目
                a_auth_req_current_item({
                    succ:function(itemjson){
                        console.log("item success:::"+itemjson);
                        project.data.currentItem=itemjson.demand[0];
                    },
                    fail:function(itemjson){
                        console.log("item fail:::"+itemjson);
                        project.data.currentItem={};
                    }
                })
            }else{
                that.nav.removeClass("login-in");
                that.nav.addClass("login-out");
            }

        };
        potato.createClass(CON, baseIModules.BaseIModule);
       //显示登录弹窗
        CON.prototype._ievent_showLoginForm = function (data,obj) {
            //获取调用登陆框的target
            var getSucc = function (LoginForm) {
                project.open(LoginForm,"_blank","{'size':['content','content']}");
            };
            var getFail = function () {
            };
            var LoginForm = project.getIModule('imodule://LoginForm',null,getSucc,getFail);

        };
        //注销登录
        CON.prototype._ievent_loginOut = function () {
            a_auth_logout({
                succ: function(json){
                    $('.user_nav').hide();
                    $('.user_nav .phone').text('');
                    $('#IndexBookin .phone').val('');
                    location.reload();
                },
                fail: function(json) {
                    alert('Sorry: ' + json.msg);
                }
            })
        };
        return CON;
    })();

    return Module;
});
