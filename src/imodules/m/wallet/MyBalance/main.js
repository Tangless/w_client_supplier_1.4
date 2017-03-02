define(function(GrabIntroduces) {
    var baseIModules = project.baseIModules;
    var Module = (function(){
        var CON = function(dom){
            baseIModules.BaseIModule.call(this, dom);
            this.initModal();
            this.balance = '';

            this.initList();
            this.VPresenter = new potato2.WholeVPresenter($(dom));
            this.VPresenter.getAside = function(){
                return that.aside.VPresenter.view;
            }
            var that = this;
            this.VPresenter._installTo = function(parent){
                potato2.VPresenter.prototype._installTo.call(this, parent);
                that.aside.setBody(this,"MyBalance");
            }
        };
        potato.createClass(CON, baseIModules.BaseIModule);
        
        CON.prototype._update = function(){
            var that = this;
            return project.getIModule("imodule://UserCenterNav",null,function(UserCenterNav){
                that.aside = UserCenterNav;
            });
        };
        CON.prototype.initModal = function(){
            var _this = this;
            a_auth_req_account_money({
                succ:function(json){
                    if(json.balance>0){
                        _this.balance = json.balance;
                        _this.find('.balance-money').addClass('sufficient');
                        _this.find('.money-text').text(std_money_format(json.balance));
                        _this.find('.withdrawals').removeHide();
                        _this.find('.enough').text('可提现余额');
                    }else {
                       _this.find('.paycheck').removeHide(); 
                    }
                }
            })
        }
        CON.prototype._ievent_openModal = function(){
            var _this = this;
            var openModal = function(openModal){
                project.open(openModal,'_blank','maxWidth');
                openModal.addListener('stateChanged', function (e) {
                if(e.data.to == 'closed'){
                    openModal.deleteInput();
                }
            })
            }
            project.getIModule('imodule://TransferOutModal',null,openModal)
        }

        CON.prototype.initList = function(){
            var _this = this;
            a_auth_req_balace({
                succ:function(json){
                    var to_change = true;
                    if (json.list.length>0) {
                        for(var i = 0;i<json.list.length;i++){
                            if (json.list[i].status!=0) {
                                _this.showList(json.list[i]);
                                to_change = false;
                            }
                        }
                    }

                    // 显示“去充值”条件：1. 没有充值/消费记录； 2. 有记录，但都为status=0 状态
                    if (to_change) {
                        $(_this._els.transportNone).removeHide();
                    }
                },
                fail:function(json){

                }
            })
        }
        CON.prototype.showList = function(json){
            var newDiv = this.find('.trans-conone.hide').clone().addClass('detail').removeHide();
            var _intm = count_date_gap(json._intm);
            newDiv.find('.zhifu').text(json.title);
            newDiv.find('.shijian').text(_intm);
            if(json.type=='1'){
                newDiv.find('.payMoney').text('+'+std_money_format(json.money)).addClass('jinru');
            }else{
                newDiv.find('.payMoney').text('-'+std_money_format(json.money)).addClass('zhichu');
            }
            newDiv.attr('type',json.type);
            newDiv.appendTo(this.find('.trans-con'));
        }
        CON.prototype._ievent_transTabBtn = function(data,target,hit){
            
            // $(this._els.transTabContent).eq(index).removeHide().siblings().addHide();

            if($(target).find('span').text()=='收入'){
                    this.find('.zhichu').parent().parent().addHide();
                    this.find('.jinru').parent().parent().removeHide();
                }else if($(target).find('span').text()=='支出'){
                    this.find('.jinru').parent().parent().addHide();
                    this.find('.zhichu').parent().parent().removeHide();
                }else{
                    this.find('.trans-conone.detail').removeHide();
                }
            var index = $(target).index();
            $(target).addClass('active').siblings().removeClass('active');

            if(index == 1 || index == 2) {
                $(target).parent().children().css({'borderRightColor':'#e3e8ee','borderRightWidth':'1px','borderRightStyle':'solid'})
                $(target).prev().css('borderRight','none'); //#4785f9
                $(target).css({'borderRightColor':'#4785f9','borderRightWidth':'1px','borderRightStyle':'solid'});
            
            }else{
                $(target).parent().children().css({'borderRightColor':'#e3e8ee','borderRightWidth':'1px','borderRightStyle':'solid'})
               $(target).css({'borderRightColor':'#4785f9','borderRightWidth':'1px','borderRightStyle':'solid'})
            }
        }

        //个人中心去充值
        CON.prototype._ievent_pCenterCharge = function(data,target){
            potato.application.addLoadingItem($("#centerCharge"));

            var getSucc = function (BalanceLowModal) {
                potato.application.removeLoadingItem($("#centerCharge"));
                project.open(BalanceLowModal,"_blank","maxWidth");
            };
            var getFail = function () {
                potato.application.removeLoadingItem($("#centerCharge"));
            };
            var BalanceLowModal = project.getIModule('imodule://BalanceLowModal',null,getSucc,getFail);
        }

        return CON;
    })();


    return Module;
});

