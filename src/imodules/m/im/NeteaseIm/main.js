define(function (NIM) {
    var baseIModules = project.baseIModules;
    var Module = (function () {
        var CON = function (dom) {
            baseIModules.BaseIModule.call(this, dom);
            this.scrollPanel = $(this._els.scrollPanel);
            this.chatPane = $(this._els.chatPane);
            this.glist = $(this._els.glist);
            this.slist = $(this._els.slist);
            this.enclosure = $(this._els.enclosure);
            this.send = $(this._els.send);
            this.client_id = '';
            this.client_nick = '';
            this.demand_id = qs('demand_id') + "";
            this.group_id = '';
            this.groupMember = [];//当前群成员
            this._setOperation();


            var _this = this;
            //聊天界面
            var msgPane = $('.chat-pane');

            //输入框输入事件监听
            $('#input').on('input propertychange blur', function () {
                //聊天面板滚到底部
                msgPane[0].scrollTop = msgPane[0].scrollHeight;

                var v = $(this).val();
                if (v.length > 0 && v.trim().length > 0) {
                    _this.enclosure.addClass('hide');
                    _this.send.removeClass('hide');
                } else {
                    $(this).css('height', '26px');
                    _this.send.addClass('hide');
                    _this.enclosure.removeClass('hide');
                }
            });

            $(window).resize(function () {
                _this._setChatHeight();
                msgPane[0].scrollTop = msgPane[0].scrollHeight;
            });
            $('.edit-comment').click(function () {
                setTimeout(function () {
                    _this._setChatHeight();
                }, 700)
            });

            $('.input-pane').on('submit', function (e) {
                e.preventDefault();
                _this._ievent_sendMsg();
            });


            this.webim = {
                session: '',
                messages: {history: [], news: []},
                update: function (msgs) {
                    var html = '';
                    for (var i = 0, j = msgs.length; i < j; i++) {
                        html += _this.pushMsg(msgs[i]);
                    }
                    msgPane.append(html);

                    var last = msgs[msgs.length - 1];
                    // if (last) {
                    //     webimConfigs.setReaded(this.session, last.seq);
                    // }
                    var delayTime = 300;
                    //如果消息中没有图片,就加快显示速度
                    if (html.indexOf('chat-img') < 0) {
                        delayTime = 30;
                    }

                    //图片加载需要时间,延迟滚动
                    setTimeout(function () {
                        msgPane[0].scrollTop = msgPane[0].scrollHeight;
                    }, delayTime);


                },
                history: function (msgs) {
                    var html = '';
                    for (var i = 0; i < msgs.length; i++) {
                        html = _this.pushMsg(msgs[i]) + html;
                    }
                    if (project.data.isGuestIM) {
                        msgPane.append(html);
                    } else {
                        msgPane.prepend(html);
                    }

                    var last = msgs[msgs.length - 1];
                    // if (last) {
                    //     webimConfigs.setReaded(this.session, last.seq);
                    // }

                    //图片加载需要时间,延迟滚动
                    setTimeout(function () {
                        msgPane[0].scrollTop = msgPane[0].scrollHeight;
                    }, 500);

                    //游客只能主动刷新
                    if (project.data.user.guestid || project.data.user.user_type == 0) {
                        webimConfigs.setPullMsg(_this.webim.session);
                    }
                }
            };

            webimConfigs.addListener(this.webim);

            potato.application.addListener('IMSyncSuccess', function () {
                _this._init();

                if(project.data.isSelfOrder){
                    //客户监听群聊消息,以实时更新聊天群列表
                    _this.webim2 = {
                        session: _this.group_id,
                        messages: {history: [], news: []},
                        update: function (msgs) {
                            if(nim.currSess != _this.group_id){
                                for (var i = 0, j = msgs.length; i < j; i++) {
                                    var msg = msgs[i];
                                    var fromAccount = msg.from;
                                    var merberInfo = _this._getCurrentGroupMember(fromAccount);
                                    if(msg.type == 'notification'){
                                        return
                                    }
                                    //如果发消息的人不存在当前群里边(即 新参与的工程商)
                                    if(!merberInfo || merberInfo.type == 0){
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
                        history: function (){

                        }
                    };
                    webimConfigs.addListener(_this.webim2);

                    //客户监听私聊消息,以实时更新聊天群租列表
                    _this.webim3 = {
                        session: 'all',
                        messages: {history: [], news: []},
                        update: function (msgs) {
                            $.each(msgs, function (key, value) {
                                if(value.news && value.unread >0){
                                    //如果是私聊群的消息
                                    if (!_this._hasPrivateGroup(key)) {
                                        //重新取一遍参与的工程商列表信息(延时执行:防止后台接口数据更新延迟)
                                        setTimeout(function () {
                                            _this._getCurrentGroup();
                                        }, 2000);
                                    }
                                }
                            });
                        }
                    };
                    webimConfigs.addListener(_this.webim3);
                }
            });
        };
        potato.createClass(CON, baseIModules.BaseIModule);

        //切换聊天对象 更新设置
        CON.prototype.switchSession = function (sessionID) {
            var isLargeGroup = false;
            if (sessionID == project.data.demand.demand_im_group_outer_id) {
                isLargeGroup = true;
            }
            webimConfigs.setCurrSession(sessionID, isLargeGroup);
            this.webim.session = sessionID;
            this.webim.messages = {history: [], news: []};
        };
        //获取当前标的的信息
        CON.prototype._init = function () {
            var _this = this;
            //如果标的信息已经缓存
            if (!project.data.demand.succ) {
                a_demand_req_info(_this.demand_id, {
                    succ: function (json) {
                        project.data.demand = json;
                        cid = json.demand_info.client_id;
                        _this.client_id = cid;
                        _this.client_nick = json.demand_info.nick;
                        _this.group_id = json.demand_im_group_outer_id;
                        _this.service_gid = json.demand_customer_csad_im_group_outer_id;
                        webimConfigs.setLargeGroup(_this.group_id);

                        //决定显示那种群组界面
                        _this._displayArea();
                    },
                    fail: function () {
                        _this._displayArea();
                    }
                })
            } else {
                //决定显示那种群组界面
                _this.client_id = project.data.demand.demand_info.client_id;
                _this.client_nick = project.data.demand.demand_info.nick;
                _this.group_id = project.data.demand.demand_im_group_outer_id;
                _this.service_gid = project.data.demand.demand_customer_csad_im_group_outer_id;
                webimConfigs.setLargeGroup(_this.group_id);
                _this._displayArea();
            }
        };
        //判断用户身份,决定显示区域
        CON.prototype._displayArea = function () {
            var _this = this;
            var group_id = _this.group_id;
            var user = project.data.user;
            _this._getCurrentGroup({
                succ: function () {
                    //监听私聊消息
                    // webimConfigs.addListener(_this.webim3);
                }
            });
            //如果是当前标的的客户
            if (user.user_id == _this.client_id) {
                _this.glist.removeClass('hide');
                $('.input-pane').off('click').find('#input').removeAttr('disabled').attr('placeholder', '需求越清晰，获得的报价越准确哟！');

                _this._setChatHeight();
                //则看当前用户是否已加入群
                _this._setCurrSess(group_id);

            } else {
                _this.slist.removeClass('hide');
                _this._setChatHeight();

                //如果是工程商
                if (user.user_type == '100') {
                    //则看当前用户是否已加入群
                    _this._setCurrSess(group_id, true);

                    //如果是游客或者普通用户,直接拉取群消息
                } else {
                    _this.switchSession(group_id);
                }
            }
        };
        //加群/拉取消息/设置当前会话
        CON.prototype._setCurrSess = function (group_id, isSupplier) {
            var _this = this;
            //搜索群
            webimConfigs.getMyGroup({
                succ: function (teams) {
                    console.log(teams);
                    var hasJoined = false;
                    for (var i = 0; i < teams.length; i++) {
                        if (teams[i].teamId == group_id) {
                            hasJoined = true;
                            break;
                        }
                    }
                    //如果已经加群
                    if (hasJoined) {
                        _this.switchSession(group_id);
                    } else {
                        //加群
                        webimConfigs.applyJoinGroup(group_id, {
                            succ: function () {
                                _this.switchSession(group_id);
                                //如果是工程商进群了,则更新工程商的聊天状态
                                if (isSupplier) {
                                    var chatStatus = 0;//加群,还未聊天
                                    setSupplierChatStatus(_this.demand_id, chatStatus, {
                                        succ: function () {
                                            _this._getCurrentGroup();
                                            console.log('更新工程商聊天状态成功!')
                                        }
                                    });
                                }
                                console.log('******加群成功啦******');
                            },
                            fail: function (err) {
                                //加群失败
                                alert('加入群聊失败,请检查网络并刷新重试');
                            }
                        });
                    }

                },
                fail: function () {

                }
            })
        };
        //在聊天窗口显示消息
        CON.prototype.pushMsg = function (msg, isHistory) {
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
                    //如果自己发标客户
                    if (project.data.isSelfOrder) {
                        //如果没头像,用"姓"做头像
                        userhead = '<span class="user-head-icon">您</span>';
                    } else {
                        //如果自己是工程商
                        var src = project.data.user.avatar;
                        userhead = '<img class="user-head-icon" src="' + src + '"/>';

                        //如果自己是第一次发言,则更新工程商(自己)的聊天状态
                        if (memberInfo && memberInfo.type == 0) {
                            var chatStatus = 1;
                            setSupplierChatStatus(_this.demand_id, chatStatus, {
                                succ: function () {
                                    _this._getCurrentGroup({
                                        succ: function () {
                                            console.log('更新参与的工程商信息成功')
                                        }
                                    });
                                }
                            })
                        }
                    }

                    //小三角
                    triangle = '<img class="triangle" src="/images/imodules/ChatRoom/triangle.png">';

                    onemsg = '<div class="one-message self-msg">' + userhead +
                        '<div class="msgbody"><pre>' + msg.text + '</pre>' + triangle +
                        '</div></div>'
                }
                //不是自己发的消息
                else {
                    //如果是发标的客户 ==>姓做头像
                    if (fromAccount == this.client_id) {
                        var name = this.client_nick || $('.client-fname').find('span').text();
                        var firName = name.substr(0, 1);
                        userhead = '<span class="user-head-icon">' + firName + '</span>'

                    } else {

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
                        } else if (!memberInfo && fromAccount != '3') {
                            userhead = '<img class="user-head-icon" head="' + fromAccount + '"/>';
                            //防止过快请求数据没有更新
                            setTimeout(function () {
                                _this._getCurrentGroup({
                                    succ: function () {
                                        memberInfo = _this._getCurrentGroupMember(fromAccount);
                                        var src = memberInfo.avatar;
                                        $('.user-head-icon[head="' + fromAccount + '"]').attr('src', src);
                                        console.log('更新参与的工程商信息成功')
                                    }
                                });
                            }, 2000);
                        }

                    }
                    //小三角
                    triangle = '<img class="triangle" src="/images/imodules/ChatRoom/triangle2.png">';

                    onemsg = '<div class="one-message">' + userhead +
                        '<div class="msgbody"><pre>' + msg.text + '</pre>' + triangle +
                        '</div></div>'
                }
                //如果是万屏汇客服发的消息 , 默认头像
                if (fromAccount == '3') {
                    var src3 = '/images/imodules/ChatRoom/xiaohui.png';
                    userhead = '<img class="user-head-icon" src="' + src3 + '"/>';
                    //小角标
                    var vip = '<span class="icon-vip"></span>';

                    onemsg = '<div class="one-message">' + vip + userhead +
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
            // var msgPane = $('.chat-pane');
            // if(isHistory){
            //     msgPane.prepend(onemsg);
            // }else{
            //     msgPane.append(onemsg);
            // }
            // msgPane[0].scrollTop = msgPane[0].scrollHeight;
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

                        if(project.data.isSelfOrder){
                            _this._sendSmsToSupplier(msg)
                        }
                    },
                    fail: function (err) {

                    }
                });
            }
        };
        //工程商, 切换聊天对象
        CON.prototype._ievent_changeChatObj = function (data, obj) {

            //如果是游客或者普通用户,限制操作
            var userType = project.data.user.user_type;
            if (userType == '0' || userType == '1' && project.data.user.user_id != this.client_id) {
                $('.input-pane').trigger('click');
                return false;
            }

            var _this = this;
            if (!$(obj).hasClass('active')) {
                $(obj).addClass('active').siblings().removeClass('active');

                var to_id = '';
                //如果是公共洽谈区
                if ($(obj).hasClass('sup-gChat')) {
                    to_id = _this.group_id;
                    _this._saveDraft(to_id);
                    _this.switchSession(to_id);

                    //如果是与客户私聊
                } else if ($(obj).hasClass('sup-cChat')) {

                    //两人群id = 标的id + '#' + 当前工程商id
                    to_id = _this.private_gid;
                    //如果群存在
                    if (to_id) {
                        _this._saveDraft(to_id);
                        _this.switchSession(to_id);
                    } else {
                        //重新请求一次数据,防止数据过老
                        _this._getCurrentGroup({
                            succ: function () {
                                to_id = _this.private_gid;
                                if (to_id) {
                                    _this._saveDraft(to_id);
                                    _this.switchSession(to_id);
                                } else {
                                    //创建群
                                    var option = {
                                        type: 'advanced',
                                        name: _this.demand_id + ':' + project.data.user.user_id,
                                        accounts: [window.nim.account + '', _this.client_id + ''],
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
                                                sub_val: project.data.user.user_id
                                            };
                                            api_ajax_post("im/im02", data, {});
                                        },
                                        fail: function (err) {
                                            console.log('!!!!' + err)
                                        }
                                    })
                                }
                            }
                        });
                    }
                }
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
                        succ: function (json) {
                            var sid = $(obj).attr('id');
                            var sinfo = _this._getCurrentGroupMember(sid);
                            to_id = sinfo.demand_customer_supplier_im_group_outer_id;
                            if (to_id) {
                                _this._saveDraft(to_id);
                                _this.switchSession(to_id);
                            } else {
                                //不存在就创建群
                                var option = {
                                    type: 'advanced',
                                    name: _this.demand_id + ':' + project.data.user.user_id,
                                    accounts: [window.nim.account + '', $(obj).attr('id') + ''],
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
                    _this.privateGroupList = [];
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
                        _this.privateGroupList.push(gm[i].demand_customer_supplier_im_group_outer_id)
                    }
                    _this.groupMember = online.concat(offline);
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
                member.gname = gm[i].nick.substr(0, 1);

                var mhtml;
                //如果有头像
                if (member.gimg) {
                    mhtml = '<div class="group-item" id="{{id}}" gid="{{gid}}" ievent="clientChangeChat">'
                        + '<img class="user-head" src="{{gimg}}">'
                        + '</div>';
                } else {
                    mhtml = '<div class="group-item" id="{{id}}" gid="{{gid}}" ievent="clientChangeChat">'
                        + '<span class="user-head">{{gname}}</span>'
                        + '</div>';
                }
                var currSess = nim.currSess;
                if (member.gid == currSess) {
                    mhtml = mhtml.replace('group-item', 'group-item active');
                }
                var mt = Mustache.render(mhtml, member);
                gmHtml += mt;
            }
            $('.gchat').attr('gid', did);
            $('.vip').attr('gid', sid);//====================待完善===================
            $('.scroll-pane').html(gmHtml);
            this._setScrollPaneWidth();
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
        //查看私聊群是否群在
        CON.prototype._hasPrivateGroup = function (pid) {
            var list = this.privateGroupList;
            var flag = false;
            for (var i = 0, j = list.length; i < j; i++) {
                if (pid == list[i]) {
                    flag = true;
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
        ////清空输入框后发送按钮隐藏
        CON.prototype._clearInput = function () {
            $("#input").val('').css('height', '24px');
            $("#input").focus();
            this.send.addClass('hide').removeAttr('disabled');
            this.enclosure.removeClass('hide');
        };
        //重设聊天界面的高度
        CON.prototype._setChatHeight = function () {
            var phoneH = $(window).height();
            var grabH = $('.grab-detail').height();
            var inputH = $('.input-pane').height();
            var merberH = $('.chat-member').not('.hide').height();
            var aaa = phoneH - grabH - inputH - merberH - 35;
            $('.chat-pane').css('height', aaa + 'px');
        };
        //重设聊天界面的高度
        CON.prototype._setChatHeight = function () {
            var phoneH = $(window).height();
            var grabH = $('.grab-detail').height();
            var inputH = $('.input-pane').height();
            var merberH = $('.chat-member').not('.hide').height();
            var aaa = phoneH - grabH - inputH - merberH - 35;
            $('.chat-pane').css('height', aaa + 'px');
        };
        //判断用户身份,限定操作
        CON.prototype._setOperation = function () {
            var user = project.data.user;
            //游客或者普通用户
            if (user.user_type == '1' || user.user_type == '0') {
                this._limitOperation(user.user_type);
            } else if (user.user_type == '100' && !user.avatar) {
                this._limitOperation(user.user_type)
            }
        };
        //如果客户在私聊群发消息,且工程商不在线,则发送短信
        CON.prototype._sendSmsToSupplier = function (msg) {
            var _this = this;
            if(msg.to){
                if(msg.to != _this.group_id && msg.to != _this.service_gid){
                    var groupInfo = _this._getPrivateGroupInfo(msg.to);
                    if(groupInfo.imonline == 0){
                        //发送成功后,更新工程商列表
                        _this._getCurrentGroup({
                            succ: function () {
                                if(_this._getPrivateGroupInfo(msg.to).imonline == 0){
                                    sendSmsToSupplier(_this.demand_id,groupInfo.user_id,{
                                        succ:function () {
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
        //游客和普通用户,没有头像的工程商,限制操作,弹出相应弹窗
        CON.prototype._limitOperation = function (userType) {
            $('#input').attr('disabled', 'disabled');
            $('.input-pane').on('click', function () {

                var succ = function (imodule) {
                    project.open(imodule, '_blank', 'maxWidth');
                };
                if (userType == '0') {
                    //如果是游客,弹出登录框
                    project.getIModule('imodule://ClientLoginForm', null, succ);
                } else if (userType == '1') {
                    //如果是游客,弹出升级框
                    project.getIModule('imodule://UpgradeToSupplier', null, succ);
                } else if (userType == '100') {
                    //如果是工程商没头像,弹出上传头像
                    project.getIModule('imodule://AvatarUploader', {isFromChat: true}, succ);
                }
            });
        };
        //根据组成员数量设置 滑动区域的宽度;
        CON.prototype._setScrollPaneWidth = function () {
            var n = this.scrollPanel.find('.group-item').length;
            this.scrollPanel.css('width', 52 * n + 50 + 'px');
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