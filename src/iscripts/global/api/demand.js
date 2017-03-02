// AUTHOR:   SongErwei
// ROLE:    	
// CREATED:  2016-02-01 19:42:15

/*
 * 获取（某单）详细信息
 */
function a_demand_req_info(id, cb) {
	// http://api.wanpinghui.com/{$version}/index.php?r=demand/b44&demand_id={$demand_id}
	// {
	// 		"succ":"1",
	//     	"address" : "深圳市宝安区",
	//      "size" : "15m2左右",
	//     	"location" : "半户外",
	//      "color" : "全彩屏",
	//      "span" : "P3-P4",
	//      "budget" : "100000",
	// }
	
	var q = {
		r: "v1.4/demand/b44",
		"demand_id": id 
	};
	
	api_ajax(q, cb);
}
/*
 * 获取（某单）详细信息==>提取info接口的部分数据
 */
function a_demand_req_information(id, cb) {
	//提取info接口的部分数据  demand_info
	// http://api.wanpinghui.com/{$version}/index.php?r=demand/b44&demand_id={$demand_id}
	
	var q = {
		r: "v1.4/demand/b44",
		"demand_id": id
	};

	api_ajax(q, {
		succ:function (json) {
			if(json.succ=='1'){
				json.demand_info.balance = json.balance;
				cb.succ(json.demand_info);
			}
		},
		fail:function (json) {
			cb.fail && cb.fail(json)
		}
	});
}
/*
 * b21 获取（某单）排队情况(1,获得联系方式/2,进入排队/3,来晚了)
 */
function a_demand_req_status(id, cb) {
	// http://api.wanpinghui.com/index.php?r=bid/demand
	
	var data = {"demand_id": id};

	api_ajax_post("bid/demand", data, cb);
}
/*
 * 取消跟进
 *
 */
function a_demand_cancel_grab(id, cb) {
	// http://api.wanpinghui.com/index.php?r=bid/demand

	var data = {"demand_id": id};

	api_ajax_post("bid/cancel", data, cb);
}

/*
 * 立即抢单
 */
function a_demand_bid_now(id, cb) {
	// http://api.wanpinghui.com/{$version}/index.php?r=bid/order&demand_id={$demand_id}
	// {
	//     "succ":"1",
	//     "seconds": 103
	// }    
	// or: 
	// {
	//     "succ":"0"
	//     "seconds":0,
	//     "msg":"来晚一步，已经抢光"
	// }
	
	var q = {
		r: "bid/order",
		"demand_id": id 
	};
	
	api_ajax(q, cb);
}


/*
 * 获取当前参与竞标的人数
 */
function a_demand_req_bidders(id, cb) {
    // B17
    // http://api.wanpinghui.com/{$version}/index.php?r=bid/suppliers&demand_id={$demand_id}
    //
    // {
    //   "succ":"1",
    //   "suppliers":"43",
    // }
	var q = {
		r: "bid/suppliers",
		"demand_id": id 
	};
	
	api_ajax(q, cb);
}
/*
 * 获取当前参与竞标的工程商列表
 */
function a_demand_req_suppliers(id, cb) {
    // B17
    // http://api.wanpinghui.com/{$version}/index.php?r=demand/b42&demand_id={$demand_id}
	//
    // "supplier_list":[ // 空数组：表示尚无工程商参与；
	//      {'id': 1, 'nick': 'a','avatar':"http://cdn.wanpinghui.com/cms/avatar/1.png", "type":"1"},//仅抢单，未留言
	// 		{'id': 2, 'nick': 'b','avatar':"http://cdn.wanpinghui.com/cms/avatar/2.png", "type":"2"},//留过言，未抢单
	// 		{'id': 3, 'nick': 'c','avatar':"http://cdn.wanpinghui.com/cms/avatar/3.png", "type":"3"}//又抢单，又留言
    // ]
	var q = {
		r: "v1.4/demand/b42",
		"demand_id": id 
	};
	
	api_ajax(q, cb);
}

/*
 * 获取自己本次抢单的结果（等待结束时调用） 
 */
function a_demand_req_bid_result(id, cb) {
	// http://api.wanpinghui.com/{$version}/index.php?r=bid/result&demand_id={$demand_id}	
	// {
	//    "succ":"1",
	//    "result": 1,//1：抢单成功，-1：抢单落选（就差一点，您落选了），-2：未参与，-3：抢单进行中
	//     "client_info": {
	//         "nick": "张三",
	//         "phone": "13800005438"
	//     }, // result为1，此值须存在
	// }

	var q = {
		r: "bid/result",
		"demand_id": id 
	};
	
	api_ajax(q, {
		succ: function(json) { // 为了不把result的值细节扩散出去，这里再封装一次
			if (1 == json.result) {
			  	cb.succ(json);
		  	} else if (-1 == json.result) {
			  	cb.lost(json);
            } else {
                cb.x(json);
            }
		},
        fail: function(json) {
            cb.fail(json);
        }
	});
}

/*
 * 获取（某单）抢单的供应商列表
 */
function a_demand_req_bid_users(id, cb) {
	// http://api.wanpinghui.com/{$version}/index.php?r=bid/users&demand_id={$demand_id}
	//{
	//   "succ":"1",
	//   "rank": 56,//如果该用户未参与抢单，则rank值为所有参与抢单人数
	//   "list":[
	//   	{
	//      	"nick": "李三",
	//          "bid_time": "2015-12-29 12:34",
	//          "succ": "0"
	//      },
	//      ...                                  
	//   ]
	//} 	

	var q = {
		r: "bid/users",
		"demand_id": id 
	};
	
	api_ajax(q, cb);
}

/*
 * （工程商）提交（竞标）方案
 */ 
function a_demand_commit_scheme(data, cb) {
	// http://api.wanpinghui.com/{$version}/index.php?r=scheme/save
	// 
	// | 参数 | 含义 | 备注 |
	// |:------:|:------:|:------:|
	// | demand_id | 需求id | 必填 |
	// | supplier_scheme_id | 工程方案id | 选填，仅用于修改时 |
	// | price | 工程价 | 必填 |
	// |summery | 综述 | 必填 |
	// | module | 模组 | 必填 |
	// | chip | 芯片 | 必填 |
	// | power |电源 | 必填 |
	// | controller | 控制 | 必填 |
	// | note | 备注 | 选填 |

	api_assert_has_key(data, 'demand_id');
	api_ajax_post("scheme/save", data, cb);
}

/*
 * 客户支付(选中方案的)订金
 */
function a_demand_pay_deposit(scheme_id, cb) {
    // http://api.wanpinghui.com/{$version}/index.php?r=pay/deposit
    //
    // POST
    // |supplier_scheme_id|工程方案id|必填|

	var data = {
		"supplier_scheme_id" : scheme_id 
	};

 	api_ajax_post("pay/deposit", data, cb);
}

/*
 * 用户确认工程商安装完成
 */ 
function a_demand_client_confirm_install_done(demand_id, cb) {
	// http://api.wanpinghui.com/index.php?r=demand/client-confirm-install
	var data = {"demand_id": demand_id};
	api_ajax_post("demand/client-confirm-install", data, cb);

    bd_track_client_confirm_install();
} 

/*
 * 用户确认工程商维修完成
 */ 
function a_demand_client_confirm_repair_done(demand_id, cb) {
	// http://api.wanpinghui.com/index.php?r=demand/client-confirm-repair
	var data = {"demand_id": demand_id};
	api_ajax_post("demand/client-confirm-repair", data, cb);
} 

/*
 * 工程商提交“安装完成”
 */ 
function a_demand_supplier_commit_install(demand_id, cb) {
    // http://api.wanpinghui.com/index.php?r=demand/supplier-install
	var data = {"demand_id": demand_id};
	api_ajax_post("demand/supplier-install", data, cb);
}

/*
 * 工程商提交“维修完成”
 */ 
function a_demand_supplier_commit_repaired(demand_id, cb) {
    // http://api.wanpinghui.com/index.php?r=demand/supplier-repair
	var data = {"demand_id": demand_id};
	api_ajax_post("demand/supplier-repair", data, cb);
}

/*
 * 客户取消订单
 */ 
function a_demand_cancel(demand_id, reason, cb) {
	// - 客户可以在任何阶段取消需求订单
	// - 如果客户支付了保证金，则需要工程商或管理员确认后，才可退还保证金
	// - 取消需求订单时，需要填写取消原因
	// 
	// ## 请求地址
	// http://api.wanpinghui.com/{$version}/index.php?r=demand/cancel&demand_id={$demand_id}&reason={$reason}
	// | 参数 | 含义 | 备注 |
	// |:------:|:------:|:------:|
	// |demand_id|需求id|必填|
	// |reason|原因|必填|
	// 
	// {
	//   "succ":"1"
	// }

	var q = {
		r: "demand/cancel",
		"demand_id": demand_id,
		"reason": reason
	};

	api_ajax(q, cb);
}

/*
 * 客户恢复（已取消的）的需求
 */ 
function a_demand_resume(demand_id, cb) {
	// 客户可以取消交易后，在未得到工程商或管理员确认前，可以随时恢复交易。
	// http://api.wanpinghui.com/{$version}/index.php?r=demand/resume&demand_id={$demand_id}
	// {
	//   "succ":"1"
	// }

	var q = {
		r: "demand/resume",
		"demand_id": demand_id
	};

	api_ajax(q, cb);
}

/*
 * 客户评价供应商
 */ 
function a_demand_evaluate_supplier(supplier_id, demand_id, score, cb) {
	// http://api.wanpinghui.com/index.php?r=evaluate/supplier
	// 
	// POST
	// 
	// |:------:|:------:|:------:|
	// |supplier_id|工程商id|必填|
	// |demand_id|需求id|必填|
	// |score|分值|必填(数字0-5)|
	
	var data = {
		'supplier_id': supplier_id,
		'demand_id': demand_id,
		'score': score 
	};

	api_ajax_post("evaluate/supplier", data, cb);
}

/*
 * 工程商留言-b28
 */ 
function a_demand_comment_supplier(demand_id, cb) {
	// 加载评论内容
	// http://api.wanpinghui.com/{$version}/index.php?r=demand/comment&demand_id={$demand_id}&tpl={$tpl}
	

	var q = {
		r: "demand/comment",
		"demand_id": demand_id

	};

	api_ajax(q, cb);
}

/*
 * 保存留言回复-b29
 */ 
function a_demand_discuss_comment_supplier(entity, content, parentId, cb) {
	// http://api.wanpinghui.com/{$version}/index.php?r=comment/default/create
	// 
	// POST
	// ## 参数
	// |          参数         |       含义      | 备注 |
	// |-----------------------|-----------------|------|
	// | entity                | b28接口获取的值 | 必填 |
	// | CommentModel[content] | 评论内容        | 必填 |
	
	var data = {
		'entity': entity,
		'content': content,
		'parentId':parentId
	};

	api_ajax_post("comment/default/create", data, cb);
}


/*
 * 删除评论-b32
 */ 
function a_discuss_comment_delete(id, cb) {
	// http://api.wanpinghui.com/{$version}/index.php?r=comment/default/delete&id={$id}
	// 
	// POST
	// ## 参数
	// |          参数         |       含义      | 备注 |
	// |-----------------------|-----------------|------|
	// | id                    | 评论id          | 必填 |
	
	var data = {
		'id': id
	};

	api_ajax_post("comment/default/delete", data, cb);
}

/*
 * c33-短信验证码激活待完善的项目
 */
function a_demand_activate_project(phone, passcode, demand_id, cb) {
    // http://api.xxtao.com/index.php?r=v1.4/demand/c33
    //
    // POST
    // |phone|手机号|必填|
    // |passcode|验证码|必填|
    // |demand_id|需求id|必填|

	var data = {
		"phone" : phone,
		"passcode": passcode,
		"demand_id": demand_id
	};

 	api_ajax_post("v1.4/demand/c33", data, cb);
}
