define(function (GrabIntroduces) {
    var baseIModules = project.baseIModules;
    var Module = (function () {
        var CON = function (dom) {
            baseIModules.BaseIModule.call(this, dom);
            this._role = 1;//options.role;
            this._form = $(this._els.form);
            this._mobileInput = $(this._els.form[0].mobile);
            this._captchaInput = $(this._els.form[0].captcha);
            this._getCaptcha = $(this._els.form[0].getCaptcha);
            this.inquiryTips = this.find(".inquiry-tips");
            this.phoneCheck = this.find(".phone-check");
            this.codeCheck = this.find(".code-check");
            this.errorData = this.find(".error-data");
            this.loginBtn = this.find("#login");
            this.phone = this.find(".phone");
            this.code = this.find(".code");
            this.isCallPublish = false;
            //验证码60s内不可重复发送,true:可发；false：不可发送
            this.flag = true;
            var that = this;

            //初始化确认按钮不可点击
            this.loginBtn.attr("disabled", true);
            //监听input变化
            $('input').bind("input propertychange", function () {
                if ($(this).val().length != 0) {
                    $(this).css("color", "#212022");
                }
                if ($(this).val().length != 0 && that.code.val().length != 0) {
                    that.loginBtn.attr("disabled", false);
                } else {
                    that.loginBtn.attr("disabled", true);
                }
            });
            //重新编辑手机号时，错误提示取消
            this.phone.bind("input propertychange", function () {
                that.phoneCheck.css("display", "none");
                that.codeCheck.css("display", "none");
                that.errorData.css("display", "none");
            });
            //验证码变化时，当手机号正确时取消错误提示
            this.code.bind("input propertychange", function () {
                if (!(that.errorData.text() == "请填写正确的手机号" || that.errorData.text() == "手机号不能为空")) {
                    that.codeCheck.css("display", "none");
                    that.errorData.css("display", "none");
                }
            });
            //失去焦点自动检测
            this.phone.blur(function () {
                that.phoneCheck.css("display", "none");
                that.codeCheck.css("display", "none");
                that.errorData.css("display", "none");
                var phone = that.phone.val();
                that._check_phone(phone);
                //如果手机号正确，自动发送验证码请求
                if (that._check_phone(phone) && that.flag) {
                    that._ievent_getCaptcha();
                }
            });
            this.code.blur(function () {
                var phone = that.phone.val();
                if ($(this).val().length == 0 && that._check_phone(phone)) {
                    that.codeCheck.css("display", "block");
                    that.errorData.css("display", "inline");
                    that.errorData.text("验证码不能为空");
                }
            });
        };
        potato.createClass(CON, baseIModules.BaseIModule);
        //询价进来初始化
        CON.prototype._init = function (json) {
            var that = this;
            that.flag = false;
            //从询价接口进来时的初始化
            if (json.msg) {
                that.inquiryTips.css("display", "block");
                that.phone.val(json.phone);
                that.phone.css("color", "#212022");
                that._check_phone(json.phone);
            }
            // 倒计时
            that._getCaptcha.css("color", "#b3b5b7");
            that._getCaptcha.html('60s后重新获取').prop('disabled', true);
            var wait = 60;
            var timer = setInterval(function () {
                wait--;
                that._getCaptcha.html(wait + 's后重新获取');
                if (wait < 1) {
                    clearInterval(timer);
                    timer = null;
                    that._getCaptcha.html('重新获取验证码').prop('disabled', false);
                    that._getCaptcha.css("color", "#4785f9");
                    that.flag = true;
                }
            }, 1000)

        }
        //提交表单
        CON.prototype._ievent_submitForm = function (data, target) {
            var urlId = qs('classify');
            var data = $.serializeForm(target);
            var that = this;
            console.log(that.isCallPublish)
            if (this._check_phone(data.mobile) && this._check_get_code(data.captcha)) {
                potato.application.addLoadingItem($("#login"));

                a_auth_login(data.mobile, this._role, data.captcha, {
                    succ: function (json) {
                        potato.application.removeLoadingItem($("#login"));

                        if (1 == json.is_new) {
                            // 新注册的用户，记录一次转化
                            project.getIModule('imodule://Track').trackRegister();
                            if (that.isCallPublish) {
                                window.location.href = "call-demand.html?classify=" + urlId + "";
                            } else {
                                // timeout以免track执行不完整，
                                setTimeout(function () {
                                    window.location.reload();
                                }, 500);
                            }
                        } else {
                            if (that.isCallPublish) {
                                window.location.href = "call-demand.html?classify=" + urlId + "";
                            } else {
                                window.location.reload();
                            }
                        }
                        //登录成功后获取当前项目
                        a_auth_req_current_item({
                            succ: function (itemjson) {
                                console.log("item success:::" + itemjson);
                                project.data.currentItem = itemjson.demand[0];
                            },
                            fail: function (itemjson) {
                                console.log("item fail:::" + itemjson);
                                project.data.currentItem = {};
                            }
                        })
                    },
                    fail: function (json) {
                        potato.application.removeLoadingItem($("#login"));
                        that.codeCheck.css("display", "block");
                        that.errorData.css("display", "inline");
                        that.errorData.text("验证码输入有误");
                    }
                })
            }
            return false;
        };
        //检测手机号
        CON.prototype._check_phone = function (usrName) {
            if (!usrName) {
                this.phoneCheck.css("display", "block");
                this.phoneCheck.css("color", "#fe3824");
                this.phoneCheck.removeClass("icon-checkmark-pc");
                this.phoneCheck.addClass("icon-error-pc");
                this.codeCheck.css("display", "block");
                this.errorData.css("display", "inline");
                this.errorData.text("手机号不能为空");
                return false;
            } else if (!is_phone_valid(usrName)) {
                this.phoneCheck.css("display", "block");
                this.phoneCheck.css("color", "#fe3824");
                this.phoneCheck.removeClass("icon-checkmark-pc");
                this.phoneCheck.addClass("icon-error-pc");
                this.codeCheck.css("display", "block");
                this.errorData.css("display", "inline");
                this.errorData.text("请填写正确的手机号");
                return false;
            } else {
                this.phoneCheck.css("display", "block");
                this.phoneCheck.css("color", "#7ed321");
                this.phoneCheck.removeClass("icon-error-pc");
                this.phoneCheck.addClass("icon-checkmark-pc");
                return true;
            }
        };
        //发送验证码
        CON.prototype._ievent_getCaptcha = function () {
            var phone = this._mobileInput.val();
            var that = this;
            if (this._check_phone(phone)) {
                that.flag = false;
                a_auth_req_passcode(phone, this._role, {
                    succ: function (json) {
                        if (json.passcode) {
                            that._captchaInput.val(json.passcode)
                        }
                        // 倒计时
                        that._getCaptcha.css("color", "#b3b5b7");
                        that._getCaptcha.html('60s后重新获取').prop('disabled', true);
                        var wait = 60;
                        var timer = setInterval(function () {
                            wait--;
                            that._getCaptcha.html(wait + 's后重新获取');
                            if (wait < 1) {
                                clearInterval(timer);
                                timer = null;
                                that._getCaptcha.html('重新获取验证码').prop('disabled', false);
                                that._getCaptcha.css("color", "#4785f9");
                                that.flag = true;
                            }
                        }, 1000)
                    },
                    fail: function (json) {
                        that.codeCheck.css("display", "block");
                        that.errorData.css("display", "inline");
                        that.errorData.text(json.msg);
                        that._getCaptcha.html('获取验证码').prop('disabled', false);
                        that._getCaptcha.css("color", "#b3b5b7");
                        that.flag = true;
                    }
                })
            }
        };
        CON.prototype._check_get_code = function (pwd) {
            if (!pwd) {
                this.codeCheck.css("display", "none");
                if ($(this).val().length == 0) {
                    this.codeCheck.css("display", "block");
                    this.errorData.css("display", "inline");
                    this.errorData.text("验证码不能为空");
                }
                return false;
            } else {
                return true;
            }
        };
        //关闭弹窗后清空数据
        CON.prototype._update = function () {
            this.inquiryTips.css("display", "none");
            this.phoneCheck.css("display", "none");
            this.codeCheck.css("display", "none");
            this.errorData.css("display", "none");
            this.phone.val("");
            this.code.val("");

        };
        return CON;
    })();
    return Module;
});

