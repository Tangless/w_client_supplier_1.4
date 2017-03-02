// AUTHOR:   SongErwei
// ROLE:    	
// CREATED:  2016-04-06 18:04:58
 

//var max_nick = 4
var max_nick = 10
//提交方案中用户输入长度检测
var information = {
	max_price:15,
	max_summery:24
}

function is_nick_valid(nick) {
	return (has(nick) && all_hanzi(nick) && nick.length <= max_nick);
}

// 检查通过，返回''
// 否则返回错误信息
function check_nick_with_tip(nick) {
	var tip = '';
	if (!has(nick)) {
		tip = '请输入您的称呼';
	} else if (!all_hanzi(nick)) {
		tip = '含有特殊字符，请使用中文输入';
	} else if (nick.length > max_nick) {
		tip = '称呼不能超过' + max_nick + '个汉字';
	}

	return tip;
} 

// 规则同上
function check_phone_with_tip(phone) {
	var tip = '';
	if (!has(phone)) {
		tip = '请输入手机号';
	} else if (!is_phone_valid(phone)) {
		tip = '请输入正确的手机号';
	} 

	return tip;
}

function input_box_bind_enter(sel, cb) {
	$(sel).keypress(function(event){
		var keycode = (event.keyCode ? event.keyCode : event.which);
		if (keycode == '13') {
			var word = $(this).val();
			if (word.length > 0) {
				cb.on_enter(word);
			}
		}
	});
}

// 当前页面是否在24H模块
function is_in_hour24() {
	return location.pathname.contains('hour24');
}
