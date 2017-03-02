/**
 * Created by jacques on 16/11/02.
 */
module.exports = function (c) {
    return c.local.mockAnyResponse({
        httpRequest: c.req('user/info'),
        httpResponse: c.resp200({
            "succ":"1",
            "demand_id":"99"
        }),

        times: c.times
    });
};
