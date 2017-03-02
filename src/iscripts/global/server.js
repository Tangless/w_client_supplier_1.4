/**
 * Created by jacques on 16/7/8.
 */
var server = {

    //着陆页 发送登记的用户信息到后台
    send_landing_phone:function (data,successCallback, failCallback) {
        var defaultData = {
            who: "着陆页",
            user_type: "1",
            phone: ''
        };
        var tpl_data = $.extend({}, defaultData, data);

		var tpl = make_api_origin() + '/index.php?r=user/dengji&who={{who}}&phone={{phone}}&user_type={{user_type}}';
        $.ajax({
            type: 'GET',
            dataType: "jsonp",
            jsonp: "jsoncallback",
            url: Mustache.render(tpl,tpl_data),
            success: function(json) {
                var date = json.now;
                if (json.succ == "1" ) {
                    successCallback(json, date);
                } else if (failCallback){
                    failCallback(json, date);
                }
            },

            error: function() {
                alert('请求错误')
            }
        })
    }
};
