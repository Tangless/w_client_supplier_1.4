define(function () {
    var baseIModules = project.baseIModules;
    var Module = (function () {
        var CON = function (dom) {
            baseIModules.BaseIModule.call(this, dom);
            var _this = this;
            this._isFirstTime = true;
            $(document).click(function () {
                _this.find('.option').addHide();
            })
            $(this.find('input')).click(function () {
                return false;
            })
            this.demand = '';
        };

        potato.createClass(CON, baseIModules.BaseIModule);
        //判断登录状态，显示哪个模块
        CON.prototype.initInfo = function () {
            var id;
            var _this = this;
            _this.webim = {
                session: "all",
                messages: {history: [], news: []},
                update: function (msgs) {
                    var version = msgs.version;
                    delete(msgs.version);
                    if (msgs != null) {
                        _this.comMsg(msgs);
                    }
                    msgs.version = version;
                }
            };
            potato.application.addListener('IMSyncSuccess', function () {
                webimConfigs.addListener(_this.webim);
            });
            if (project.isLogin()) {
                a_auth_req_current_item({
                    succ: function (json) {
                        if (json.demand.length > 0) {
                            _this.initTpl(json.demand[0], json.user);
                            _this.find('.logout').removeHide();
                            _this.find('.login').addHide();
                            potato.application.addListener('demandUpdate', function (event) {
                                var update = 1;
                                a_auth_req_current_item({
                                    succ: function (data) {
                                        _this.initTpl(data.demand[0], data.user, update);
                                    },
                                    fail: function (data) {

                                    }
                                })
                            })

                        } else {
                            var reg = /^[\u4e00-\u9faf]+$/;
                            var nick = project.data.user.nick;
                            _this.find('.logout').addHide();
                            _this.find('.login').removeHide();
                            _this.find('.phone').val(project.data.user.phone);
                            _this.find('.phone').attr('disabled', true);
                            if (reg.test(nick)) {
                                _this.find('.name').val(nick);
                            }
                        }
                        _this.find('.cliDiv').removeHide();
                    },
                    fail: function (itemjson) {
                    }
                });
                //监听新消息,放在首页面板
                potato.application.addListener('newMsg', function (event) {
                    _this._putMsgOnPanel(event.data.msg);
                });
            } else {
                _this.find('.cliDiv').removeHide();
                this.find('.logout').addHide();
                this.find('.login').removeHide();
            }
        }
        //询价调输入信息按钮
        CON.prototype._ievent_callModal = function (data, target, hit) {
            $(target).parent().siblings().find('.option').addHide();
            if ($($(target).siblings('.option')).attr('class').indexOf('hide') == -1) {
                $(target).siblings('.option').addHide();
            } else {
                $(target).siblings('.option').removeHide();
            }
            return false;
        }

        //本来想写一个来着，但是取值不好取，就写了三个
        CON.prototype._ievent_select1 = function (data, target, hit) {
            this.locSelect(target);
            return false;
        }
        CON.prototype._ievent_select2 = function (data, target, hit) {
            this.corSelect(target);
            return false;
        }
        CON.prototype._ievent_select3 = function (data, target, hit) {
            this.spanSelect(target);
            return false;
        }

        //选择屏幕类型
        CON.prototype._ievent_type = function (data, target, hit) {
            $(target).siblings().removeClass('selected');
            $(target).addClass('selected');
            var scrType = $(target).attr('type');
            this.find('.scrType').text($(target).text())
            $(target).parent().addHide();
            this.updateInit(scrType);
            this.find('.border-middle .option').removeHide();
            return false;
        }

        //实现选择屏幕联动改变颜色、位置的初始值
        CON.prototype.updateInit = function (scrType) {
            var list = this.find('.choose');
            for (var i = 0; i < list.length; i++) {
                if (scrType == 0) {
                    if ($(list[i]).attr('loc') == 1) {
                        this.locSelect(list[i]);
                    }
                    if ($(list[i]).attr('color') == 3) {
                        this.corSelect(list[i]);
                    }
                    this.difSpan('P12', 'P10', 'P8')
                    if ($(list[i]).text() == "P10") {
                        this.spanSelect(list[i]);
                    }
                } else if (scrType == 1) {
                    if ($(list[i]).attr('loc') == 3) {
                        this.locSelect(list[i]);
                    }
                    if ($(list[i]).attr('color') == 1) {
                        this.corSelect(list[i]);
                    }
                    this.difSpan('P12', 'P10', 'P8')
                    if ($(list[i]).text() == "P10") {
                        this.spanSelect(list[i]);
                    }
                } else if (scrType == 2) {
                    if ($(list[i]).attr('loc') == 1) {
                        this.locSelect(list[i]);
                    }
                    if ($(list[i]).attr('color') == 3) {
                        this.corSelect(list[i]);
                    }
                    this.difSpan('P6', 'P8', 'P10')
                    if ($(list[i]).text() == "P10") {
                        this.spanSelect(list[i]);
                    }
                } else if (scrType == 3) {
                    if ($(list[i]).attr('loc') == 1) {
                        this.locSelect(list[i]);
                    }
                    if ($(list[i]).attr('color') == 1) {
                        this.corSelect(list[i]);
                    }
                    this.difSpan('P6', 'P8', 'P10')
                    if ($(list[i]).text() == "P10") {
                        this.spanSelect(list[i]);
                    }
                } else if (scrType == 4) {
                    if ($(list[i]).attr('loc') == 2) {
                        this.locSelect(list[i]);
                    }
                    if ($(list[i]).attr('color') == 3) {
                        this.corSelect(list[i]);
                    }
                    this.difSpan('P3', 'P4', 'P5')
                    if ($(list[i]).text() == "P4") {
                        this.spanSelect(list[i]);
                    }
                } else {
                    if ($(list[i]).attr('loc') == 2) {
                        this.locSelect(list[i]);
                    }
                    if ($(list[i]).attr('color') == 3) {
                        this.corSelect(list[i]);
                    }
                    this.difSpan('P1.25', 'P2.0', 'P2.5')
                    if ($(list[i]).text() == "P2.0") {
                        this.spanSelect(list[i]);
                    }
                }
            }
        }
        //选择不同类型屏幕对应默认不同的间距
        CON.prototype.difSpan = function (p1, p2, p3) {
            $($('.span .choose')[0]).text(p1)
            $($('.span .choose')[1]).text(p2)
            $($('.span .choose')[2]).text(p3)
        }

        //选择一种类型之后清除其他选项的底色，三个方法
        CON.prototype.locSelect = function (dom) {
            $(dom).parent().parent().find('.choose').removeClass('locChoosed');
            $(dom).addClass('locChoosed')
            this.find('.location').text($(dom).text());
        }
        CON.prototype.corSelect = function (dom) {
            $(dom).parent().parent().find('.choose').removeClass('corChoosed');
            $(dom).addClass('corChoosed')
            this.find('.color').text($(dom).text());
        }
        CON.prototype.spanSelect = function (dom) {
            $(dom).parent().parent().find('.choose').removeClass('spanChoosed');
            $(dom).addClass('spanChoosed')
            this.find('.between').text($(dom).text());
        }

        //弹出聊天窗口,临时用一下
        CON.prototype._ievent_chatRoom = function (data, target, hit) {
            $(target).attr('ievent', '');
            var _this = this;
            this.find('.option').addHide();
            var type = this.find('.selected').attr('type');
            var size = this.find('.size').val();
            var location = this.find('.locChoosed').attr('loc');
            var color = this.find('.corChoosed').attr('color');
            var nick = this.find('.name').val();
            var phone = this.find('.phone').val();
            var city_id = this.find('.citySelect').text();
            var span;
            if (this.find('.spanInput input').val() != "") {
                span = this.find('.spanInput input').val();
            } else {
                span = this.find('.spanChoosed').text();
            }
            if (this.checkType(type) && this.checkInfo(size, 'size', "面积") && this.checkName(nick, 'name', "称呼") && this.checkPhone(phone, 'phone', "手机号")) {
                a_auth_req_demand_c36(type, color, span, location, size, city_id, phone, nick, {
                    succ: function (json) {
                        if (json.demand_id != undefined) {
                            _this.demand = json.demand_id;
                            if (project.isLogin()) {
                                localStorage.setItem("chatroom", 'open');//存储变量名为key，值为value的变量
                                window.location.reload();
                            } else {
                                if (json.send_passcode == 1) {
                                    var callBack = function (module) {
                                        project.open(module, '_blank')
                                        $(target).attr('ievent', 'chatRoom');
                                        module.find('.c-code-phone').text(phone);
                                    }
                                    project.getIModule('imodule://Code', {phone: phone, demand_id: _this.demand}, callBack)
                                }
                            }
                        } else {
                            project.getIModule('imodule://LoginForm', null, function (module) {
                                //打开弹窗时调用倒计时
                                module._init({"msg": json.msg, "phone": phone});
                                project.open(module, '_blank', {'size': ['content', 'content']});
                            })
                        }
                    },
                    fail: function (json) {
                        if(json.status==2){
                            var callBack = function (module) {
                                project.open(module, '_blank')
                                $(target).attr('ievent', 'chatRoom');
                                module.find('.c-code-phone').text(phone);
                            }
                        project.getIModule('imodule://Code', {phone: phone, demand_id: _this.demand}, callBack)
                        }
                    }
                })
            } else {
                $(target).attr('ievent', 'chatRoom');
            }
            return false;
        };
        CON.prototype._ievent_inquiry = function () {
            project.getIModule("imodule://ChatRoom", null, function (module) {
                module.openChatRoom();
            })
        }
        //选择城市模块
        CON.prototype._ievent_citySelect = function () {
            var _this = this;
            project.getIModule("imodule://CitySelector", null, function (module) {
                //城市名回掉给当前页面
                module.initCallback(function (city, value) {
                    _this.find('.citySelect').text(city);
                }, _this.find('.citySelect').text());
                project.open(module, "_blank");
            })
        }
        //选择城市以后回显到首页
        CON.prototype.thisCity = function (city) {
            this.find('.citySelect').text(city);
        }
        //用户在选择间距时，选择其他的操作
        CON.prototype._ievent_others = function (data, target, hit) {
            $(target).parent().parent().addHide();
            $(target).parent().parent().siblings('.spanInput').removeHide();
            return false;
        }
        //用户选择其他间距时返回选择间距
        CON.prototype._ievent_close = function (data, target, hit) {
            $(target).parent().find('input').val('');
            $(target).parent().addHide();
            $(target).parent().siblings('.span').removeHide();
            return false;
        }
        //点击确定按钮，show出填写用户信息框
        CON.prototype._ievent_sure = function (data, target, hit) {
            if (this.find('.spanInput input').val() != "") {
                this.find('.between').text(this.find('.spanInput input').val());
            }
            $(target).parents('.option').addHide();
            this.find('.userInfo .option').removeHide();
            return false;
        }
        //点击收起按钮收起填写窗口
        CON.prototype._ievent_retract = function (data, target, hit) {
            $(target).parent().addHide();
            if ($('.scrSize .name').val() != "") {
                $('.nameT').text(this.find('.scrSize .name').val());
            }
            if ($('.scrSize .phone').val() != "") {
                $('.phoneT').text(this.find('.scrSize .phone').val());
            }
            return false;
        }
        //验证用户所填信息
        CON.prototype.checkType = function (type) {
            if (type == undefined) {
                this.find('.scrModal').removeHide();
                return false;
            } else {
                return true;
            }
        }
        CON.prototype.checkInfo = function (info, dom, tip) {
            var reg = /^\d+(\.\d+)?$/
            if (info == "") {
                $('.' + dom + 'Tip').removeHide();
                $('.' + dom + 'Tip').find('.errorInfo').text(tip + '不能为空！')
                this.find('.option').addHide();
                this.find('.sizeModal').removeHide();
                return false;
            } else if (!reg.test(info)) {
                $('.' + dom + 'Tip').removeHide();
                $('.' + dom + 'Tip').find('.errorInfo').text('请输入正确的' + tip);
                this.find('.option').addHide();
                this.find('.sizeModal').removeHide();
                return false;
            } else {
                return true;
            }
        }
        CON.prototype.checkName = function (info, dom, tip) {
            var reg = /^[a-zA-Z\u4e00-\u9fa5 ]{1,10}$/
            if (info == "") {
                $('.' + dom + 'Tip').removeHide();
                $('.' + dom + 'Tip').find('.errorInfo').text(tip + '不能为空！')
                this.find('.option').addHide();
                this.find('.infoModal').removeHide();
                return false;
            } else if (!reg.test(info)) {
                $('.' + dom + 'Tip').removeHide();
                $('.' + dom + 'Tip').find('.errorInfo').text('请输入正确的' + tip);
                this.find('.option').addHide();
                this.find('.infoModal').removeHide();
                return false;
            } else {
                return true;
            }
        }
        CON.prototype.checkPhone = function (info, dom, tip) {
            var reg = /^\d{11}$/
            if (info == "") {
                $('.' + dom + 'Tip').removeHide();
                $('.' + dom + 'Tip').find('.errorInfo').text(tip + '不能为空！')
                this.find('.option').addHide();
                this.find('.infoModal').removeHide();
                return false;
            } else if (!reg.test(info)) {
                $('.' + dom + 'Tip').removeHide();
                $('.' + dom + 'Tip').find('.errorInfo').text('请输入正确的' + tip);
                this.find('.option').addHide();
                this.find('.infoModal').removeHide();
                return false;
            } else {
                return true;
            }
        }
        CON.prototype.initTpl = function (json, user, update) {
            if (update == 1) {
                this.find('.tpl').remove();
            }
            var tpl = this._els.tpl[0].text;
            var dom = Mustache.render(tpl, {
                "json": json, 'user': user, util: {
                    time: function () {
                        return count_date_gap(json._intm);
                    },
                    budget: function () {
                        return std_money_format_in_th(json.budget).budget + std_money_format_in_th(json.budget).unit;
                    },
                    loc: function () {
                        return api_dict.demand.loc[json.location + ""];
                    },
                    color: function () {
                        return api_dict.demand.color[json.color + ""];
                    },
                    type: function () {
                        return api_dict.demand.type[json.type + ""];
                    },
                }
            })
            $(dom).appendTo(this.find('.logout'));

        }
        CON.prototype._putMsgOnPanel = function (lastMsg) {
            var msg = lastMsg.text;
            var userId = lastMsg.from;
            //如果是自己发的
            if (userId == project.data.user.user_id) {
                userId = '您';
                //如果是客服
            } else if (userId == '3') {
                userId = '客服代表'
            } else {
                var slist = project.data.joinedSupplierList || [];
                var l = slist.length;
                var mInfo;
                for (var k = 0; k < l; k++) {
                    if (userId == slist[k].user_id + "") {
                        mInfo = slist[k];
                        break;
                    }
                }
                if (!mInfo) {
                    return;
                }
                userId = mInfo.nick;
                if (mInfo.company_name) {
                    userId = mInfo.nick + '&nbsp;|&nbsp;' + mInfo.company_name;
                }
            }
            this.find('.userId').html(userId + '&nbsp;:&nbsp;');
            this.find('.lastMsg').html(msg);
        };
        //私聊群未读消息数统计
        CON.prototype.comMsg = function (msgs) {
            var _this =this;
            var unread = 0;
            var gid = project.data.demand.demand_im_group_outer_id;
            $.each(msgs, function (key, value) {
                //不是群聊
                if (key == gid && _this._isFirstTime) {
                    _this._putMsgOnPanel(value.lastMsg);
                    _this._isFirstTime = false;
                }else{
                    // 如果是客服私聊
                    if (key == project.data.demand.demand_customer_csad_im_group_outer_id) {
                        unread += value.unread;
                    } else {
                        // 工程商私聊群
                        var plist = project.data.joinedSupplierList || [];
                        for (var i = 0, j = plist.length; i < j; i++) {
                            if (key == plist[i].demand_customer_supplier_im_group_outer_id) {
                                unread += value.unread;
                            }
                        }
                    }
                }
            });
            if (unread == 0) {
                if (gid) {
                    var groupUnread = msgs[gid].unread;
                    if (groupUnread > 0) {
                        this.find('.unreadAll').removeHide();
                        this.find('.unread').addHide();
                    } else{
                        this.find('.unread').addHide();
                        this.find('.unreadAll').addHide();
                    }
                }

            } else {
                this.find('.unread').html(unread).removeHide();
                this.find('.unreadAll').addHide();
            }

        };
        return CON;
    })();
    return Module;
});

