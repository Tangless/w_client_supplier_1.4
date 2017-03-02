module.exports = function (c) {
    return c.local.mockAnyResponse({
        httpRequest: c.req('supplier-vas/b40'),
        httpResponse: c.resp200({
            "succ":"1",
             // 提升可测试；
            "status":"1"

            //"succ": "0",
            //"msg": "未登录"
        }),


        times: c.times
    });
};
