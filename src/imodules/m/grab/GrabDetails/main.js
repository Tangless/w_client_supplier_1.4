define(["/iscripts/iwidgets/Audio.js"],function(Audio) {
    var baseIModules = project.baseIModules;
    var Module = (function(){
        var CON = function(dom){
            baseIModules.BaseIModule.call(this, dom);
            this.audio = new Audio(this._els.audioPane[0]);
            this._init();
            this.data = "";
            this.needWait = true;
            this.is_self = 'false';
            this.user_type = '1';

            //此处是判断快捷登录后是否应该显示激活弹框，从heade里面复制过来的
            var user = project.data.user;
            //现版本此城市暂时写死为郑州，注释以备后用
            // $(this._els.cityName).html(user.city_name);
            if (user.user_type == 100 && user.activated == 0) {         
                project.getIModule("imodule://ActivateSupplier",null,function(ActivateSupplier){
                    project.open(ActivateSupplier,"_blank",{type:"maxWidth",controls:[],closeAble:false});
                });
            }

            // 1. 仅第一次打开详情页，展示详情；之后，直接到洽谈室
            // 2. 从“提交招标信息完成”跳过来的，不参与此判断
            if (qs('isFromInvite') != 'true') {
                this._tryGotoChatRoom();
            }
        };
        potato.createClass(CON, baseIModules.BaseIModule);

        CON.prototype._tryGotoChatRoom = function () {
            var id = qs('demand_id');
            var key = 'detail_info_viewed';
            var val = window.localStorage[key];
            var viewed = [];
            if (val && val.length > 0) {
                var arr = JSON.parse(val);
                if (arr.indexOf(id) >= 0) {
                    // 已经展示过详情，直接跳到洽谈室
                    $('#inRoom').trigger('click');
                    return;
                } else {
                    $('#BiddingRule').show();
                    viewed = arr;
                }
            }

            // 否则，展示这一次，并记收录到“展示过”列表
            viewed.push(id);
            window.localStorage.setItem(key, JSON.stringify(viewed));
        }

        CON.prototype._init = function () {
            var _this = this;
            var id = qs("demand_id");
            var isFromAlipay = qs('from');
            var status, beforeThird, isJoined, hasPhone,hasNotJoined, hasPayed, hasCancel, orderIsGoing;
            isJoined = false;
            hasPayed = false;
            hasCancel = false;
            hasNotJoined = false;
            var suppliers,grabStatus,grabdepos,balance,seconds;
            //查询信息
            a_demand_req_info(id, {
                succ: function (json){
                    _this.data = json.demand_info;
                    grabStatus = json.demand_info.status;
                    grabdepos = json.demand_info.grabdepo;
                    balance = json.balance;
                    seconds = json.seconds;
                    suppliers = _this.JudgmentType(_this.data.supplier_list);
                    // hasNotJoined = json.timeline.length == 0;//没参与过
                    orderIsGoing = parseInt(json.demand_info.status) < 60;//订单进行中
                    hasPhone = json.demand_info.phone ? true : false;//有手机号
                    beforeThird = suppliers < 3;//排名前三
                    //判断参与状态
                    var arr = json.timeline;
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i].raction == "bid/demand") {
                            //考虑到timeline为空不一定就代表已经参加抢单,所以再判断一次

                            isJoined = true; //参与过
                            console.log(arr[i].intm + '===' + arr[i].content)
                        }
                        if (arr[i].raction == "bid/demand/depos" || arr[i].r == "oss/demand-supplier/assign") {
                            hasPayed = true; //付过押金钱
                            console.log(arr[i].intm + '===' + arr[i].content)
                        }
                    }


                    //=====如果是支付宝充值成功后 跳转过来的=====
                    if (isFromAlipay == 'pay') {
                        //正在进行中
                        if(parseInt(grabStatus) < 60){

                            //如果 支付成功 已经**跳转**到抢单状态
                            if (isJoined) {
                                //如果已经付过押金(支付成功跳转页可能已经扣除押金)直接到获取客户信息页面
                                if (hasPayed) {
                                    status = "3";
                                    return false;
                                }
                                //转到排队页面
                                status = "2";

                            }else{
                                //如果支付成功 还没有跳转 则先查询余额是否充足
                                if (parseInt(balance) >= parseInt(grabdepos)) {
                                    //查看排队情况
                                    a_demand_req_status(id,{
                                        succ:function (json) {
                                            var supplierslen = _this.JudgmentType(json.demand_info.supplier_list);
                                            var seconds = json.seconds;
                                            var grabStatus = json.demand_info.status;
                                            //直接到获取客户信息页面
                                            if (parseInt(supplierslen) < 3) {
                                                status = "3"
                                            } else if (parseInt(supplierslen) >= 3) {
                                                //转到排队页面
                                                status = "2"
                                            }
                                            //根据不同状态改变页面元素
                                            _this._transferTo(status);
                                        },
                                        fail:function () {
                                            //如果请求失败,暂时先跳转到首页
                                            alert("获取抢单信息失败");
                                            // window.location.href = '/index.html';
                                        }
                                    })

                                }else {
                                    //弹出余额不足的弹窗
                                    project.open('imodule://BalanceLowModal', "_blank", "maxWidth");
                                }

                            }
                        }else if(parseInt(grabStatus) >= 60){
                            //来晚了,订单已完成
                            status = "4";
                        }


                    /*
                     *  "通过短信点进来"===根据条件判定当前工程商的抢单状态
                     */
                    } else {

                        //订单已结束
                        if (!orderIsGoing) {
                            status = "4";

                        //订单进行中
                        }else {
                           
                            //没参与过  ===》 等待报价
                            if (!isJoined) {
                                status = "1";

                            //参与过
                            } else {
                                //  ===》 排队中
                                status = "2";

                                //参与过 付过钱 且 有手机号 ===》 拨打电话
                                if (hasPayed && hasPhone) {
                                    status = "3"
                                }
                            }
                        }
                    }
                    //渲染数据
                    _this._initData(_this.data);
                    //根据不同状态改变页面元素
                    _this._transferTo(status);

                    //im需要的数据,避免二次请求
                    project.data.demand = json;
                },
                fail:function () {
                    //如果请求失败,暂时先跳转到抢单页
                    //alert("===获取信息失败===");
                    project.tip("非常抱歉","tipfail","这条数据不存在，3秒钟后自动跳转到首页",true)
                    $(_this._els.grabNow).attr('disabled','disabled').removeAttr('ievent');
                    setTimeout(function(){
                        window.location.href = "/index.html";
                    },3000);
                }
            });
        };
        //根据不同状态改变页面元素
        CON.prototype._transferTo = function (status) {
            var _this = this;
            var rule;//竞标规则的代号
            var suppliers = _this.JudgmentType(_this.data.supplier_list);
            switch (status) {
                case "1":
                    //等待报价
                    $(_this._els.grabNow).attr('ievent','grabOrder');
                    $(_this._els.moneyIcon).removeClass('hide');
                    _this.needWait = false;
                    //需要排队等待
                    if(_this.data.suppliers >= 3){
                        $(_this._els.wait).html('联系者太多，需排队预约!').removeClass('hide');
                        _this.needWait = true;
                    }
                    rule = 1;
                    break;
                case "2":
                    //排队中
                    $(_this._els.wait).html('您正在排队,请耐心等待!').removeClass('hide');
                    $(_this._els.grabNow).attr('disabled','disabled');
                    rule = 2;
                    break;
                case "3":
                    //抢单成功
                    $(_this._els.grabNow).removeAttr('disabled').removeAttr('ievent').attr('href','tel:'+_this.data.phone);
                    rule = 1;
                    break;
                case "4":
                    //交易完成==来晚了
                    $(_this._els.grabNow).attr('disabled','disabled').removeAttr('ievent');
                    rule = 3;
                    break;
            }
            // //如果页面是抢单成功跳转过来
            // var call = qs('call');
            // if(call){
            //     //如果是抢单成功,直接拨打电话
            //     $(_this._els.grabNow)[0].click();
            // }
            //设置竞标规则
            var getSucc = function (BiddingRule) {
                BiddingRule.setRuleStatus(rule);
            };
            var BiddingRule = project.getIModule('imodule://BiddingRule',null,getSucc);
        };
       
       //判断b44接口中supplier_list不包含type=2的个数（即是否排队）
        CON.prototype.JudgmentType = function(oldlist){
            var suppliersLen;
            var arr = new Array();
            if(oldlist){
                for(var i=0; i<oldlist.length; i++){
                    if(oldlist[i].type != 2){
                        arr.push(oldlist[i]);
                    }
                }
                suppliersLen = arr.length;
            }else{
                suppliersLen = 0;
            }

            return suppliersLen;
        }

        //渲染数据
        CON.prototype._initData= function(json){
            var _this = this;
            var statusText='';
            //需求状态
            if(parseInt(json.status) < 60){
                $(this._els.statusIcon).attr('class','icon-Tender statusIcon');
                statusText = "正在招标";
            }else{
                $(this._els.statusIcon).attr('class','icon-checkmark02 statusIcon');
                $(this._els.grabNow).attr('disabled','disabled');
                statusText = "交易完成";
            }
            //如果聊天窗口隐藏着
            if($('.grab-chat').hasClass('hide')){
                $(this._els.statusText).text(statusText).attr('changeText',statusText);
            }else{
                $(this._els.statusText).text('正在洽谈').attr('changeText',statusText);
                $(this._els.statusIcon).removeClass('icon-Tender').addClass('icon-message02');
            }


            //订单时间
            var gapDate = count_date_gap(json._intm);
            $(this._els.time).text(gapDate);

            //填充信息
            var budget =std_money_format_in_th(json.budget);
            var budgetText = budget.unit;
            var infoPrice = 0;
            budget = budget.budget;
            if (parseInt(json.budget) <= 0) {
                $(this._els.budget).html('<span class="bargaining">议价</span>');
                infoPrice = "面议";
            } else {
                $(this._els.budget).html('<em class="budg-ys">预算</em><span>'+budget+'</span>'+budgetText);
                infoPrice = (budget + budgetText);
            }
            $(this._els.city).text(json.city_name);
            var sex = json.sex;
            var sexColor = 'male-color';
            //判断男女
            if(sex == "0"){
                sex = "女士";
                sexColor = "female-color";
            }else{
                sex = "先生";
                sexColor = "male-color";
            }
            //判断是否是自己的订单
            a_profile_req({
                succ:function (data) {
                    var userid = data.user_id;
                    if(userid == json.client_id){
                        _this.is_self = true;
                        project.data.isSelfOrder = true;
                        //限制用户对自己的订单操作;
                        // $(_this._els.comment).attr('disabled','disabled').removeAttr('ievent');
                        $(_this._els.grabNow).attr('disabled','disabled').removeAttr('ievent');
                        $(_this._els.wait).addClass('hide');
                        //如果是用户自己发布的标,那么显示编辑标书的按钮
                        $(_this._els.reedit).removeClass('hide');
                        $(_this._els.namePhone).hide();
                    }else{
                        $(_this._els.namePhone).show();
                    }
                    _this.user_type = data.user_type;
                },
                fail:function (msg) {
                    _this.user_type = '0';
                }
            });


            $(this._els.nick).text(json.nick.substr(0,1)+sex);
            $(this._els.firstName).addClass(sexColor).text(json.nick.substr(0,1));
            $(this._els.address).text('位置在' + thin_address(json.address));
            $(this._els.size).text(json.size);
            $(this._els.location).text(api_dict.demand.loc[json.location]);
            $(this._els.span).text('间距'+ json.span);
            $(this._els.color).text(api_dict.demand.color[json.color]+'显示，');
            $(this._els.screenType).text(api_dict.demand.type[json.type]);
            //如果有音频
            if(json.audio){
                $('#audioTag').attr('src',json.audio);
                $(this._els.audioPane).removeClass('hide');
            }
            //如果有图片
            if(json.image){
                $(this._els.image).attr('src',json.image);
                $('.demand-image').removeClass('hide');
                $(this._els.bargaInfo).html("有图／" + infoPrice +"／" + json.span + "／" + api_dict.demand.color[json.color] + "／" + json.size + "㎡");
            }else
            {
                $(this._els.bargaInfo).html(infoPrice +"／" + json.span + "／" + api_dict.demand.color[json.color] + "／" + json.size + "㎡"); 
            }
            //如果有备注
            if(json.note){
                $(this._els.note).text(json.note);
                $('.note').removeClass('hide');
            }

        };

        //等待报价页==按钮点击==立即抢单
        CON.prototype._ievent_grabOrder= function(){
            project.getIModule('imodule://Track').trackInstantGrab();
            potato.application.addLoadingItem($("#grabnow"));
            //如果没有登录
            if(this.user_type == '0') {
                this._openLoginModal($("#grabnow"));
            } else{
                //用户 ==> 升级工程商弹框
                if(this.user_type == '1'){
                    this._openUpgradeModal($("#grabnow"));

                    //工程商 ==> 抢单弹框
                }else if(this.user_type == '100'){
                    var _this = this;
                    var openModal = function(payModal){
                        var title = '若排到，将自动扣款';
                        var sure = '继续排队';
                        //如果是需要排队,则更改付费弹窗的文案;
                        if(_this.needWait){
                            payModal._setText(title,sure);
                        }
                        project.open(payModal,"_blank","maxWidth");
                        potato.application.removeLoadingItem($("#grabnow"));
                    };
                    var openModalFail = function () {
                        potato.application.removeLoadingItem($("#grabnow"));
                    };
                    project.getIModule('imodule://PayADepositModal',{'grabdepo':_this.data.grabdepo,'balance':_this.data.balance},openModal,openModalFail);
                }
            }
        };
        //留言按钮
        CON.prototype._ievent_addComment = function () {
            potato.application.addLoadingItem($(".edit-comment"));
            
            //如果没有登录信息
            if(this.user_type == '0') {
                this._openLoginModal($(".edit-comment"));
            } else{
                //用户 ==> 升级工程商弹框
                if(this.user_type == '1'){
                    this._openUpgradeModal($(".edit-comment"));

                //工程商 ==> 留言框
                }else if(this.user_type == '100'){
                    var getSucc = function (LeavingMessage) {
                        potato.application.removeLoadingItem($(".edit-comment"));
                        LeavingMessage._ievent_Leave();
                    };
                    var getFail = function () {
                        potato.application.removeLoadingItem($(".edit-comment"));
                    };
                    var LeavingMessage = project.getIModule('imodule://LeavingMessage',null,getSucc,getFail);
                }
            }
        };
        //打开升级弹窗
        CON.prototype._openUpgradeModal = function (obj) {
            //获取升级弹窗
            var loginModal = function (UpgradeToSupplier) {
                potato.application.removeLoadingItem(obj);
                project.open(UpgradeToSupplier,"_blank","maxWidth");
            };
            //获取失败
            var openModalFail = function () {
                potato.application.removeLoadingItem(obj);
            };
            project.getIModule('imodule://UpgradeToSupplier',null,loginModal,openModalFail);
        };
        //打开登录弹窗
        CON.prototype._openLoginModal = function (obj) {
            var loginModal = function (loginModal) {
                potato.application.removeLoadingItem(obj);
                project.open(loginModal,"_blank","maxWidth");
            };
            var openModalFail = function () {
                potato.application.removeLoadingItem(obj);
            };
            project.getIModule('imodule://ClientLoginForm',null,loginModal,openModalFail);
        };
        //返回当前订单是否是用户自己的的订单
        CON.prototype.isSelfOrder = function () {
              return this.is_self
        };

        //编辑标书
        CON.prototype._ievent_reeditBid = function () {
            var _this = this;
            var loginModal = function (PublishInviteModule) {
                project.open(PublishInviteModule,"_blank","maxWidthHeight");
            };
            //标示此时是编辑标书状态,不是新建
            project.getIModule('imodule://PublishInviteModule',{"edit":true,"data":_this.data},loginModal);
        };
        //点击查看大图
        CON.prototype._ievent_scanBig = function (data, obj) {
            var src = $(obj).attr('src');
            var width = $(obj).width();
            var height = $(obj).height();
            var rate = width/height;//宽高比
            var hh = $(window).width();//大图的宽 == 屏幕宽度
            var bgh = hh/rate/2;  // 计算出大图的高度 de 一半
            
            //dom插入
            var bigImg = '<div class="bigImgBg" ievent="closeBigImg"><img class="bigImg" src="'+src+'"/></div>';
            $('#GrabDetails').append(bigImg);
            
            //让图片垂直居中
            $('.bigImg').css('margin-top', -bgh+ 'px');
        };
        //关闭大图
        CON.prototype._ievent_closeBigImg = function (data, obj) {
            $(obj).remove();
        };

        CON.prototype._ievent_returnScroll = function (data, obj) {
            // var qsid = qs('demand_id');
            // window.location.href = "/index.html#"+qsid;
           //alert(document.referrer)
           var fromid = qs('from');
           if(fromid == 1){
            window.history.go(-1);
           }else{
            window.location.href = "/index.html";
           }
        }

        return CON;
    })();

    return Module;
});
