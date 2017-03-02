define(function() {
    var baseIModules = project.baseIModules;
    var Module = (function(){
        var CON = function(dom){
            baseIModules.BaseIModule.call(this, dom);
            this.getCity();
            
        };
        potato.createClass(CON, baseIModules.BaseIModule);
        //获取用户所在城市
        CON.prototype.getCity = function(){
            var _this = this;
            amap_ip_in_city({
                succ:function(city){
                    _this.initNum(city);
                }
            })
        }
         //读取数据
        CON.prototype.initNum = function(city){
            var _this = this;

            a_auth_req_number_engineering_by_cityname(city, {
                succ: function(json){
                    var tpl = _this._els.tpl[0].text;
                    var dom = Mustache.render(tpl,json);
                    $(dom).appendTo('#Enginer');
                },
                fail: function(json){

                }
            })
        }
       	
       
        return CON;
    })();


    return Module;
});

