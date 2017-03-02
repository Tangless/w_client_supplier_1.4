define(function() {
    var baseIModules = project.baseIModules;
    var Module = (function(){
        var CON = function(dom){
            baseIModules.BaseIModule.call(this, dom);
            this.activeBtn = this.find(".btn-active");
            this.phone=this.find(".input-phone");
            this.name=this.find(".input-name");
            this.maleMark=this.find(".male-mark");
            this.femaleMark=this.find(".female-mark");
            this.activeBtn.attr("disabled",true);
            this.phone.attr("disabled",true);
            var that = this;
            //监听input变化
            this.name.bind("input propertychange", function() {
                if($(this).val().length!=0){
                    that.activeBtn.attr("disabled",false);
                }else{
                    that.activeBtn.attr("disabled",true);
                }
            });
            
            
            a_profile_req({
                succ : function(data){
                    $(that._els.phone).html(data.phone);
                }
            });

            this.sex = 1;
        };
        potato.createClass(CON, baseIModules.BaseIModule);
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


        CON.prototype._ievent_active = function () {
            var nick = this.name.val();
            if(!all_hanzi(nick)){
                alert('含有特殊字符，请使用中文输入');
                return false;
            }
            var sex = this.sex;
            var that = this;
            potato.application.addLoadingItem(this.activeBtn);
            b_supplier_activate({nick:nick,sex:sex},{
                succ : function(){
                    potato.application.removeLoadingItem(that.activeBtn);

					project.getIModule('imodule://Track').trackActivate();

					// timeout以免track执行不完整，
					setTimeout(function() {
						window.location.reload();
					}, 500);
                },
                fail : function(error){
                    potato.application.removeLoadingItem(that.activeBtn);
                    alert(error.msg);
                }
            })
        }

        return CON;
    })();

    return Module;
});
