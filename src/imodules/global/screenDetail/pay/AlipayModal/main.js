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
			//if(href.indexOf('demand.html')>0){
				$(this._els.title).text('充值金额');
				$(this._els.submitBtn).attr('ievent','doCharge').text('立即充值');
			//}
        };
        potato.createClass(CON, baseIModules.BaseIModule);
		
		CON.prototype.setCtx = function(ctx,transnum,isSms) {
			this.ctx = ctx;
			this.find('.deposit').text(ctx.deposit);
			//充值时的订单号
			this.transnum = transnum;
			if(isSms){
				$(this._els.title).text('支付金额');
				$(this._els.submitBtn).attr('ievent','doChargeSms').text('立即支付');
			}
		};
		CON.prototype._ievent_doPay = function() {
			var url = api.url_jump_alipay();
			tlog('open url: ' + url);
			window.open(url);

			var _this = this;
			var onSucc = function(mod) {
				mod.setCtx(_this.ctx);
				if(mod.parent){
					mod.parent.close();
				}
				project.open(mod,'_blank',"maxWidth");
			};
			project.getIModule("imodule://PayDoneModal", null, onSucc);
		};

		//抢单页充值时点击
		CON.prototype._ievent_doCharge = function () {
			potato.application.addLoadingItem($("#paynow"));
			
			var _this = this;
			var transnum = _this.transnum;
			var demand_id = qs('demand_id');
			var host = window.location.host;
			var protocol = window.location.protocol;
			//充值成功跳转到transfer页面,通过from参数来判定是来自支付宝跳转
			var transTo = protocol+'//'+host+'/demand.html?demand_id='+demand_id+'&from=pay';
			//对url进行encode
			var afterpayto = encodeURIComponent(transTo);

			var url = api.url_grapJump_alipay()+'&transnumber='+transnum+'&afterpayto='+afterpayto;
			tlog('open url: ' + url);
			window.open(url);
			
			var onSucc = function(mod) {
				mod.setCtx(_this.ctx,transnum);
				if(mod.parent){
					mod.parent.close();
				}
				project.open(mod,'_blank',"maxWidth");
				potato.application.removeLoadingItem($("#paynow"));
			};
			project.getIModule("imodule://PayDoneModal", null, onSucc);
		};
		//短信服务开通 充值时点击
		CON.prototype._ievent_doChargeSms = function () {
			potato.application.addLoadingItem($("#paynow"));

			var _this = this;
			var transnum = _this.transnum;
			var host = window.location.host;
			var protocol = window.location.protocol;
			var transTo = protocol+'//'+host+'test/imodule.html?id=ShortMessageService';
			//对url进行encode
			var afterpayto = encodeURIComponent(transTo);

			var url = api.url_grapJump_alipay()+'&transnumber='+transnum+'&afterpayto='+afterpayto;
			tlog('open url: ' + url);
			window.open(url);

			var onSucc = function(mod) {
				mod.setCtx(_this.ctx,transnum);
				if(mod.parent){
					mod.parent.close();
				}
				project.open(mod,'_blank',"maxWidth");
				potato.application.removeLoadingItem($("#paynow"));
			};
			project.getIModule("imodule://PayDoneModal", null, onSucc);
		};
        return CON;
    })();

    return Module;
});
