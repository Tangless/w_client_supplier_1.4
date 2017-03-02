// Javascript File
// AUTHOR:   SongErwei
// FILE:     api.js
// ROLE:     api基础、公用方法和对象 
// CREATED:  2016-01-24 11:04:50

var api = {
	url: (function() {
		var url = make_api_origin() + "/index.php";
		tlog(url);
		return url;
	})(),

	url_jump_alipay: function() {
		// http://api.wanpinghui.com/{$version}/index.php?r=pay/jump
		return this.make_url('pay/jump');
 	},
	url_grapJump_alipay: function() {
		// http://api.wanpinghui.com/{$version}/index.php?r=pay/jump
		return this.make_url('account/pay');
 	},
	make_url: function(r) {
    	return (this.url + '?r=' + r);
	}
}; 

function api_ajax(query, cb) {
	_api_ajax('get', api.url, query.r, query, cb);
}

function api_ajax_temp(query, cb) {
	_api_ajax_temp('get', api.url, query.r, query, cb);
}

function api_ajax_post(r, data, cb) {
	var url = api.url + '?r=' + r;
	_api_ajax('post', url, r, data, cb);
}

function api_ajax_post_form_data(r, form_data, cb) {
	var url = api.url + '?r=' + r;
    var ext = {
        processData: false,
        contentType: false
    };
	_api_ajax('post', url, r, form_data, cb, ext);
}

// 第三方的jquery插件（比如上传图片），不能直接用$.ajax时，会用此方法。以给前端同学一个统一的回调方式
function api_std_succ_callback(cb, json, date) {
    cb && cb.always && cb.always(json, date);
    if ("1" == json.succ) {
        cb && cb.succ && cb.succ(json, date);
    } else {
        cb && cb.fail && cb.fail(json, date);
    }
}

//
// cb: callback
//
//param: r, for log only
function _api_ajax(method, url, r, data, cb, ext) {
	console.log(url,data);
	if(r != 'im/im01'){
		potato.application.addLoadingItem();
	}
	olog("[>" + method + "](" + r + "): ", data);
	$.ajax(url, $.extend({
		method: method,
		data: data,
		dataType: "json",
		timeout: 30000,
		xhrFields: {
		 	withCredentials: true
		},
		success: function(json, status, xhr) {
			if(r != 'im/im01'){
				potato.application.removeLoadingItem();
			}
			olog("[<resp](" + r + "): ", json);
            api_std_succ_callback(cb, json, json.now);
		},
		
		error: function(xhr, status, thrown) {
			// https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
			if(r != 'im/im01'){
				potato.application.removeLoadingItem();
			}
			if(status == "timeout"){
				tlog(r + ' 请求超时!');
			}
			var code = as_int(xhr.status);
			tlog("[!err!](" + r + "): status: " + code + ", msg: " + thrown);
			cb && cb.always && cb.always();

			var errorCallback = cb.error || cb.fail;
			errorCallback && errorCallback({msg:"连接失败"}) ;
		}
	}, ext || {}));
}

function _api_ajax_temp(method, url, r, data, cb) {
	console.log(url,data);
	potato.application.addLoadingItem();
	olog("[>" + method + "](" + r + "): ", data);
	$.ajax(url, {
		method: method,
		data: data,
		dataType: "jsonp",
		jsonp: "jsoncallback",
		timeout: 30000,
		xhrFields: {
		 	withCredentials: true
		},
		success: function(json, status, xhr) {
			potato.application.removeLoadingItem();
			olog("[<resp](" + r + "): ", json);
            api_std_succ_callback(cb, json, json.now);
		},
		
		error: function(xhr, status, thrown) {
			// https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
			potato.application.removeLoadingItem();
			if(status == "timeout"){
				tlog(r + ' 请求超时!');
			}
			var code = as_int(xhr.status);
			tlog("[!err!](" + r + "): status: " + code + ", msg: " + thrown);
			cb && cb.always && cb.always();

			var errorCallback = cb.error || cb.fail;
			errorCallback && errorCallback() ;
		}
	});
}

/*
 * assert query中必须含有某key（用于警告程序员时调用此方法，不用于检查用户输入）
 */ 
function api_assert_has_key(data, key) {
	assert1(data[key] != undefined, "You must post key: " + key);
}
function api_assert_has_keys(data, keys) {
	keys.forEach(function(key, i) {
		assert1(data[key] != undefined, "You must post key: " + key);
	})
}

// api pattern: 
/*
function api_xxx(x, y, cb) {
	var q = {
		r: "some/xxx",
		'x': x,
		'y': y,
	};
	
	api_ajax(q, cb);
}

function use_xxx() {
	api_xxx('some', 'some', {
		succ: function(json) {
			//do succ
		},

		// optional
		fail: function(json) {
			// do fail
		},
	});
}

*/


