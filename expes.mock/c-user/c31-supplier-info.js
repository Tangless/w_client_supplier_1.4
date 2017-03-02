module.exports = function (c) {
    return c.local.mockAnyResponse({
        httpRequest: c.req('user/c31'),
        httpResponse: c.resp200({

            "succ":"1",
            "nick":"张年",
            "user_id":"1",
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
            "usersig":"eJxlz01PwjAcBvD7PkWzK8a0HWWtCQcEhalEiLiwUzPXTgvSla5sEON3V6fGJp5-z--leQsAAOHq7uE8L4rqoB13JyNDcAFCGJ79oTFK8NzxyIp-KI9GWcnz0knbISYMQ*hHlJDaqVL9BrBntdjybn9HqP85iSjBsR9Rzx3Or5bjZDp4aUkr75ueSG-LGU7TGh2kg5vZeH5Ktq-7CVV6kT-WSTZSI0tiZm56dBfFgi2e1ullVk4qtLZtsdoXWLPyerCZZv22WQ6H3kmndvLnoZhFBEFKPW2krVWlv8tARBBCDH5VDt6DDwfDWzs_" // 前端使用该字段登录ImServer；

        }),

        times: c.times
    });
};
