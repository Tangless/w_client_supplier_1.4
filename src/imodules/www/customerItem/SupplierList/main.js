define(function() {
    var baseIModules = project.baseIModules;
    var Module = (function(){
        var CON = function(dom){
            baseIModules.BaseIModule.call(this, dom);
            this.isFirst = true;
            this.loading = false;
            this.getCity();
        };

        potato.createClass(CON, baseIModules.BaseIModule);
        //获取用户所在城市
        CON.prototype.getCity = function(){
            var _this = this;
            amap_ip_in_city({
                succ:function(city){
                    _this.initCityNum(city);
                }
            })
        }
        CON.prototype.initCityNum = function(city){
            this.find('.loading').removeHide();
            var _this = this;
            var cityId = qs('city');
            a_auth_req_number_engineering_by_cityname(city, {
                succ: function(json){
                    _this.find('.all').text(json.cnt.all_cnt);
                    _this.find('.near').text(json.cnt.city_cnt);
                    // 此页不用了，这里改了接口，暂先注释
                    //_this.find('.nearSup').attr('city',city_id);
                },
                fail: function(json){

                }
            })
            if(cityId!=null){
                this.find('.allSup').removeClass('choosed');
                this.find(".nearSup").addClass('choosed');
                //this.find('.nearSup').attr('city',city_id);
                //this.getList(city_id);
            }else{
                this.getList("");
            }
        }
        CON.prototype.getList = function(city_id){
            var init = this.find('.allInfo').length;
            var flag = init%20==0;
            var page = init/20+1;
            var _this = this;
            if(flag){
                a_auth_req_demand_b39(city_id,page,{
                    succ: function(json){

                        _this.updateData(json);
                        _this.loading = true;
                        project.getIModule('imodule://SuppliersPage',null,function(module){
                            module.initSize();
                        })
                    },
                    fail: function(json){

                    }
                })
            }
            $('#list').scroll(function() {
                if($('#list').scrollTop() ==$('#list').prop('scrollHeight') - $('#list').height()) {
                    if(_this.loading){
                        _this.find('.loading').removeHide();
                        _this.isFirst = false;
                        _this.loading = true;
                        city_id = _this.find('.choosed').attr('city');
                        _this.getList(city_id)
                    }
                }
            })
        }
        CON.prototype._ievent_choose = function(data,target,hit){
            $(target).siblings().removeClass('choosed');
            $(target).addClass('choosed');
            var cityId = $(target).attr('city');
            var page = 1;
            $('.allInfo').remove();
            this.getList(cityId,page);
            project.getIModule('imodule://SuppliersPage').initSize();
            
        }
        //处理一些自己需要的数据
        CON.prototype.updateData = function(json){
            var tpl = this._els.tpl[0].text;
            for(var i = 0;i < json.list.length;i++){
                if(json.list[i].avatar==""){
                    json.list[i].isImg = false;
                }else{
                    json.list[i].isImg = true;
                }
            }
            var dom = Mustache.render(tpl,{"list":json.list,util:{
                nickFmt: function(){
                    return this.nick.substring(0,1)
                }
            }});
            $(dom).appendTo('#list');
            this.find('.loading').addHide();
        }
        return CON;
    })();
    return Module;
});

