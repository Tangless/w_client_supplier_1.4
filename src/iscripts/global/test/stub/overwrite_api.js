// AUTHOR:   SongErwei
// ROLE:    	
// CREATED:  2016-06-01 01:19:45
 

function api_ajax(query, cb) {
	if (!req_stub_data('req', query.r, query, cb)) {
		_api_ajax('get', api.url, query.r, query, cb);
	}
}

function api_ajax_post(r, data, cb) {
	if (!req_stub_data('post', r, data, cb)) {
		var url = api.url + '?r=' + r;
		_api_ajax('post', url, r, data, cb);
	}
}

function req_stub_data(method, r, query, cb) {
	var stub = window.stub;
	if (being(stub) && being(stub[r])) {
		setTimeout(function() {
			var json = stub[r];
			olog("[>stub-" + method + "](" + r + "): ", query);
			olog("[<stub-resp](" + r + "): ", json);
			var date = json.now;
			if ("1" == json.succ) {
				cb.succ(json, date);
			} else if (cb.fail !== undefined){
				cb.fail(json, date);
			}
		}, 200);
		return true;
	} else {
		return false;
	}
}
