define(function(GrabIntroduces) {
    var baseIModules = project.baseIModules;
    var Module = (function(){
        var CON = function(dom, parent, option){
            baseIModules.BaseIModule.call(this, dom, parent, option);
            this.phone = option.phone;
            this.demand_id = option.demand_id;
            this.codeGain = $(this._els.codeGain);
            this.phoneNum = $(this._els.codeNum);
            this.getCode();
            this.inputFocus();
            
        };
        potato.createClass(CON, baseIModules.BaseIModule);
       
       	CON.prototype.getCode = function(){
       		var that = this;
          that.phoneNum.text(that.phone);
          that.codeCountDown();
       	}

        CON.prototype.codeCountDown = function(){
            var that = this;
             that.codeGain.html('60s后重新获取验证码').prop('disabled', true);
              var wait = 60;
              var timer = setInterval(function(){
                  wait--;
                that.codeGain.html(wait + 's后重新获取验证码');
                  if(wait<1){
                      clearInterval(timer);
                      timer = null;
                      that.codeGain.html('重新获取验证码').prop('disabled', false).addClass('code-blue');
                  }
              }, 1000)
        }

       	CON.prototype._ievent_getCode = function(){
          var that = this;
       		var phone = parseInt(that.phone);
          //a02发送手机验证码接口
          _a_auth_req_passcode(phone, "", "", {
            succ: function (json) {
              //倒计时
              that.codeCountDown();
            },
            fail: function(json){
             alert(json.msg);
            }
          });
       	}

       	CON.prototype.inputFocus = function(){
          var that = this;

         	$(this._els.incode).find('input').bind('input propertychange','input',function(event) {

            //让下一个input自动获得焦点
            if(!isNaN($(this).val())){                              
              $(this).parent().next().find('input').focus();                       
            } 

            //当输入为非数字时自动替换为空格
            this.value = this.value.replace(/[^\d]/g, '').replace(/(\d{4})(?=\d)/g, "$1 ");

            var code0 = $(that._els.incode).eq(0).find('input').val()
            var code1 = $(that._els.incode).eq(1).find('input').val()
            var code2 = $(that._els.incode).eq(2).find('input').val()
            var code3 = $(that._els.incode).eq(3).find('input').val()

            var sum = $.trim(code0) + $.trim(code1) + $.trim(code2) + $.trim(code3);
            if (4 == sum.length) {
              console.log('4位数字，尝试校验...');
              that.verifyPasscode(sum);
            }
          });

          $(this._els.incode).find('input').keydown(function(event){
            if(event.which == 8){
              $(this).parent().prev().find('input').val('');
             $(this).parent().prev().find('input').focus();
            }
          })
        }
       

          CON.prototype.verifyPasscode = function(passcode) {
              var that = this;
              var demand_id = parseInt(this.demand_id);
              //c33-验证激活待完善项目
              a_demand_activate_project(this.phone, passcode, demand_id, {
                succ:function(json){

                     
                    // 请求成功，则记一个cookie，以便刷新页面时如果有这个cookie，则打开聊天室
                    // 而打开弹层的判断要在CustomerIterPage.js中操作

                    localStorage.setItem("chatroom",'open');//存储变量名为key，值为value的变量
                    window.location.reload();

                },
                fail:function(json){
                    alert(json.msg)
                    $(that._els.incode).find('input').val('');
                    $(that._els.incode).eq(0).find('input').focus();
                   
                }
            });
          }

        return CON;
    })();


    return Module;
});

