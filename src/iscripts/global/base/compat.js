// AUTHOR:   SongErwei
// ROLE:    	
// CREATED:  2016-06-03 09:39:43
 
// 为了兼容（目前只有ie8），也为了代码保持统一，基本原则：如果ie8不支持某方法，那就统一都不用；定义统一的方法，都用
// 如，forEach，ie8不支持，那就统一用自己定义的一个方法。"x"，作为一个统一的前缀，标识是我们自己定义的

// 有人说forEach慢，而且ie8也不支持它，那就不统一都不用它了，自己定义
Array.prototype.xForEach = function(cb) {
	for (var i = 0; i < this.length; i++){
		cb.apply(this, [this[i], i, this]);
	}
}
