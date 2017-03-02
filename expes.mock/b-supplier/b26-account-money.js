module.exports = function (c) {
  return c.local.mockAnyResponse({
    httpRequest: c.req('account/balance'),
    httpResponse: c.resp200({
		"succ":"1",
        "balance":"300"
	}),

    times: c.times 
  });
};
