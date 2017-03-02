/**
 * Created by jacques on 16/8/30.
 */
module.exports = function (c) {
    return c.local.mockAnyResponse({
        httpRequest: c.req('bid/cancel'),
        httpResponse: c.resp200({
            "succ": "1",
            "msg": "取消跟进"
        }),
        times: c.times
    });
};
