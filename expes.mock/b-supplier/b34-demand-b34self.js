module.exports = function (c) {
  return c.local.mockAnyResponse({
    httpRequest: c.req('demand/b34self'),
    httpResponse: c.resp200({
		  "succ":"1",
		  "now":"2016-04-28T18:58:18",
		  "list":[
		    {
		        "_intm" : "2016-04-27T18:58:18",
		        "client_id":"12",
		        "address" : "深圳市宝安区",
		        "size" : "15",
		        "location" : "半户外",
		        "color" : "全彩屏",
		        "span" : "P3-P4",
		        "budget" : "100000",//预算
		        "status":"10",//10进行中，60：交易结束
		        "nick":"万先生",
		        "sex":"0",
		        "suppliers":[]
		    },
		    {
		        "_intm" : "2016-04-27T18:58:18",
		        "client_id":"12",
		        "address" : "深圳市宝安区",
		        "size" : "15",
		        "location" : "半户外",
		        "color" : "全彩屏",
		        "span" : "P3-P4",
		        "budget" : "100000",//预算
		        "status":"10",//10进行中，60：交易结束
		        "nick":"万先生",
		        "sex":"1",
		        "suppliers":[]
		    },
		    {
		        "_intm" : "2016-04-27T18:58:18",
		        "client_id":"12",
		        "address" : "深圳市宝安区",
		        "size" : "15",
		        "location" : "半户外",
		        "color" : "全彩屏",
		        "span" : "P3-P4",
		        "budget" : "100000",//预算
		        "status":"60",//10进行中，60：交易结束
		        "nick":"杨先生",
		        "sex":"1",
		        "suppliers":[]
		    }
		  ]
	}),

    times: c.times 
  });
};
