// AUTHOR:   SongErwei
// ROLE:    	
// CREATED:  2016-04-29 16:52:27
 
//brief: “刚刚” “n分钟前” 等给人看的时间。 
function time_ago(then, now) {
	var ie = isIE();

	//由于ie8不兼容"2016-05-20T23:42:00"，而chrome不兼容"2016/05/20T23:42:00"写法，故分别判断
	if (ie) {
	    return date_ago(new Date(Date.parse(then.replace(/-/g,"/"))), new Date(Date.parse(now.replace(/-/g,"/"))));
	} else {
	   return date_ago(new Date(then), new Date(now));
	}
}

var isIE = function(ver){
    var b = document.createElement('b')
    b.innerHTML = '<!--[if IE ' + ver + ']><i></i><![endif]-->'
    return b.getElementsByTagName('i').length === 1
}

//arg: then and now should be Date(), and now should be better server time, not local time
function date_ago(then, now) {
	var ms = (now - then);
	var sec = Math.floor(ms / 1000);
	if (sec < 60) {
		return '刚刚';
	} else {
		var m = Math.floor(sec / 60);
		if (m < 60) {
			return (m + '分钟前');
		} else {
			var h = Math.floor(m / 60);
			if (h < 24) {
				return (h + '小时前');
			} else {
				var d = Math.floor(h / 24);
				if (d < 10) {
					return (d + '天前');
				} else {
					var day = month_day(then); 
					return day; 
				}
			}
		}
	}
}

function month_day(date) {
	return ((date.getMonth() + 1) + '月' + date.getDate() + '日')
}

function year_month_day(date) {
	return (date.getFullYear() + '年' + month_day(date))
}

function time_ago2(then, now) {
	var y_then = then.getFullYear();
	var y_now = now.getFullYear();
	if (y_then !== y_now) {
		// 不是同一年，就直接显示 年/月/日
		return year_month_day(then);
	} else {
		var m_then = then.getMonth();
		var m_now = now.getMonth();
		if (m_then !== m_now) {
			// 不是同一月，就直接显示 月/日
			return month_day(then); 
		} else {
			var d_then = then.getDate();
			var d_now = now.getDate();
			if (d_then !== d_now) {
				var d_delta = d_now - d_then;
				switch (d_delta) {
					case 1:
						return '昨天'
					case 2:
						return '前天'
					case 3:
						return '3天前'
				}
			}

		}
	}
}

