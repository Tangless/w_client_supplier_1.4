define(function () {
    var baseIModules = project.baseIModules;
    var Module = (function () {
        var CON = function (dom) {
            baseIModules.BaseIModule.call(this, dom);
            this.scrollPanel = $(this._els.scrollPanel);
            this.chatPane = $(this._els.chatPane);
            this.demandPane = $(this._els.demandPane);
            this.editProject = $(this._els.editProject);
            this.glist = $(this._els.glist);
            this.chatContent = $(this._els.chatContent);
            this.enclosure = $(this._els.enclosure);
            this.send = $(this._els.send);
            this.client_id = '';
            this.client_nick = '';
            this.group_id = '';
            this.groupMember = [];//当前群成员
            this.demand_id = '';
            this.tempGroupInfo = {};
            this.tempGroupClientInfo = {};
            this.privateGroupList = [];

            var _this = this;
            //聊天界面
            var msgPane = $('.chat-pane');

            this.demandInfoTpl = this.demandPane.html();
            //输入框输入事件监听
            $('#input').on('input propertychange blur', function () {
                //聊天面板滚到底部
                msgPane[0].scrollTop = msgPane[0].scrollHeight;

                var v = $(this).val();
                if (v.length > 0 && v.trim().length > 0) {

                } else {
                    $(this).css('height', '26px');
                }
            });

            $(window).resize(function () {
                msgPane[0].scrollTop = msgPane[0].scrollHeight;
            });
            $('.input-pane').on('submit', function (e) {
                e.preventDefault();
                _this._ievent_sendMsg();
            });
            
            //图片选择事件
            $('#imgFile').on('change', function () {
                webimConfigs.sendImage();
            });

            this.webim = {
                session: '',
                messages: {history: [], news: []},
                update: function (msgs) {
                    var html = '';
                    for (var i = 0, j = msgs.length; i < j; i++) {
                        if (_this.currSessIsOthers) {
                            html = html + _this.othersPushMsg(msgs[i]);
                        } else {
                            html = html + _this.pushMsg(msgs[i]);
                        }
                    }
                    msgPane.append(html);

                    var delayTime = 300;
                    //如果消息中没有图片,就加快显示速度
                    if (html.indexOf('chat-img') < 0) {
                        delayTime = 30;
                    }

                    //图片加载需要时间,延迟滚动
                    setTimeout(function () {
                        msgPane[0].scrollTop = msgPane[0].scrollHeight;
                    }, delayTime);

                    var id = this.session;
                    var lastMsg = msgs[msgs.length - 1].text;
                    if(lastMsg.indexOf('chat-img') > 0){
                        lastMsg = '[图片]'
                    }
                    $('.group-item[gid="' + id + '"]').find('.last-msg').html(lastMsg);
                },
                history: function (msgs) {
                    var html = '';
                    for (var i = 0; i < msgs.length; i++) {
                        if (_this.currSessIsOthers) {
                            html = _this.othersPushMsg(msgs[i]) + html;
                        } else {
                            html = _this.pushMsg(msgs[i]) + html;
                        }
                    }
                    if (project.data.isGuestIM || _this.currSessIsOthers) {
                        msgPane.append(html);
                    } else {
                        msgPane.prepend(html);
                    }

                    //图片加载需要时间,延迟滚动
                    setTimeout(function () {
                        msgPane[0].scrollTop = msgPane[0].scrollHeight;
                    }, 500);
                }
            };

            webimConfigs.addListener(this.webim);

            potato.application.addListener('IMSyncSuccess', function () {
                _this._init({
                    succ: function () {
                        //客户监听群聊消息,以实时更新聊天群列表
                        _this.webim2 = {
                            session: _this.group_id,
                            messages: {history: [], news: []},
                            update: function (msgs) {
                                if (nim.currSess != _this.group_id) {
                                    for (var i = 0, j = msgs.length; i < j; i++) {
                                        var msg = msgs[i];
                                        var fromAccount = msg.from;
                                        var merberInfo = _this._getCurrentGroupMember(fromAccount);
                                        if (msg.type == 'notification') {
                                            return
                                        }
                                        //如果发消息的人不存在当前群里边(即 新参与的工程商)
                                        if (!merberInfo || merberInfo.type == 0) {
                                            //重新取一遍参与的工程商列表信息(延时执行:防止后台接口数据更新延迟)
                                            setTimeout(function () {
                                                _this._getCurrentGroup({
                                                    succ: function () {
                                                        console.log('更新参与的工程商信息成功')
                                                    }
                                                });
                                            }, 2000);
                                        }
                                    }
                                }
                            },
                            history: function () {

                            }
                        };
                        webimConfigs.addListener(_this.webim2);

                        //客户监听私聊消息,以实时更新聊天群租列表
                        _this.webim3 = {
                            session: 'all',
                            messages: {history: [], news: []},
                            update: function (msgs) {
                                $.each(msgs, function (key, value) {
                                    if (value.news && value.unread > 0) {
                                        if (value.unread > 9) {
                                            value.unread = '…';
                                        }
                                        if(value.lastMsg.text.indexOf('chat-img') > 0){
                                            value.lastMsg.text = '[图片]'
                                        }
                                        //如果是私聊群的消息
                                        if (!_this._hasPrivateGroup(key) && key != _this.group_id) {
                                            //重新取一遍参与的工程商列表信息(延时执行:防止后台接口数据更新延迟)
                                            setTimeout(function () {
                                                _this._getCurrentGroup();
                                            }, 2000);
                                        } else if (key != nim.currSess) {
                                            var item = $('.group-item[gid="' + key + '"]');
                                            item.find('.unread-num').html(value.unread).removeClass('hide');
                                            item.find('.last-msg').html(value.lastMsg.text);
                                        }
                                        if (key != nim.currSess) {
                                            if (key == _this.service_gid) {
                                                var vip = $('.vip');
                                                vip.find('.unread-num').html(value.unread).removeClass('hide');
                                                vip.find('.last-msg').html(value.lastMsg.text);
                                            }
                                            if (key == _this.group_id) {
                                                var gchat = $('.gchat');
                                                gchat.find('.unread-num').html(value.unread).removeClass('hide');
                                                gchat.find('.last-msg').html(value.lastMsg.text);
                                            }
                                        }
                                    }
                                });
                            }
                        };
                        webimConfigs.addListener(_this.webim3);

                        //当chatroom的value等于open时，打开聊天弹框，并且清除chatroom。防止下次刷新再打开
                        if (localStorage.getItem("chatroom") == 'open') {
                            _this.openChatRoom();
                            localStorage.removeItem("chatroom");
                        }
                    }
                });
            });
        };
        potato.createClass(CON, baseIModules.BaseIModule);

        //切换聊天对象 更新设置
        CON.prototype.switchSession = function (sessionID, isOthersGroup) {
            var isLargeGroup = false;
            if (sessionID == project.data.demand.demand_im_group_outer_id) {
                isLargeGroup = true;
            }
            if (isOthersGroup) {
                isLargeGroup = true;
            }
            webimConfigs.setCurrSession(sessionID, isLargeGroup);
            $('.group-item[gid="' + sessionID + '"]').find('.unread-num').addClass('hide').html('');
            this.webim.session = sessionID;
            this.webim.messages = {history: [], news: []};
        };
        //获取当前标的的信息
        CON.prototype._init = function (cb) {
            var _this = this;
            if (project.data.currentItem) {
                _this.demand_id = project.data.currentItem.demand_id;
                _this.currUserHasProject = true;
                _this._initGroup(cb);
            } else {
                //登录成功后获取当前项目
                a_auth_req_current_item({
                    succ: function (itemjson) {
                        console.log("item fail:::" + itemjson);
                        if (itemjson.demand.length > 0) {
                            project.data.currentItem = itemjson.demand[0];
                            _this.demand_id = project.data.currentItem.demand_id;
                            _this.currUserHasProject = true;
                            _this._initGroup(cb);
                        } else {
                            project.data.currentItem = {};
                            _this.currUserHasProject = false;
                        }
                    },
                    fail: function (itemjson) {
                        console.log("item fail:::" + itemjson);
                        project.data.currentItem = {};
                        _this.currUserHasProject = false;
                        // _this._initOthersChat();
                    }
                })
            }
        };
        //加载自己的项目群所需的数据
        CON.prototype._initGroup = function (cb) {
            var _this = this;
            //如果标的信息已经缓存
            a_demand_req_info(_this.demand_id, {
                succ: function (json) {
                    var info = json.demand_info;
                    info.type_value = info.type;
                    info.location_value = info.location;
                    info.color_value = info.color;
                    project.data.demand = json;
                    _this.client_id = json.demand_info.client_id;
                    _this.client_nick = json.demand_info.nick;
                    _this.group_id = json.demand_im_group_outer_id;
                    _this.service_gid = json.demand_customer_csad_im_group_outer_id;
                    webimConfigs.setLargeGroup(_this.group_id);
                    _this._getCurrentGroup();
                    cb && cb.succ();
                },
                fail: function (json) {
                    alert('请求失败: ' + json.msg);
                    cb && cb.fail();
                }
            })

        };
        //没有正在招标的项目的登录用户,聊天窗口显示变化
        CON.prototype._initOthersChat = function (data) {
            this.switchSession(data.im_group_outer_id, true);
            this._els.editProject[0].className = 'edit-project hide';
            this._els.demandPane[0].className = 'demand-info';
            this._els.chatPane[0].className = 'chat-pane';
            this._els.inputPane[0].className = 'input-pane';

            $(this).css('width', '700px');
            this.glist.addClass('hide');
            this.chatContent.css({
                'width': '700px',
                'margin': '0'
            }).find('.input-pane').addClass('hide');
            this.chatPane.css('height', '296px');
            this.demandPane.css('height', '354px');
            this.currSessIsOthers = true;
            this.tempGroupInfo = data;
            this.tempGroupClientInfo = data.user;
            this.tempDemandId = data.demand_id;

            project.open(this, '_blank', {"size": ["700px", "650px"]})
        };
        //打开自己的项目的聊天室
        CON.prototype._initSelfChat = function (Details) {
            if (!this.find('.gchat').hasClass('active')) {
                this.find('.group-list').find('.active').removeClass('active');
                this.find('.gchat').addClass('active');
            }
            this.switchSession(this.group_id);
            this._els.editProject[0].className = 'edit-project hide';
            this._els.demandPane[0].className = 'demand-info';
            this._els.chatPane[0].className = 'chat-pane';
            this._els.inputPane[0].className = 'input-pane';

            $(this).css('width', '800px');
            this.glist.removeClass('hide');
            // 如果已在localStorage中存有该demand_id, 说明已经展示过详情，则直接到聊天；
            // 否则，写入demand_id，并展示详情
            this.chatContent.css({
                'width': '615px',
                'margin-right': '-5px'
            }).find('.input-pane').removeClass('hide');

            if (this.demand_id == localStorage.getItem("detail_info")) {
                Details._ievent_slideUp();

                this.chatPane.css('height', '475px');
                this.demandPane.css('height', '122px');
            } else {
                localStorage.setItem("detail_info", this.demand_id);//存储变量名为key，值为value的变量

                this.chatPane.css('height', '135px');
                this.demandPane.css('height', '460px');
            }

            this.currSessIsOthers = false;
            project.open(this, '_blank', {"size": ["800px", "650px"]})
        };
        //打开聊天室并切换到会话
        CON.prototype.openChatRoom = function (data) {
            var _this = this;
            this.chatPane.html('');
            // this.demandPane.html(_this.demandInfoTpl);

            var success;
            if (data && data.demand_id != _this.demand_id) {
                success = function (Details) {
                    _this._getDemandInfo(data.demand_id, {
                        succ: function (json) {
                            Details.initTpl(json)
                        },
                        fail: function () {
                            alert('获取项目信息失败,请重试')
                        }
                    })

                };
                _this._initOthersChat(data);
            } else {
                //如果是自己的项目
                if (_this.group_id) {
                    success = function (Details) {
                        Details.initTpl(project.data.demand);
                        _this._initSelfChat(Details);
                    };
                } else {
                    this._initGroup({
                        succ: function () {
                            var succ = function (Details) {
                                Details.initTpl(project.data.demand);
                                _this._initSelfChat(Details);
                            };
                            project.getIModule('imodule:Details', null, succ);
                        },
                        fail: function () {
                            alert('查询项目失败,请检查网络并刷新重试...')
                        }
                    });
                }
            }
            project.getIModule('imodule://Details', null, success);

        };
        CON.prototype._getDemandInfo = function (demand_id, cb) {
            a_demand_req_info(demand_id, {
                succ: function (json) {
                    cb && cb.succ(json);
                },
                fail: function (json) {
                    alert('请求失败: ' + json.msg);
                    cb && cb.fail();
                }
            })
        }
        //在聊天窗口显示消息
        CON.prototype.pushMsg = function (msg) {
            var _this = this;
            var fromAccount = msg.from;
            var isSelfSend = msg.flow == 'out';//消息是否为自己发的
            var subType = msg.type;//消息类型
            var triangle, userhead;
            var onemsg = '';
            //群普通消息
            if (subType == 'text') {

                //查询消息成员的资料
                var memberInfo = this._getCurrentGroupMember(fromAccount);

                //如果自己发的消息
                if (isSelfSend) {
                    userhead = '<span class="user-head-icon">您</span>';
                    //小三角
                    triangle = '<img class="triangle" src="/images/imodules/ChatRoom/triangle.png">';

                    onemsg = '<div class="one-message self-msg">' + userhead +
                        '<div class="msgbody"><pre>' + msg.text + '</pre>' + triangle +
                        '</div></div>'
                }
                //不是自己发的消息
                else {
                    var msghead = '';

                    if (memberInfo) {
                        var src2 = memberInfo.avatar;
                        userhead = '<img class="user-head-icon" src="' + src2 + '"/>';
                        //如果是第一次发言,则更新工程商的列表信息
                        if (memberInfo.type == 0) {
                            //适当延迟,等待数据更新
                            setTimeout(function () {
                                _this._getCurrentGroup({
                                    succ: function () {
                                        console.log('更新参与的工程商信息成功')
                                    }
                                });
                            }, 2000);
                        }
                        if (memberInfo.company_name) {
                            msghead = '<div class="msgfrom-info">' + memberInfo.nick + '<span class="msgfrom-company">&nbsp;|&nbsp;' + memberInfo.company_name + '</span></div>'
                        } else {
                            msghead = '<div class="msgfrom-info">' + memberInfo.nick + '</div>'
                        }

                    } else if (!memberInfo && fromAccount != '3') {
                        userhead = '<img class="user-head-icon" head="' + fromAccount + '"/>';
                        msghead = '<div class="msgfrom-info" msghead="' + fromAccount + '"></div>';
                        //防止过快请求数据没有更新
                        setTimeout(function () {
                            _this._getCurrentGroup({
                                succ: function () {
                                    memberInfo = _this._getCurrentGroupMember(fromAccount);
                                    var src = memberInfo.avatar;
                                    $('.user-head-icon[head="' + fromAccount + '"]').attr('src', src);
                                    var innerhtml;
                                    if (memberInfo.company_name) {
                                        innerhtml = memberInfo.nick + '<span class="msgfrom-company">&nbsp;|&nbsp;' + memberInfo.company_name + '</span>';
                                    } else {
                                        innerhtml = memberInfo.nick;
                                    }
                                    $('.user-head-icon[msghead="' + fromAccount + '"]').html(innerhtml);

                                    console.log('更新参与的工程商信息成功');
                                }
                            });
                        }, 2000);
                    }

                    //小三角
                    triangle = '<img class="triangle" src="/images/imodules/ChatRoom/triangle2.png">';

                    onemsg = '<div class="one-message">' + msghead + userhead +
                        '<div class="msgbody"><pre>' + msg.text + '</pre>' + triangle +
                        '</div></div>'
                }
                //如果是万屏汇客服发的消息 , 默认头像
                if (fromAccount == '3') {
                    var src3 = '/images/imodules/ChatRoom/xiaohui.png';
                    userhead = '<img class="user-head-icon" src="' + src3 + '"/>';
                    //小角标
                    var vip = '<span class="icon-vip"></span>';
                    msghead = '<div class="msgfrom-info">客服代表</div>';

                    onemsg = '<div class="one-message">' + msghead + vip + userhead +
                        '<div class="msgbody"><pre>' + msg.text + '</pre>' + triangle +
                        '</div></div>'
                }


                //群提示消息
            } else if (subType == 'notification') {
                var sid = msg.from;
                onemsg = '<div class="one-message system-msg">' + sid + ' 加入群聊' + '</div>'
            }
            //如果是图片,去掉<pre>标签
            if (onemsg.indexOf('chat-img') > 0) {
                onemsg = onemsg.replace('<pre>', '').replace('</pre>', '');
            }

            return onemsg
        };
        //在别人的项目的聊天窗口显示消息
        CON.prototype.othersPushMsg = function (msg) {
            var _this = this;
            var fromAccount = msg.from;
            var isSelfSend = false;//消息是否为自己发的
            var subType = msg.type;//消息类型
            var triangle, userhead, msghead;
            var onemsg = '';
            //群普通消息
            if (subType == 'text') {

                //查询消息成员的资料
                var memberInfo = this._getTempGroupMember(fromAccount);

                //如果是发标的客户 ==>姓做头像
                if (fromAccount == _this.tempGroupClientInfo.user_id) {
                    var name = this.tempGroupClientInfo.nick;
                    var firName = name.substr(0, 1);
                    userhead = '<span class="user-head-icon">' + firName + '</span>';
                    //小三角
                    triangle = '<img class="triangle" src="/images/imodules/ChatRoom/triangle.png">';
                    msghead = '<div class="msgfrom-info">客户&nbsp;|&nbsp;' + name + '</div>';
                    onemsg = '<div class="one-message self-msg">' + msghead + userhead +
                        '<div class="msgbody"><pre>' + msg.text + '</pre>' + triangle +
                        '</div></div>'

                } else {
                    if (memberInfo) {
                        var src2 = memberInfo.avatar;
                        userhead = '<img class="user-head-icon" src="' + src2 + '"/>';

                        if (memberInfo.company_name) {
                            msghead = '<div class="msgfrom-info">' + memberInfo.nick + '<span class="msgfrom-company">&nbsp;|&nbsp;' + memberInfo.company_name + '</span></div>'
                        } else {
                            msghead = '<div class="msgfrom-info">' + memberInfo.nick + '</div>'
                        }

                    } else if (!memberInfo && fromAccount != '3') {
                        userhead = '<img class="user-head-icon" head="' + fromAccount + '"/>';
                        msghead = '<div class="msgfrom-info" msghead="' + fromAccount + '"></div>';
                        //防止过快请求数据没有更新
                        setTimeout(function () {
                            _this._getCurrentOthersGroup({
                                succ: function () {
                                    memberInfo = _this._getTempGroupMember(fromAccount);
                                    var src = memberInfo.avatar;
                                    $('.user-head-icon[head="' + fromAccount + '"]').attr('src', src);

                                    var innerhtml;
                                    if (memberInfo.company_name) {
                                        innerhtml = memberInfo.nick + '<span class="msgfrom-company">&nbsp;|&nbsp;' + memberInfo.company_name + '</span>';
                                    } else {
                                        innerhtml = memberInfo.nick;
                                    }
                                    $('.user-head-icon[msghead="' + fromAccount + '"]').html(innerhtml);

                                    console.log('更新参与的工程商信息成功')
                                }
                            });
                        }, 2000);
                    }
                    //小三角
                    triangle = '<img class="triangle" src="/images/imodules/ChatRoom/triangle2.png">';

                    onemsg = '<div class="one-message">' + msghead + userhead +
                        '<div class="msgbody"><pre>' + msg.text + '</pre>' + triangle +
                        '</div></div>'
                }


                //如果是万屏汇客服发的消息 , 默认头像
                if (fromAccount == '3') {
                    var src3 = '/images/imodules/ChatRoom/xiaohui.png';
                    userhead = '<img class="user-head-icon" src="' + src3 + '"/>';
                    //小角标
                    var vip = '<span class="icon-vip"></span>';
                    msghead = '<div class="msgfrom-info">客服代表</div>';

                    onemsg = '<div class="one-message">' + msghead + vip + userhead +
                        '<div class="msgbody"><pre>' + msg.text + '</pre>' + triangle +
                        '</div></div>'
                }


                //群提示消息
            } else if (subType == 'notification') {
                var sid = msg.from;
                onemsg = '<div class="one-message system-msg">' + sid + ' 加入群聊' + '</div>'
            }
            //如果是图片,去掉<pre>标签
            if (onemsg.indexOf('chat-img') > 0) {
                onemsg = onemsg.replace('<pre>', '').replace('</pre>', '');
            }

            return onemsg
        };
        //发送消息点击事件
        CON.prototype._ievent_sendMsg = function () {
            var _this = this;
            var text = $('#input').val();
            if (text.length > 0 && text.trim().length > 0) {
                $('#send').attr('disabled', 'disabled');
                webimConfigs.onSendMsg(text, {
                    succ: function (msg) {
                        console.log('发送成功');
                        _this.pushMsg(msg);
                        _this._clearInput();
                        //清空草稿
                        setCookie("tmpmsg_" + nim.currSess, '', 0);

                        if (project.data.isSelfOrder) {
                            _this._sendSmsToSupplier(msg)
                        }
                    },
                    fail: function (err) {

                    }
                });
            }
        };
        //标的客户, 切换聊天对象
        CON.prototype._ievent_clientChangeChat = function (data, obj) {
            var _this = this;
            if (!$(obj).hasClass('active')) {
                $('.group-list').find('.active').removeClass('active');
                $(obj).addClass('active');

                var to_id = '';

                to_id = $(obj).attr('gid');
                var supplier_id = $(obj).attr('id');
                //如果群存在
                if (to_id && to_id != 0) {
                    _this._saveDraft(to_id);
                    _this.switchSession(to_id);
                } else {
                    //如果不存在,重新请求一次数据,防止数据过老
                    _this._getCurrentGroup({
                        succ: function () {
                            supplier_id = $(obj).attr('id');
                            var sinfo = _this._getCurrentGroupMember(supplier_id);
                            to_id = sinfo.demand_customer_supplier_im_group_outer_id;
                            if (to_id) {
                                _this._saveDraft(to_id);
                                _this.switchSession(to_id);
                            } else {
                                //不存在就创建群
                                var option = {
                                    type: 'advanced',
                                    name: _this.demand_id + ':' + project.data.user.user_id,
                                    accounts: [window.nim.account + '', supplier_id + ''],
                                    joinMode: 'noVerify',
                                    beInviteMode: 'noVerify',
                                    inviteMode: 'all',
                                    updateTeamMode: 'all',
                                    updateCustomMode: 'all'
                                };
                                webimConfigs.createGroup(option, {
                                    succ: function (obj) {
                                        console.log(obj);
                                        var gid = obj.team.teamId;
                                        _this._saveDraft(gid);
                                        _this.switchSession(gid);
                                        //将teamid传到后端b44接口保存
                                        var data = {
                                            outer_id: gid,
                                            type: 103,
                                            val: _this.demand_id,
                                            sub_val: supplier_id
                                        };
                                        api_ajax_post("im/im02", data, {});
                                    },
                                    fail: function (err) {
                                        console.log('!!!!' + err)
                                    }
                                })
                            }
                        }
                    })
                }
            }

            if (!$('.edit-project').hasClass('hide')) {
                $('.edit-project').addClass('hide');
                $('.demand-info').removeClass('hide');
                $('.chat-pane').removeClass('hide');
                $('.input-pane').removeClass('hide');
            }
        };
        //获取当前标的群成员资料
        CON.prototype._getCurrentGroup = function (cb) {
            var _this = this;
            a_demand_req_suppliers(_this.demand_id, {
                succ: function (json) {
                    var gm = json.supplier_list;
                    var j = gm.length;
                    var online = [];
                    var offline = [];
                    for (var i = 0; i < j; i++) {
                        //给"在线"和"不在线"的工程商 排序
                        if (gm[i].imonline == '1') {
                            online.push(gm[i]);
                        } else {
                            offline.push(gm[i]);
                        }
                        //如果是当前登录的工程商,储存私聊群id
                        if (project.data.user.user_id == gm[i].user_id) {
                            _this.private_gid = gm[i].demand_customer_supplier_im_group_outer_id;
                        }
                        _this.privateGroupList.push(gm[i].demand_customer_supplier_im_group_outer_id);
                        var msgPool = webimConfigs.getPool();
                        $.each(msgPool, function (key, value) {
                            if (key == gm[i].demand_customer_supplier_im_group_outer_id) {
                                gm[i].unread = value.unread;
                                gm[i].lastMsg = value.lastMsg.text || '';
                            }
                        });
                    }
                    _this.groupMember = online.concat(offline);
                    project.data.joinedSupplierList = _this.groupMember;
                    //如果是发标的客户
                    if (project.data.user.user_id == _this.client_id) {
                        _this._setClientMember();
                    }

                    //接受回调
                    cb && cb.succ(json);
                }
            })
        };
        //标的客户 聊天界面展示
        CON.prototype._setClientMember = function () {
            var gm = this.groupMember;
            var did = this.group_id;
            var sid = this.service_gid;
            var gmHtml = '';
            for (var i = 0; i < gm.length; i++) {
                var member = {};
                if (gm[i].type == 0) {
                    continue
                }
                member.id = gm[i].user_id;
                member.gid = gm[i].demand_customer_supplier_im_group_outer_id;
                member.gimg = gm[i].avatar;
                member.gname = gm[i].nick;
                member.gfirname = gm[i].nick.substr(0, 1);
                member.gcompany = gm[i].company_name;
                member.lastMsg = gm[i].lastMsg || '';

                var mhtml, unread;
                if (member.unread > 0) {
                    unread = '<span class="unread-num">' + member.unread + '</span>'
                } else {
                    unread = '<span class="unread-num hide"></span>'
                }
                //如果有头像
                if (member.gimg) {
                    mhtml = '<div class="group-item" id="{{id}}" gid="{{gid}}" ievent="clientChangeChat">'
                        + '<img class="user-head" src="{{gimg}}">' +
                        unread +
                        '<div class="item-info">' +
                        '<h4><span class="s-nick" >{{gname}}</span>{{#gcompany}}<span class="s-company">&nbsp;|&nbsp;{{gcompany}}</span>{{/gcompany}}</h4>' +
                        '<span class="last-msg">' + member.lastMsg + '</span>' +
                        '</div>'
                        + '</div>';
                } else {
                    mhtml = '<div class="group-item" id="{{id}}" gid="{{gid}}" ievent="clientChangeChat">'
                        + '<span class="user-head hide">{{gfirname}}</span>' +
                        unread +
                        '<div class="item-info">' +
                        '<h4><span class="s-nick" >{{gname}}</span>{{#gcompany}}<span class="s-company">&nbsp;|&nbsp;{{gcompany}}</span>{{/gcompany}}</h4>' +
                        '<span class="last-msg">' + member.lastMsg + '</span>' +
                        '</div>'
                        + '</div>';
                }
                var currSess = nim.currSess;
                if (member.gid == currSess) {
                    mhtml = mhtml.replace('group-item', 'group-item active');
                }
                var mt = Mustache.render(mhtml, member);
                gmHtml += mt;
            }
            var gchat = $('.gchat');
            var vip = $('.vip');
            var msgPool = webimConfigs.getPool();
            $.each(msgPool, function (key, value) {
                if (key == did) {
                    if (value.unread > 0) {
                        gchat.find('.unread-num').removeClass('hide').html(value.unread);
                    }
                    gchat.find('.last-msg').html(value.lastMsg.text);
                }
                if (key == sid) {
                    if (value.unread > 0) {
                        vip.find('.unread-num').removeClass('hide').html(value.unread);
                    }
                    vip.find('.last-msg').html(value.lastMsg.text);
                }
            });

            gchat.attr('gid', did).find('.g-num').html(gm.length + 1);
            vip.attr('gid', sid);//====================待完善===================
            $('.joined-suppliers').html(gmHtml);
        };
        //获取当前标的群单个成员资料
        CON.prototype._getCurrentGroupMember = function (merberId) {
            var gm = this.groupMember;
            var j = gm.length;
            var mInfo = '';
            for (var i = 0; i < j; i++) {
                if (merberId == gm[i].user_id + "") {
                    mInfo = gm[i];
                    break;
                }
            }
            return mInfo
        };

        //获取当前会话的参与的工程商列表
        CON.prototype._getCurrentOthersGroup = function (cb) {
            var _this = this;
            a_demand_req_suppliers(_this.tempDemandId, {
                succ: function (json) {
                    _this.tempGroupInfo = json;
                    //接受回调
                    cb && cb.succ(json);
                }
            })
        };
        //获取当前会话的群成员资料
        CON.prototype._getTempGroupMember = function (merberId) {
            var gm = this.tempGroupInfo.supplier_list;
            var j = gm.length;
            var mInfo = '';
            for (var i = 0; i < j; i++) {
                if (merberId == gm[i].user_id + "") {
                    mInfo = gm[i];
                    break;
                }
            }
            return mInfo
        };
        //查看私聊群是否群在
        CON.prototype._hasPrivateGroup = function (pid) {
            var list = this.privateGroupList;
            var flag = false;
            if (list.length > 0) {
                for (var i = 0, j = list.length; i < j; i++) {
                    if (pid == list[i]) {
                        flag = true;
                    }
                }
            }
            return flag
        };
        //查看私聊群工程商是否在线
        CON.prototype._getPrivateGroupInfo = function (pid) {
            var list = this.groupMember;
            var privateGroupInfo;
            for (var i = 0, j = list.length; i < j; i++) {
                if (pid == list[i].demand_customer_supplier_im_group_outer_id) {
                    privateGroupInfo = list[i];
                }
            }
            return privateGroupInfo
        };
        //发送图片
        CON.prototype._ievent_sendImg = function (data, obj) {
            var _this = this;
            $('#imgFile').trigger('click');
        };
        ////清空输入框后发送按钮隐藏
        CON.prototype._clearInput = function () {
            $("#input").val('').css('height', '24px');
            $("#input").focus();
            this.send.addClass('hide').removeAttr('disabled');
            this.enclosure.removeClass('hide');
        };
        //如果客户在私聊群发消息,且工程商不在线,则发送短信
        CON.prototype._sendSmsToSupplier = function (msg) {
            var _this = this;
            if (msg.to) {
                if (msg.to != _this.group_id && msg.to != _this.service_gid) {
                    var groupInfo = _this._getPrivateGroupInfo(msg.to);
                    if (groupInfo.imonline == 0) {
                        //发送成功后,更新工程商列表
                        _this._getCurrentGroup({
                            succ: function () {
                                if (_this._getPrivateGroupInfo(msg.to).imonline == 0) {
                                    sendSmsToSupplier(_this.demand_id, groupInfo.user_id, {
                                        succ: function () {
                                            console.log('发送提示短信成功')
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            }
        };
        // 保存草稿
        CON.prototype._saveDraft = function (toSel) {

            //保存当前的消息输入框内容到草稿
            var msgtosend = $('#input').val();
            var msgLen = msgtosend.trim().length;
            if (msgLen > 0) {
                setCookie("tmpmsg_" + nim.currSess, msgtosend, 1);
            }

            //清空聊天界面
            $(".chat-pane").html('');

            //获取缓存的草稿内容
            var tmgmsgtosend = getCookie("tmpmsg_" + toSel);
            if (tmgmsgtosend) {
                $("#input").val(tmgmsgtosend);
            } else {
                this._clearInput();
            }
        };
        //清空输入框后发送按钮隐藏
        CON.prototype._clearInput = function () {
            $("#input").val('').css('height', '24px');
            $("#input").focus();
            this.send.addClass('hide').removeAttr('disabled');
            this.enclosure.removeClass('hide');
        };
        return CON;
    })();
    return Module;
});