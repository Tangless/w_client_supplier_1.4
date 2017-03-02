// AUTHOR:   SongErwei
// ROLE:    	
// CREATED:  2016-06-04 18:20:24
 
// 手机上的坐标以rem为单位，故需计算相应的px值（高德地图要求marker相关的单位都为px）
//
function screen_top_left_offset() {
    var left = function(sel) {
        return parseFloat(sel.css('left'));
    }
    var bottom = function(sel) {
        return parseFloat(sel.css('bottom'));
    }

    var tip = undefined;
	var x_disp = 0; // 因大头针（或人头儿）在x方向并不居中，故给个校准值（经验值） 

    var scr = $('.screen.hide');
    var bor = scr.find('.board'); 
    if (is_supplier_map()) {
        tip = scr.find('.sup-point');
		x_disp = 7;
    } else {
        tip = scr.find('.rect-for-calc');
		x_disp = 6;
    }

    var pin = scr.find('.pin');
    var x = left(tip) + tip.width() / 2;
    var pin_left = x - pin.width() / 2 + x_disp; 

	//重要：pin的width/height在css中均为px值，而非rem，这一点异于其他元素
	var pin_h = pin.height() + 15; // pin的高度 + (与board的)间隔
    var y = bor.height() + pin_h;

    // x,y: amap marker所需的offset
    // pin_left: 大头针相对于屏左边的偏移
    return {x: -x, y: -y, pin_left: pin_left, pin_bottom: -pin_h, board_w: bor.width(), board_h: bor.height() + pin_h};
}
