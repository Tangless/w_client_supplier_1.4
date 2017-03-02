// AUTHOR:   SongErwei
// ROLE:    	
// CREATED:  2016-03-24 17:20:11
 
//note: 此方法基于高德服务，故需先引入高德api，即 
// <script src="https://webapi.amap.com/maps?v=1.3&key=your-key&plugin=AMap.CitySearch"></script>
//
function amap_ip_in_city(cb) {
	var cs = new AMap.CitySearch();
	cs.getLocalCity(function(status, result) {
		if (status === 'complete' && result.info === 'OK') {
			var city = std_city_name(result.city);
			tlog('cur city(ip by amap): ' + city);	
			cb.succ(city);
		} else {
			tlog('ip to city failed(by amap), status: ' + status + ', result: ' + result);
			cb.fail();
		}
	});
}

function std_city_name(raw) {
    if (raw.length < 4) {
        return raw.replace('市', '');
    }

    var tb = '特别行政区';
    if (raw.indexOf(tb) != -1) {
        return raw.replace(tb, '');
    }

    if (raw.indexOf('自治') != -1) {
        return raw.replace(/([蒙古朝鲜土家布依哈尼景颇满藏回黎彝羌壮苗傣白侗瑶僳]族?)+自治[州县区]/, '');
    }

    var dq = '地区';
    if (raw.indexOf(dq) != -1) {
        return raw.replace(dq, '');
    }

    var res = raw.replace('市', '');
    return (res.length <= 4) ? res : res.substr(0, 4);
}

assert('北京' === std_city_name('北京市'));
assert('香港' === std_city_name('香港特别行政区'));
assert('阿里' === std_city_name('阿里地区'));

assert('博尔塔拉' === std_city_name('博尔塔拉蒙古自治州'));
assert('阿坝' === std_city_name('阿坝藏族羌族自治州'));
assert('延边' === std_city_name('延边朝鲜族自治州'));
assert('恩施' === std_city_name('恩施土家族苗族自治州'));
assert('凉山' === std_city_name('凉山彝族自治州'));
assert('黔东南' === std_city_name('黔东南苗族侗族自治州'));
assert('黔南' === std_city_name('黔南布依族苗族自治州'));
assert('德宏' === std_city_name('德宏傣族景颇族自治州'));
assert('怒江' === std_city_name('怒江僳僳族自治州'));
assert('红河' === std_city_name('红河哈尼族彝族自治州'));

assert('不知道是' === std_city_name('不知道是什么市'));
