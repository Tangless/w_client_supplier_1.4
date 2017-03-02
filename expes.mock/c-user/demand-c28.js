module.exports = function (c) {
  return c.local.mockAnyResponse({
    httpRequest: c.req('demand/c28'),
    httpResponse: c.resp200({
		  "succ":"1",
		  "now":"2016-04-28T18:58:18",
		  "publish_list":[	//我发布的标的列表
				{
					//标的id
					"demand_id":"23", // 发布招标的ID；

					//客户（发布人）信息
					"client_id": "235", // 发布招标的客户ID；
					"nick":"万先生",
					"sex":"0",

					//标的信息
					"type": 0,	//分类：0：其它；1：门头招牌；2：户外广告牌；3：信息告示牌；4：舞台用屏；5：室内高清屏；
					"_intm" : "2016-04-27T18:58:18",
					"address" : "深圳市宝安区",
					"size" : "15",
					"location" : "半户外",
					"color" : "全彩屏",
					"span" : "P3-P4",
					"budget" : "100000",	//预算，0：表示议价；
					"image": "http://img.domain.com/a.jpg",	//需求场地图片
					"note": '需要防水',	//备注
					"status":"10",//10进行中，60：交易结束

					"suppliers":[]//返回空数组
				},
				{
					//标的id
					"demand_id":"23", // 发布招标的ID；

					//客户（发布人）信息
					"client_id": "235", // 发布招标的客户ID；
					"nick":"万先生",
					"sex":"0",

					//标的信息
					"type": 1,	//分类：0：其它；1：门头招牌；2：户外广告牌；3：信息告示牌；4：舞台用屏；5：室内高清屏；
					"_intm" : "2016-04-27T18:58:18",
					"address" : "深圳市宝安区",
					"size" : "15",
					"location" : "半户外",
					"color" : "全彩屏",
					"span" : "P3-P4",
					"budget" : "100000",	//预算，0：表示议价；
					"image": "http://img.domain.com/a.jpg",	//需求场地图片
					"note": '需要防水',	//备注
					"status":"10",//10进行中，60：交易结束

					"suppliers":[]//返回空数组
				},
				{
					//标的id
					"demand_id":"23", // 发布招标的ID；

					//客户（发布人）信息
					"client_id": "235", // 发布招标的客户ID；
					"nick":"万先生",
					"sex":"0",

					//标的信息
					"type": 2,	//分类：0：其它；1：门头招牌；2：户外广告牌；3：信息告示牌；4：舞台用屏；5：室内高清屏；
					"_intm" : "2016-04-27T18:58:18",
					"address" : "深圳市宝安区",
					"size" : "15",
					"location" : "半户外",
					"color" : "全彩屏",
					"span" : "P3-P4",
					"budget" : "100000",	//预算，0：表示议价；
					"image": "http://img.domain.com/a.jpg",	//需求场地图片
					"note": '需要防水',	//备注
					"status":"10",//10进行中，60：交易结束

					"suppliers":[]//返回空数组
				},
			],
	bid_list: [	//我参与的标的列表
		//同publish_list
		{
					//标的id
					"demand_id":"23", // 发布招标的ID；

					//客户（发布人）信息
					"client_id": "235", // 发布招标的客户ID；
					"nick":"万先生",
					"sex":"0",

					//标的信息
					"type": 3,	//分类：0：其它；1：门头招牌；2：户外广告牌；3：信息告示牌；4：舞台用屏；5：室内高清屏；
					"_intm" : "2016-04-27T18:58:18",
					"address" : "深圳市宝安区",
					"size" : "15",
					"location" : "半户外",
					"color" : "全彩屏",
					"span" : "P3-P4",
					"budget" : "100000",	//预算，0：表示议价；
					"image": "http://img.domain.com/a.jpg",	//需求场地图片
					"note": '需要防水',	//备注
					"status":"10",//10进行中，60：交易结束

					"suppliers":[]//返回空数组
				},
				{
					//标的id
					"demand_id":"23", // 发布招标的ID；

					//客户（发布人）信息
					"client_id": "235", // 发布招标的客户ID；
					"nick":"万先生",
					"sex":"0",

					//标的信息
					"type": 4,	//分类：0：其它；1：门头招牌；2：户外广告牌；3：信息告示牌；4：舞台用屏；5：室内高清屏；
					"_intm" : "2016-04-27T18:58:18",
					"address" : "深圳市宝安区",
					"size" : "15",
					"location" : "半户外",
					"color" : "全彩屏",
					"span" : "P3-P4",
					"budget" : "100000",	//预算，0：表示议价；
					"image": "http://img.domain.com/a.jpg",	//需求场地图片
					"note": '需要防水',	//备注
					"status":"10",//10进行中，60：交易结束

					"suppliers":[]//返回空数组
				},
				{
					//标的id
					"demand_id":"23", // 发布招标的ID；

					//客户（发布人）信息
					"client_id": "235", // 发布招标的客户ID；
					"nick":"万先生",
					"sex":"0",

					//标的信息
					"type": 5,	//分类：0：其它；1：门头招牌；2：户外广告牌；3：信息告示牌；4：舞台用屏；5：室内高清屏；
					"_intm" : "2016-04-27T18:58:18",
					"address" : "深圳市宝安区",
					"size" : "15",
					"location" : "半户外",
					"color" : "全彩屏",
					"span" : "P3-P4",
					"budget" : "100000",	//预算，0：表示议价；
					"image": "http://img.domain.com/a.jpg",	//需求场地图片
					"note": '需要防水',	//备注
					"status":"10",//10进行中，60：交易结束

					"suppliers":[]//返回空数组
				},
	],

	}),

    times: c.times 
  });
};
