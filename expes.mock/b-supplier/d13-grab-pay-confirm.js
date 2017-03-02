/**
 * Created by jacques on 16/8/31.
 */
module.exports = function (c) {
    return c.local.mockAnyResponse({
        httpRequest: c.req("account/checkpay"),
        httpResponse: c.resp200({
            "succ": "1",
            "ok": "1",
            "msg":'支付成功!'
        }),
        times: c.times
    });
};