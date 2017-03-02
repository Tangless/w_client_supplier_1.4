define(function(GrabIntroduces) {
    var baseIModules = project.baseIModules;
    var Module = (function(){
        var CON = function(dom){
            baseIModules.BaseIModule.call(this, dom);
            this.addCard = false;
            this.isFirst = true;
            this.getMon = '';
            this.cardNum = '';
            this.userName = '';
            this.errorTip=this.find(".error-tip");
            this.errorData=this.find(".error-data");
            var _this = this;
            $('input').focus(function(){
                _this.errorTip.css("display","none");
            })
        };
        potato.createClass(CON, baseIModules.BaseIModule);
        CON.prototype._update = function(){
            var _this = this;
            var proxy = new potato.Proxy();
            var module = project.getIModule('imodule://MyBalance');
            _this.find('.myBalance').text(std_money_format(module.balance));
                        
            a_auth_req_account_list({
                succ: function(json){
                    if(json.list.length > 0){
                        _this.isFirst = false;
                        var length = json.list.length;
                        var card = json.list[length-1];
                        _this.userName = card.real_name;
                        var lastFour = card.card_number.substring(card.card_number.length-4,card.card_number.length);
                        _this.find('.cardNum').text(card.card_number);
                        _this.find('.transferModal .choose').text(card.card_name+' ('+lastFour+') '+card.real_name)
                        _this.find('.transferModal').removeHide();
                        _this.find('.transferModal').siblings().addHide();
                        for(var i = length-2>=0?length-2:0;i < length;i++){
                            _this.showCardList(json.list[i]);
                        }
                    }else{
                        _this.find('.transferMoneyModal .title').removeClass('padding10').addClass('padding35');
                        _this.find('.transferMoneyModal').removeHide();
                        _this.find('.transferMoneyModal .go-back').addHide();
                        _this.find('.transferMoneyModal').siblings().addHide();
                    }
                    $(document).bind('input propertychange',function(){
                        _this.disabled();
                    })
                    proxy.success(true);
                },
                fail: function(json){

                }

            })
            return proxy;

        }
        CON.prototype.deleteInput = function(){
            this.find('input').val('');
        }

        CON.prototype._ievent_conBtn = function(data,target,hit){
            var money = $(target).parent().siblings().find('input').val();
            this.cardNum = this.find('.cardNum').text();
            if(this.checkMoney(money,target)){
                this.getMon = money;
                this.find('.testPhoneModal').removeHide();
                this.find('.testPhoneModal').siblings().addHide();
                this.parent.refreshSize()
            }
        }
        CON.prototype._ievent_nextBtn = function(data,target,hit){
            this.addCard = true;
            var parent = $(target).parent().siblings();
            var money = parent.find('.mon').val();
            var card = parent.find('.card').val()
            var name = parent.find('.name').val();
            this.getMon = money;
            if(has(card)){
                this.cardNum = card.match(/\d+/)[0]; // 中国银行(1234n)型，需要匹配出卡号;
            }
            this.userName = name;
            if(this.checkMoney(money,target)&&
                this.checkCard(card,target)&&
                this.checkName(name,target)){
                this.find('.testPhoneModal').removeHide();
                this.find('.testPhoneModal').siblings().addHide();
                this.parent.refreshSize()
            }
            
        }
        CON.prototype._ievent_conMoneyBtn = function(data,target,hit){
            var _this = this;
            this.addCard = false;
            var code = this.find('.code').val();
            if(!has(code)){
                $(_this.errorTip[2]).css("display","block");
                $(_this.errorData[2]).text('验证码不能为空');
            }else{
                $(target).attr('ievent','');
                potato.application.addLoadingItem($('.con-btn'));
                a_auth_req_exchange_save(_this.getMon,_this.cardNum,_this.userName,code,{
                    succ: function(json){
                        potato.application.removeLoadingItem($('.con-btn'));
                        _this.parent.close();
                        project.tip('申请成功','succ','请耐心等待，预计24小时内到账')
                        setTimeout(function(){
                            location.reload();
                        },3000)
                    },
                    fail: function(json){
                        $(_this.errorTip[2]).css("display","block");
                        $(_this.errorData[2]).text(json.msg);
                       $(target).attr('ievent','conMoneyBtn');
                       potato.application.removeLoadingItem($('.con-btn')); 
                    }
                })
            }
            
        }
        CON.prototype._ievent_getCaptcha = function(data,target,hit){
            var _this = this;
            a_auth_req_account_code({
                succ: function(json){
                    _this.find('.sendPhone span').text(json.phone);
                    _this.find('.sendPhone').removeHide();
                    _this.parent.refreshSize();
                    var time = 60;
                    $(target).attr("ievent","");
                    var timer = setInterval(function(){
                        time--;
                        $(target).html(time+'s后重新获取')
                        if(time<1){
                            clearInterval(timer);
                            timer = null;
                            $(target).html('重新获取');
                            $(target).attr("ievent","getCaptcha");
                        }
                    },1000);
                },
                fail: function(json){
                    $(_this.errorTip[2]).css("display","block");
                    $(_this.errorData[2]).text(json.msg);
                }
            })
            

        }
        CON.prototype._ievent_changeCard = function(){
            this.find('.chooseCardModal').removeHide();
            this.find('.transferModal').addHide();
            this.parent.refreshSize();
        }
        CON.prototype._ievent_useNewCard = function(){
            $('.transferMoneyModal').removeHide();
            $('.chooseCardModal').addHide();
            this.parent.refreshSize();
                
            
        }
        CON.prototype.showCardList = function(json){
            var length = json.card_number.length;
            var lsatFour = json.card_number.substring(length-4,length);
            var newDiv = this.find('.modal-contents.hide').clone().addClass('list').removeHide();
            newDiv.find('.cardName').text(json.card_name+' ('+lsatFour+') '+json.real_name);
            newDiv.find('.cardList').text(json.card_number);
            newDiv.attr('ievent','thisCard');
            newDiv.prependTo('.chooseCardModal .modal-body');
        }
        CON.prototype._ievent_thisCard = function(data,target,hit){
            var which = $(target).find('.cardName').text();
            var thisCard = $(target).find('.cardList').text();
            this.find('.cardNum').text(thisCard);
            this.find('.transferModal .choose').text(which);
            this.find('.transferModal').removeHide();
            this.find('.chooseCardModal').addHide();
            this.parent.refreshSize();
        }
        CON.prototype._ievent_goBack = function(data,target,hit){
            var modal = $(target).parent();
            var className = modal.attr('class');
            if(className == 'chooseCardModal'){
                this.find('.transferModal').removeHide();
                modal.addHide();
                this.parent.refreshSize();
            }else if(className == 'transferMoneyModal'){
                this.find('.chooseCardModal').removeHide();
                modal.addHide();
                this.parent.refreshSize();
            }else{
                if(this.isFirst||this.addCard){
                    this.find('.transferMoneyModal').removeHide();
                    modal.addHide();
                    this.parent.refreshSize();
                }else{
                    this.find('.transferModal').removeHide();
                    modal.addHide();
                    this.parent.refreshSize();
                }
            }
        }
        CON.prototype.checkMoney = function(money,target){
            var module = project.getIModule('imodule://MyBalance');
            var balance = module.balance;
            if(!has(money)){
                this.errorTip.css("display","block");
                this.errorData.text("提现金额不能为空");
                return false;
            }else if(money - balance > 0){
                this.errorTip.css("display","block");
                this.errorData.text("余额不足！请重新输入");
                return false;
            }else if((money+'').contains('-')){
                this.errorTip.css("display","block");
                this.errorData.text("提现金额不能为负数");
                return false;
            }else if(money == 0){
                this.errorTip.css("display","block");
                this.errorData.text("提现金额不能为0");
                return false;
            }
            return true
        }
        CON.prototype.checkCard = function(card,target){
            if(!has(card)){
                $(this.errorTip[1]).css("display","block");
                $(this.errorData[1]).text("卡号不能为空！");
                return false;
            }
            return true;
        }
        CON.prototype.checkName = function(name,target){
            if(!has(name)){
                $(this.errorTip[1]).css("display","block");
                $(this.errorData[1]).text("开户名不能为空！");
                return false;
            }
            return true;
        }
        CON.prototype.disabled = function(){
            this.one('.transferModal','#oneMoney')
            this.one('.testPhoneModal','#code')
            this.three('#threeMoney',"#threeCard","#threeName")
        }
        CON.prototype.one = function(modal,id){
                if($(id).val()!=''){
                    this.find(modal+' .one').attr("disabled",false).removeClass('disabled')
                }else{
                    this.find(modal+' .one').attr("disabled",true).addClass('disabled')
                }
        }
        CON.prototype.three = function(id1,id2,id3){
            /*
            * 2016-11-04  jacques
            * 移除了这个判断条件  ---》 $(id2).val().length<22 ;
            * 原因 : 输入银行卡号后,输入框失去焦点后会自动识别银行卡并加入 银行名称,此时 $(id2).val()的长度远超出22个字符;
            * */
            if($(id1).val()!=""&&$(id2).val().length>=16&&$(id3).val()!=""){
                this.find('.three').attr("disabled",false).removeClass('disabled')
            }else{
                this.find('.three').attr("disabled",true).addClass('disabled')
            }
        }
        return CON;
    })();
    $(function(){
        
        $('.transferMoneyModal .card').blur(function(){
            var card = $('.transferMoneyModal .card').val();
            if(card.length >= 16){
                a_auth_req_d11_account_bank(card,{
                    succ: function(json){
                        if(json.bank_name!=''){
                            $('.transferMoneyModal .card').attr('type','text');
                            $('.transferMoneyModal .card').val(json.bank_name+' ('+card+') ')
                        }
                    },
                    fail: function(json){

                    }
                })
            }
        })
    })

    return Module;
});

