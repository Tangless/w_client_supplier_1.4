module.exports = function (c) {
  return c.local.mockAnyResponse({
    httpRequest: c.req('exchange/code'),
    httpResponse: c.resp200({
		"succ":"1",
		"code":"123456",
	    "phone":"18561849623"
	}),

    times: c.times 
  });
};
