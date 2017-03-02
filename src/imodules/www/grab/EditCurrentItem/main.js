define(function(GrabIntroduces) {
    var baseIModules = project.baseIModules;
    var Module = (function(){
        var CON = function(dom,parent,option){
            baseIModules.BaseIModule.call(this, dom);
            this.picture=this.find(".image-panel");
            this.imgUrl='';
            this.demand_id='';
            var _this = this;

            //获得图片地址
            project.getIModule('imodule://ImageUploader', null, function(mod) {
                mod.initCallback({
                    succ: function(json) {
                        tlog('uploaded image: ' + json.image);
                        _this.imgUrl=json.image;
                    },
                    fail: function(json) {
                    },
                    // 删除图片时的回调
                    on_delete: function(url) {
                        tlog('you deleted image: ' + url);
                        _this.imgUrl='';
                    }
                });
            })

        };
        potato.createClass(CON, baseIModules.BaseIModule);

        CON.prototype._init = function () {
            var _this = this;
            var data = project.data.demand.demand_info;
            this._fillInput(data);
            //初始化图片
            project.getIModule('imodule://ImageUploader', null, function(mod) {
                mod.setOrgImage(_this.imgUrl);
            });
            //编辑招标时,部分字段不能为空
            $('input[must="true"]').on('input propertychange blur',function(){
                //再做一次判断是否空数据
                if(!_this._isFullInput()) {
                    $(_this._els.submit).attr('disabled', 'disabled');
                }else{
                    $(_this._els.submit).removeAttr('disabled');
                }
            })
        };
        //展开下拉菜单
        CON.prototype._ievent_showMenu = function (data, obj) {
            if( $(obj).next('div').hasClass("hide") ){
                $($("[class$='-choice']")).addClass("hide");
                $($(".choice-other")).addClass("hide");
                $($(".show-menu")).find('.icon-circle-down').removeClass('rotate');
                $(obj).next('div').removeHide();
                $(obj).find('.icon-circle-down').addClass('rotate');
            }else{
                $($("[class$='-choice']")).addClass("hide");
                $($(".show-menu")).find('.icon-circle-down').removeClass('rotate');
            }


        };
        //下拉选项点击选中事件
        CON.prototype._ievent_chooseType=function(data,obj,hit){
            var choosed = $(hit).text();
            var num = $(hit).attr('num');
            if(num==1){
                //门头招牌
                $(this._els.location).text('半户外').attr('num',3);
                $(this._els.color).text('单色').attr('num',1);
                $(this._els.spacing).text('p10').attr('num',3);
                $($('.spacing-choice .spacing-item')[0]).text('p6').attr('num',1);
                $($('.spacing-choice .spacing-item')[1]).text('p8').attr('num',2);
                $($('.spacing-choice .spacing-item')[2]).text('p10').attr('num',3);
            }else if(num==2){
                //户外广告屏
                $($('.location-choice .loc-item')[1]).css("disabled","disabled");
                $(this._els.location).text('户外').attr('num',1);
                $(this._els.color).text('全彩').attr('num',3);
                $(this._els.spacing).text('p10').attr('num',3);
                $($('.spacing-choice .spacing-item')[0]).text('p6').attr('num',1);
                $($('.spacing-choice .spacing-item')[1]).text('p8').attr('num',2);
                $($('.spacing-choice .spacing-item')[2]).text('p10').attr('num',3);
            }else if(num==3){
                //信息告示屏
                $(this._els.location).text('户外').attr('num',1);
                $(this._els.color).text('单色').attr('num',1);
                $(this._els.spacing).text('p10').attr('num',3);
                $($('.spacing-choice .spacing-item')[0]).text('p6').attr('num',1);
                $($('.spacing-choice .spacing-item')[1]).text('p8').attr('num',2);
                $($('.spacing-choice .spacing-item')[2]).text('p10').attr('num',3);
            }else if(num==4){
                //舞台用屏
                $(this._els.location).text('室内').attr('num',2);
                $(this._els.color).text('全彩').attr('num',3);
                $(this._els.spacing).text('p4').attr('num',2);
                $($('.spacing-choice .spacing-item')[0]).text('p3').attr('num',1);
                $($('.spacing-choice .spacing-item')[1]).text('p4').attr('num',2);
                $($('.spacing-choice .spacing-item')[2]).text('p5').attr('num',3);
            }else if(num==5){
                //室内高清屏
                $($('.location-choice .loc-item')[0]).css("disabled","disabled");
                $(this._els.location).text('室内').attr('num',2);
                $(this._els.color).text('全彩').attr('num',3);
                $(this._els.spacing).text('p2.0').attr('num',2);
                $($('.spacing-choice .spacing-item')[0]).text('p1.25').attr('num',1);
                $($('.spacing-choice .spacing-item')[1]).text('p2.0').attr('num',2);
                $($('.spacing-choice .spacing-item')[2]).text('p2.5').attr('num',3);
            }else if(num==0){
                //其他
                $(this._els.location).text('户外').attr('num',1);
                $(this._els.color).text('全彩').attr('num',3);
                $(this._els.spacing).text('p10').attr('num',3);
                $($('.spacing-choice .spacing-item')[0]).text('p6').attr('num',1);
                $($('.spacing-choice .spacing-item')[1]).text('p8').attr('num',2);
                $($('.spacing-choice .spacing-item')[2]).text('p10').attr('num',3);
            }
            $(this._els.type).text(choosed).attr('num',num);
            $(obj).addClass("hide");
            $(obj).prev().find('.icon-circle-down').removeClass('rotate');

        }
        CON.prototype._ievent_chooseLocation = function (data, obj, hit) {
            if($(this._els.type).attr('num')==2||$(this._els.type).attr('num')==5){
                return false;
            }
            var choosed = $(hit).text();
            var num = $(hit).attr('num');
            console.log(num);
            $(this._els.location).text(choosed).attr('num',num);
            $(obj).addClass("hide");
            $(obj).prev().find('.icon-circle-down').removeClass('rotate');
        };
        CON.prototype._ievent_chooseColor=function(data,obj,hit){
            var choosed = $(hit).text();
            var num = $(hit).attr('num');
            $(this._els.color).text(choosed).attr('num',num);
            $(obj).addClass("hide");
            $(obj).prev().find('.icon-circle-down').removeClass('rotate');
        }
        CON.prototype._ievent_chooseSpacing=function(data,obj,hit){
            var choosed = $(hit).text();
            var num = $(hit).attr('num');
            var th_spacing=this;
            if(num==0){
                //其他
                $(obj).addClass("hide");
                $(obj).next().removeHide();

                $(obj).next().find(".sure-other").on("click",function(){
                    var val=$(obj).next().find(".other").val();
                    $(obj).next().addClass("hide");
                    $(obj).prev().find('.icon-circle-down').removeClass('rotate');
                    $(th_spacing._els.spacing).text(val).attr('num',num);
                });
                $(obj).next().find(".close-other").on("click",function(){
                    $(obj).next().find(".other").val("");
                });

            }else{
                $(this._els.spacing).text(choosed).attr('num',num);
                $(obj).addClass("hide");
                $(obj).prev().find('.icon-circle-down').removeClass('rotate');
            }
        }

        //判断必填项是否为空
        CON.prototype._isFullInput = function () {
            var flag = false;
            var size = $(this._els.size).val();
            var address = $(this._els.address).val();
            //如果都不为空
            if(size &&  address && parseInt(size) != 0){
                flag = true;
            }
            return flag;
        };
        //编辑招标情况下,填充招标信息
        CON.prototype._fillInput = function (json) {
            $(this._els.type).text(api_dict.demand.type[json.type_value]).attr('num',json.type_value);
            $(this._els.color).text(api_dict.demand.color[json.color_value]).attr('num',json.color_value);
            $(this._els.spacing).text(json.span);
            $(this._els.location).text(api_dict.demand.loc[json.location_value]).attr('num',json.location_value);
            $(this._els.budget).val(json.budget);
            $(this._els.size).val(json.size);
            $(this._els.address).val(json.address);
            $(this._els.note).css('height','auto').val(json.note);
            this.demand_id=json.demand_id;
            this.imgUrl = json.image;

            if(!this._isFullInput()){
                $(this._els.submit).attr('disabled','disabled');
            }
        };
        //编辑招标信息的提交
        CON.prototype._ievent_submitEdit = function(data,target,hit){
            //再做一次判断是否空数据
            if(!this._isFullInput()){
                $(this._els.submit).attr('disabled','disabled');
            }else{
                var color = $(this._els.color).attr('num');
                var type = $(this._els.type).attr('num');
                var span = $(this._els.spacing).text();
                var location = $(this._els.location).attr('num');
                var budget = $(this._els.budget).val();
                var size = $(this._els.size).val();
                var address = $(this._els.address).val();
                var note = $(this._els.note).val();
                var demand_id =this.demand_id;
                var _this = this;
                //c37接口,还未改
                a_auth_req_demand_c37update(demand_id,type,color,span,location,budget,size,address,note,_this.imgUrl,{
                    succ: function(json){
                        $('.edit-project').addClass('hide');
                        $('.demand-info').removeClass('hide');
                        $('.chat-pane').removeClass('hide');
                        $('.input-pane').removeClass('hide');

                        //提交时调用此方法，解决出现两张图片问题
                        _this._ievent_onDone();
                        //更新项目信息
                        a_demand_req_info(demand_id,{
                            succ: function (json) {
                                var info = json.demand_info;
                                info.type_value = info.type;
                                info.location_value = info.location;
                                info.color_value = info.color;
                                project.data.demand = json;
                                potato.application.dispatch(new potato.Event('demandUpdate',{demand:json}));
                            },
                            fail: function () {

                            }
                        });
                    },
                    fail: function(json){
                        _this.delData();
                    }
                })
            }
        };

        //提交是调用此方法删除canvas的缓存地址
        CON.prototype._ievent_onDone = function() {
            console.log("on done");
            project.getIModule('imodule://ImageUploader', null, function(mod) {
                mod.onDone();
            });
        }
        return CON;
    })();


    return Module;
});

