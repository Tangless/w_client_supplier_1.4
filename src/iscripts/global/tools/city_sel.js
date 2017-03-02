// AUTHOR:   SongErwei
// ROLE:    	
// CREATED:  2016-04-06 16:28:10
 
$(function() {
	init_city_sel();
    // init_index_click();
})

function dis_index_event(){
    $('.city-which-index').click(function(){
        var dis = $(this).parent();
        if($(this).attr("select")=="yes"){
            dis.find('.join-delist').addHide();
            $(this).attr("select","no");
        }else{
            dis.find('.join-delist').removeHide();
            $(this).attr("select","yes");
        }
    })
}

function init_city_sel(cb) {
	a_auth_req_city_dict({
		succ: function(json) {
			fill_dom(json.list);
            offen_user_city()
            dis_index_event();
            bind_index_event();
            bind_select_event({
                succ: function(city) {
                    set_city_name_id(city);
                    hide_city_sel();

                }
            });

            posit_cur_city(json.list, {
                succ: function(city) {
                    set_city_name_id(city);
                }
            });

			//test
			//show_city_sel();
		}
	});
}
function offen_user_city() {
    if(Cookies.get("city_name")!=undefined&&Cookies.get("city_id")!=undefined){
        var city_names = Cookies.get("city_name").split(":")
        var city_ids = Cookies.get("city_id").split(":");
        for (var i = 0; i < city_names.length; i++) {
            var ai = '<a class="city-item" href="javascript:;">' + city_names[i] + '</a><i class="id">' + city_ids[i] + '</i>';
                    $('<span>' + ai + '</span>').appendTo('.join-position');
        } 
    }
    
    }
function fill_dom(list) {
	var abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
 	for (var i = 0; i < abc.length; i++) {
		var k = abc[i];
		var cities = list[k];
		if (being(cities)) {
			var li = $('<li class="city-group-' + k + '"></li>');
			$('<h4 class="city-which-index" select="yes">' + k + '</h4>').appendTo(li);
			var div = $('<div class="join-delist"></div>');
			div.appendTo(li);

			cities.xForEach(function(e) {
                var ai = '<a class="city-item" href="javascript:;">' + e.city_name + '</a><i class="id">' + e.city_id + '</i>';
				$('<p>' + ai + '</p>').appendTo(div);
                if (1 == e.is_common) {
                    $('<span>' + ai + '</span>').appendTo('.join-comcity');
                }
			});

			li.appendTo('.join-dest');
            
            // 右边索引
			$('<span class="city-index">' + k + '</span>').appendTo($('.join-letter'));
		}	
	}
}

function bind_select_event(cb) {
    $('.city-item').click(function() {
        var name = $(this).text(); 
        var id = $(this).parent().find('i').text();
        cb.succ({id: id, name: name});
    })
    $('.my-position').click(function(){
        location.reload()
    })
}

function bind_index_event() {
    $('.city-index').click(function() {
        var k = $(this).text();
        $('html, body').animate({
            scrollTop: $('.city-group-' + k).offset().top
        }, 1)
    })

    // "常用城市"特殊
    $('.city-index-0').click(function() {
        $('html, body').animate({
            scrollTop: $('.city-group-0').offset().top
        }, 1)
    })
}

function posit_cur_city(list, cb) {
    amap_ip_in_city({
        succ: function(city) {
            a_auth_lookup_city_id(city, list, {
                succ: function(city_id) {
                    window.city = {id: city_id, name: city};
                    cb.succ(window.city);
                },
                fail: function(json) {
                    tlog('sorry, 城市字典中没有收录: ' + city);
                }
            });
        },
        fail: function() {
            tlog('ip定位失败，需手动选择（先用深圳）');
            window.city = {id: '202', name: '深圳'};
            cb.succ(window.city);
        }
    });
}
function set_city_name_id(city) {
    tlog('select city: ' + city.name + '(' + city.id + ')');
    $('.city_name').text(city.name);
    $('.city_id').text(city.id);
    rem_cookies(city)
}
// function focus_on_display(){
//     $("input").focus(function(){
//         $(".input-error").addHide();
//     })
// }
function rem_cookies(city){
    if(Cookies.get("city_name")!=undefined&&Cookies.get("city_id")!=undefined){
        var city_names = Cookies.get("city_name").split(":")
        var city_ids = Cookies.get("city_id").split(":");
        var flag = true;
        for(var i = 0;i<city_names.length;i++){
            if(city.name==city_names[i]||city.id==city_ids[i]){
                flag = false;
                break;      
            }
        }
        if(flag){
            Cookies.set("city_name",city.name+":"+Cookies.get("city_name"), { expires: 30 });
            Cookies.set("city_id",city.id+":"+Cookies.get("city_id"), { expires: 30 });
        }
    }else{
        Cookies.set("city_name",city.name, { expires: 30 });
        Cookies.set("city_id",city.id, { expires: 30 });
    }
}
function show_city_sel() {
   $('.city-sel').removeHide();
   $('.join-form').addHide();
}

function hide_city_sel() {
   $('.join-form').removeHide();
   $('.city-sel').addHide();
}
