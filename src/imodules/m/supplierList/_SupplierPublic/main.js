define(["/global/iscripts/libs/jquery.scrollstop.js"],function() {
    var baseIModules = project.baseIModules;
    var Module = (function(){
        var CON = function(dom){
            baseIModules.BaseIModule.call(this, dom);
            this.isFirst = true;
            this.loading = false;
        };

        potato.createClass(CON, baseIModules.BaseIModule);
        
        CON.prototype.paging = function(city_id){
            tlog('call paging...');

            this.find('.downMore').removeHide();
            var _this = this;
            var init = this.find('.list').length;
            var flag = init%20==0;
            var page = init/20+1;
            if(flag){
                a_auth_req_demand_b39(city_id,page,{
                    succ:function(json){
                        _this.find('.nationwide .much').text(json.cnt)
                        _this.dataFormat(json);
                    },
                    fail:function(json){
                    }
                })
            }else{
                this.find('.downMore').addHide();
            }
            
            $(window).off('scroll').scroll(function() {
                if($(window).scrollTop() == $(document).height() - $(window).height()) {
                    if(!_this.loading){
                        _this.isFirst = false;
                        _this.loading = true;
                        _this.find('.downMore').removeHide();
                        _this.paging(city_id)
                    }
                }
            })
        }
        CON.prototype.findFirst = function(){
            var _this = this;
            var list = this.find('.list');
            var thisOne;
            for(var i = 0;i < list.length;i++){
                var height = $('#container').height();
                if($(list[i]).offset().top-$(window).scrollTop()>height){
                        thisOne = i;
                        this.showThis(thisOne,list);
                        break;
                    }
            }
            $(document).off("scrollstop").on("scrollstop",function(){
                _this.findFirst();
          });
        }
        CON.prototype.showThis = function(thisOne,list){
            var end;
            if(list.length - thisOne>=10){
                end = thisOne + 10;
            }else{
                end = list.length;
            }

            for(var i = thisOne;i < end;i++){
                var lat = $(list[i]).find('.lat').text();
                var lng = $(list[i]).find('.lng').text();
                if(lat>0&&lng>0){
                    if(i==thisOne){
                        project.getIModule("imodule://SupplierMap").addBigMarker(lat,lng);
                    }else{
                        project.getIModule("imodule://SupplierMap").addSmallMarker(lat,lng);
                    }
                }
            }
            project.getIModule("imodule://SupplierMap").showAll();

        }
        CON.prototype.dataFormat = function(json){
            
            for(var i = 0;i < json.list.length;i++){
                if(json.list[i]!=undefined){
                    if(json.list[i].avatar==""){
                        json.list[i].avatar = "{{MIMAGE}}/user.png"
                    }
                }
            }
            this.append(json);
            
            
        }
        CON.prototype.append = function(json){
            var tpl = this._els.tpl[0].text;
            var _this = this;
            var dom = Mustache.render(tpl,json);
            if(this.isFirst){
                this.setTime(dom);
            }else{
                setTimeout(function(){
                    _this.setTime(dom);
                },2000)
            }
        }
        CON.prototype.setTime = function(dom){
            var _this = this;
                _this.find('.downMore').addHide();
                $(dom).appendTo('.supList');
                var url = location.pathname;
                if(url=="/suppliers.html"){
                    var module = project.getIModule("imodule://AllSuppliersPage");
                }else{
                    var module = project.getIModule("imodule://SingleCitySupplierPage");
                    _this.findFirst();
                }
                module.initData();
                
                _this.loading = false;
        }
        return CON;
    })();
    return Module;
});

