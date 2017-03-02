/**
 * Created by jacques on 16/8/30.
 */
module.exports = function (c) {
    return c.local.mockAnyResponse({
        httpRequest: c.req("account/order"),
        httpResponse: c.resp200({
            "succ": "1",
            "transnumber":'abc_201608311752'
        }),
        times: c.times
    });
};
