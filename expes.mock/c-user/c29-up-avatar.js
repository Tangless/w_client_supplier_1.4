module.exports = function (c) {
    return c.local.mockAnyResponse({
        httpRequest: c.req('user/c29'),
        httpResponse: c.resp200({
            "succ":"1",
            "image":"http://image.baidu.com/search/detail?ct=503316480&z=0&ipn=d&word=pic&step_word=&hs=0&pn=2&spn=0&di=48480650680&pi=0&rn=1&tn=baiduimagedetail&is=0%2C0&istype=0&ie=utf-8&oe=utf-8&in=&cl=2&lm=-1&st=undefined&cs=1884963422%2C1346981684&os=2337189642%2C1920283661&simid=3478453730%2C430749937&adpicid=0&ln=1811&fr=&fmq=1479266951404_R&fm=&ic=undefined&s=undefined&se=&sme=&tab=0&width=&height=&face=undefined&ist=&jit=&cg=&bdtype=0&oriquery=&objurl=http%3A%2F%2Fimg4.duitang.com%2Fuploads%2Fblog%2F201406%2F08%2F20140608224500_cjsH5.thumb.700_0.jpeg&fromurl=ippr_z2C%24qAzdH3FAzdH3Fooo_z%26e3B17tpwg2_z%26e3Bv54AzdH3Frj5rsjAzdH3F4ks52AzdH3F8canlda0nAzdH3F1jpwtsAzdH3F&gsm=0&rpstart=0&rpnum=0"

        }),

        times: c.times
    });
};
