module.exports = function (c) {
    return c.local.mockAnyResponse({
        httpRequest: c.req('demand/b44'),
        httpResponse: c.resp200({
            "succ": "1",
            "now": "2016-04-27T18:58:18",//服务器当前时间
            "demand_info": {
                "demand_id": "1",

                "client_id": "235", // 发布招标的客户ID；
                "address": "深圳市宝安区",
                "city_id": "234",
                "city_name": "深圳",

                type: 0, //分类：0：其它；1：门头招牌；2：户外广告牌；3：信息告示牌；4：舞台用屏；5：室内高清屏；
                "size": "15",
                "location": "1",	//1：户外，2：户内
                "color": "2",	//1：单色，2：双色，3：全彩
                "span": "P3-P4",
                "budget": "100000",//预算
                "status": "10",//10进行中，60：交易结束
                "sex": "1",
                "image": "http://cdn.wanpinghui.com/cms/pic/23.jpg",//返回统一：imgae
                "note": "这就是个测试",
                "nick": "万先生",
                "phone": "15187429856",//客户联系电话，只是前三和管理员指派的供应商可见。
                "audio": "http://api.wanpinghui.com/audio/3.mp3",//客服和客户之间的录音链接
                "grabdepo": "150",//抢单服务费
                "_intm": 1479283825,

                "supplier_list": [
                    {'id': 4, 'nick': 'a','avatar':"http://cdn.wanpinghui.com/cms/avatar/1.png", "type":"1"},//仅抢单，未留言
                    {'id': 2, 'nick': 'b','avatar':"http://cdn.wanpinghui.com/cms/avatar/2.png", "type":"2"},//留过言，未抢单
                    {'id': 3, 'nick': 'c','avatar':"http://cdn.wanpinghui.com/cms/avatar/3.png", "type":"3"}//又抢单，又留言
                ], //参见 b42 接口；
                "timeline": [
                    {
                        raction: "bid/demand",
                        _intm: "2016-04-27T18:18:18",
                        "content": "已参与抢单产生抢单记录的"
                    },
                    {
                        raction: "bid/demand/depos",
                        _intm: "2016-04-27T18:18:18",
                        "content": "缴纳抢单服务费20元，余额259元"
                    }, {
                        raction: "bid/cancel",
                        _intm: 1479283825,
                        "content": "张三取消跟进，退回服务费12元，余额271元"
                    }
                ],
                'balance': "271", // 工程商钱包余额
            }

            }),

        times: c.times
    })
        ;
};
