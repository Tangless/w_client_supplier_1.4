define(function() {
    var baseIModules = project.baseIModules;
    var Module = (function(){
        var CON = function(dom, parent, option){
            baseIModules.BaseIModule.call(this, dom, parent, option);
            this.grabdepo = option.grabdepo || this._getGrabDepos();
            this.balance = option.balance || this._getGrabDepos();
			this.title = $(this._els.title);
			this.sure = $(this._els.sure);

			//押金数额
			$(this._els.money).text(std_money_format(this.grabdepo));
        };
        potato.createClass(CON, baseIModules.BaseIModule);
		
		//根据排队情况更改文案
		CON.prototype._setText = function (title,sure) {
			this.title.html(title);
			this.sure.html(sure);
		};
		//确认按钮点击
		CON.prototype._ievent_ensure = function () {
			potato.application.addLoadingItem($("#ensure-pay"));
			var _this = this;
			var demand_id = qs('demand_id');
			//查看余额是否充足
			if (parseInt(_this.balance) >= parseInt(_this.grabdepo)) {
				//查看排队情况
				a_demand_req_status(demand_id,{
					succ:function () {
						potato.application.removeLoadingItem($("#ensure-pay"));
						window.location.reload();
					},
					fail:function () {
						potato.application.removeLoadingItem($("#ensure-pay"));
						//如果请求失败,暂时先跳转到首页
						alert("获取抢单信息失败");
						// window.location.href = '/index.html';
					}
				})

			}else {
				//弹出余额不足的弹窗
				potato.application.removeLoadingItem($("#ensure-pay"));
				project.open('imodule://BalanceLowModal', "_blank", "maxWidth");
			}

		};
		//取消按钮点击
		CON.prototype._ievent_closeModal = function () {
			this.parent.close();
		};
		//获取押金备选方案
		CON.prototype._getGrabDepos = function () {
			var _this = this;
			var demand_id = qs("demand_id");
			//请求订单信息获取押金额度
			a_demand_req_information(demand_id, {
				succ: function (json) {
					_this.grabdepo =json.grabdepo;
					_this.balance =json.balance;
					//押金数额
					$(_this._els.money).text(std_money_format(json.grabdepo));
				}
			})
		};

        return CON;
    })();

    return Module;
});
