define(['/global/iscripts/tools/countUp.min.js'],function() {
    var baseIModules = project.baseIModules;
    var Module = (function(){
        var CON = function(dom){
            baseIModules.BaseIModule.call(this, dom);
            this.initData();

        };

        potato.createClass(CON, baseIModules.BaseIModule);
        CON.prototype.requestMsg = function(){
            var _this = this;
            this.webim = {
                session:"all",
                messages: {history: [], news: []},
                update:function(msgs){
                    if(msgs!=null){
                         _this.findList(msgs);
                    }
                }
            }
            webimConfigs.addListener(this.webim);
        }
        CON.prototype.initData = function(){
                var _this = this;
                a_auth_req_conf_dict({
                    succ:function(data){
                        a_auth_req_demand_c28({
                            succ: function(json){
                                if(json.bid_list.length!=0||json.publish_list.length!=0){
                                    _this.find('.noInfo').addHide();
                                    _this.find('.myInv').text(json.bid_list.length+json.publish_list.length)
                                    project.getIModule('imodule://InviteBidsHallPage').setLength(json.bid_list.length+json.publish_list.length)
                                    _this.find('.font').removeHide();
                                    _this.find('.myBids').removeHide();
                                    _this.dataFormat(json,data);
                                    _this.requestMsg();

                                }else{
                                    _this.find('.noInfo').removeHide();
                                    _this.find('.myBids').addHide();
                                }
                                
                            },
                            fail: function(json){

                            }
                        })
                    },
                    fail: function(json){

                    }
                })
                

                //b36
                //这次迭代的城市id默认为郑州，后期再改为ip定位
                var city_id = 151; 
                a_auth_req_number_engineering_by_cityid(city_id, {
                    succ: function(json) {
                        $('.splCount').text(json.cnt.city_cnt);
                        $('.allCountry').text(json.cnt.all_cnt);
                        var numSlideAll = new countUp("allNum", 0, json.cnt.all_cnt, 0, .7);
                        var numSlideSpl = new countUp("splNum", 0, json.cnt.city_cnt, 0, .7);
                        numSlideAll.start();
                        numSlideSpl.start();
                    },
                    fail: function(json) {

                    }
                })
                
        }
        CON.prototype._ievent_goTo = function(data,target,hit){
            var demandId = $(target).find('.demandId').text();
            location.href = './demand.html?demand_id='+demandId;
        }
        CON.prototype.dataFormat = function(json,data){
            var newList = {
                list:[]
            }
            this.dataChange(json.publish_list,"1",data);
            this.dataChange(json.bid_list,"0",data);
               var tpl = this._els.tpl[0].text;
                var dom = Mustache.render(tpl,json);
                $(dom).appendTo('.myBids');
           }
           CON.prototype.dataChange = function(list,active,data){
                for (var i = 0; i < list.length; i++) {
                    var thisList = list[i];
                    if(active=="1"){
                        thisList.nick = "您";
                    }
                    thisList.time = count_date_gap(thisList._intm);
                    thisList.color = data.demand.color[thisList.color];
                    thisList.type = data.demand.type[thisList.type];
                    money = std_money_format_in_th(thisList.budget);
                    thisList.location = data.demand.loc[thisList.location];
                    thisList.size = std_num_format(thisList.size);
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
                    var publicId = "";
                    if(thisList.supplier_list.length!=0){
                        for(var k = 0;k<thisList.supplier_list.length;k++){
                            publicId += thisList.supplier_list[k].demand_customer_supplier_im_group_outer_id +",";
                        }
                    }
                    thisList.publicId = publicId;
               }
           }
           CON.prototype.findList = function(msgs){
                var list = this.find('.mylist');
                var demandId;
                var pub;
                var comMsg = 0;
                for(var i = 0; i < list.length;i++){
                    demandId = $(list[i]).find('.demandId').text()
                    pub = $(list[i]).find('.publicId').text()
                    this.comMsg(demandId,msgs,list[i],pub)
                    if($(list[i]).find('.msgs').text()!=''){
                        comMsg +=  parseInt($(list[i]).find('.msgs').text())
                    }
                }
                if(comMsg!=0){
                    project.getIModule('imodule://InviteBidsHallPage').setMsgs(comMsg)
                }
           }
           CON.prototype.comMsg = function(demandId,msgs,list,pub){
                var newArr = Object.keys(msgs);
                var message = 0;
                // var re =new RegExp("^" + demandId + "#");
                var pubArr = pub.split(',')
                for(var i = 0;i < newArr.length;i++){
                    if(demandId == newArr[i]){
                            // $(list).find('.point').removeHide();
                            message += parseInt(msgs[newArr[i]].unread);
                    }
                    // if(re.test(newArr[i])){
                    //     message += parseInt(msgs[newArr[i]].unread);
                    // }
                    for(var j = 0;j < pubArr.length;j++){
                        if(newArr[i] = pubArr[j]){
                        if(msgs[newArr[i]].unread!=0){

                            // message += parseInt(msgs[newArr[i]].unread);
                            $(list).find('.point').removeHide();
                        }
                        }
                    }
                }
                if(message!=0){
                    $(list).find('.point').addHide();
                    $(list).find('.msgs').html(message).removeHide();
                }
           }
        return CON;
    })();
    return Module;
})
