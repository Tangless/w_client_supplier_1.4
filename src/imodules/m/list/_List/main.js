define(function() {
    var baseIModules = project.baseIModules;
    var Module = (function(){
        var CON = function(dom){
            baseIModules.BaseIModule.call(this, dom);
            this.tpl = this._els.tpl[0].text;
        };

        potato.createClass(CON, baseIModules.BaseIModule);
        /*需要格式化一些数据以达到效果图的数据展示效果*/
        CON.prototype.changeData = function(json,id,data,page){
            for(var i=0;i<json.list.length;i++){
                json.list[i].anchor = (page-1)*20+i;
                var all = ""
                if(json.list[i]!=undefined){
                    if(id==json.list[i].client_id){
                        json.list[i].sup = 'suppliers'
                    }
                    if(json.list[i].supplier_list.length!=0){
                        for(var j = 0;j < json.list[i].supplier_list.length;j++){
                            if(json.list[i].client_id!=json.list[i].supplier_list[j].user_id){
                                if(all==""){
                                    all = all + json.list[i].supplier_list[j].nick;

                                }else{
                                    all = all +'，'+ json.list[i].supplier_list[j].nick;
                                }
                            }
                            if(all==""){
                                json.list[i].supplier = "正在召集工程商..."
                            }else{
                                json.list[i].supplier = all;
                            }
                            if(id == json.list[i].supplier_list[j].user_id){
                                json.list[i].sup = 'suppliers'
                            }
                            if(json.list[i].client_id == json.list[i].supplier_list[j].user_id){
                                if(json.list[i].supplier_list[j].imonline == 1){
                                    if(json.list[i].status==60){
                                        json.list[i].statusName = '已结束';
                                    }else{
                                        json.list[i].statusName = '洽谈中';
                                    }
                                }else{
                                    this.getStatus(json.list[i])
                                }
                            }else{
                                this.getStatus(json.list[i])
                            }
                        }
                    }else{
                        this.getStatus(json.list[i])
                        json.list[i].supplier = "正在召集工程商..."
                    }
                    
                }
            }
            for(var i=0;i<json.list.length;i++){
                var thisList = json.list[i];
                thisList.time = count_date_gap(thisList._intm);
                thisList.type = data.demand.type[thisList.type];
                thisList.color = data.demand.color[thisList.color];
                thisList.location = data.demand.loc[thisList.location];
                thisList.size = std_num_format(thisList.size);
                if(thisList.type.length>=4){
                    thisList.type1 = thisList.type.substring(0,2);
                    thisList.type2 = thisList.type.substring(2)
                }else{
                    thisList.type1 = thisList.type;
                }
                
                money = std_money_format_in_th(thisList.budget);
                if(money.budget==""||money.budget==0){
                    money = "议价";
                }else{
                    money = money.budget+money.unit;
                }
                if(thisList.image!=""){
                    thisList.info = ("有图 / "+money+" / "+thisList.span+" / "+thisList.color+" / "+thisList.size+"㎡ / "+thisList.location);
                }else{
                    thisList.info = (money+" / "+thisList.span+" / "+thisList.color+" / "+thisList.size+"㎡ / "+thisList.location);
                }
            }
            
        }
        CON.prototype.getStatus = function(list){
            if(list.status==60){
                list.statusName = '已结束';
            }else{
                list.statusName = '招标中';
            }
        }
        return CON;
    })();
    return Module;
})