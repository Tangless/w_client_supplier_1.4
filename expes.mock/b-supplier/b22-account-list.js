module.exports = function (c) {
  return c.local.mockAnyResponse({
    httpRequest: c.req('account/list'),
    httpResponse: c.resp200({
	  "succ":"1",
	    "list":[
	        {
	            "card_name":"中国银行",
	            "card_number":"46878835345234524352345",
	            "real_name":"张三",
	        },
	        {
	            "card_name":"支付宝",
	            "card_number":"13548759876",
	            "real_name":"张三",
	        },
	    ]
	}),

    times: c.times
  });
};
