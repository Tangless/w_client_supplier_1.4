// AUTHOR:   SongErwei
// ROLE:     TODO (some explanation)
// CREATED:  2016-01-22 21:36:19
//编辑招标信息
/*
 *2016-12-27-jacques
 *编辑当前项目
 */
function a_auth_req_demand_c37update(demand_id,type,color,span,location,budget,size,address,note,img,cb) {
	var q = {
		"demand_id":demand_id,
		"type":type,
		"color":color,
		"span":span,
		"location":location,
		"budget":budget,
		"size":size,
		"address":address,
		"note": note,
		"image":img
	};
	api_ajax_post("v1.4/demand/c37",q,cb);
}
/*
 *2016-12-26-jacques
 *获取当前项目
 */
function a_auth_req_current_item(cb) {
	var q = {
		r: "v1.4/demand/c35"
	};
	api_ajax(q,cb);
}
/*
 *2016-08-31-jacques
 *短信服务开通状态
 */
function a_auth_charge_sms_state(cb) {
	var q = {
		r: "supplier-vas/b41"
	};
	api_ajax(q,cb);
}
/*
 *2016-08-31-jacques
 *开通短信服务
 */
function a_auth_charge_sms_open(city_id, pay_type, amt, cb) {
	var q = {
		"city_id": city_id,
		"pay_type": pay_type,
		"amt": amt
	};

	api_ajax_post( "supplier-vas/b40",q, cb);
}

/*
*2016-08-31-jacques
*抢单时充值下单
*/
function a_auth_charge_order(money,cb) {
	var data = { "money": money};

	api_ajax_post("account/order", data, cb);
}
/*
*2016-08-31-jacques
*抢单时充值支付
*/
function a_auth_charge_pay(transnumber,afterpayto,cb) {
	var q = { 
		r: "account/pay",
		"transnumber":transnumber,
		"afterpayto":afterpayto
	};

	api_ajax(q, cb);
}

function a_auth_demand_c22unfinish(cb){
	var q = {
		r:"demand/c22unfinish"
	}
	api_ajax(q, cb);
}

/*
	获取首页项目列表
*/

function a_auth_demand_c34(type,page,cb){
	var q = {
		'type':type,
		'page':page,
		r:"v1.4/demand/c34"
	}
	api_ajax(q, cb);
}
/*


*2016-08-31-jacques
*抢单时充值验证
*/
function a_auth_charge_confirm(transnumber,cb) {
	
	var q = {
		r:"account/checkpay",
		"transnumber": transnumber
	};
	api_ajax(q, {
		succ:function (json) {
			if(json.ok == "1"){
				cb.succ();
			}else if(json.ok == "0"){
				cb.fail();
			}
		},
		fail:function (json) {
			alert(json.msg)
		}
	});
}

function a_auth_req_d14_getId(city,cb){
	var q = {
		"city_name":city,
		"r":"v1.4/city/getid"
	}
	api_ajax(q, cb);
}

/*
	发布项目
**/
function a_auth_req_demand_c36(type,color,span,location,size,city_id,phone,nick,cb) {
	var q = {
		"type":type,
		"color":color,
		"span":span,
		"location":location,
		"size":size,
		"city_name":city_id,
		"phone":phone,
		"nick":nick
	};
	api_ajax_post("v1.4/demand/c36",q,cb);
}
/*
 * 获取所有城市
 */
function a_auth_req_city_dict(cb) {
	// http://api.wanpinghui.com/{$version}/index.php?r=city/list
	// {
	//     succ: 1,
	//     list: {
	//         A: [
	//             {
	//                 city_name: "澳门",
	//                 city_id: 1,
	//                 is_common: 1
	//             },
	//             {
	//                 city_name: "阿里",
	//                 city_id: 2
	//             }
	//         ],
	//         B: [
	//         ...
	//         ]
	//     }
	// }
	var q = {
		r: "v1.4/city/list"
	};

	api_ajax(q, cb);
}
/*获取工程商账户余额*/
function a_auth_req_balace(cb) {
	var q = {
		r:"exchange/list"
	};
	api_ajax(q,cb);
}
/*获取工程商提现记录*/
function a_auth_req_account(cb) {
	var q = {
		r:"account/list"
	};
	api_ajax(q,cb);
}
/*获取提现验证码*/
function a_auth_req_account_code(cb) {
	var q = {
		r:"exchange/code"
	};
	api_ajax(q,cb);
}
/*获取账户余额*/
function a_auth_req_account_money(cb) {
	var q = {
		r:"account/balance"
	};
	api_ajax(q,cb);
}
function a_auth_req_conf_dict(cb){
	var q = {
		r:"conf/dict"
	}
	api_ajax(q,cb);
}
//获取热门招标列表
function a_auth_req_demand_b37(city_id,sort,pagesize,cb) {
	var q = {
		r:"demand/b37",
		"sort":sort,
		"city_id":city_id,
		"pagesize":pagesize
	};
	api_ajax(q,cb);
}

//获取我发布的招标列表
function a_auth_req_demand_c28(cb) {
	var q = {
		r:"demand/c28"
	};
	api_ajax(q,cb);
}

//获取我参与的招标列表
function a_auth_req_demand_b35(cb) {
	var q = {
		r:"demand/b35"
	};
	api_ajax(q,cb);
}

//编辑招标信息
function a_auth_req_demand_c27update(demand_id,type,color,span,location,budget,size,address,note,img,cb) {
	var q = {
		"demand_id":demand_id,
		"type":type,
		"color":color,
		"span":span,
		"location":location,
		"budget":budget,
		"size":size,
		"address":address,
		"note": note,
		"image":img
	};
	api_ajax_post("demand/c27",q,cb);
}
//发布招标信息
function a_auth_req_demand_create(type,color,span,location,budget,size,address,note,img,cb) {
	var q = {
		"type":type,
		"color":color,
		"span":span,
		"location":location,
		"budget":budget,
		"size":size,
		"address":address,
		"note": note,
		"image":img
	};
	api_ajax_post("demand/c26", q, cb);
}

function a_auth_req_account_list(cb) {
	var q = {
		r:"account/list"
	};
	api_ajax(q,cb);
}

function a_auth_req_d11_account_bank(card,cb) {
	var q = {
		r:"account/bank-name",
		"bank_card":card
	};
	api_ajax(q,cb);
}
//根据城市获取招标列表
function a_auth_req_demand_b38(city_id,pagesize,sort_max,sort_min,sort,cb) {
	var q = {
		r:"demand/b38",
		"city_id":city_id,
		"pagesize":pagesize,
		"sort_max":sort_max,
		"sort_min":sort_min,
		"sort":sort
	};
	api_ajax(q,cb);
}

//根据城市获取工程商列表
function a_auth_req_demand_b39(city_id,page,cb) {
	var q = {
		r:"supplier/b39",
		"city_id":city_id,
		"page":page
	};
	api_ajax(q,cb);
}

function a_auth_req_exchange_save(money,cardNum,userName,code,cb) {
	var data = {
		'money':money,
		'card_number':cardNum,
		'real_name':userName,
		'code':code
	};
	api_ajax_post("exchange/b07", data, cb);
}

function a_auth_lookup_city_id(name, dict, cb) {
	var abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	for (var i = 0; i < abc.length; i++) {
		var arr = dict[abc[i]];
		if (arr) {
			for (var j = 0; j < arr.length; j++) {
				if (name == arr[j].city_name) {
					cb.succ(arr[j].city_id);
					return;
				}
			}
		} else {
			//tlog('no city for index: ' + abc[i]);
		}
	}
	cb.fail();
}

/*
 * 获取手机验证码
 */
function a_auth_req_passcode(phone, role, cb) {
	_a_auth_req_passcode(phone, role, 0, cb);
}
function a_auth_req_passcode_4test(phone, role, cb) {
	_a_auth_req_passcode(phone, role, 1, cb);
}
function _a_auth_req_passcode(phone, role, resp_code, cb) {
	// http://api.wanpinghui.com/{$version}/index.php?r=user/passcode&phone={$phone}&user_type={$user_type}&code={$code}
	// {
	//     "succ":"1"
	// }
	// {
	//     "succ":"0"
	// }
	var q = {
		r: "v1.4/user/passcode",
		"phone": phone,
		"user_type": role_to_num(role)
	};

	if (resp_code) {
		q.code = 1;
	}

	api_ajax(q, cb);
}

/*
 * 登录
 */
function a_auth_login(phone, role, passcode, cb) {
	// http://api.wanpinghui.com/{$version}/index.php?r=user/login&phone={$phone}&passcode={$passcode}&user_type={$user_type}
	// {
	//     "succ":"1"
	// }
	// {
	//     "succ":"0"
	// }
	var q = {
		r: "v1.4/user/login",
		"user_type": role_to_num(role),
		"phone": phone,
		"passcode": passcode
	};

	api_ajax(q, cb);
}

/*
 * 注销
 */
function a_auth_logout(cb) {
	// http://api.wanpinghui.com/{$version}/index.php?r=user/logout
	// {
	//     "succ":"1"
	// }
	// {
	//     "succ":"0"
	// }
	var q = {
		r: "v1.4/user/logout"
	};

	api_ajax(q, cb);
}

//客户获取未读消息
function a_repo_req_tip(cb){
	var q = {
		r : "tips/list"
	}
	api_ajax(q,cb);
}

//客户标识已读消息
function a_repo_req_tip_status(demand_tips_id,cb){
	var q = {
		demand_tips_id :demand_tips_id,
		r : "tips/readed"
	}
	api_ajax(q,cb);
}

/*
 * (客户)十秒登记
 */
function a_auth_bookin(who, phone, role, city_id, cb) {
	// http://api.wanpinghui.com/{$version}/index.php?r=user/dengji&who={$who}&phone=$phone&city_id={$city_id}&user_type={$user_type}
	// {
	//     "succ":"1"
	// }
	// {
	//     "succ":"0"
	// }

	var q = {
		r: "user/dengji",
		"who": who,
		"phone": phone,
		"user_type": role_to_num(role),
		"city_id": city_id
	};

	api_ajax(q, cb);
}

/*
 * 加盟成为工程商
 */
function a_auth_supplier_join(who, phone, city_id, cb) {
	// http://api.wanpinghui.com/index.php?r=supplier/join&who={$who}&phone=$phone&city_id={$city_id}&from={$from}
	var q = {
		r: "supplier/join",
		"who": who,
		"phone": phone,
		"city_id": city_id
	};

	api_ajax(q, cb);
}

/*
 * 检查手机号是否已有（若已有，说明此手机登录过，为了保护其内容，后续的登录必须通过验证码）
 */
function a_auth_check_if_logged_ever(phone, role, cb) {
	// http://api.wanpinghui.com/{$version}/index.php?r=user/checkphone&phone={$phone}&user_type={$user_type}
	// ### 有登记时
	// {
	//     "succ":"1",
	//		'first':0
	// }
	// ### 未登记时
	// {
	//     "succ":"0",
	//		'first':1
	// }
	var q = {
		r: "user/checkphone",
		"phone": phone,
		"user_type": role_to_num(role)
	};

	api_ajax(q, cb);
}

/*
 * 获取指定city当前签约基本情况
 */
function a_auth_req_signing_status(city_id, cb) {
	// http://www.wanpinghui.com/{$version}/index.php?r=ec/index&city_id=$city_id
	// 	{
	// 	  "succ":"1",
	// 	  "left" : "432",
	// 	  "suppliers" : "12548",
	// 	  "orders":"5428"
	// 	}
	
	var q = {
		r: "ec/index",
		"city_id": city_id
	};

	api_ajax(q, cb);
}

/*
 * 工程商签约
 */
function a_auth_supplier_sign(who, phone, city_id, intro_by, cb) {
	// http://www.wanpinghui.com/{$version}/index.php?r=ec/dengji&who={$who}&phone=$phone&city_id={$city_id}&from={$from}
	var q = {
		r: "ec/dengji",
		"who": who,
		"phone": phone,
		"city_id": city_id,
		"from": intro_by || ''
	};

	api_ajax(q, cb);
}

/*
 * 获取当前用户签约排名的相关数据
 */
function a_auth_req_my_signing_rank(city_id, cb) {
	// http://www.wanpinghui.com/{$version}/index.php?r=ec/rank&city_id={$city_id}
	//
	var q = {
		r: "ec/rank",
		"city_id": city_id
	};

	api_ajax(q, cb);
}

//管理员登录
function a_req_longin(usrName,pwd,cb){
	var q = {
		r:"user/login",
		phone:usrName,
		passcode:pwd,
		user_type:"200"
	}
	api_ajax(q,cb);
}

//获取工程商信息
function a_req_supplier_info(cb){
	var q = {
		r:"supplier/infolist",
		page: '0',
		size: '1000'  // 在应用分多次加载算法前，先多返回一些
	}
	api_ajax(q, cb);
}

/*
 * 获取全国和附近的工程商
 */
function a_auth_req_number_engineering_by_cityid(city_id, cb) {
	// http://api.wanpinghui.com/index.php?r=v1.4/supplier/b45&city_id={$city_id}
	// {
 	//    	'succ': '1',
	// 		'cnt': {
	// 			'city_cnt':'177',
	// 			'all_cnt':'19861',
	// 		}
	// }
	
	var q = {
		r: "v1.4/supplier/b45",
		"city_id": city_id
	};

	api_ajax(q, cb);
}

function a_auth_req_number_engineering_by_cityname(city_name, cb) {
	var q = {
		r: "v1.4/supplier/b45",
		"city_name": city_name
	};

	api_ajax(q, cb);
}
