module.exports = function (c) {
  return c.local.mockAnyResponse({
    httpRequest: c.req('company/detail'),
    httpResponse: c.resp200({
    	"succ":"1",
        "company_name":"深圳市亮彩科技有限公司",
        "address":"清华信息港 综合楼 501",
        "area_name":"南山区",
        "city_id":"202",
        "born_date":"2011-10-23",
        "city_name":"深圳市",
        "company_detail":"背景墙 公司形象墙  广告招牌  喷绘写真 发光字 门头装饰 楼顶招牌 欢迎来电咨询<br/>深圳泰林广告设计公司成立于2003年，近10年来，我们高效、踏实、力求完美的工作，业务获得快速的发展，先后成立广告设计、广告策划、广告制作、广告工程等部门；<br/>泰林广告将通过持之以恒的努力，全面提高品质、提升效率、提升服务，实现全面快速的发展。泰林广告坚持以卓越的品质、优质的服务、友好的态度、恒久的信念为经营理念，以诚信为本，德誉为魂，为客户服务，让几万家新老客户省心、放心，诚挚的感谢新老客户的支持和帮助！",
        "main_business":"主营业务",
        "service_scope":"服务范围",
        "cate_list":[
                {
                    cate_id: "1",
                    cate_name: "LED"
                },
                {
                    cate_id: "2",
                    cate_name: "水晶"
                },
                {
                    cate_id: "5",
                    cate_name: "树脂"
                }
          ],
        "service_area_list":[
            {
                area_id: "2",
                area_name: "西城区"
            },
            {
                area_id: "4",
                area_name: "丰台区"
            },
            {
                area_id: "7",
                area_name: "门头沟区"
            }
        ],
        "lng":"116.409405",
        "lat":"39.8934",
        "recommend_list":[
            {
                "company_id":"3",
                "company_name":"深圳市亮彩科技有限公司",
                "address":"清华信息港 综合楼 501",
                "area_name":"南山区",
                "company_img":"http://img.zhaopaizhizuodian.com/company/23.jpeg"
            },
            {
                "company_id":"3",
                "company_name":"深圳市亮彩科技有限公司",
                "address":"清华信息港 综合楼 501",
                "company_img":"http://img.zhaopaizhizuodian.com/company/23.jpeg",
                "area_name":"南山区",
            },
            {
                "company_id":"3",
                "company_name":"深圳市亮彩科技有限公司",
                "address":"清华信息港 综合楼 501",
                "company_img":"http://img.zhaopaizhizuodian.com/company/23.jpeg",
                "area_name":"南山区",
            },
            {
                "company_id":"3",
                "company_name":"深圳市亮彩科技有限公司",
                "address":"清华信息港 综合楼 501",
                "company_img":"http://img.zhaopaizhizuodian.com/company/23.jpeg",
            },
            {
                "company_id":"3",
                "company_name":"深圳市亮彩科技有限公司",
                "address":"清华信息港 综合楼 501",
                "company_img":"http://img.zhaopaizhizuodian.com/company/23.jpeg",
                "area_name":"南山区",
            },
            {
                "company_id":"3",
                "company_name":"深圳市亮彩科技有限公司",
                "address":"清华信息港 综合楼 501",
                "company_img":"http://img.zhaopaizhizuodian.com/company/23.jpeg",
                "area_name":"南山区",
            }
        ]
	}),

    times: c.times 
  });
};