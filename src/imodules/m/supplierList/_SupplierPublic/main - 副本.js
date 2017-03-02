define(["/global/iscripts/libs/jquery.scrollstop.js"],function() {
    var baseIModules = project.baseIModules;
    var Module = (function(){
        var CON = function(dom){
            baseIModules.BaseIModule.call(this, dom);
            // this.initData();
            this.loading = true;
        };

        potato.createClass(CON, baseIModules.BaseIModule);
        
        CON.prototype.paging = function(json){
            this.find('.downMore').removeHide();
            var _this = this;
            // if(json.list.length>20){
                _this.dataFormat(json)
            // }else{
                // _this.append(json);
            // }
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
            $(document).on("scrollstop",function(){
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
                if(i==thisOne){
                    project.getIModule("imodule://SupplierMap").addBigMarker(lat,lng);
                }else{
                    project.getIModule("imodule://SupplierMap").addSmallMarker(lat,lng);
                }
            }
            project.getIModule("imodule://SupplierMap").showAll();

        }
        CON.prototype.dataFormat = function(json){
            var _this = this;
            var init = this.find('.list').length;
            var end =init + 20;
            var newList = {
                list:[]
            };
            for(var i = init;i < end;i++){
                if(json.list[i]!=undefined){
                    if(json.list[i].avatar==""){
                        json.list[i].avatar = "{{MIMAGE}}/user.png"
                    }
                    newList.list.push(json.list[i]);
                }
            }
            _this.append(newList);
            $(window).scroll(function() {
                if($(window).scrollTop() == $(document).height() - $(window).height()) {
                    if(_this.loading){
                        _this.loading = false;
                        _this.find('.downMore').removeHide();
                        _this.dataFormat(json)
                    }
                }
            })
            
        }
        CON.prototype.append = function(json){
            var tpl = this._els.tpl[0].text;
            var _this = this;
            setTimeout(function(){
                _this.loading = true;
                _this.find('.downMore').addHide();
                var dom = Mustache.render(tpl,json);
                $(dom).appendTo('.supList');
                var url = location.pathname;
                if(url=="/suppliers.html"){
                    var module = project.getIModule("imodule://AllSuppliersPage");
                }else{
                    var module = project.getIModule("imodule://SingleCitySupplierPage");
                    _this.findFirst();
                }
                module.initData();
                
                // $(window).on("scrollstop",function(){
             // })
            },3000)
        }
        return CON;
    })();
    return Module;
});

