define(function() {
    var Module = (function() {
		var baseIModules = project.baseIModules;
        var CON = function(dom) {
            baseIModules.BaseIModule.call(this, dom);
			this.ctx = undefined;
            this.transnum = '';

            //如果是抢单页充值,则修改文案和方法
            //===暂时都用以下方法来做===
            //var href = window.location.href;
            //if(href.indexOf('demand')>0){
                $(this._els.payDone).text('完成充值').attr('ievent','grabPayDone');
                $(this._els.payFail).text('重新充值').attr('ievent','grabPayFail');
            //}

        };
        potato.createClass(CON, baseIModules.BaseIModule);
		
		CON.prototype.setCtx = function(ctx,transnum) {
			this.ctx = ctx;
            //抢单页 参数
            this.transnum = transnum;
		};

		CON.prototype._ievent_payDone = function() {
			this._check_and_do(false);
		};

		CON.prototype._ievent_repay = function() {
			this._check_and_do(true);
		};

		CON.prototype._check_and_do = function(repay) {
			// 赵妮同学说：我忘记了我已经支付了，又点“重新支付”。这时，也应提示他已成功。故，两个按钮都判断.
            var _this = this;
            a_auth_charge_confirm(this.ctx.demand_id, {
                succ: function(json) {
                    _this.parent.close();
                    show_paid_tip();
                    //window.re_ajax();
                },
                fail: function(json) {
					if (repay) {
						project.open('imodule://AlipayModal', '_self');
					} else {
						project.open('imodule://GotNoMoneyModal', '_self');
					}
                }
            })
		};
        
        //======如果是抢单页充值======
        CON.prototype._ievent_grabPayDone = function() {
            potato.application.addLoadingItem($(".done"));
            this._grab_pay_confirm(false);
        };

        CON.prototype._ievent_grabPayFail = function() {
            potato.application.addLoadingItem($(".repay"));
            this._grab_pay_confirm(true);
        };

        CON.prototype._grab_pay_confirm = function(repay) {
            var _this = this;
            var demand_id = qs('demand_id');
            var href = 'index.html?demand_id='+demand_id+'&from=pay';
            //充值验证
            a_auth_charge_confirm(_this.transnum, {
                succ: function(json) {
                    _this.parent.close();
                    project.tip('恭喜,充值完成','succ','',true);
                    
                    potato.application.removeLoadingItem($(".done"));
                    potato.application.removeLoadingItem($(".repay"));
                    
                    setTimeout(function () {
                        //跳转到抢单详情页
                        window.location.href = href;
                    },2000)
                },
                fail: function(json) {
                    if (repay) {
                        var pay = project.getIModule('imodule://AlipayModal');
                        if(pay.parent){
                            pay.parent.close();
                        }
                        project.open('imodule://AlipayModal','_blank',"maxWidth");
                    } else {
                        var nomoney = project.getIModule('imodule://GotNoMoneyModal');
                        if(nomoney.parent){
                            nomoney.parent.close();
                        }
                        project.open('imodule://GotNoMoneyModal','_blank',"maxWidth");
                    }
                    potato.application.removeLoadingItem($(".done"));
                    potato.application.removeLoadingItem($(".repay"));
                }
            })
        };
        
        
		
        return CON;
    })();

    return Module;
});
