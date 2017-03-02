define(function() {
    var Module = (function(){
        var CON = function(dom,options){
            project.baseIModules.BaseIModule.call(this, dom);
            this._role = options.role;
            $(dom).addClass("_LoginForm");
            //this._errorMsg = $(this._els.errorMsg);
            this._form = $(this._els.form);
            this._mobileInput = $(this._els.form[0].mobile);
            this._captchaInput = $(this._els.form[0].captcha);
            this._getCaptcha = $(this._els.form[0].getCaptcha);
            this.errorTip=this.find(".error-tip");
            this.errorData=this.find(".error-data");
            this.loginBtn=this.find("#login");
            this.phone=this.find(".phone");
            this.code=this.find(".code");
            this.isCallPublish = false;
            var that = this;
            $(dom).find("input").focus(function(){
                that.errorTip.css("display","none");
            })
            this.loginBtn.attr("disabled",true);
            //监听input变化
            this.phone.bind("input propertychange", function() {
                if($(this).val().length!=0&&that.code.val().length!=0){
                    that.loginBtn.attr("disabled",false);
                }else{
                    that.loginBtn.attr("disabled",true);
                }
            });
            this.code.bind("input propertychange", function() {
                if($(this).val().length!=0&&that.phone.val().length!=0){
                    that.loginBtn.attr("disabled",false);
                }else{
                    that.loginBtn.attr("disabled",true);
                }
            });
        };

        potato.createClass(CON, project.baseIModules.BaseIModule);

        CON.prototype._comeFromCall = function(){
            this.isCallPublish = true;
        }
        
        CON.prototype._ievent_submitForm = function(data, target){
            var urlId = qs('classify');
            var data = $.serializeForm(target);
            var that = this;
            //console.log(that.isCallPublish)
            if (this._check_phone(data.mobile) && this._check_get_code(data.captcha)){
				potato.application.addLoadingItem($("#login"));

                a_auth_login(data.mobile, this._role, data.captcha,{
                    succ: function(json){
                        potato.application.removeLoadingItem($("#login"));

						if (1 == json.is_new) {
							// 新注册的用户，记录一次转化
							project.getIModule('imodule://Track').trackRegister();


                            if (that.isCallPublish){
                                window.location.href = "call-demand.html?classify="+urlId+"";
                            }else{
    							// timeout以免track执行不完整，
    							setTimeout(function() {
    								window.location.reload();
    							}, 500);
                            }
						} else {
                            if (that.isCallPublish){
                                window.location.href = "call-demand.html?classify="+urlId+"";
                            }else{
							 window.location.reload();
                            }
						}
                    },
                    fail: function(json){
                        potato.application.removeLoadingItem($("#login"));

                        that.errorTip.css("display","block");
                        that.errorData.text(json.msg);
                    }
                })
            }
            return false;
        };

        CON.prototype._check_phone = function(usrName){
            if(!usrName){
                this.errorTip.css("display","block");
                this.errorData.text("手机号不能为空");
                //this._errorMsg.text('手机号不能为空').removeHide();
                return false;
            }else if(!is_phone_valid(usrName)){
                this.errorTip.css("display","block");
                this.errorData.text('请填写正确的手机号');
                //this._errorMsg.text('请填写正确的手机号').removeHide();
                return false;
            }else{
                return true;
            }
        };
        CON.prototype._check_get_code = function(pwd){
            if(!pwd){
                this.errorTip.css("display","block");
                this.errorData.text('验证码不能为空');
                //this._errorMsg.text('验证码不能为空').removeHide();
                return false;
            }else{
                return true;
            }
        };

        CON.prototype._ievent_getCaptcha = function(){
            var phone = this._mobileInput.val();
            var that = this;
            if(this._check_phone(phone)){
                that._getCaptcha.html('验证码发送中').prop('disabled', true);
                a_auth_req_passcode(phone, this._role, {
                    succ: function (json) {
                        if (json.passcode) {
                           that._captchaInput.val(json.passcode)
                        }
                        // 倒计时
                        that._getCaptcha.html('60s后重新获取').prop('disabled', true);
                        var wait = 60;
                        var timer = setInterval(function(){
                            wait--;
                            that._getCaptcha.html(wait + 's后重新获取');
                            if(wait<1){
                                clearInterval(timer);
                                timer = null;
                                that._getCaptcha.html('获取验证码').prop('disabled', false);
                            }
                        }, 1000)
                    },
                    fail: function (json) {
                        that._errorMsg.text(json.msg).removeHide();
                        that._getCaptcha.html('获取验证码').prop('disabled', false);
                    }
                })
            }
        };
        return CON;

    })();

    project.embedCss('@@include("{{MCSS}}")');
    
    return Module;
});
