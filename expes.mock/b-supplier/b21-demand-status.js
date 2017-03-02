module.exports = function (c) {
    return c.local.mockAnyResponse({
        httpRequest: c.req('bid/demand'),
        httpResponse: c.resp200({
            "succ":"1",
            "date":"2016-04-27T18:58:18",
            "seconds":"900",//从扣款时间开始计算,本时间是设置时长，客户端根据当前时间自行计算显示
            'balance':"40",//工程商账户余额
            "demand_info":{
                "client_id": "235", // 发布招标的客户ID；
                "city_id":"234",
                "_intm":"2016-10-12T17:41:58",
                "address" : "深圳市宝安区深圳市宝安区深圳市宝安区",
                "city_name": "深圳",
                "size" : "150.2",
                "location" : "半户外",
                "color" : "全彩屏",
                "span" : "P3-P4",
                "budget" : "30000",//预算
                "status":"10",//10进行中，60：交易结束
                "nick":"万狗子",
                "sex":"1",
                "audio":"/test.mp3",//客服和客户之间的录音链接
                "grabdepo":"50",//抢单押金
                "suppliers":"2",//竞标人数
                "rank":"2",
                "phone":"15187429856"//客户联系电话，只是前三和管理员指派的供应商可见。
            },
            "timeline":[
                // {
                //     r:"bid/demand",
                //     username:"张三",
                //     intm:"2016-08-27T18:12:18",
                //     "content":"张三参与抢单"
                // },
                // {
                //     r:"bid/demand/depos",
                //     username:"张三",
                //     intm:"2016-08-28T14:49:18",
                //     "content":"缴纳抢单押金20元，余额259元"
                // },
            ]
        }),
        times: c.times
    });
};
