 define(['/iscripts/imodules/_List.js'],function(list) {
    var baseIModules = project.baseIModules;
    var Module = (function(){
        var CON = function(dom){
            list.call(this, dom);
            this.initData();
            this.loading = false;
            this.isTrue = false;
            this.isFirst = true;
        };

       
        potato.createClass(CON, list);
        CON.prototype.findMark = function(){
            var demandId = qs('demand_id');
            var which = qs('which');
            var pagesize;
            if(which==null){
                pagesize = "";
            }else{
                pagesize = (Math.ceil(which/20)+2)*20;
            }
        }
        CON.prototype.initData = function(){
            var _this = this;
            _this.showLogo();
            this.find('.upMore').removeHide();
            var pre = false;
            // if(project.isLogin()){
            //     a_profile_req({
            //         succ: function(data){
            //             var city = data.city_id;
            //             _this.initList(city,pre)
            //         },
            //         fail: function(data){
                        
            //         }
            //     })
            // }else{
            //     // amap_ip_in_city({
            //     //     succ:function(city){
            //     //         _this.initList(city,pre)
            //     //     }
            //     // })
            //     _this.initList('郑州',pre)
            // }
            //此版本只显示郑州的招标信息，以上为动态判断，暂且注释，以备后用
            var cityId = '151';
            var min = "";
            // _this.initNearbySuppliers(cityId)
            a_auth_req_conf_dict({
                succ:function(json){
                    _this.initList(cityId,pre,min,json)
                    _this.initHotList(cityId,json);
                },
                fail: function(json){
                }
            })
            
        }

        CON.prototype._ievent_goToDetail = function(data,target,hit){
            console.log($(target).parent())
        }

        /*热门招标列表*/
        CON.prototype.initHotList = function(cityId,data){
            var _this = this;

            a_auth_req_demand_b37(cityId,"_intm","1000",{
                succ: function(json){
                    if(json.list.length!=0){
                    _this.changeData(json,json.user_id,data);
                    var tpl = _this._els.tpl[0].text;
                        for(var i=0;i<json.list.length;i++){
                            json.list[i].name = i;
                        }
                        var dom = Mustache.render(tpl,json);
                        _this.find('.part').removeHide();
                        $(dom).appendTo('.list .part');
                        _this.find('.upMore').addHide();

                    }
                },
                fail: function(json){

                }
            })
        }
        CON.prototype.initList = function(city,pre,min,data){
            var _this = this;
            var init = this.find('.all a').length;
            var flag = init%20==0;
            if(flag){
                a_auth_req_demand_b38(city,"20","",min,"demand_id",{
                    succ:function(json){
                        _this.pagingList(json,pre,json.user_id,data,"");
                    },
                    fail: function(json){

                    }
                })
            }else{
                    _this.loading = true;
                    _this.find('.downMore').addHide();
            }
            $(window).scroll(function() {
                if(_this.loading){
                    if($(window).scrollTop()==0){
                        isFirst=false;
                        _this.find('.upMore').removeHide();
                        _this.loading = false;
                        pre = true;
                        var id = $(".all a:first").find('.demandId').text();
                        var all = $('.all a').length;
                        a_auth_req_demand_b38(city,"",id,"","demand_id",{
                            succ: function(json){
                                if(json.list.length!=0){
                                    _this.pagingList(json,pre,json.user_id,data,all);
                                }else{
                                    setTimeout(function(){
                                        _this.loading = true;
                                        _this.find('.upMore').addHide();
                                    },3000)
                                    
                                }
                            },
                            fail: function(){
                                _this.find('.upMore').addHide();
                            }
                        })
                    }
                    if($(window).scrollTop() == $(document).height() - $(window).height()) {
                        isFirst=false;
                        _this.find('.downMore').removeHide();
                        var id = $(".all a:last").find('.demandId').text();
                        _this.loading = false;
                        _this.initList(city,pre,id,data);
                    }
                }
            })
        }
        CON.prototype.pagingList = function(json,pre,id,data,all){
            var _this = this;
            _this.changeData(json,id,data)
            var tpl = this._els.tpl[1].text;
            var dom = Mustache.render(tpl,json);
            if(_this.isFirst){
                    $('.upMore').addHide();
                    _this.find('.all').removeHide();
                    $(dom).appendTo('.all');
                    _this.loading = true;
                    var callBack = function(module){
                        setTimeout(function () {
                            module.initData();
                        },600);
                    
                    };
                    project.getIModule("imodule://InviteBidsHallPage",null,callBack)
            }else{
                setTimeout(function(){
                    if(pre){
                        $('.upMore').addHide();
                        $(dom).insertAfter('.all .title')
                        _this.find('.hasNew span').text(json.cnt);
                        _this.find('.hasNew').removeHide()
                        pre = false;
                        setTimeout(function(){
                           _this.find('.hasNew').addHide() 
                        },1000) 
                    }else{
                        $('.downMore').addHide();
                        $('.upMore').addHide();
                        _this.find('.all').removeHide();
                        $(dom).appendTo('.all');
                    }
                    _this.loading = true;
                    var callBack = function(module){
                        setTimeout(function () {
                            module.initData();
                        },600);
                    
                    };
                    project.getIModule("imodule://InviteBidsHallPage",null,callBack)
                
                },2000)

            }
            
        }

        

        CON.prototype.showLogo = function(){
            var _this = this;
            $(window).scroll(function() {
                var scroll = $(this).scrollTop()
                var module = project.getIModule("imodule://Header");
                var PubHei = $(_this._els.pub).height();
                var PubTit = $(_this._els.pubTit).height();
                var ua = navigator.userAgent.toLowerCase(); 
                if(scroll>PubTit){
                    //alert(scroll + '||||' +PubTit)
                    /*_this.isTrue = true;
                    if (/android/.test(ua)) {  ///iphone|ipad|ipod/.test(ua)   ---iphone
                        module.find('.logo').css('opacity',1);
                        module.find('.title').addClass('can_click');
                    } else{
                         module.find('.logo').removeClass('pubAnimation2')
                         module.find('.logo').addClass('pubshadow')
                         module.find('.header').addClass('pubAnimation');
                    }
                     
                    module.find('.header').css('box-shadow','0 1px 4px rgba(0,0,0,.13)') */
                }
                if(scroll<=PubTit){
                  
                    if(_this.isTrue == true){
                        /*if (/android/.test(ua)) {
                            module.find('.logo').css('opacity',0);
                            module.find('.title').removeClass('can_click');
                        } else { 
                            module.find('.logo').removeClass('pubshadow')
                            module.find('.header').removeClass('pubAnimation');
                            module.find('.logo').addClass('pubAnimation2')

                        }
                        module.find('.menu').slideUp();
                        $('.menu-mask').remove();
                        module.find('.title-btn').removeClass('rotate');
                        module.find('.header').css('box-shadow','none')*/
                     }
                }
            })
        }

        CON.prototype._ievent_publishBtn = function(){

            window.location.href = 'call-type.html';
            //逻辑改变，所以先注释
            /*var callBack
            if(project.isLogin()){
                callBack = function(module){
                    project.open(module,"_blank","maxWidthHeight");
                    // module.initModule();
                }
                a_auth_demand_c22unfinish({
                    succ: function(json){
                        if(json.list.length==0){
                            project.getIModule("imodule://PublishInviteModule",null,callBack);
                        }else{
                            project.open('imodule://HavePublishModule','_blank',"maxWidth");
                        }
                    },
                    fail: function(json){

                    }
                })
                
                
            }else{
                callBack = function(module){
                    project.open(module,"_blank","maxWidth");
                }
                project.getIModule("imodule://ClientLoginForm",null,callBack)
            }*/
        }
        return CON;
    })();
    return Module;
});

