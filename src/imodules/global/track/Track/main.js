// AUTHOR:   SongErwei
// ROLE:    	
// CREATED:  2016-07-12 19:47:06

define(function() {
    var Module = (function() {
		var baseIModules = project.baseIModules;
        var CON = function(dom) {
            baseIModules.BaseIModule.call(this, dom);
        };
        potato.createClass(CON, baseIModules.BaseIModule);

        CON.prototype.trackInput = function() {
            this._track('input.html');
        };
        CON.prototype.trackConsult = function() {
            this._track('consulting.html');
        };
		// 注册（即首次登录）
        CON.prototype.trackRegister = function() {
            this._track('register.html');
        };
		// 激活
        CON.prototype.trackActivate = function() {
            this._track('activate.html');
        };

		// “立即抢单”，仅m端需要
        CON.prototype.trackInstantGrab = function() {
            this._track('instant_grab.html');
        };

        CON.prototype.track10sSignupSubmit = function() {
            this._track('10ssignup_submit.html');
        };

        CON.prototype.trackSubmitPhone = function(phone) {
            this._track('10ssignup_submit.html', 'phone=' + encodeURIComponent(phone));
        };
        CON.prototype.trackSubmitPhoneSucc = function(phone) {
			// 确保两个事件发生的先后顺序预期
			var _this = this;
			setTimeout(function() {
				_this._subTrack('10ssignup_succ.html', 'phone=' + encodeURIComponent(phone));
			}, 50);
        };

		// 不想再逐一为各个行为加一个html，故加一个较通用的
        CON.prototype.trackAction = function(act) {
            this._track('action.html', 'action=' + encodeURIComponent(act));
        };

		// 下面2个方法，所有页面均需要，已在main.md.html中调用，不需再单独调用
		// 另：因这2个事件用户动作不存在严格的对应关系，发生的时机不确定。故放在SubTrackFrame中，以免影响Track像click、input这样的明确事件
        CON.prototype.trackMouseMove = function() {
            this._subTrack('effective.html');
        };
        CON.prototype.trackInterestedUser = function() {
            this._subTrack('interested.html');
        };

        CON.prototype.track50xError = function(err_50x) {
            var dest = '/502.html?err=' + err_50x + '&on_page=' + encodeURIComponent(location.pathname);
            console.log('track: ' + dest);
            $(this.dom).find('#SubTrackFrame').attr('src', dest);
        }  
        
        CON.prototype._track = function(page, ext) {
			this._doTrack('#TrackFrame', page, ext);
		};
        CON.prototype._subTrack = function(page, ext) {
			this._doTrack('#SubTrackFrame', page, ext);
		};
        CON.prototype._doTrack = function(frame, page, ext) {
			var dest = '/track/' + page + '?on_page=' + encodeURIComponent(location.pathname);
			if (ext) {
				dest += ('&' + ext);
			}

			console.log('track: ' + dest);
            $(this.dom).find(frame).attr('src', dest); 
        };

        return CON;
    })();

    (function() {
        // growingio
        (function() {
            var _vds = _vds || [];
            window._vds = _vds;

            var accId = '';
            if (window.is_wph) {
                accId = '892d2771d972fd9c';
            } else if (window.is_testin) {
                accId = 'a29d497dacb954b7'; 
            } else {
                accId = 'aaf1fad322803e0c';
            }

            _vds.push(['setAccountId', accId]);

            function script() {
				console.log('init growing.');
                var vds = document.createElement('script');
                vds.type='text/javascript';
                vds.async = true;
                vds.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'dn-growing.qbox.me/vds.js';
                var s = document.getElementsByTagName('script')[0];
                s.parentNode.insertBefore(vds, s);
            }

            if (cookie_utils.is_loggedin()) {
                a_profile_req({
                    succ: function(json) {
                        _vds.push(['setCS1', 'user_id', json.user_id]);
                        _vds.push(['setCS2', 'user_type', cookie_utils.is_client() ? 'client' : 'supplier']);
                        _vds.push(['setCS3', 'user_nick', json.nick]);
                        script();
                    },
                    fail: function(json) {
                        script();
                    }
                })
            } else {
                script();
            }
        })();

		// 每个页面都要绑定的track，在这里一勺烩
        $(function() {
            // 咨询在线客服
            consulting();

            // 鼠标有一些事件，则track
            mouse_move();	

            // 停留时间超过30s，则track
            visit_time();

			// 用户输入
			$('input').click(function() {
                 project.getIModule('imodule://Track').trackInput();
			})
        })

        function consulting() {
            // 客服是第三方代码，需等待其加载完成
            var inter = setInterval(function() {
                var sel = $('#MEIQIA-BTN, #MEIQIA-BTN-CHAT, #MEIQIA-BTN-CALL');
                if (sel.length >= 1) {
                    console.log('meiqia is there!');

                    sel.click(function() {
                        project.getIModule('imodule://Track').trackConsult();
                    })
                    clearInterval(inter);
                }
            }, 500);
        }

        function mouse_move() {
            var mouse_count = 0;
            var mm = 'mousemove';
            var clk = 'click';

            var on_mouse = function(max) {
                return function() {
                    if (++mouse_count > max) {
                        track_mouse_movement();

                        tlog('off track mousemove')
                        $(document).off(mm, on_mm);
                        $(document).off(clk, on_clk);
                    }
                }
            }

            // 10次move，或2次click，则认为是“人”在访问
            var on_mm = on_mouse(10);
            var on_clk = on_mouse(2);

            $(document).on(mm, on_mm);
            $(document).on(clk, on_clk);
        }

        // 此方法，原始作者是赵勇
        function visit_time() {
            var timer,count,sec,start,limit=30;

            count = function(){
                var sec = parseInt(getCookie('visit_time')) || 0;
                sec++;
                setCookie('visit_time',sec);
                console.log(sec);
                if(sec == limit){
                    track_interested_user();
                }
                if(sec > limit){
                    $(window).off("focus").off("blur");
                    sessionStorage.removeItem("visit_time");
                    clearInterval(timer);
                    timer = 0;
                    setCookie('visit_time',sec, 30);
                }
            }
            start = function(){
                if(!timer && sec<=limit){
                    timer = setInterval(count,1000);
                }
            }
            sec = parseInt(getCookie('visit_time')) || 0;
            if(sec <= limit){
                $(window).focus(function(){
                    sessionStorage.setItem("visit_time",1);
                    start();
                }).blur(function(){
                    sessionStorage.removeItem("visit_time");
                    clearInterval(timer);
                    timer = 0;
                });
                if(sessionStorage.getItem("visit_time")){//同
                    start();
                }

            }
        }

        // track鼠标移动事件(以防机器)
        function track_mouse_movement() {
            project.getIModule('imodule://Track').trackMouseMove();
        } 

        // track停留超过30s的用户
        function track_interested_user() {
            project.getIModule('imodule://Track').trackInterestedUser();
        }	

        function tlog(s) {
            console.log(s);
        }

        // cookie 2-------------
        //
        // Original JavaScript code by Chirp Internet: www.chirp.com.au
        // Please acknowledge use of this code by including this header.
        // 咱以后就尽量用js.cookie.js吧 --by SongErwei@2016/7/15
        function getCookie(name) {
            var re = new RegExp(name + "=([^;]+)");
            var value = re.exec(document.cookie);
            return (value != null) ? unescape(value[1]) : null;
        }

        function setCookie(c_name,value,expiredays) {
            var exdate=new Date();
            exdate.setDate(exdate.getDate()+expiredays);
            document.cookie=c_name+ "=" +escape(value)+';path=/;'+
                        ((expiredays==null) ? "" : "expires="+exdate.toGMTString());
        }
    })();

    return Module;
})
