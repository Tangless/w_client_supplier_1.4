// AUTHOR:   SongErwei
// ROLE:    	
// CREATED:  2016-03-31 11:45:56

// includes 方法还不是标准，IE不支持，故不能用，自己定义吧

String.prototype.contains = function(it) { 
	return this.indexOf(it) != -1;  
}
Array.prototype.contains = function(it) { 
	//return this.indexOf(it) != -1;  
	// IE8没有indexOf，暂时先用jquery的，先跑起来
	return ($.inArray(it, this) != -1);
}

// 在数字前补0，保证长度为n
//copyfrom: http://stackoverflow.com/questions/8513032/less-than-10-add-0-to-number
Number.prototype.pad = function(n) {
	return (new Array(n).join('0') + this).slice((n || 2) * -1);
}

$.prototype.is_visible = function() {
	return this.is(':visible');
}
$.prototype.is_not = function(sel) {
	return (!this.is(sel));
}

// 适用于只能点击一次的，以防连续点击
$.prototype.one_click = function(handler) {
	return this.one('click', function() {
		tlog('You clicked me, and can not click me any more');
		handler();
	});
}

// hide是我们convention.css中定义的标准class，js中应尽量用addHide()/removeHide()方式来隐藏/显示。
// 若用show()/hide()，有时会因为inline的问题，出现非预期结果
$.prototype.addHide = function() {
	return this.addClass('hide');
}
$.prototype.removeHide = function() {
	return this.removeClass('hide');
}
// $.prototype.rmHide = function() {
// 	return this.removeHide(); 
// }
$.prototype.hasHide = function() {
	return this.hasClass('hide');
}

$.prototype.addActive = function() {
	return this.addClass('active');
}
$.prototype.removeActive = function() {
	return this.removeClass('active');
}
// $.prototype.rmActive = function() {
//     return this.removeActive();
// }
$.prototype.hasActive = function() {
	return this.hasClass('active');
}

$.prototype.tplToObj = function() {
	if (this.hasClass('tpl')) {
		return this.removeClass('tpl').addClass('obj');
	} else {
		alert('not tpl element');
	}
}

// 下面这些是我还不会prototype时的扩展策略，未来有时间再改成prototype方式 

function $has(sel) {
	return ($(sel).length > 0)	
}

// 常常忘记 .
function $c(name) {
	return ('.' == name[0] ? $(name) : $('.' + name))
}

function $t(sel) {
	return $(sel).text()
}

function $v(sel) {
	return $(sel).val()
}

function $has_t(sel) {
	return $t(sel).length > 0
}
function $has_v(sel) {
	return $v(sel).length > 0
}
