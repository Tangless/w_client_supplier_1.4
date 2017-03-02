/**
 * Created by jacques on 16/11/11.
 */
var webimConfigs = (function () {
    var allMessages = {};
    //当前用户身份
    var webimAccount = {
        sdkAppID: 1400018527,
        accountType: 8592
    };
    var href = window.location.href;
    //如果是正式环境
    if(href.indexOf('wanpinghui.com') > 0){
        webimAccount = {
            sdkAppID: 1400018308,
            accountType: 8591
        };
    }
    var loginInfo = {
        'sdkAppID': webimAccount.sdkAppID, //用户所属应用id,必填
        'accountType': webimAccount.accountType, //用户所属应用帐号类型，必填
        'identifier': '', //当前用户ID,必须是否字符串类型，必填
        'identifierNick': '小明', //当前用户昵称，选填
        'userSig': '', //当前用户身份凭证，必须是字符串类型，必填
        'headurl': ''//当前用户默认头像，选填
    };

    var options = {
        'isLogOn': false//是否开启控制台打印日志,默认开启，选填
    }

    //全局变量设置
    var friendHeadUrl = ''; //默认好友头像
    var selType = webim.SESSION_TYPE.GROUP;//当前聊天类型
    var selToID = '';//当前选中聊天id（当聊天类型为私聊时，该值为好友帐号，否则为群号）
    var selSess = '';//当前聊天会话对象

    //监听事件
    var listeners = {
        "onConnNotify": onConnNotify,//监听连接状态回调变化事件,必填
        "onMsgNotify": onMsgNotify,//监听新消息(私聊，普通群(非直播聊天室)消息，全员推送消息)事件，必填
        // "onBigGroupMsgNotify": onBigGroupMsgNotify,//监听新消息(直播聊天室)事件，直播场景下必填
        // "onGroupSystemNotifys": onGroupSystemNotifys,//监听（多终端同步）群系统消息事件，如果不需要监听，可不填
        // "onGroupInfoChangeNotify": onGroupInfoChangeNotify,//监听群资料变化事件，选填
        // "onFriendSystemNotifys": onFriendSystemNotifys,//监听好友系统通知事件，选填
        // "onProfileSystemNotifys": onProfileSystemNotifys//监听资料系统（自己或好友）通知事件，选填
        // "jsonpCallback": jsonpCallback,//IE9(含)以下浏览器用到的jsonp回调函数，
    };
    function setSelToId(id) {
        selToID = id;
        selSess = '';
    }
    //监听连接状态回调变化事件
    function onConnNotify(resp) {
        var info;
        switch (resp.ErrorCode) {
            case webim.CONNECTION_STATUS.ON:
                webim.Log.warn('建立连接成功: ' + resp.ErrorInfo);
                break;
            case webim.CONNECTION_STATUS.OFF:
                info = '连接已断开，无法收到新消息，请检查下你的网络是否正常: ' + resp.ErrorInfo;
                webim.Log.warn(info);
                break;
            case webim.CONNECTION_STATUS.RECONNECT:
                info = '连接状态恢复正常: ' + resp.ErrorInfo;
                webim.Log.warn(info);
                break;
            default:
                webim.Log.error('未知连接状态: =' + resp.ErrorInfo);
                break;
        }
    }

    //发送消息(文本或者表情)
    function onSendMsg(msgText) {

        if (!selToID) {
            alert("你还没有选中好友或者群组，暂不能聊天");
            clearInput();
            return;
        }
        //获取消息内容
        var msgtosend = msgText;
        var msgLen = webim.Tool.getStrBytes(msgtosend);

        if (msgtosend.length < 1) {
            alert("发送的消息不能为空!");
            clearInput();
            return;
        }
        var maxLen, errInfo;
        //群聊消息长度限制
        maxLen = webim.MSG_MAX_LENGTH.GROUP;
        errInfo = "消息长度超出限制(最多" + Math.round(maxLen / 3) + "汉字)";
        if (msgLen > maxLen) {
            alert(errInfo);
            return;
        }
        if (!selSess) {
            selSess = new webim.Session(selType, selToID, selToID, friendHeadUrl, Math.round(new Date().getTime() / 1000));
        }
        var isSend = true;//是否为自己发送
        var seq = -1;//消息序列，-1表示sdk自动生成，用于去重
        var random = Math.round(Math.random() * 4294967296);//消息随机数，用于去重
        var msgTime = Math.round(new Date().getTime() / 1000);//消息时间戳
        var subType;//消息子类型
        subType = webim.GROUP_MSG_SUB_TYPE.COMMON;
        
        var msg = new webim.Msg(selSess, isSend, seq, random, msgTime, loginInfo.identifier, subType, loginInfo.identifierNick);

        var text_obj, face_obj, tmsg, emotionIndex, emotion, restMsgIndex;
        //解析文本和表情
        var expr = /\[[^[\]]{1,3}\]/mg;
        var emotions = msgtosend.match(expr);
        if (!emotions || emotions.length < 1) {
            text_obj = new webim.Msg.Elem.Text(msgtosend);
            msg.addText(text_obj);
        } else {

            for (var i = 0; i < emotions.length; i++) {
                tmsg = msgtosend.substring(0, msgtosend.indexOf(emotions[i]));
                if (tmsg) {
                    text_obj = new webim.Msg.Elem.Text(tmsg);
                    msg.addText(text_obj);
                }
                emotionIndex = webim.EmotionDataIndexs[emotions[i]];
                emotion = webim.Emotions[emotionIndex];

                if (emotion) {
                    face_obj = new webim.Msg.Elem.Face(emotionIndex, emotions[i]);
                    msg.addFace(face_obj);
                } else {
                    text_obj = new webim.Msg.Elem.Text(emotions[i]);
                    msg.addText(text_obj);
                }
                restMsgIndex = msgtosend.indexOf(emotions[i]) + emotions[i].length;
                msgtosend = msgtosend.substring(restMsgIndex);
            }
            if (msgtosend) {
                text_obj = new webim.Msg.Elem.Text(msgtosend);
                msg.addText(text_obj);
            }
        }
        return msg
    }
    //发送图片消息
    function sendPic(images) {
        if (!selToID) {
            alert("您还没有好友，暂不能聊天");
            return;
        }

        if (!selSess) {
            selSess = new webim.Session(selType, selToID, selToID, friendHeadUrl, Math.round(new Date().getTime() / 1000));
        }
        var msg = new webim.Msg(selSess, true,-1,-1,-1,loginInfo.identifier,0,loginInfo.identifierNick);
        var images_obj = new webim.Msg.Elem.Images(images.File_UUID);
        for (var i in images.URL_INFO) {
            var img = images.URL_INFO[i];
            var newImg;
            var type;
            switch (img.PIC_TYPE) {
                case 1://原图
                    type = 1;//原图
                    break;
                case 2://小图（缩略图）
                    type = 3;//小图
                    break;
                case 4://大图
                    type = 2;//大图
                    break;
            }
            newImg = new webim.Msg.Elem.Images.Image(type, img.PIC_Size, img.PIC_Width, img.PIC_Height, img.DownUrl);
            images_obj.addImage(newImg);
        }
        msg.addImage(images_obj);
        //调用发送图片消息接口
        webim.sendMsg(msg, function (resp) {
            
        }, function (err) {
            alert(err.ErrorInfo);
        });
    }
    function clearInput() {
        $("#input").val('').css('height','24px');
        $("#input").focus();
        $('#sendMsg').addClass('hide').removeAttr('disabled');
        $('.enclosure').removeClass('hide');
    }
    //把消息转换成Html
    function convertMsgtoHtml(msg) {
        var html = "", elems, elem, type, content;
        elems = msg.getElems();//获取消息包含的元素数组
        for (var i = 0, k = elems.length; i < k; i++) {
            elem = elems[i];
            type = elem.getType();//获取元素类型
            content = elem.getContent();//获取元素对象
            switch (type) {
                case webim.MSG_ELEMENT_TYPE.TEXT:
                    html += convertTextMsgToHtml(content);
                    break;
                case webim.MSG_ELEMENT_TYPE.FACE:
                    html += convertFaceMsgToHtml(content);
                    break;
                case webim.MSG_ELEMENT_TYPE.IMAGE:
                    html += convertImageMsgToHtml(content);
                    break;
                case webim.MSG_ELEMENT_TYPE.GROUP_TIP:
                    html += convertGroupTipMsgToHtml(content);
                    break;
                default:
                    webim.Log.error('未知消息元素类型: elemType=' + type);
                    break;
            }
        }
        return html;
    }

    //解析文本消息元素
    function convertTextMsgToHtml(content) {
        return content.getText();
    }

    //解析表情消息元素
    function convertFaceMsgToHtml(content) {
        var index = content.getIndex();
        var data = content.getData();
        var faceUrl = null;
        var emotion = webim.Emotions[index];
        if (emotion && emotion[1]) {
            faceUrl = emotion[1];
        }
        if (faceUrl) {
            return "<img src='" + index + "'/>";
        } else {
            return data;
        }
    }

    //解析图片消息元素
    function convertImageMsgToHtml(content) {
        var smallImage = content.getImage(webim.IMAGE_TYPE.SMALL);//小图
        var bigImage = content.getImage(webim.IMAGE_TYPE.LARGE);//大图
        var oriImage = content.getImage(webim.IMAGE_TYPE.ORIGIN);//原图
        if (!bigImage) {
            bigImage = smallImage;
        }
        if (!oriImage) {
            oriImage = smallImage;
        }
        return "<img class='chat-img' src='" + smallImage.getUrl() + "#" + bigImage.getUrl() + "#" + oriImage.getUrl() + "' ievent='scanBig' />";
    }

    //解析群提示消息元素
    function convertGroupTipMsgToHtml(content) {
        var WEB_IM_GROUP_TIP_MAX_USER_COUNT = 10;
        var text = "";
        var maxIndex = WEB_IM_GROUP_TIP_MAX_USER_COUNT - 1;
        var opType, opUserId, userIdList;
        var groupMemberNum;
        opType = content.getOpType();//群提示消息类型（操作类型）
        opUserId = content.getOpUserId();//操作人id
        switch (opType) {
            case webim.GROUP_TIP_TYPE.JOIN://加入群
                userIdList = content.getUserIdList();
                //text += opUserId + "邀请了";
                for (var m=0; m<userIdList.length; m++) {
                    text += userIdList[m] + ",";
                    if (userIdList.length > WEB_IM_GROUP_TIP_MAX_USER_COUNT && m == maxIndex) {
                        text += "等" + userIdList.length + "人";
                        break;
                    }
                }
                text = text.substring(0, text.length - 1);
                text += "加入该群，当前群成员数：" + content.getGroupMemberNum();
                break;
            case webim.GROUP_TIP_TYPE.QUIT://退出群
                text += opUserId + "离开该群，当前群成员数：" + content.getGroupMemberNum();
                break;
            case webim.GROUP_TIP_TYPE.KICK://踢出群
                text += opUserId + "将";
                userIdList = content.getUserIdList();
                for (var m=0; m<userIdList.length; m++) {
                    text += userIdList[m] + ",";
                    if (userIdList.length > WEB_IM_GROUP_TIP_MAX_USER_COUNT && m == maxIndex) {
                        text += "等" + userIdList.length + "人";
                        break;
                    }
                }
                text += "踢出该群";
                break;
            case webim.GROUP_TIP_TYPE.SET_ADMIN://设置管理员
                text += opUserId + "将";
                userIdList = content.getUserIdList();
                for (var m=0; m<userIdList.length; m++) {
                    text += userIdList[m] + ",";
                    if (userIdList.length > WEB_IM_GROUP_TIP_MAX_USER_COUNT && m == maxIndex) {
                        text += "等" + userIdList.length + "人";
                        break;
                    }
                }
                text += "设为管理员";
                break;
            case webim.GROUP_TIP_TYPE.CANCEL_ADMIN://取消管理员
                text += opUserId + "取消";
                userIdList = content.getUserIdList();
                for (var m=0; m<userIdList.length; m++) {
                    text += userIdList[m] + ",";
                    if (userIdList.length > WEB_IM_GROUP_TIP_MAX_USER_COUNT && m == maxIndex) {
                        text += "等" + userIdList.length + "人";
                        break;
                    }
                }
                text += "的管理员资格";
                break;

            case webim.GROUP_TIP_TYPE.MODIFY_GROUP_INFO://群资料变更
                text += opUserId + "修改了群资料：";
                var groupInfoList = content.getGroupInfoList();
                var type, value;
                for (var m=0; m<groupInfoList.length; m++) {
                    type = groupInfoList[m].getType();
                    value = groupInfoList[m].getValue();
                    switch (type) {
                        case webim.GROUP_TIP_MODIFY_GROUP_INFO_TYPE.FACE_URL:
                            text += "群头像为" + value + "; ";
                            break;
                        case webim.GROUP_TIP_MODIFY_GROUP_INFO_TYPE.NAME:
                            text += "群名称为" + value + "; ";
                            break;
                        case webim.GROUP_TIP_MODIFY_GROUP_INFO_TYPE.OWNER:
                            text += "群主为" + value + "; ";
                            break;
                        case webim.GROUP_TIP_MODIFY_GROUP_INFO_TYPE.NOTIFICATION:
                            text += "群公告为" + value + "; ";
                            break;
                        case webim.GROUP_TIP_MODIFY_GROUP_INFO_TYPE.INTRODUCTION:
                            text += "群简介为" + value + "; ";
                            break;
                        default:
                            text += "未知信息为:type=" + type + ",value=" + value + "; ";
                            break;
                    }
                }
                break;

            case webim.GROUP_TIP_TYPE.MODIFY_MEMBER_INFO://群成员资料变更(禁言时间)
                text += opUserId + "修改了群成员资料:";
                var memberInfoList = content.getMemberInfoList();
                var userId, shutupTime;
                for (var m=0; m<memberInfoList.length; m++) {
                    userId = memberInfoList[m].getUserId();
                    shutupTime = memberInfoList[m].getShutupTime();
                    text += userId + ": ";
                    if (shutupTime != null && shutupTime !== undefined) {
                        if (shutupTime == 0) {
                            text += "取消禁言; ";
                        } else {
                            text += "禁言" + shutupTime + "秒; ";
                        }
                    } else {
                        text += " shutupTime为空";
                    }
                    if (memberInfoList.length > WEB_IM_GROUP_TIP_MAX_USER_COUNT && m == maxIndex) {
                        text += "等" + memberInfoList.length + "人";
                        break;
                    }
                }
                break;
            default:
                text += "未知群提示消息类型：type=" + opType;
                break;
        }
        return text;
    }

    //监听（多终端同步）群系统消息方法
    // var onGroupSystemNotifys={
    //     "1": onApplyJoinGroupRequestNotify,//申请加群请求（只有管理员会收到）
    //     "2": onApplyJoinGroupAcceptNotify,//申请加群被同意（只有申请人能够收到）
    //     "3": onApplyJoinGroupRefuseNotify,//申请加群被拒绝（只有申请人能够收到）
    //     "4": onKickedGroupNotify,//被管理员踢出群(只有被踢者接收到)
    //     "5": onDestoryGroupNotify,//群被解散(全员接收)
    //     "6": onCreateGroupNotify,//创建群(创建者接收)
    //     "7": onInvitedJoinGroupNotify,//邀请加群(被邀请者接收)
    //     "8": onQuitGroupNotify,//主动退群(主动退出者接收)
    //     "9": onSetedGroupAdminNotify,//设置管理员(被设置者接收)
    //     "10": onCanceledGroupAdminNotify,//取消管理员(被取消者接收)
    //     "11": onRevokeGroupNotify,//群已被回收(全员接收)
    //     "255": onCustomGroupNotify//用户自定义通知(默认全员接收)
    // };

    //切换好友或群组聊天对象
    function changeSelTo(to_id) {
        if (selToID != null && selToID != to_id) {

            //设置之前会话的已读消息标记
            webim.setAutoRead(selSess, false, false);

            //保存当前的消息输入框内容到草稿
            //获取消息内容
            var msgtosend = document.getElementById("input").value;
            var msgLen = webim.Tool.getStrBytes(msgtosend);
            if (msgLen > 0) {
                webim.Tool.setCookie("tmpmsg_" + selToID, msgtosend, 3600);
            }
            selToID = to_id;
            //清空聊天界面
            document.getElementsByClassName("chat-pane")[0].innerHTML = "";

            var tmgmsgtosend = webim.Tool.getCookie("tmpmsg_" + selToID);
            if (tmgmsgtosend) {
                $("#input").val(tmgmsgtosend);
            } else {
                clearInput();
            }
            // //获取历史消息
            // webim.MsgStore.delSessByTypeId(selType, selToID);
            // getLastGroupHistoryMsgs(getHistoryMsgCallback,
            //     function (err) {
            //         alert(err.ErrorInfo);
            //     }
            // );
        }
    }
    //=======群组管理=======
    //创建群组
    function createGroup(option,cb) {
        option.ApplyJoinOption = 'FreeAccess';//不需要加群验证
        webim.createGroup(
            option,
            function (resp) {
                cb.succ && cb.succ(resp);
            },
            function (err) {
                cb.fail && cb.fail(err);
                console.log(err.ErrorInfo);
            }
        );
    }
    //获取我的群组
    function getMyGroup(cb) {
        var options = {
            'Member_Account': loginInfo.identifier+"",
            'Limit': "200",
            'Offset': "0",
            'GroupBaseInfoFilter': [
                'Type',
                'Name',
                'Introduction',
                'Notification',
                'FaceUrl',
                'CreateTime',
                'Owner_Account',
                'LastInfoTime',
                'LastMsgTime',
                'NextMsgSeq',
                'MemberNum',
                'MaxMemberNum',
                'ApplyJoinOption'
            ],
            'SelfInfoFilter': [
                'Role',
                'JoinTime',
                'MsgFlag',
                'UnreadMsgNum'
            ]
        };
        webim.getJoinedGroupListHigh(
            options,
            function (resp) {
                var data = [];
                if (!resp.GroupIdList || resp.GroupIdList.length == 0) {
                    console.log('你目前还没有加入任何群组');
                    cb.succ && cb.succ(data);
                    return;
                }
                for (var i = 0; i < resp.GroupIdList.length; i++) {

                    var group_id = resp.GroupIdList[i].GroupId;
                    var name = webim.Tool.formatText2Html(resp.GroupIdList[i].Name);
                    var type_en = resp.GroupIdList[i].Type;
                    var type = webim.Tool.groupTypeEn2Ch(resp.GroupIdList[i].Type);
                    var role_en = resp.GroupIdList[i].SelfInfo.Role;
                    var role = webim.Tool.groupRoleEn2Ch(resp.GroupIdList[i].SelfInfo.Role);
                    var msg_flag = webim.Tool.groupMsgFlagEn2Ch(resp.GroupIdList[i].SelfInfo.MsgFlag);
                    var msg_flag_en = resp.GroupIdList[i].SelfInfo.MsgFlag;
                    var join_time = webim.Tool.formatTimeStamp(resp.GroupIdList[i].SelfInfo.JoinTime);
                    var member_num = resp.GroupIdList[i].MemberNum;
                    data.push({
                        'GroupId': group_id,
                        'Name': name,
                        'TypeEn': type_en,
                        'Type': type,
                        'RoleEn': role_en,
                        'Role': role,
                        'MsgFlagEn': msg_flag_en,
                        'MsgFlag': msg_flag,
                        'MemberNum': member_num,
                        'JoinTime': join_time
                    });
                }
                cb.succ && cb.succ(data);
            },
            function (err) {
                cb.fail && cb.fail(err);
                console.log(err.ErrorInfo);
            }
        );
    };
    //搜索群 / 获取群高级资料
    function getGroupPublicInfo(groupid,cb) {
        var options = {
            'GroupIdList': [
                groupid+""
            ],
            'GroupBasePublicInfoFilter': [
                'Type',
                'Name',
                'Introduction',
                'Notification',
                'FaceUrl',
                'CreateTime',
                'Owner_Account',
                'LastInfoTime',
                'LastMsgTime',
                'NextMsgSeq',
                'MemberNum',
                'MaxMemberNum',
                'ApplyJoinOption'
            ]
        };
        webim.getGroupPublicInfo(
            options,
            function (resp) {
                var data = [];
                if (resp.GroupInfo && resp.GroupInfo.length > 0) {
                    for (var i in resp.GroupInfo) {
                        if (resp.GroupInfo[i].ErrorCode > 0) {
                            alert(resp.GroupInfo[i].ErrorInfo);
                            return;
                        }
                        var group_id = resp.GroupInfo[i].GroupId;
                        var name = webim.Tool.formatText2Html(resp.GroupInfo[i].Name);
                        var type_zh = webim.Tool.groupTypeEn2Ch(resp.GroupInfo[i].Type);
                        var type = resp.GroupInfo[i].Type;
                        var owner_account = resp.GroupInfo[i].Owner_Account;
                        var create_time = webim.Tool.formatTimeStamp(resp.GroupInfo[i].CreateTime);
                        var member_num = resp.GroupInfo[i].MemberNum;
                        var notification = webim.Tool.formatText2Html(resp.GroupInfo[i].Notification);
                        var introduction = webim.Tool.formatText2Html(resp.GroupInfo[i].Introduction);
                        data.push({
                            'GroupId': group_id,
                            'Name': name,
                            'TypeZh': type_zh,
                            'Type': type,
                            'Owner_Account': owner_account,
                            'MemberNum': member_num,
                            'Notification': notification,
                            'Introduction': introduction,
                            'CreateTime': create_time
                        });
                    }
                }
                cb.succ && cb.succ(data);
            },
            function (err) {
                console.log(err.ErrorInfo);
                //因为群不存在的情况下搜索,腾讯im会报错,错误代码10015,所以我们不把它当作错误处理;
                var ErrorCode = err.GroupInfo && err.GroupInfo[0].ErrorCode;
                if(ErrorCode == 10015 || ErrorCode == 10010){
                    var data = [];
                    cb.succ && cb.succ(data);
                }else{
                    cb.fail && cb.fail(err)
                }
            }
        );
    }
    //申请加群
    function applyJoinGroup(id,cb) {
        var options = {
            'GroupId': id,
            'ApplyMsg': '',
            'UserDefinedField': ''
        };
        webim.applyJoinGroup(
            options,
            function (resp) {
                var joinedStatus=resp.JoinedStatus;
                //JoinedSuccess--成功加入，WaitAdminApproval--等待管理员审核
                if(joinedStatus=="JoinedSuccess"){
                    cb.succ && cb.succ(resp);
                }
            },
            function (err) {
                console.log(err.ErrorInfo);
                cb.fail && cb.fail();
            }
        );
    };
    

    //监听新消息(私聊，普通群(非直播聊天室)消息，全员推送消息)事件
    var msgStr,msgData,updateList=[],historyLoading={};
    function getMsgData(){
        var str = webimConfigs.getSession();
        if(!str){return null;}
        if(str!==msgStr){
            msgStr = str;
            msgData = JSON.parse(str);
        }
        return msgData;
    }
    function onMsgNotify(newMsgList) {
        var msgData = getMsgData();
        var msgList = [];
        newMsgList.forEach(function (newMsg) {
            var session = newMsg.getSession().id();
            var msg = parseMsg(newMsg);
            if (!msgData[session]) {
                msgData[session] = {history:null,news:[],unread:0,pullMsg:0};
            }
            msgData[session].news.push(msg);
        });
        var sessMap = webim.MsgStore.sessMap();
        for (var i in sessMap) {
            var sess = sessMap[i];
            msgData[sess.id()].unread = sess.unread();
            //sess.type(), sess.id(), sess.name()
        }
        var str = JSON.stringify(msgData);
        webimConfigs.setSession(str);
        //webim.setAutoRead(selSess, true, true);
    }
    
    //获取上一屏历史消息并缓存
    function getLastHistroyMsg(session){
        if(historyLoading[session]){
            return;
        }
        historyLoading[session] = true;
        webim.MsgStore.delSessByTypeId(webim.SESSION_TYPE.GROUP,session);
        var options = {
            'GroupIdList': [
                session
            ],
            'GroupBaseInfoFilter': [
                'NextMsgSeq'
            ],
            'MemberInfoFilter': [
            ]
        };
        webim.getGroupInfo(
                options,
                function (resp) {
                    var options = {
                        GroupId: session,
                        ReqMsgSeq: resp.GroupInfo[0].NextMsgSeq - 1,
                        ReqMsgNumber: 100
                    };
                    if (options.ReqMsgSeq == null || options.ReqMsgSeq == undefined || options.ReqMsgSeq<=0) {
                        setHistory([]);
                        return;
                    }
                    if(msgData[session].history){
                        var arr = msgData[session].history;
                        var last = arr[arr.length-1];
                        if(last.seq >= options.ReqMsgSeq){
                            setHistory([]);
                            return;
                        }
                    }
                    webim.syncGroupMsgs(
                            options,
                            function (msgList) {
                                //MsgStore.sessByTypeId(webim.SESSION_TYPE.GROUP,session)
                                setHistory(msgList);
                            },
                            function(){
                                setHistory([]);
                            }
                    );
                },
                function(){
                    setHistory([]);
                }
        );
        function setHistory(msgs){
            var list = [];
            for(var i=0; i<msgs.length; i++){
                list[i] = parseMsg(msgs[i]);
            }
            if(!msgData[session].history || !msgData[session].history.length){
                msgData[session].history = list;
                webimConfigs.setSession(JSON.stringify(msgData));
            }else{
                if(list.length){
                    var hadArr = msgData[session].history;
                    var hadSeq = hadArr[hadArr.length-1].seq;
                    var newArr = list.filter(function(item){
                        return item.seq>hadSeq;
                    });
                    if(newArr.length){
                        msgData[session].history = hadArr.concat(newArr);
                        webimConfigs.setSession(JSON.stringify(msgData));
                    }
                }
            }
            setTimeout(function(){
                historyLoading[session] = false;
            },3000)//防止过快刷新
        }
    }
    //解析消息
    function parseMsg(msg) {
        var isSelfSend, fromAccount, fromAccountNick, sessType, subType, content;
        fromAccount = msg.getFromAccount();
        if (!fromAccount) {
            fromAccount = '';
        }
        fromAccountNick = msg.getFromAccountNick();
        if (!fromAccountNick) {
            fromAccountNick = fromAccount;
        }
        isSelfSend = msg.getIsSend();//消息是否为自己发的
        sessType = msg.getSession().type();
        subType = msg.getSubType();
        content = convertMsgtoHtml(msg);

        return {
            content: content,
            subType: subType,
            fromAccount: fromAccount,
            fromAccountNick: fromAccountNick,
            isSelfSend: isSelfSend,
            seq : msg.getSeq()
        }
    }
    //获取新消息 比较跟推送
    setInterval(function () {
        var msgData = getMsgData();
        if(!msgData){return;}
        for(var i=0,k=updateList.length; i<k; i++){
            var mod = updateList[i];
            var session = mod.session;
            if(session){
                if(session=="all"){
                    if(mod.messages != msgData){
                        mod.messages = msgData;
                        mod.update(msgData);
                    }
                }else{
                    var msgList = msgData[session];
                    if(!msgList){
                        msgList = msgData[session] = {"history":null,"news":[],"unread":0,"pullMsg":0};
                    }
                    if(!msgList.history || msgList.pullMsg){
                        getLastHistroyMsg(session);
                    }

                    var nnum = msgList.news.length;
                    var onum = mod.messages.news.length;
                    if(nnum > onum){
                        mod.messages.news = msgList.news.map(function(item){
                            return item;
                        });
                        mod.update(msgList.news.slice(onum));
                    }
                    if(msgList.history){
                        var nnum = msgList.history.length;
                        var onum = mod.messages.history.length;
                        if(nnum > onum){
                            mod.messages.history = msgList.history.map(function(item){
                                return item;
                            });
                            mod.history(msgList.history.slice(onum));
                        }
                    }
                }
            }
        }
    }, 1000);
    //对外暴露的方法和属性
    return {
        sessionStr:"",
        setSession: function(str){
            this.sessionStr = str;
        },
        getSession: function(){
            return this.sessionStr;
        },
        getSessionIns: function(id){
            return webim.MsgStore.sessByTypeId(webim.SESSION_TYPE.GROUP,id);
        },
        setPullMsg: function(session){
            var msgData = getMsgData();
            msgData[session].pullMsg = true;
        },
        login: function (user, cb) {
            if(user.guestid || user.user_type==0){//游客主动刷新
                loginInfo.identifier = (user.guestid||user.user_id)+"";
                loginInfo.userSig = user.guestsig||user.usersig;
                listeners = {};
            }else{
                loginInfo.identifier = user.user_id+"";
                loginInfo.userSig = user.usersig;
            }
            loginInfo.identifierNick = user.nick;
            loginInfo.headurl = user.avatar;
            webim.login(
                loginInfo, listeners, options,
                function (resp) {
                    cb.succ && cb.succ(resp);
                    //获取我的群列表消息
                    var options = {
                        'Member_Account': loginInfo.identifier,
                        'Limit': 200,
                        'Offset': 0,
                        //'GroupType':'',
                        'GroupBaseInfoFilter': [
                            'Type',
                            'Name',
                        ],
                        'SelfInfoFilter': [
                            'UnreadMsgNum'
                        ]
                    };
                    webim.getJoinedGroupListHigh(
                            options,
                            function (resp) {
                                if (resp.GroupIdList && resp.GroupIdList.length) {
                                    var msgData = getMsgData();
                                    for (var i = 0; i < resp.GroupIdList.length; i++) {
                                        var group = resp.GroupIdList[i];
                                        var session = group.GroupId;
                                        if (!msgData[session]) {
                                            msgData[session] = {history:null,news:[],unread:0,pullMsg:0};
                                        }
                                        msgData[session].unread = group.SelfInfo.UnreadMsgNum;
                                    }
                                    var str = JSON.stringify(msgData);
                                    webimConfigs.setSession(str);
                                }
                            },
                            function (err) {
                                cb.fail && cb.fail(err);
                            }
                    );
                    
                },
                function (err) {
                    cb.fail && cb.fail(err);
                }
            );
        },
        logout: function (cb) {
            if (loginInfo.identifier) {
                //sdk登出
                webim.logout(
                    function (resp) {
                        loginInfo.identifier = null;
                        loginInfo.userSig = null;
                        //接受回调
                        cb.succ && cb.succ(resp);
                    }
                );
            } else {
                alert('未登录');
            }
        },
        setReaded: function(session,seq){
            webim.setAutoRead(webimConfigs.getSessionIns(session), true, true);
        },
        addListener: function (mod) {
            updateList.push(mod);
        },
        loginInfo: loginInfo,
        selToID: selToID,
        convertMsgtoHtml:convertMsgtoHtml,
        setSelToId: setSelToId,
        onSendMsg: onSendMsg,
        sendPic: sendPic,
        changeSel: changeSelTo,
        getMyGroup: getMyGroup,
        searchGroup: getGroupPublicInfo,
        getGroupPublicInfo: getGroupPublicInfo,
        createGroup: createGroup,
        applyJoinGroup: applyJoinGroup
    }
})();

