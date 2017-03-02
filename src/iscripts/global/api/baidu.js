// AUTHOR:   SongErwei
// ROLE:    	
// CREATED:  2016-06-03 14:26:58
 
/*
1   UV      
2   PV比        pv/uv   
3   停留达标率  tu/uv           访问万屏汇，累计停留时间超过3分钟，称为停留达标，记为TU
4   回访率      ru/uv           离开万屏汇，再次访问万屏汇，记为RU
5   报装率      su/uv           报装用户，称为su
6   查看标书率  vsu/uv          查看过标书的用户，称为vsu
7   付款率      psu/uv          成功在线支付的用户，称为psu
8   成功交易率  tsu/uv          确认安装服务的用，称为tsu
9   客单价      tm/psu          交易总额，tm
10  每点击价值  tm/uv）＊n      利润率，称为n
*/

//important: 这些方法真正在百度那些起效，需保证百度统计的基础代码已加载，见 web/shared/baidu-sitecenter.html

function bd_track_client_bookin() {
    bd_track_client('报装');
}

function bd_track_client_view_scheme() {
    bd_track_client('查看标书');
}

function bd_track_client_paid() {
    bd_track_client('支付订金');
}

function bd_track_client_confirm_install() {
    bd_track_client('确认安装完成');
}

function bd_track_client(action, opt_label, opt_value) {
    _bd_track('购屏', action, opt_label, opt_value);    
}

// http://tongji.baidu.com/open/api/more?p=guide_trackEvent
/*
    _hmt.push(['_trackEvent', category, action, opt_label, opt_value]);

    category：要监控的目标的类型名称，通常是同一组目标的名字，比如"视频"、"音乐"、"软件"、"游戏"等等。该项必选。
    action：用户跟目标交互的行为，如"播放"、"暂停"、"下载"等等。该项必选。
    opt_label：事件的一些额外信息，通常可以是歌曲的名称、软件的名称、链接的名称等等。该项可选。
    opt_value：事件的一些数值信息，比如权重、时长、价格等等，在报表中可以看到其平均值等数据。该项可选。
*/

function _bd_track(cate, action, opt_label, opt_value) {
//note: 现在改用“路径转化”功能实现，为了避免重复统计，故先屏蔽“事件跟踪”  @2016/7/5
// 	tlog('bd track event: (' + cate + ', ' + action + ')');
//     _hmt.push(['_trackEvent', cate, action, opt_label, opt_value]);
}

//test
//(function() {
// 
// 	bd_track_client_bookin();
// 	bd_track_client_view_scheme();
// 	bd_track_client_paid();
// 	bd_track_client_confirm_install();
//})()

