// AUTHOR:   SongErwei
// ROLE:    	
// CREATED:  2016-04-28 15:05:57
 
// 意图：因为浏览器不在前台（后tab不是当前时），setInterval/setTimeout会变慢，甚至暂停。故，
//       一些计时（如轮询）不能依赖于时间叠加，而是每次执行时取当前时间，跟终止时间做差，来得到剩余时间

// 单位：秒
function VTimer(sec) {
	var now = new Date().getTime();
	this.end = (sec * 1000 + now);
	this.start = now;
}

VTimer.prototype.passed = function() {
	var now = new Date().getTime();
	return Math.round((now - this.start) / 1000);
}

VTimer.prototype.remains = function() {
	var now = new Date().getTime();
	var r = (this.end - now);
	return (r > 0) ? Math.round(r / 1000) : 0;
}

VTimer.prototype.ended = function() {
	return (this.remains() <= 0);
}

