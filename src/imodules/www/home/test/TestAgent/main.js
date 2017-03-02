define(function() {
    var Module = (function() {
		var baseIModules = project.baseIModules;
        var CON = function(dom) {
            baseIModules.BaseIModule.call(this, dom);
            tlog('hello, i am for autotest');
        };
        potato.createClass(CON, baseIModules.BaseIModule);

        return CON;
    })();

	$(function() {
		var done = false;
		var succ = false;
		var has_cases = false;
		a_screen_req_case_screens({
			succ: function(json) {
				done = true;
				succ = true;
				has_cases = (json.list.length > 0);
			},
			fail: function(json) {
				done = true;
			}
		})

		//重要：这些方法是给自动化测试用的，不要删了哦
		function get_api_request_result(q) {
			if ('done' == q) {
				return done;
			} else if ('succ' == q) {
				return succ;
			} else if ('has' == q) {
				return has_cases;
			} else {
				return false;
			}
		}

		function api_request_result() {
			if (has_cases) {
				return 'has';
			} else if (succ) {
				return 'succ';
			} else if (done) {
				return 'done';
			} else {
				return 'sorry';
			}
		}

		window.get_api_request_result = get_api_request_result;
		window.api_request_result = api_request_result;
	})

    return Module;
})
