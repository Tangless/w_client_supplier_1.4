/* my-mock-responses.js */
/* 使用node，导入模拟数据 */
/* node my-mock-responses.js */
/* curl -v -X GET 'http://localhost:2080/index.php?r=j&username=michael' */

var argv = require('yargs').argv;
var origin = argv.origin || 'http://www2.xxtao.com:8000';
console.log('mock-server will allow CORS for Origin: ' + origin);

var mockServer = require('mockserver-client'),
	mockServerClient = mockServer.mockServerClient,
	proxyClient = mockServer.proxyClient;

var local = mockServerClient('localhost', 2080),
	localProxy = proxyClient('localhost', 2090);

local.reset();

var extend = require('util')._extend;
var utils = require('./expes.mock/my-utils');

var cfg = {
	local: local,
	localProxy: localProxy,

	r_list: require('./expes.mock/r-list')(),

	// 我们api一个r参数唯一定义一个接口（不因GET/POST而有差异），故不再匹配method 
	req: function(r) {
		return this._method('', r);
	},
// 	GET: function(r) {
// 		return this._method('GET', r);
// 	},
// 	POST: function(r) {
// 		return this._method('POST', r);
// 	},

	_method: function(m, r) {
		// 将mock的从r_list中清除，最终剩下的则forward给www.xxtao.com
		utils.remove(this.r_list, r);

		return {
//			method: m,
			path: '/index.php',
			queryStringParameters: [
				{'name': 'r', 'values': [r]}
			],
		}
	},
	resp200: function(body /*, headers*/) {
		return extend(
			{
				statusCode: 200,
				headers: [
					{"name": "Content-Type", "values": ["application/json; charset=utf-8"]},
					{"name": "Access-Control-Allow-Origin", "values": [origin]},
					{"name": "Access-Control-Allow-Credentials", "values": ["true"]}
				],

				delay: {
					timeUnit: 'MILLISECONDS',
					value: 90
				}
			},
			{
				body: JSON.stringify(extend({"mock": "hello, i'm mock"}, body))
			})
	},
	times: {
		'remainingTimes': 1,
		'unlimited': true
	},
};

var getExpectation = function(expectation) {
	require('./expes.mock/' + expectation)(cfg);
};

// 1. 在这里添加你想mock的接口
// getExpectation('b-supplier/b44-demand-info');
// getExpectation('b-supplier/b42-demand-joined');
// getExpectation('b-supplier/b09-exchange-list');
// getExpectation('b-supplier/b21-demand-status');
// getExpectation('b-supplier/b22-account-list');
// getExpectation('b-supplier/b23-bid-view');
// getExpectation('b-supplier/b24-demand-cancel');
// getExpectation('b-supplier/b25-exchage-code');
// getExpectation('b-supplier/b26-account-money');
// getExpectation('b-supplier/b07-exchange-save');
// getExpectation('b-supplier/d08-grab-charge-order');
// getExpectation('b-supplier/d13-grab-pay-confirm');
// getExpectation('b-supplier/d11-account-bank');
// getExpectation('f-sate/f03-company-detail');
// getExpectation('b-supplier/b26-demand-listbycity');
// getExpectation('c-user/c31-supplier-info.js');
// getExpectation('b-supplier/b40-sms-service-order.js');
// getExpectation('b-supplier/b41-sms-service-state.js');
// getExpectation('c-user/c29-up-avatar.js');
// getExpectation('c-user/c31-supplier-info');

// getExpectation('b-supplier/d11-account-bank');
// getExpectation('f-sate/f03-company-detail');
//
// getExpectation('b-supplier/b34-demand-b34self');
// getExpectation('b-supplier/b35-demand-b35bid');
// getExpectation('b-supplier/demand-b38');
// getExpectation('b-supplier/supplier-b39');
// getExpectation('c-user/demand-c28');
getExpectation('c-user/demand-c34');
getExpectation('c-user/c35-user-demand-info.js');
// getExpectation('a-user/c17-user-tips-list');
// ========以上为mock的接口 

// 2. 其他全部forward到www.xxtao.com
getExpectation('all-forward');


