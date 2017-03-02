// AUTHOR:   SongErwei
// ROLE:    	
// CREATED:  2016-06-12 18:20:43
//
//ref: https://github.com/js-cookie/js-cookie

$(function() {
    var src_key  = 'source';
	var refr_key = 'lander_referrer';
	var uid_key  = 'uid';
	var opt = {domain: get_top_domain_name(), expires: 30};

	var extend_cookie_expires = function(key, opt) {
		var val = Cookies.get(key);
		if (has(val)) {
			Cookies.set(key, val, opt); 
			return true;
		} else {
			return false;
		}
	};

	// source: 若query中有，则应用之，并应用referrer；否则，去看cookie
    var src_val = qs(src_key);
    if (has(src_val)) {
        Cookies.set(src_key, src_val, opt); 

 		var refr_val = document.referrer;
		if (has(refr_val)) {
			Cookies.set(refr_key, refr_val, opt);
		}
	} else {
		// source & referrfer: 若cookie中有，则延长过期时间；否则，啥也不干
		if (extend_cookie_expires(src_key, opt)) {
			extend_cookie_expires(refr_key, opt);
		}
	}

	// uid: 若cookie中有，则延长过期时间；否则, 创建
	if (!extend_cookie_expires(uid_key, opt)) {
		Cookies.set(uid_key, uuid.v4(), opt);
	}
});
