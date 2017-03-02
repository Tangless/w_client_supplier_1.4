module.exports = function (c) {
  var regex = '(' + c.r_list.join('|') + ')';
  c.local.mockAnyResponse({
	httpRequest: c.req(regex),
	httpForward: {
	  host: 'm.xxtao.com',
	  port: 80,
	  schema: "HTTP"
	},

	times: c.times 
  });
};
