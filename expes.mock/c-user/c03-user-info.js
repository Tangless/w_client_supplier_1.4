/**
 * Created by jacques on 16/10/11.
 */
module.exports = function (c) {
    return c.local.mockAnyResponse({
        httpRequest: c.req('user/info'),
        httpResponse: c.resp200({
            "succ":"1",
            "nick":"张年",
            "user_id":"gaoyue",
            "user_type":"100",
            "phone":"15623546565",
            "address":"深圳市宝安区福永街道桥头社区永福路112号",
            "avatar":"/images/imodules/ChatRoom/triangle.png",
            "idcard":"362528198812032451",
            "city_id":"1",
            "city_name":"北京",
            "company_name":"万屏时代",
            "position":"销售经理",
            "activated":"1",//1:已激活，0：未激活
            "sex":"1",//性别：1男，0：女
            "balance":23,//钱包余额
            "usersig":"eJxlz1FvgjAUBeB3fkXDq8tsqyIs8YEZYUtUkME0vJAGKrsSgbWFoMv**zZmMpI9f*fm3POhIYT0cP1yz9K0akqVqEvNdfSAdKzf-WFdQ5YwlUxE9g95V4PgCTsqLnqkM4tiPIxAxksFR7gFclZdGj5wmRVJ39EzmX5fE5PS*TACeY*b1W75-OQ4rRU03aEzHq2xa5*c9TJ0q8gP3CpuY1e0*0yOy4K1vg12cPDfUiDeeXPdj3YxpiDF63u0PW1xYYUrGTNj5HllF0b5YjGoVHDmt4fmpmFOJ5gMtOVCQlX*LsZkRgix8M9s7VP7AoCLXbc_" // 前端使用该字段登录ImServer；
        }),

        times: c.times
    });
};
