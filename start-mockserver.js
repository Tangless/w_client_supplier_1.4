/* start_mockserver.js */
/* 启动mockserver */

/*
 * 前端开发过程中如何使用mock数据（俗称假数据、模拟数据、桩数据）?
 *
 * -1. 确保你机器上安装了java 
 *
 * 0. npm i 
 *	  安装必需的插件
 *
 * 1. node start-mockserver.js [--v=1]
 *    启动mock-server。（跟我们gulp调试一样，会占住命令行，故请单开一个tab或window启动）
 *    --v: verbose
 *
 * 2. gulp [--site=m] --mock=1
 *	  使用mock数据调试
 *
 * 3. 如需新加mock数据，请在expes.mock中进行(参照已有例子)，并在my-mock-responses.js中链入。（保存之后gulp会自动加载新数据）
 *
 * ---------------------
 *
 * 缺陷：
 * 	 因跨域问题，需给mock数据设置Access-Control-Allow-Origin（需要指定请求的Origin）。这个值暂不能动态获得，只能返回
 * 	 固定值，如: http://www2.xxtao.com:8000。故，如同时调试www和m，只能给一方提供mock数据，另一方因Origin问题会失败。
 *
 * ---------------------
 *
 * 其他：
 *    1. 其实主要的代码在my-mock-responses.js中，因它的执行已集成在gulp流程中(见tasks.gulp/mock_expes.js)，被掩盖了
 *    2. 如要mock某个接口，则如上面第3点所述添加；对其他接口的请求会被forward(就是不拦截，放出去)给www.xxtao.com
 */

//
// @ref: https://www.npmjs.com/package/mockserver-grunt
//

var argv = require('yargs').argv;

var mockserver = require('mockserver-grunt');
mockserver.start_mockserver({
	serverPort: 2080,
	proxyPort: 2090,
	verbose: argv.v
});

