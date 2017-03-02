// AUTHOR:   SongErwei
// ROLE:    	
// CREATED:  2016-05-31 23:53:30
 
// 此文件为桩的主流程。“桩”，就是不依赖于api提供的数据，而是自己给自己提供数据。
// 原理：
// 1. 将曾经某次由api返回的json数据copy&paste为js的对象（用chrome装了jsonview后的排版，直接粘贴就是标准格式）
// 2. 本文件include该对象
// 3. 改写api_ajax方法（本文件中），若请求的r参数对应提供1中json的接口，则直接返回该对象。
// bingo
//
// 用gulp实现：在本地调试时将本文件追加到生成的global.js上。
//
// 注意：如果不需要桩，请注释本文件中所有代码


// 这句一定要有
@@include("overwrite_api.js")

// 屏幕详情页
//include("data/demand_index/status_ok.js")
//include("data/demand_index/pay.js")
//include("data/demand_index/no_biding_complete.js")
//include("data/demand_index/confirm_setup_done.js")

//include("data/demand_index/i_committed_repair.js")
//include("data/demand_index/supplier_repair_done.js")
//include("data/demand_index/i_confirmed_repair_done.js")
//include("data/demand_index/ordered_repair.js")

// 工程商屏幕详情页
//include("data/supplier_demand_detail/status_ok.js")
//include("data/supplier_demand_detail/to_submit_scheme.js")
//include("data/supplier_demand_detail/he_commited_repair.js")
//include("data/supplier_demand_detail/i_repair_done.js")

// 我的屏 
//include("data/demand_list/no_screen.js")
//include("data/demand_list/two_status_ok_screens.js")

// 抢单
//include("data/bid_order/succ_10s.js")

// 轮询消息
//include('data/tips_list/two_tips.js');

// 加载评论
//include('data/demand_comment/load_review.js');

// 加载名片
//include('data/demand_comment/business_card.js');

