// AUTHOR:   SongErwei
// ROLE:    	
// CREATED:  2016-02-01 19:25:12
 
/*
 * 获取用户基本信息
 */
// function a_profile_req(cb) {
//
// 	var q = {
// 		r: "user/c31"
// 	};
//
// 	api_ajax(q, cb);
// }
/*
 * 网易云信版本
 * 获取用户基本信息
 */
function a_profile_req(cb) {

	var q = {
		r: "user/c32"
	};

	api_ajax(q, cb);
}
//当前客户是否是发标的客户
function a_req_info_and_invite(cb) {
	var isguest;
	a_profile_req({
		succ:function (user) {
			var href = window.location.href;
			var demand_id = qs('demand_id');
			var demand = href.indexOf('demand.html');
			if(demand > 0 && demand_id) {
				a_demand_req_information(demand_id,{
					succ:function (json) {
						if(user.user_id != json.client_id && user.user_type == '1'){
							user.isCurrUserIsNotInvitor = true;
							cb.succ && cb.succ(user);
						}else{
							cb.succ && cb.succ(user);
						}
					},
					fail:function () {
						isguest = false;
						cb.fail && cb.fail(isguest);
					}
				})
			}else{
				cb.succ && cb.succ(user);
			}
			
		},
		fail: function () {
			isguest = true;
			cb.fail && cb.fail(isguest);
		}
	})
}

/*
 * 提交用户基本信息
 */
function a_profile_save(data, cb) {
	// http://api.wanpinghui.com/{$version}/index.php?r=user/save
	// 1、客户时
	//
	// | 参数 | 含义 | 备注 |
	// |:------:|:------:|:------:|
	// |nick|昵称|选填| 
	// |phone|手机号|选填| 
	// |address|地址|选填| 
	//
	// 2、工程商时
	//
	// | 参数 | 含义 | 备注 |
	// |:------:|:------:|:------:|
	// |nick|昵称|选填| 
	// |phone|手机号|选填| 
	// |address|地址|选填| 
	// |idcard|身份证号|选填| 
	//
	api_ajax_post("v1.4/user/save", data, cb);
}

/*
 * 获取供应商“我的钱包”（账户余额、流水明细）
 */ 
function a_profile_req_wallet(cb) {
	// http://api.wanpinghui.com/{$version}/index.php?r=exchange/list
	// {
	//   "succ":"1",
	//   "account":24595,//账户余额
	//   "list":[
	//     {"title":"订单完成",type:"1","money":12000,"_intm":"2015-12-31"},
	//     {"title":"缴纳诚意金",type:"2","money":2000,"_intm":"2015-12-31"},
	//     {"title":"提现请求",type:"2","money":10000,"_intm":"2015-12-31"},
	//   ]
	// }
	
	var q = {
		r: "exchange/list"
	};

	api_ajax(q, cb);
}
/*
 * 工程商激活
 */
function b_supplier_activate(data, cb) {
	// http://api.wanpinghui.com/{$version}/index.php?r=supplier/activate
	// |   参数  |   含义   | 备注 |
	// |---------|----------|------|
	// | nick    | 昵称     | 选填 |
	// | sex     | 性别   | 选填 |
	api_ajax_post("supplier/activate", data, cb);
}
/*
 * 工程商名片
 */
function b_supplier_card(user_id, cb) {
	// http://api.wanpinghui.com/{$version}/index.php?r=supplier/b31&user_id={$user_id}
	var q = {
		r: "supplier/b31",
		"user_id": user_id 
	};

	api_ajax(q, cb);
}
