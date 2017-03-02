define(function () {
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
            this.demand_id = qs('demand_id') + "";//demand_id,也是群id
            this._setOperation();
            this.groupMember = [];//当前群成员

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
                    $(this).css('height', '24px');
                    _this.send.addClass('hide');
                    _this.enclosure.removeClass('hide');
                }
                // //输入区自动增高
                // var h = $(this).height();
                // $(this).css('max-height', '64px');
                // $(this).css('height', this.scrollHeight + 'px');
            });
            //图片选择事件
            $('#imgFile').on('change', function () {
                var uploadFiles = $(this)[0];
                var file = uploadFiles.files[0];
                //群发图片
                var businessType = webim.UPLOAD_PIC_BUSSINESS_TYPE.GROUP_MSG;

                //封装上传图片请求
                var opt = {
                    'file': file, //图片对象
                    'onProgressCallBack': '', //上传图片进度条回调函数
                    'From_Account': webimConfigs.loginInfo.identifier, //发送者帐号
                    'To_Account': _this.webim.session, //接收者
                    'businessType': businessType//业务类型
                };
                //上传图片
                webim.uploadPic(opt,
                    function (resp) {
                        //上传成功发送图片
                        webimConfigs.sendPic(resp);
                    },
                    function (err) {
                        alert(err.ErrorInfo);
                    }
                );
            });
            this.webim = {
                session: '',
                messages: {history: [], news: []},
                update: function (msgs) {

                    var html = '';
                    for (var i = 0; i < msgs.length; i++) {
                        html += _this.addMsg(msgs[i]);
                    }
                    msgPane.append(html);

                    var last = msgs[msgs.length - 1];
                    if (last) {
                        webimConfigs.setReaded(this.session, last.seq);
                    }
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
                        html += _this.addMsg(msgs[i]);
                    }
                    if (project.data.isGuestIM) {
                        msgPane.append(html);
                    } else {
                        msgPane.prepend(html);
                    }

                    var last = msgs[msgs.length - 1];
                    if (last) {
                        webimConfigs.setReaded(this.session, last.seq);
                    }

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
            //单独监听 群消息 ---》 主要为了监听新成员入群,从而实时更新群列表及资料
            this.webim2 = {
                session: this.demand_id,
                messages: {history: [], news: []},
                update: function (msgs) {
                    for (var i = 0; i < msgs.length; i++) {
                        //群普通消息 并且不是客服/发标客户自己 发的
                        if (msgs[i].subType == webim.GROUP_MSG_SUB_TYPE.COMMON && msgs[i].fromAccount != '3' && msgs[i].fromAccount != _this.client_id) {
                            var fromAccount = msgs[i].fromAccount;
                            var memberInfo = _this._getCurrentGroupMember(fromAccount);
                            //如果发消息的人不存在当前群里边(即 新参与的工程商)
                            if (!memberInfo) {
                                //重新取一遍参与的工程商列表信息(延时执行:防止后台接口数据更新延迟)
                                setTimeout(function () {
                                    _this._getCurrentGroup();
                                }, 2000);
                            }
                        }
                    }
                },
                history: function () {

                }
            };
            this.webim3 = {
                session: 'all',
                messages: "",
                update: function (msgs) {
                    $.each(msgs, function (key, value) {
                        //如果是私聊群的消息
                        if (key.indexOf(_this.demand_id + '#') == 0) {
                            var arr = key.split('#');
                            var isExist = _this._getCurrentGroupMember(arr[1]);
                            if (!isExist && arr[1] != '3') {
                                //重新取一遍参与的工程商列表信息(延时执行:防止后台接口数据更新延迟)
                                setTimeout(function () {
                                    _this._getCurrentGroup();
                                }, 2000);
                            }
                        }
                    });
                }
            };
            webimConfigs.addListener(this.webim);
            webimConfigs.addListener(this.webim2);

            $(window).resize(function () {
                _this._setChatHeight();
                msgPane[0].scrollTop = msgPane[0].scrollHeight;
            });
            $('.edit-comment').click(function () {
                setTimeout(function () {
                    _this._setChatHeight();
                }, 700)
            });

            //监听登录,登录后操作
            potato.application.addListener('IMLogined', function () {
                _this.init() + "";//发标客户id
            });
        };
        potato.createClass(CON, baseIModules.BaseIModule);

        //获取当前标的的客户id
        CON.prototype.init = function () {
            var _this = this;
            var cid = project.data.client_id;
            if (!cid) {
                a_demand_req_information(_this.demand_id, {
                    succ: function (json) {
                        cid = json.client_id;
                        _this.client_id = cid;
                        _this.client_nick = json.nick;
                        //决定显示那种群组界面
                        _this._displayArea();
                    },
                    fail: function () {
                        _this._displayArea();
                    }
                })
            } else {
                //决定显示那种群组界面
                _this.client_id = cid;
                _this._displayArea();
            }
        };
        //切换聊天对象 更新设置
        CON.prototype.switchSession = function (sessionID) {
            webimConfigs.changeSel(sessionID);
            webimConfigs.setSelToId(sessionID);
            this.webim.session = sessionID;
            this.webim.messages = {history: [], news: []};
        };
        //在聊天窗口显示消息
        CON.prototype.addMsg = function (msg) {
            var _this = this;
            var isSelfSend = msg.isSelfSend;//消息是否为自己发的
            var fromAccount = msg.fromAccount;
            var fromAccountNick = msg.fromAccountNick || fromAccount;
            var subType = msg.subType;//消息类型
            var triangle, userhead;
            var onemsg = '';
            //群普通消息
            if (subType == webim.GROUP_MSG_SUB_TYPE.COMMON) {

                //如果自己发的消息
                if (isSelfSend) {
                    //如果自己是当前发布招标的客户
                    if (project.data.isSelfOrder) {
                        //如果没头像,用"姓"做头像
                        userhead = '<span class="user-head-icon">您</span>'
                    } else {
                        //如果不是自己发的标
                        var src = project.data.user.avatar;
                        userhead = '<img class="user-head-icon" src="' + src + '"/>'
                    }

                    //小三角
                    triangle = '<img class="triangle" src="/images/imodules/ChatRoom/triangle.png">';

                    onemsg = '<div class="one-message self-msg">' + userhead +
                        '<div class="msgbody"><pre>' + msg.content + '</pre>' + triangle +
                        '</div></div>'
                }
                //不是自己发的消息
                else {
                    //查询消息成员的资料
                    var memberInfo = this._getCurrentGroupMember(fromAccount);

                    //如果是发标的客户 ==>姓做头像
                    if (fromAccount == this.client_id) {
                        var name = this.client_nick || $('.client-fname').find('span').text();
                        var firName = name.substr(0, 1);
                        userhead = '<span class="user-head-icon">' + firName + '</span>'

                    } else {
                        if (memberInfo) {
                            var src2 = memberInfo.avatar;
                            userhead = '<img class="user-head-icon" src="' + src2 + '"/>'
                        }
                        //如果当前消息发送人是新入群的, (只管用户消息)
                        if (!memberInfo && msg.subType == webim.GROUP_MSG_SUB_TYPE.COMMON && fromAccount != '3') {
                            userhead = '<img class="user-head-icon" head="' + fromAccount + '"/>';
                            this._getCurrentGroup({
                                succ: function () {
                                    memberInfo = _this._getCurrentGroupMember(fromAccount);
                                    var src = memberInfo.avatar;
                                    $('.user-head-icon[head="' + fromAccount + '"]').attr('src', src);
                                }
                            });
                        }
                    }
                    //小三角
                    triangle = '<img class="triangle" src="/images/imodules/ChatRoom/triangle2.png">';

                    onemsg = '<div class="one-message">' + userhead +
                        '<div class="msgbody"><pre>' + msg.content + '</pre>' + triangle +
                        '</div></div>'
                }
                //如果是万屏汇客服发的消息 , 默认头像
                if (fromAccount == '3') {
                    var src3 = '/images/imodules/ChatRoom/xiaohui.png';
                    userhead = '<img class="user-head-icon" src="' + src3 + '"/>';
                    //小角标
                    var vip = '<span class="icon-vip"></span>';

                    onemsg = '<div class="one-message">' + vip + userhead +
                        '<div class="msgbody"><pre>' + msg.content + '</pre>' + triangle +
                        '</div></div>'
                }


                //群提示消息
            } else if (subType == webim.GROUP_MSG_SUB_TYPE.TIP) {
                var arr = msg.content.split('，');
                onemsg = '<div class="one-message system-msg">' + arr[0] + '</div>'
            }
            //如果是图片,去掉<pre>标签
            if (onemsg.indexOf('chat-img') > 0) {
                onemsg = onemsg.replace('<pre>', '').replace('</pre>', '');
            }

            return onemsg;

        };
        //判断用户身份,决定显示区域
        CON.prototype._displayArea = function () {
            var _this = this;
            var demand_id = _this.demand_id;
            var user = project.data.user;
            _this._getCurrentGroup({
                succ: function () {
                    //监听私聊消息
                    webimConfigs.addListener(_this.webim3);
                }
            });
            //如果是当前标的的客户
            if (user.user_id == _this.client_id) {
                _this.glist.removeClass('hide');
                $('.input-pane').off('click').find('#input').removeAttr('disabled').attr('placeholder', '需求越清晰，获得的报价越准确哟！');

                _this._setChatHeight();
                //则看当前用户是否已加入群
                _this.joinGroup(demand_id);

            } else {
                _this.slist.removeClass('hide');
                _this._setChatHeight();

                //如果是工程商
                if (user.user_type == '100') {
                    //则看当前用户是否已加入群
                    _this.joinGroup(demand_id);

                    //如果是游客或者普通用户,直接拉取群消息
                } else {
                    _this.switchSession(demand_id);
                }
            }
        };
        //加入群
        CON.prototype.joinGroup = function (groupId) {
            var _this = this;
            webimConfigs.getMyGroup({
                succ: function (data) {
                    var hasJoined;
                    if (data.length > 0) {
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].GroupId == groupId) {
                                hasJoined = true;
                                //存储当前标的群资料
                                break;
                            }
                        }
                        //如果已经加入了群,则拉取群消息
                        if (hasJoined) {
                            _this.switchSession(groupId);
                        } else {
                            //没有,则加入群
                            webimConfigs.applyJoinGroup(groupId, {
                                succ: function (res) {
                                    _this.switchSession(groupId);
                                    console.log("我加群啦啦啦啦啦啦" + res)
                                },
                                //加群失败,默认群不存在
                                fail: function (err) {
                                    console.log("加群失败,为什么呢?" + err);
                                    //不存在就创建群
                                    var option = {
                                        'GroupId': groupId,
                                        'Owner_Account': webimConfigs.loginInfo.identifier,
                                        'Type': 'Public', //Private/Public/ChatRoom/AVChatRoom
                                        'Name': groupId,
                                        'FaceUrl': '',
                                        'Notification': '',
                                        'Introduction': '',
                                        'MemberList': [_this.client_id, webimConfigs.loginInfo.identifier, '1', '3']
                                    };
                                    webimConfigs.createGroup(option, {
                                        succ: function (resp) {
                                            _this.switchSession(groupId);
                                            console.log("创建群成功!" + resp);
                                            //创建群的人是发标人
                                            if (project.data.user.user_id == _this.client_id) {
                                                _this.glist.removeClass('hide');
                                                $('.input-pane').removeAttr('disabled').off('click').find('#input').removeAttr('disabled').attr('placeholder', '需求越清晰，获得的报价越准确哟！');

                                            }
                                        }
                                    })
                                }
                            });
                        }
                    } else {
                        //还没有加入任何群
                        webimConfigs.applyJoinGroup(groupId, {
                            succ: function (res) {
                                _this.switchSession(groupId);
                                console.log("我加群啦啦啦啦啦啦" + res)
                            }
                        });
                    }
                }
            })
        };
        //发送消息点击事件
        CON.prototype._ievent_sendMsg = function (data, obj) {
            var _this = this;
            var text = $('#input').val();
            if (text.length > 0 && text.trim().length > 0) {
                $('#sendMsg').attr('disabled', 'disabled');

                var msg = webimConfigs.onSendMsg(text);
                var msgPane = $('.chat-pane');
                //发送消息
                webim.sendMsg(msg, function (resp) {
                    webim.Tool.setCookie("tmpmsg_" + _this.webim.session, '', 0);

                    _this._clearInput();
                    var msgObj = {
                        content: webimConfigs.convertMsgtoHtml(msg),
                        subType: msg.getSubType(),
                        fromAccount: msg.getFromAccount(),
                        fromAccountNick: msg.getFromAccountNick(),
                        isSelfSend: msg.getIsSend(),
                        seq: msg.getSeq()
                    };
                    _this.webim.messages.news.push(msgObj);
                    var html = _this.addMsg(msgObj);
                    msgPane.append(html);
                    msgPane[0].scrollTop = msgPane[0].scrollHeight;

                }, function (err) {
                    console.log(err.ErrorInfo);
                    alert('发送消息失败,请重试...');
                    $('#sendMsg').removeAttr('disabled');
                });
            }
            return false
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
                    to_id = this.demand_id;

                    _this.switchSession(to_id);

                    //如果是与客户私聊
                } else if ($(obj).hasClass('sup-cChat')) {

                    //两人群id = 标的id + '#' + 当前工程商id
                    to_id = this.demand_id + "#" + project.data.user.user_id;
                    webimConfigs.searchGroup(to_id, {
                        succ: function (data) {
                            //如果群存在
                            if (data.length > 0) {
                                _this.switchSession(to_id);
                            } else {
                                //不存在就创建群
                                var option = {
                                    'GroupId': to_id,
                                    'Owner_Account': webimConfigs.loginInfo.identifier,
                                    'Type': 'Public', //Private/Public/ChatRoom/AVChatRoom
                                    'Name': to_id,
                                    'FaceUrl': webimConfigs.loginInfo.headurl,
                                    'Notification': '',
                                    'Introduction': '',
                                    'MemberList': [_this.client_id, webimConfigs.loginInfo.identifier]
                                };
                                webimConfigs.createGroup(option, {
                                    succ: function (resp) {
                                        _this.switchSession(to_id);
                                        console.log("创建群成功!" + resp)
                                    }
                                })
                            }
                        }
                    });

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
                webimConfigs.searchGroup(to_id, {
                    succ: function (data) {
                        //如果群存在
                        if (data.length > 0) {
                            _this.switchSession(to_id);
                        } else {
                            //不存在就创建群
                            var groupHead = $(obj).find('img').attr('src');
                            var option = {
                                'GroupId': to_id,
                                'Owner_Account': webimConfigs.loginInfo.identifier,
                                'Type': 'Public', //Private/Public/ChatRoom/AVChatRoom
                                'Name': to_id,
                                'FaceUrl': groupHead,
                                'Notification': '',
                                'Introduction': '',
                                'MemberList': [_this.client_id, webimConfigs.loginInfo.identifier]
                            };
                            webimConfigs.createGroup(option, {
                                succ: function (resp) {
                                    _this.switchSession(to_id);
                                    console.log("创建群成功!" + resp)
                                }
                            })
                        }
                    }
                });
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
                        //给"在线"和"不在线"的工程商 排序(排除发标的用户)
                        if (gm[i].user_id != _this.client_id) {
                            if (gm[i].imonline == '1') {
                                online.push(gm[i]);
                            } else {
                                offline.push(gm[i]);
                            }
                        }
                    }
                    _this.groupMember = online.concat(offline);
                    //如果是发标的客户
                    if (project.data.user.user_id == _this.client_id) {
                        _this._setClientMember();
                    }
                    //接受回调
                    cb && cb.succ();
                }
            })
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
        //重设聊天界面的高度
        CON.prototype._setChatHeight = function () {
            var phoneH = $(window).height();
            var grabH = $('.grab-detail').height();
            var inputH = $('.input-pane').height();
            var merberH = $('.chat-member').not('.hide').height();
            var aaa = phoneH - grabH - inputH - merberH - 35;
            $('.chat-pane').css('height', aaa + 'px');
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
                    project.getIModule('imodule://AvatarConsummatePopup', null, succ);
                }
            });
        };
        //标的客户 聊天界面展示
        CON.prototype._setClientMember = function () {
            var gm = this.groupMember;
            var did = this.demand_id;
            var cid = this.client_id;
            var wph = '3';//万屏客服id
            var gmHtml = '';
            for (var i = 0; i < gm.length; i++) {
                var member = {};
                member.gid = did + '#' + gm[i].user_id;
                member.gimg = gm[i].avatar;
                member.gname = gm[i].nick.substr(0, 1);

                var mhtml;
                //如果有头像
                if (member.gimg) {
                    mhtml = '<div class="group-item" gid="{{gid}}" ievent="clientChangeChat">'
                        + '<img class="user-head" src="{{gimg}}">'
                        + '</div>';
                } else {
                    mhtml = '<div class="group-item" gid="{{gid}}" ievent="clientChangeChat">'
                        + '<span class="user-head">{{gname}}</span>'
                        + '</div>';
                }
                var currSess = this.webim.session;
                if (member.gid == currSess) {
                    mhtml = mhtml.replace('group-item', 'group-item active');
                }
                var mt = Mustache.render(mhtml, member);
                gmHtml += mt;
            }
            $('.gchat').attr('gid', did);
            $('.vip').attr('gid', did + '#3');
            $('.scroll-pane').html(gmHtml);
            this._setScrollPaneWidth();
        };
        //根据组成员数量设置 滑动区域的宽度;
        CON.prototype._setScrollPaneWidth = function () {
            var n = this.scrollPanel.find('.group-item').length;
            this.scrollPanel.css('width', 52 * n + 50 + 'px');
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
        CON.prototype._ievent_sendImg = function (data, obj) {
            var _this = this;
            $('#imgFile').trigger('click');
        };
        //点击查看大图
        CON.prototype._ievent_scanBig = function (data, obj) {
            var src = $(obj).attr('src');
            var width = $(obj).width();
            var height = $(obj).height();
            var rate = width / height;//宽高比
            var hh = $(window).width();//大图的宽 == 屏幕宽度
            var bgh = hh / rate / 2;  // 计算出大图的高度 de 一半

            //dom插入
            var bigImg = '<div class="bigImgBg" onclick="closeBigImg(this)"><img class="bigImg" src="' + src + '"/></div>';
            $('body').append(bigImg);

            //让图片垂直居中
            $('.bigImg').css('margin-top', -bgh + 'px');
        };
        ////清空输入框后发送按钮隐藏
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

//关闭大图
function closeBigImg(obj) {
    $(obj).remove();
}