define(function() {
    var baseIModules = project.baseIModules;
    var Module = (function(){
        var CON = function(dom){
            baseIModules.BaseIPage.call(this, dom, {container:false});
            // $(this._els.aaa)
            $(this._els.carousel1).carousel();
            $(this._els.carousel2).carousel();
        };

        potato.createClass(CON, baseIModules.BaseIPage);

        CON.prototype._ievent_selectColor= function (data,target,hit) {
            if($(target).find('.all-option').css('display')=="block"){
                $(target).find('.all-option').css('display',"none");
                $(target).css('border-color',"#B1B3B4");
            }else{
                $(target).find('.all-option').css('display',"block");
                $(target).css('border-color','#FD4701');
            }
            var color;
            var slt = $(hit).attr("slt");
            var price = $(hit).attr("single-price");
            if(slt !=null){
                color = $(hit).text();
                $('.all-option').css("display","none");
                $(target).find('.selected').text(color);
                $(target).find('.selected').attr('single-price',price);
                $(target).find('.select-style').css('border-color',"#B1B3B4");
            }

        };
        CON.prototype._ievent_userInput = function (data,target,hit) {
            $(hit).siblings('.tip').css("display", "none");
            $(hit).css("border-color", "#E96733");
        }
        CON.prototype._ievent_computeBtn= function (data,target,hit) {
            var test_num = /^(\d|[1-9]\d+)(\.\d+)?$/;
            var height = $(this.dom).find('.long').val();
            var wide = $(this.dom).find('.wide').val();
            var status = $($(this.dom).find('.selected')[0]).attr('single-price');
            var where = $($(this.dom).find('.selected')[1]).attr('single-price');
            var color = $($(this.dom).find('.selected')[2]).attr('single-price');
            var result;
            var len;
            var last_result;
            if(!height||!test_num.test(height)){
                $(this.dom).find('.long').siblings('.error-tip').css("display","block");
                return false;
            }
            if(!wide||!test_num.test(wide)){
                $(this.dom).find('.wide').siblings('.error-tip').css("display","block");
                return false;
            }

            result = Math.round(height*wide*status*where*color*90);
            len = (result+"").length;
            if(len>9){
                
                $(this.dom).find('.result-money small').addClass('max-money');
                $(this.dom).find('.money-num').text('');
                $(this.dom).find('.result-money small').text("暂无此价位的屏幕信息")
            }else{
                $(this.dom).find('.result-money small').removeClass('max-money');
                $(this.dom).find('.result-money small').text("约")
                last_result = Math.round(result/Math.pow(10,len-1))*Math.pow(10,len-1);
                $(this.dom).find('.money-num').text(last_result)
            }
        };

        CON.prototype._ievent_getPrice= function (data,target,hit) {
            var phone = $(this.dom).find('.user-input').val();
            project.getIModule('imodule://Track').trackSubmitPhone(phone);

            if(phone.length!=11){
                $(this.dom).find('.user-input').siblings('.error-tip1').css("display","block");
                return false;
            }else {
                //关闭第一个弹窗,弹出第二个
                $('#Modal1').modal('hide');
                $('#Modal1').on('hidden.bs.modal', function (e) {
                   $(this.dom).find('.error-tip1').css('display','none'); 
                });
                $('#Modal2').modal('show');

                var data = {
                    'who': 'L004',
                    'phone': phone
                };

                var _this = this;
                server.send_landing_phone(data, function(json, date) {
                    _this._succ(json, date, phone);
                });
            }
        };
        
        CON.prototype._succ = function(json,date,phone) {
            project.getIModule('imodule://Track').trackSubmitPhoneSucc(phone);

        };
        return CON;
    })();

    return Module;
});
