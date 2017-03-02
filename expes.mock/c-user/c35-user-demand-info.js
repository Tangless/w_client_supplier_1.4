module.exports = function (c) {
    return c.local.mockAnyResponse({
        httpRequest: c.req('demand/c35'),
        httpResponse: c.resp200({

            "succ": "0",
            "user": {
                "user_id": "467855",
                "nick": "王五"
            },
            //项目信息
            "demand": [{
                "demand_id": "274", // 发布招标的ID；
                "type": 0,  //分类：0：其它；1：门头招牌；2：户外广告牌；3：信息告示牌；4：舞台用屏；5：室内高清屏；
                "address": "深圳市宝安区",
                "size": "15",
                "location": 1, //1 => '户外', 2 => '室内', 3 => '半户外',
                "color": 1,    //1：单色，2：双色，3：全彩
                "span": "P3-P4",
                "budget": "100000",    //预算，0：表示议价；
                "image": "http://img.domain.com/a.jpg", //需求场地图片
                "status": "10",//0：初始状态，10：洽谈中，60：圆满完成；
                '_intm': 1479283825,
                '_uptm': 1479283825,
                "intm": "2016-04-27T18:58:18",
                "uptm": "2016-04-27T18:58:18"
            }]
        }),

        times: c.times
    });
};
