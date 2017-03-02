module.exports = function (c) {
    return c.local.mockAnyResponse({
        httpRequest: c.req('demand/b42'),
        httpResponse: c.resp200({
            "succ": "1",
            "supplier_list": [
                {'id': 4, 'nick': 'a', 'avatar': "http://cdn.wanpinghui.com/cms/avatar/1.png", "type": "1"},//仅抢单，未留言
                {'id': 2, 'nick': 'b', 'avatar': "http://cdn.wanpinghui.com/cms/avatar/2.png", "type": "2"},//留过言，未抢单
                {'id': 3, 'nick': 'c', 'avatar': "http://cdn.wanpinghui.com/cms/avatar/3.png", "type": "3"}//又抢单，又留言
            ]
    }),

        times
    :
    c.times
}
)
;
}
;
