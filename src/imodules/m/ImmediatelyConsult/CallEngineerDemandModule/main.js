define(["/iscripts/iwidgets/RadarAnimation.js"],function() {
    var baseIModules = project.baseIModules;
    var Module = (function(){
        var CON = function(dom,parent,option){
            baseIModules.BaseIModule.call(this, dom, parent, option);
            this.defaultDemand();
            this.defaultSpan();

            //此处是判断快捷登录后是否应该显示激活弹框，从heade里面复制过来的
            var user = project.data.user;
            //现版本此城市暂时写死为郑州，注释以备后用
            // $(this._els.cityName).html(user.city_name);
            if (user.user_type == 100 && user.activated == 0) {         
                project.getIModule("imodule://ActivateSupplier",null,function(ActivateSupplier){
                    project.open(ActivateSupplier,"_blank",{type:"maxWidth",controls:[],closeAble:false});
                });
            }
        };

        potato.createClass(CON, baseIModules.BaseIModule);


        //返回快捷登录
        CON.prototype._ievent_returnLogin = function(){
            window.location.href = 'call-type.html';
        }

        //展开下拉菜单
        CON.prototype._ievent_showMenu = function(data, obj){
            $(obj).next('div').slideToggle();
            $(obj).find('.icon-circle-down').toggleClass('rotate');
            $(obj).parent().toggleClass('active');
        }

        //下拉选项点击选中事件
        CON.prototype._ievent_chooseLocation = function (data, obj, hit) {
            var choosed = $(hit).text();
            var num = $(hit).attr('num');
            console.log(num);
            $(this._els.location).text(choosed).attr('num',num);
            $(obj).slideToggle();
            $(obj).parent().removeClass('active');
            $(obj).prev().find('.icon-circle-down').removeClass('rotate');
        };
        CON.prototype._ievent_chooseColor = function (data, obj, hit) {
            var choosed = $(hit).text();
            var num = $(hit).attr('num');
            $(this._els.color).text(choosed).attr('num',num);
            $(obj).slideToggle();
            $(obj).parent().removeClass('active');
            $(obj).prev().find('.icon-circle-down').removeClass('rotate');
        };

        //选择分类
        CON.prototype._ievent_chooseType = function(data, target){
            $(target).addClass('active').siblings().removeClass('active');
            $(this._els.span).val('');
        }

        CON.prototype._ievent_chooseOtherType = function(data, target){
            $(this._els.demandCommon).addHide();
            $(this._els.demandOther).removeHide();
        }

        //选择分类关闭其他
        CON.prototype._ievent_otherClose = function(data, target){
            $(this._els.demandCommon).removeHide();
            $(this._els.demandOther).addHide();
            if($(this._els.span).val() != "" && $(this._els.span).val() != 0){
                $(this._els.ordinary).find('.spacing').removeClass('active');
            }
        }

        //不同类型屏默认内容
        CON.prototype.defaultDemand = function(){
            var that = this;
            var typeId = qs('classify');

            /*
            门头招牌 1    位置选择：半户外、颜色选择：单色 、间距选择：P10
            户外广告牌 2  位置选择：户外、颜色选择：全彩、间距选择：P6、P8、P10
            信息告示牌 3  位置选择：户外、颜色选择：单色、间距选择：P6、P8、P10
            舞台用屏 4    位置选择：室内、颜色选择：全彩、间距选择：P3、P4、P5
            室内高清屏 5  位置选择：室内、颜色选择：全彩、间距选择：P1.25、P2.0、P2.5
            其它 0        位置选择：户外、颜色选择：全彩、间距选择：P10
            */
            switch(parseInt(typeId)) {
                case 1:
                    $(this._els.location).html('半户外');
                    $(this._els.color).html('单色');
                    break;
                case 2:
                    $(this._els.location).html('户外');
                    $(this._els.color).html('全彩');
                    break;
                case 3:
                    $(this._els.location).html('户外');
                    $(this._els.color).html('单色');
                    break;
                case 4:
                    $(this._els.location).html('室内');
                    $(this._els.color).html('全彩');
                    break;
                case 5:
                    $(this._els.location).html('室内');
                    $(this._els.color).html('全彩');
                    break;
                case 0:
                    $(this._els.location).html('户外');
                    $(this._els.color).html('全彩');
                    break;
            }

            if(!that._isFull()){
                $(that._els.callBtn).attr('disabled','disabled');
            }else {
                $(that._els.callBtn).removeAttr('disabled');
            }

            $('.fullnull').bind('input propertychange','input',function(){
                if(!that._isFull()){
                    $(that._els.callBtn).attr('disabled','disabled');
                }else {
                    $(that._els.callBtn).removeAttr('disabled');
                }
            });


            //设置间距和颜色的num
            var locationHtml = $(this._els.location).html();
            var colorHtml = $(this._els.color).html();
            $(this._els.location).attr('num',that._ToNum(locationHtml));
            $(this._els.color).attr('num',that._ToNum(colorHtml));

        }

        //默认间距
        CON.prototype.defaultSpan = function(){
            var spanList = [
                ["P10"],
                ["P10"],
                ["P6","P8","P10"],
                ["P6","P8","P10"],
                ["P3","P4","P5"],
                ["P1.25","P2.0","P2.5"]
            ]
            var html = "";

            var i = qs('classify');
            for(var j=0; j<spanList[i].length; j++)
            {
                html += '<span class="spacing" ievent="chooseType"><em idom="span">'+spanList[i][j]+'</em><i class="icon-checkmark02"></i></span>'
            }

           $(this._els.ordinary).html(html);
           $(this._els.ordinary).find('.spacing').eq(0).addClass('active');
        }

        //提交招标信息
        CON.prototype._ievent_callSubmit = function(data,target,hit){
            var color = $(this._els.color).attr('num');
            var span = $(this._els.demandCommon).find('.active').find('em').html() || $(this._els.span).val();
            var location = $(this._els.location).attr('num');
            var size = $(this._els.size).val();
            var address = $(this._els.address).val();
            var type = qs('classify');
            var setTime = null;

            var _this = this;
            a_auth_req_demand_create(type, color, span, location, "", size, address, "", "",{
                succ: function(json){
                    //alert(color + "||" + span + "||" + location + "||" + size + "||" +address)
                    //_this.delData();
                    var demandId = parseInt(json.demand_id);
                    project.tip("提交成功","succ","24小时内，我们的工程商会为您提供方案和报价",true);
                    setTime = setTimeout(function(){
                        window.location.href = 'demand.html?demand_id='+demandId+'&isFromInvite=true';
                    },1000)

                },
                fail: function(json){
                    //alert('提交失败')
                    //_this.delData();
                }
            })
        };

        //判断必填项是否为空
        CON.prototype._isFull = function () {
            var flag = false;
            var size = $(this._els.size).val();
            var address = $(this._els.address).val();
            //如果都不为空
            if(size && parseInt(size) != 0){
                flag = true;
            }
            return flag;
        };

        //color/location 对应的文字和编码
        CON.prototype._ToNum = function (colorOrLocation) {
            var num ;
            if(colorOrLocation == '户外' || colorOrLocation == '单色'){
                num = '1';
            }else if(colorOrLocation == '室内' || colorOrLocation == '双色'){
                num = '2';
            }else if(colorOrLocation == '半户外' || colorOrLocation == '全彩'){
                num = '3';
            }else{
                //默认特殊情况下为1
                num = 1;
            }
            return num;

        };

        return CON;
    })();
    return Module;
});

