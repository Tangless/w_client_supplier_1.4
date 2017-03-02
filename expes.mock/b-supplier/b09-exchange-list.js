module.exports = function (c) {
  return c.local.mockAnyResponse({
    httpRequest: c.req('exchange/list'),
    httpResponse: c.resp200({
		"succ":"1",
        "balance":"100",
        "list":[
        	{"title":"订单完成",type:"1","money":12000,"_intm":"2015-12-31","status":0},
    		{"title":"缴纳诚意金",type:"2","money":2000,"_intm":"2015-12-31"},
    		{"title":"提现请求",type:"2","money":10000,"_intm":"2015-12-31"}
        ]
	}),

    times: c.times 
  });
};
