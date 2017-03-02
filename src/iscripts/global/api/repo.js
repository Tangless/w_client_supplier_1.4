// AUTHOR:   SongErwei
// ROLE:    	
// CREATED:  2016-02-24 16:42:54
 
function a_repo_req_cases(q, cb) {
	// http://www.wanpinghui.com/{$version}/index.php?r=search/anli&color={$color}&location={$location}&style={$style}&span={$span}
    //		&install_type={$install_type}&keyword={$keyword}&sort={$sort}&page={$page}
	//		
	// |color|颜色|选填|
	// |location|场地|选填|
	// |style|特点|选填|
	// |span|间距|选填|
	// |install_type|安装方式|选填|
	// |keyword|搜索关键字|选填|
	// |page|页数|选填，默认：1|
	// |sort|排序类型|默认:1,（1：最新，2:最热）|
	// 
	// {
	//     "succ":"1",
	//     "totals":2,
	//     "pagesize":10,
	//     "list":[
	//         {
	//           "demand_id":"1",
	//           "demand_pic" : "",
	//           "price" : "1256238",
	//           "address" : "望京soho",
	//         },
	//         {
	//           "demand_id":"3",
	//           "demand_pic" : "3.jpg",
	//           "price" : "1254887",
	//           "address" : "望京soho",
	//         }
	//     ]
	// }

	q.r = 'search/anli';
	api_ajax(q, cb);
}

function a_repo_req_topics(q, cb) {
	// http://www.wanpinghui.com/{$version}/index.php?r=search/special&keyword={$keyword}&sort={$sort}&page={$page}
	//
	// |page|页数|选填，默认：1|
	// |keyword|搜索关键字|选填|
	// |sort|排序类型|默认:1,（1：最新，2:最热）|
	// 
	// {
	//     "succ":"1",
	//     "totals":2,
	//     "pagesize":10,
	//     "list":[
	//         {
	//           "special_id":"1",
	//           "pic" : "",
	//           "title" : "1256238",
	//           "sub_title" : "望京soho",
	//           "content" : "已派供应商齐普光电王先生为您上门查看故障并维修，....，无法维修使用，现已为您更换了新的控制器（诺瓦w578）"
	//         },
	//         ...
	// 		]
	// }
	
	q.r = 'search/special';
	api_ajax(q, cb);
}


function a_repo_req_supplier_list(lng, lat, size, cb) {
	// 	## 请求地址
	// 	http://api.wanpinghui.com/index.php?r=supplier/infolist&page={$page}&size={$size}&lng={$lng}&lat={$lat}
	// 
	// 	## 参数
	// 	| 参数     | 含义       | 备注            |
	// 	| :------: | :------:   | :------:        |
	// 	| page     | 页数       | 默认：1         |
	// 	| size     | 每次展示数 | 默认：500       |
	// 	| lng      | 经度       | 格式：$min,$max ,示例：10.234563,85.245674|
	// 	| lat      | 纬度       | 格式：$min,$max  ,示例：10.234563,85.245674|
	//
	// {
	//   "succ":"1",
	//   "list":[
	// 	{
	// 		"supplier_id":"23",
	// 		"lng":"116.480665",
	// 		"lat":"39.996404",
	// 		"nick":"姚先生",
	// 		"address":"北京朝阳望京soho",
	// 		"city_name":"北京",
	// 		"tel":"13689547824",
	// 		"stars":"3"
	// 	},
	//   ]
	// }
	
	var q = {
		r: 'supplier/infolist',
		size: size,
		lng: lng || '',
		lat: lat || ''
	};

	api_ajax(q, cb);
}

// 获取指定城市的工程商数量
function a_repo_req_supplier_count_in_city(city_id, cb) {
    // http://api.wanpinghui.com/index.php?r=supplier/b30&city_id={$city_id}
    // { 
    //     'succ': '1',
    //     'cnt':'167',
    // }
    
	var q = {
		r: "supplier/b30",
		city_id: city_id
	};

	api_ajax(q, cb);
}

function a_repo_req_article_detail(id, cb) {
	//	http://api.wanpinghui.com/index.php?r=article/detail&article_id={$article_id}
	//
	//	get
	//
	//	| 参数       | 含义     | 备注     |
	//	| :------:   | :------: | :------: |
	//	| article_id | 文章id   | 必填     |

	var q = {
		r: "article/detail",
		article_id: id
	};

	api_ajax(q, cb);
}
