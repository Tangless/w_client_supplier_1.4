define(function() {
    var baseIModules = project.baseIModules;
    var Module = (function(){
        var CON = function(dom){
            baseIModules.BaseIModule.call(this, dom);
            this.json = "";
            this.getList("",1)
        };

        potato.createClass(CON, baseIModules.BaseIModule);
        CON.prototype.getList = function(type,page){
            var _this = this;
            var tpl = this._els.tpl[0].text;
            a_auth_demand_c34(type,page,{
                succ: function(json){
                    if(json.list.length!=0){
                        _this.find('.cnt .blue').text(json.item_total);
                        if(json.list.length!=0&&json.list.length%9==0){
                            _this.find('.more').removeHide();
                        }
                        _this.json = json;
                        var dom = Mustache.render(tpl, {list: json.list, util: {
                            //timeFormat: '1fenzhong'
                            time: function() {
                                return count_date_gap(this.demand._intm);
                            },
                            budget: function(){
                                return std_money_format_in_th(this).budget;
                            },
                            unit: function(){
                                return std_money_format_in_th(this).unit;
                            },
                            loc: function(){
                                return api_dict.demand.loc[this.demand.location+""];
                            },
                            color: function(){
                                return api_dict.demand.color[this.demand.color+""];
                            },
                            type: function(){
                                return api_dict.demand.type[this.demand.type+""];
                            },
                            status: function(){
                                var status;
                                if(this.demand.status==10){
                                    status = true;
                                }else{
                                    status = false;
                                }
                                return status;
                            },
                            supplier: function(){
                                var sup;
                                if(this.supplier_list.length!=0){
                                    sup = true;
                                }else{
                                    sup = false;
                                }
                                return sup;
                            },
                            img: function(){
                                return this.nick.substring(0,1);
                            }
                        }});
                        $(dom).appendTo('#list');
                        _this.find('.loadDiv').addHide();
                    }else{
                        _this.find('.loadDiv').addHide();
                        _this.find('.noMsg').removeHide();
                    }
                },
                fail: function(json){

                }
            })
        }
        CON.prototype._ievent_chooseType = function(data,target,hit){
           $(target).parent().parent().find('.type').removeClass('border');
           $(target).addClass('border'); 
           var type = $(target).attr('type');
           var page = 1;
           this.find('.more').addHide();
           this.find('.allList').remove();
           this.find('.loadDiv').removeHide();
           this.getList(type,page);
        }
        CON.prototype._ievent_goToDetail = function(data,target,hit){
            var demand = $(target).find('.demandId').text();
            var newList = '';
            for(var i = 0;i < this.json.list.length;i++){
                if(demand == this.json.list[i].demand_id){
                    newList = this.json.list[i];
                    break;
                }
            }
            project.getIModule("imodule://ChatRoom",null,function(module){
                module.openChatRoom(newList);
            })
        }
        CON.prototype._ievent_more = function(data,target,hit){
            var length = this.find('.allList').length;
            var page = length/9+1;
            var type = this.find('.border').attr('type');
            $(target).addHide();
            this.find('.loadDiv').removeHide();
            this.getList(type,page);
        }
        return CON;
    })();
    return Module;
});

