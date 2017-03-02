module.exports = function (c) {
  return c.local.mockAnyResponse({
    httpRequest: c.req('bid/view'),
    httpResponse: c.resp200({
	  "succ":"1",
	  "phone":"",
	  "has_bid":"1",//是否参与竞标
	  "has_pay":"1",//是否支付
	  "has_refund":"0",//是否退款
	}),

    times: c.times
  });
};
