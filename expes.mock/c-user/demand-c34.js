/**
 * Created by jacques on 16/10/11.
 */
module.exports = function (c) {
    return c.local.mockAnyResponse({
        httpRequest: c.req('demand/c34'),
        httpResponse: c.resp200({
            "succ":"1",
              "now":"2016-04-27T18:58:18",
              "user_id": "233", // 有这个数据项，则表示当前登录用户的user_id；
              "cnt": "9304",    // 项目总数量，用于翻页；包括：“正在洽谈”和“圆满完成”的项目，不包括“待完善”的项目（用于首页项目大厅）；
              "list": [{
                "demand_id":"23", //项目ID；
                "demand": { //项目信息
                    "demand_id":"23", //项目ID；
                    "type": 0,  //分类：0：其它；1：门头招牌；2：户外广告牌；3：信息告示牌；4：舞台用屏；5：室内高清屏；
                    "address" : "深圳市宝安区",
                    "size" : "15",
                    "location" : 1, //1 => '户外', 2 => '室内', 3 => '半户外',
                    "color" : 1,    //1：单色，2：双色，3：全彩
                    "span" : "P3-P4",
                    "budget" : "100000",    //预算，0：表示议价；
                    "image": "http://img.domain.com/a.jpg", //需求场地图片
                   "status":"10",//10进行中，60：交易结束
                    '_intm': 1479283825,
                    '_uptm': 1479283825,
                    "intm" : "2016-04-27T18:58:18",
                    "uptm" : "2016-04-27T18:58:18",
                },
                "user": {
                    "user_id": "235", //发布该项目的客户ID；
                    "nick":"万先生",
                    "sex":"0",
                },
                "supplier_list": [{ //参见 b42 接口；
                    avatar: "http://cdn.xxtao.com/cms/pics/avatar/000/494/539/494539_27296.jpg",
                },
                {
                    avatar: "http://cdn.xxtao.com/cms/pics/avatar/000/494/535/494535_18664.jpg",
                },
                {
                    avatar: "http://cdn.xxtao.com/cms/pics/avatar/000/494/506/494506_36736.jpg",
                }],
              },
              {
                "demand_id":"23", //项目ID；
                "demand": { //项目信息
                    "demand_id":"23", //项目ID；
                    "type": 0,  //分类：0：其它；1：门头招牌；2：户外广告牌；3：信息告示牌；4：舞台用屏；5：室内高清屏；
                    "address" : "深圳市宝安区",
                    "size" : "15",
                    "location" : 1, //1 => '户外', 2 => '室内', 3 => '半户外',
                    "color" : 1,    //1：单色，2：双色，3：全彩
                    "span" : "P3-P4",
                    "budget" : "100000",    //预算，0：表示议价；
                    "image": "http://img.domain.com/a.jpg", //需求场地图片
                   "status":"10",//10进行中，60：交易结束
                    '_intm': 1479283825,
                    '_uptm': 1479283825,
                    "intm" : "2016-04-27T18:58:18",
                    "uptm" : "2016-04-27T18:58:18",
                },
                "user": {
                    "user_id": "235", //发布该项目的客户ID；
                    "nick":"万先生",
                    "sex":"0",
                },
                "supplier_list": [{ //参见 b42 接口；
                    avatar: "http://cdn.xxtao.com/cms/pics/avatar/000/494/539/494539_27296.jpg",
                },
                {
                    avatar: "http://cdn.xxtao.com/cms/pics/avatar/000/494/535/494535_18664.jpg",
                },
                {
                    avatar: "http://cdn.xxtao.com/cms/pics/avatar/000/494/506/494506_36736.jpg",
                }],
              },
              {
                "demand_id":"23", //项目ID；
                "demand": { //项目信息
                    "demand_id":"23", //项目ID；
                    "type": 0,  //分类：0：其它；1：门头招牌；2：户外广告牌；3：信息告示牌；4：舞台用屏；5：室内高清屏；
                    "address" : "深圳市宝安区",
                    "size" : "15",
                    "location" : 1, //1 => '户外', 2 => '室内', 3 => '半户外',
                    "color" : 1,    //1：单色，2：双色，3：全彩
                    "span" : "P3-P4",
                    "budget" : "100000",    //预算，0：表示议价；
                    "image": "http://img.domain.com/a.jpg", //需求场地图片
                   "status":"10",//10进行中，60：交易结束
                    '_intm': 1479283825,
                    '_uptm': 1479283825,
                    "intm" : "2016-04-27T18:58:18",
                    "uptm" : "2016-04-27T18:58:18",
                },
                "user": {
                    "user_id": "235", //发布该项目的客户ID；
                    "nick":"万先生",
                    "sex":"0",
                },
                "supplier_list": [{ //参见 b42 接口；
                    avatar: "http://cdn.xxtao.com/cms/pics/avatar/000/494/539/494539_27296.jpg",
                },
                {
                    avatar: "http://cdn.xxtao.com/cms/pics/avatar/000/494/535/494535_18664.jpg",
                },
                {
                    avatar: "http://cdn.xxtao.com/cms/pics/avatar/000/494/506/494506_36736.jpg",
                }],
              }]

        }),

        times: c.times
    });
};
