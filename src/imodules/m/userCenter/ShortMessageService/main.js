define(function() {
    var baseIModules = project.baseIModules;
    var Module = (function(){
        var CON = function(dom){
            baseIModules.BaseIModule.call(this, dom);
            this.cityLists=this.find(".city-list");
            this.payMonths=this.find(".pay-month");
            this.str="";
            this.totalPrice="";
            this.payType="";
            this.isSms='立即开通';//是否开通短信
            var that = this;
            //开通短信状态获取;
            a_auth_charge_sms_state({
                succ:function (json) {
                    var service_list=json.list;
                    var length=json.list.length;
                    console.log(json);
                    var type=service_list[length-1].type;
                    var end_time=service_list[length-1].end_date.replace(/-/g, ".")+"到期";
                    if(type==1){
                        //已开通
                        that.isSms="续费";
                        that.cityLists.find(".due-time").text(end_time);
                        that.cityLists.find(".due-time").css("display","inline-block");
                        that.payMonths.find(".btn").text(that.isSms);
                    }else if(type==0){
                        that.isSms="立即开通";
                        //未开通
                        that.cityLists.find(".due-time").css("display","none");
                        that.payMonths.find(".btn").text(that.isSms);
                    }
                },
                fail:function () {
                    potato.application.removeLoadingItem($("#ImmediatelyOpen"));
                }
            });


            //下拉展开付费项
            that.cityLists.each(function(){
                var contentList=$(this);
                contentList.find(".city-head").on("click",function(event){
                    curHeight = contentList.find(".city-pay").height();
                    autoHeight = contentList.find(".city-pay").css('height', 'auto').height();
                    if($(this).find(".grab-open").text()==''){
                        contentList.find(".city-pay").slideUp();
                        $(this).find(".grab-open").text(that.isSms);
                        $(this).find(".grab-open").removeClass('icon-circle-up');
                        $(this).find(".grab-open").css("color","#4785f9");
                    }else{
                        $(this).find(".grab-open").text("");
                        $(this).find(".grab-open").addClass('icon-circle-up');
                        $(this).find(".grab-open").css("color","#b3b5b7");
                        contentList.find(".city-pay").slideDown();
                    }

                });

            });
            //每一个付费按钮
            that.payMonths.each(function(i){
                var payMonth=$(this);
                payMonth.find(".btn").on("click",function(){
                    switch (i){
                        case 0://月付
                            that.str="￥"+parseInt(payMonth.find(".price").text())+"(￥"+payMonth.find(".price").text()+"x1)";
                            that.totalPrice=parseInt(payMonth.find(".price").text());
                            that.payType=10;
                            break;
                        case 1://半年
                            that.str="￥"+parseInt(payMonth.find(".price").text())*6+"(￥"+payMonth.find(".price").text()+"x6)";
                            that.totalPrice=parseInt(payMonth.find(".price").text())*6;
                            that.payType=30;
                            break;
                        case 2://年付
                            that.str="￥"+parseInt(payMonth.find(".price").text())*12+"(￥"+payMonth.find(".price").text()+"x12)";
                            that.totalPrice=parseInt(payMonth.find(".price").text())*12;
                            that.payType=100;
                            break;
                        default:break;
                    }
                });
            });

        };
        potato.createClass(CON, baseIModules.BaseIModule);

        //缴费会员
        CON.prototype._ievent_sImmediatelyOpen = function(data,target){
            var str=this.str;
            var price=""+this.totalPrice;
            var pay_type=""+this.payType;
            var city_id= $(target).parents('.city-list').find('.city-name').data('cityid');
            potato.application.addLoadingItem($("#ImmediatelyOpen"));
            var getSucc = function (PayConfirm) {
                potato.application.removeLoadingItem($("#ImmediatelyOpen"));
                PayConfirm.setBlance(str,price,pay_type,city_id);
                project.open(PayConfirm,"_blank","maxWidth");
            };
            var getFail = function () {
                potato.application.removeLoadingItem($("#ImmediatelyOpen"));
            };
            var PayConfirm = project.getIModule('imodule://PayConfirm',null,getSucc,getFail);
        }

        CON.prototype._ievent_goBack = function(){
            window.history.go(-1);
        };
        return CON;
    })();
    return Module;
});

