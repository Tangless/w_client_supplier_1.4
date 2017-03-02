// AUTHOR:   SongErwei
// ROLE:    	
// CREATED:  2016-02-24 14:58:02

function im_load(key, token, cb) {
	var ccb = (cb != undefined) ? cb : {}
	RongIMClient.init(key)

	im_set_connecting_listener()
	im_set_recv_msg_listener(ccb)

	im_connect_server(token, ccb)
}

function im_connect_server(token, cb) {
	
	RongIMClient.connect(token, {
		onSuccess: function (userId) {
			// 此处处理连接成功。
			console.log("Login successfully. User ID: " + userId);

			if (cb.connected != undefined) {
				cb.connected()
			}
		},

		onError: function (errorCode) {
			// 此处处理连接错误。
			var info = '';
			switch (errorCode) {
			   case RongIMClient.callback.ErrorCode.TIMEOUT:
					info = '超时';
					break;
			   case RongIMClient.callback.ErrorCode.UNKNOWN_ERROR:
					info = '未知错误';
					break;
			   case RongIMClient.ConnectErrorStatus.UNACCEPTABLE_PROTOCOL_VERSION:
					info = '不可接受的协议版本';
					break;
			   case RongIMClient.ConnectErrorStatus.IDENTIFIER_REJECTED:
					info = 'appkey不正确';
					break;
			   case RongIMClient.ConnectErrorStatus.SERVER_UNAVAILABLE:
					info = '服务器不可用';
					break;
			   case RongIMClient.ConnectErrorStatus.TOKEN_INCORRECT:
					info = 'token无效';
					break;
			   case RongIMClient.ConnectErrorStatus.NOT_AUTHORIZED:
					info = '未认证';
					break;
			   case RongIMClient.ConnectErrorStatus.REDIRECT:
					info = '重新获取导航';
					break;
			   case RongIMClient.ConnectErrorStatus.PACKAGE_ERROR:
					info = '包名错误';
					break;
			   case RongIMClient.ConnectErrorStatus.APP_BLOCK_OR_DELETE:
					info = '应用已被封禁或已被删除';
					break;
			   case RongIMClient.ConnectErrorStatus.BLOCK:
					info = '用户被封禁';
					break;
			   case RongIMClient.ConnectErrorStatus.TOKEN_EXPIRE:
					info = 'token已过期';
					break;
			   case RongIMClient.ConnectErrorStatus.DEVICE_ERROR:
					info = '设备号错误';
					break;
			}
			console.log("失败:" + info);
		}
	});
}

function im_set_connecting_listener() {

	// 设置连接监听状态 （ status 标识当前连接状态）
    // 连接状态
    RongIMClient.setConnectionStatusListener({
        onChanged: function (status) {
            switch (status) {
				//链接成功
				case RongIMLib.ConnectionStatus.CONNECTED:
					console.log('链接成功');
					break;
				//正在链接
				case RongIMLib.ConnectionStatus.CONNECTING:
					console.log('正在链接');
					break;
				//重新链接
				case RongIMLib.ConnectionStatus.RECONNECT:
					console.log('重新链接');
					break;
				//其他设备登陆
				case RongIMLib.ConnectionStatus.OTHER_DEVICE_LOGIN:
				//连接关闭
				case RongIMLib.ConnectionStatus.CLOSURE:
				//未知错误
				case RongIMLib.ConnectionStatus.UNKNOWN_ERROR:
				//登出
				case RongIMLib.ConnectionStatus.LOGOUT:
				//用户已被封禁
				case RongIMLib.ConnectionStatus.BLOCK:
					break;
            }
		}
	});
}

function im_set_recv_msg_listener(cb) {
     // 消息监听器
     RongIMClient.setOnReceiveMessageListener({
        // 接收到的消息
        onReceived: function (message) {
            // 判断消息类型
            switch(message.messageType){
                case RongIMClient.MessageType.TextMessage:
					var t = message.content.content;
		 			console.log('im recv: ' + t)
					if (cb.on_text_msg != undefined) {
						cb.on_text_msg(t)
					}
                    break;
                case RongIMClient.MessageType.ImageMessage:
                    // do something...
                    break;
                case RongIMClient.MessageType.VoiceMessage:
                    // do something...
                    break;
                case RongIMClient.MessageType.RichContentMessage:
                    // do something...
                    break;
                case RongIMClient.MessageType.LocationMessage:
                    // do something...
                    break;
                case RongIMClient.MessageType.DiscussionNotificationMessage:
                    // do something...
                    break;
                case RongIMClient.MessageType.InformationNotificationMessage:
                    // do something...
                    break;
                case RongIMClient.MessageType.ContactNotificationMessage:
                    // do something...
                    break;
                case RongIMClient.MessageType.ProfileNotificationMessage:
                    // do something...
                    break;
                case RongIMClient.MessageType.CommandNotificationMessage:
                    // do something...
                    break;
                case RongIMClient.MessageType.UnknownMessage:
                    // do something...
                    break;
                default:
                    // 自定义消息
                    // do something...
            }
        }
    });
}

function im_send_msg_to_kefu(text, kefu_id) {
    RongIMClient.getInstance().startCustomService();

    var msg = new RongIMLib.TextMessage({content: text});
 	var type = RongIMLib.ConversationType.CUSTOMER_SERVICE; // 客服会话类型

	RongIMClient.getInstance().sendMessage(type, kefu_id, msg, {
	   	onSuccess: function (msg) {
			// 发送消息成功
			console.log("Send successfully");
		},
		onError: function (errorCode) {
			// 发送消息失败
			console.log(errorCode);
		}
	}); 
} 

/* 单聊消息，暂不需要
function im_send_msg(text) {
	// 定义消息类型,文字消息使用 RongIMClient.TextMessage
	var msg = new RongIMLib.TextMessage();
	// 设置消息内容
	msg.setContent("hello");
	
	var conversationtype = RongIMLib.ConversationType.PRIVATE; // 私聊
	var targetId = "xxx"; // 目标 Id
	RongIMClient.getInstance().sendMessage(conversationtype, targetId, msg, null, {
		// 发送消息成功
		onSuccess: function () {
			console.log("Send successfully");
		},
		onError: function (errorCode) {
			var info = '';
			switch (errorCode) {
				case RongIMLib.callback.ErrorCode.TIMEOUT:
					info = '超时';
					break;
				case RongIMLib.callback.ErrorCode.UNKNOWN_ERROR:
					info = '未知错误';
					break;
				case RongIMLib.SendErrorStatus.REJECTED_BY_BLACKLIST:
					info = '在黑名单中，无法向对方发送消息';
					break;
				case RongIMLib.SendErrorStatus.NOT_IN_DISCUSSION:
					info = '不在讨论组中';
					break;
				case RongIMLib.SendErrorStatus.NOT_IN_GROUP:
					info = '不在群组中';
					break;
				case RongIMLib.SendErrorStatus.NOT_IN_CHATROOM:
					info = '不在聊天室中';
					break;
				default :
					info = x;
					break;
			}
			console.alert('发送失败:' + info);
		}
	});
}

*/
