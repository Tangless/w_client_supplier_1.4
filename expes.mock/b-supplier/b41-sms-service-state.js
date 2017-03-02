module.exports = function (c) {
    return c.local.mockAnyResponse({
        httpRequest: c.req('supplier-vas/b41'),
        httpResponse: c.resp200({
            "succ":"1",
            "uid":"2", // 提升可测试；
            "user_type":"100",
            "list":[
                {
                    id: 1,
                    "type":"1",//类型，1：短信
                    "pay_type":"100",//付费类型，10：月；20：季；30：半年；100：一年
                    "city_id":"151",
                    "start_date":"2016-10-13",
                    "end_date":"2017-10-12",
                },{
                    id: 1,
                    "type":"1",//类型，1：短信
                    "pay_type":"30",//付费类型，10：月；20：季；30：半年；100：一年
                    "city_id":"151",
                    "start_date":"2016-10-13",
                    "end_date":"2018-10-12",
                },
                {
                    id: 1,
                    "type":"1",//类型，1：短信
                    "pay_type":"30",//付费类型，10：月；20：季；30：半年；100：一年
                    "city_id":"151",
                    "start_date":"2016-10-13",
                    "end_date":"2018-1-12",
                },
                {
                    id: 1,
                    "type":"1",//类型，1：短信
                    "pay_type":"30",//付费类型，10：月；20：季；30：半年；100：一年
                    "city_id":"151",
                    "start_date":"2016-10-13",
                    "end_date":"2019-10-12",
                }
            ]
            //"succ": "0",
            //"msg": "未登录"
        }),


        times: c.times
    });
};
