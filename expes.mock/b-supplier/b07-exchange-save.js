module.exports = function (c) {
  return c.local.mockAnyResponse({
    httpRequest: c.req('exchange/save'),
    httpResponse: c.resp200({
		"succ":"1",
	}),

    times: c.times 
  });
};
