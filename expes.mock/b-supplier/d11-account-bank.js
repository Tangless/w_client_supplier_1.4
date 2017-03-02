module.exports = function (c) {
  return c.local.mockAnyResponse({
    httpRequest: c.req('account/bank-name'),
    httpResponse: c.resp200({
	  "succ":"1",
	   "bank_name":"中国银行"
	}),

    times: c.times
  });
};
