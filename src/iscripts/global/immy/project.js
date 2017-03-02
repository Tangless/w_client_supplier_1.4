"use strict";
(function () {
    var project = window.project = {

        autoCreateIModules: function () {
            var page = $("body[imodule]")[0]
            project._addInitLoading();
            if (page) {
                project.getIModule(page);
            }
            project._removeInitLoading();
            $("*[imodule]").each(function (index, element) {
                if (element.nodeName == "BODY") {
                    return true;
                }
                project._addInitLoading();
                project.getIModule(element);
                project._removeInitLoading();
            });
        },
        getIModule: function (obj, options, success, failure) {
            var imid, dom;
            if (typeof(obj) == "string") {
                imid = obj;
            } else {
                if (obj instanceof potato.UModule) {
                    dom = obj.dom;
                } else {
                    dom = obj;
                }
                dom.id = dom.id || "imodule_" + potato.getUniqueID();
                imid = dom.getAttribute("imid") || "imodule://" + dom.id;
            }
            var cache = potato.getCache(imid);
            if (cache instanceof potato.Proxy) {
                success && cache.addSuccessCaller(success);
                failure && cache.addFailureCaller(failure);
                return cache;
            } else if (cache instanceof potato.UModule) {
                obj = cache;
            }
            var ins = this._getIModule(obj, options, success, failure);
            if (ins instanceof potato.Proxy) {
                ins.addSuccessCaller(function (ins) {
                    potato.setCache(imid, ins, "r");
                });
            }
            potato.setCache(imid, ins, "r");
            return ins;
        },
        _getIModule: function (imid, options, success, failure) {
            options = options || {};
            var dom, ins, proxy, cls = options.con;
            if (imid instanceof potato.UModule) {
                return updateIModule(imid);
            } else if (typeof(imid) == "object") {
                dom = imid;
                dom.id = dom.id || "imodule_" + potato.getUniqueID();
                imid = dom.getAttribute("imid") || "imodule://" + dom.id;
            }
            dom = dom || $("div[imid='" + imid + "']")[0];
            if (!dom) {
                var htmlRequest = potato.load({url: imid});
                htmlRequest.addSuccessCaller(createIModule);
                if (!proxy) {
                    proxy = new potato.Proxy();
                }
                return proxy;
            } else {
                return createIModule();
            }

            function createIModule(html) {
                if (html) {
                    dom = $(html).appendTo(project._hideDiv).get(0);
                }
                if (!cls) {
                    if (dom.hasAttribute("imodule")) {
                        var conName = dom.getAttribute("imodule") || "imodules/" + dom.id;
                    } else {
                        cls = project.baseIModules.BaseIModule;
                    }
                }
                try {
                    var con = cls || require(conName);
                } catch (e) {
                    setTimeout(function () {
                        project._addInitLoading();
                        require([conName], function (con) {
                            initIModule(con);
                            project._removeInitLoading();
                        }, function (error) {
                            initIModule(project.baseIModules.BaseIModule);
                            project._removeInitLoading();
                            //endResult(new potato.Error("b3"));
                        });
                    }, 10);

                }
                if (!con) {
                    if (!proxy) {
                        proxy = new potato.Proxy();
                    }
                    return proxy;
                } else {
                    return initIModule(con);
                }
            };
            function initIModule(con) {
                var ins = new con(dom, null, options);
                dom.setAttribute("imid", imid);
                return updateIModule(ins);
            };
            function updateIModule(imodule) {
                ins = imodule;
                var result = imodule._update(options);
                if (result instanceof potato.Proxy) {
                    result.addCompleteCaller(endResult);
                    if (!proxy) {
                        proxy = new potato.Proxy();
                    }
                    return proxy;
                } else {
                    return endResult(result);
                }
            };
            function endResult(result) {
                if (result instanceof window.Error) {
                    potato.commonFailureCaller(result);
                    failure && failure(result);
                    if (proxy) {
                        proxy.failure(result);
                    } else {
                        return result;
                    }
                } else {
                    success && success(ins);
                    if (proxy) {
                        proxy.success(ins);
                    } else {
                        return ins;
                    }
                }

            }
        },
        tip: function (title, icon, text, timer) {
            var html, img, args, dom;
            //如果参数是对象
            if (typeof(title) == "object") {
                args = title;
                title = args.title;
                text = args.text;
                timer = args.timer;
                img = args.img || '/images/ui/no_upload.png';
            }
            if (typeof (text) == "string") {
                if (img) {

                    //拼接字符串
                    html = '<div class="-immy-tip-img text-left">' +
                        '<img src="' + img + '" alt="屏幕图片">' +
                        '<div class="-immy-tip-info">' +
                        '<h1 class="-immy-tip-title">' + title +
                        '</h1>' +
                        '<p class="-immy-tip-note">' + text +
                        '</p></div></div>'

                } else {
                    var p = '';
                    var i = 'hide';
                    //如果有text
                    if (text) {
                        p = '<p class="-immy-tip-note">' + text + '</p>'
                    }
                    //如果有图标就显示
                    if (icon) {
                        i = icon;
                    }
                    //拼接字符串
                    html = '<div class="-immy-tip"><h1 class="-immy-tip-title">' +
                        '<i class="' + i + '"></i>' +
                        '<span>' + title + '</span></h1>' +
                        p + '</div>';

                }
                dom = $(html).appendTo(project._hideDiv);
            } else {
                dom = text;
            }

            //自动消失
            if (timer) {
                setTimeout(function () {
                    tip.close();
                }, 2000)
            }

            var tip = project.open(dom[0], "_blank", "slideUp");
        },

        embedCss: function (cssText) {
            if (document.createStyleSheet) {//兼容ie8
                var c = document.createElement("p");
                c.innerHTML = "x<style>" + cssText + "</style>";
                var cssStyle = c.lastChild;
            } else {
                var cssStyle = document.createElement('style');
                cssStyle.type = 'text/css';
                cssStyle.innerHTML = cssText;
            }
            try {
                var head = document.getElementsByTagName('head')[0];
                document.getElementsByTagName('head')[0].appendChild(cssStyle);
            } catch (e) {
                console.log(e);
            }

        },
        _addInitLoading: function () {
            this._globalLoading.add();
            if (this._initLoading === null) {
                this._initLoading = 1;
                this._globalLoading.add();
                setTimeout(function () {
                    project._removeInitLoading();
                }, 0);
            }
            this._initLoading++;
        },
        _removeInitLoading: function () {
            this._globalLoading.remove();
            this._initLoading--;
            if (this._initLoading == 0) {
                document.documentElement.className = "";
            }
        },
        isLogin: function () {
            return cookie_utils.is_loggedin();
        },
        /*open : function(data){//module,options,updateIModule,open,target
         var dialog;
         if(data.target=='cur'){
         dialog = potato.getCurDialog();
         }else if(data.target=='new'){
         var list = project.loaderDialogRecycle;
         for(var i=0,k=list.length; i<k; i++){
         if(list[i].dialogState == "closed"){
         break;
         }
         }
         if(i==k){
         var div = document.createElement("div");
         dialog = project.createIModule($(div), project.umods.Base_LoaderDialog);
         list.push(dialog);
         }else{
         dialog = list[i];
         }
         }else{
         dialog = potato.application;
         }
         dialog.loadUri(data);
         return dialog;
         },*/
        findData: function (view) {
            var data;
            var script = view.find("script[data-name='data']");
            if (script.length) {
                data = potato.parseXML(script[0].text);
                data = potato.parseResult(data.lastChild);
            }
            return data;
        },
        getCurCity: function () {
            return $.when(
                $.ajax({
                    crossDomain: true,
                    url: 'http://restapi.amap.com/v3/ip?key=' + '1c6b7d0e376ddb2744867aae0aed627c'
                })/*,
                 $.ajax({
                 crossDomain:true,
                 url: 'http://api.map.baidu.com/location/ip?ak=' + 'x6GD4iE5RqXCEO0lTbZpvyfjYHkg6Dpm'
                 })*/
            ).done(function (amap, baidu) {
                console.log(amap.city);
            });


            // .then(function (result) {
            //     if (result.status) {
            //         return $.ajax({
            //             'url': 'http://restapi.amap.com/v3/config/district?key=' + key + '&keywords=' + result.adcode + '&subdistrict=0&extensions=base',
            //         })
            //     } else {
            //         return $.ajax({
            //             url: 'http://restapi.amap.com/v3/geocode/regeo?key=1c6b7d0e376ddb2744867aae0aed627c&location=116.481488,39.990464&extensions=base',
            //         });
            //     }
            // })
            // function reject(reason) {//构造处在错误状态的promise对象
            //     var dfr = $.Deferred();
            //     dfr.reject(reason);
            //     return dfr.promise();
            // }
        },
        // getCurCity: function () {
        //     var key = ;
        //     return $.ajax({url: 'http://api.map.baidu.com/location/ip?ak=' + key})
        // },
        path: null,
        baseIWidgets: null,
        baseIModules: null,
        _dialogRecycle: [],
        _activeTarget: null,
        _hideDiv: $('<div class="-immy-hide"></div>').appendTo(document.body),
        _initLoading: null,
        _globalLoading: new potato.LoadingDelay(500),
        open: null
    };

    potato.setConfig({
        "application": {
            focus: function () {
                return true;
            }, _blur: function () {
                return true;
            }, close: function () {
                return true;
            }, addLoadingItem: function () {
                project._addInitLoading();
            }, removeLoadingItem: function () {
                project._removeInitLoading();
            }, setLoadingNote: function () {
            }
        }
    });


    $(document).ready(function () {
        a_profile_req({
            succ: function (user) {
                var href = window.location.href;
                var demand_id = qs('demand_id');
                var demand = href.indexOf('demand.html');
                if (demand > 0 && demand_id) {
                    a_demand_req_information(demand_id, {
                        succ: function (json) {
                            if (user.user_id != json.client_id && user.user_type == '1') {
                                //默认用户/游客
                                //这个是调接口失败的时候,仍然直接登录游客账户
                                user.guesttoken = 'fde1aab0afa2589bbf2e3144ce3029a8',
                                    user.guestid = '1';
                                afterLogin(user);

                            } else {
                                afterLogin(user);
                            }
                        },
                        fail: function () {
                            //project.data.isGuestIM = true;
                            //imLogin();
                        }
                    })
                }
                else {
                    afterLogin(user);
                }

            },
            fail: function () {
                //默认用户/游客
                //这个是调接口失败的时候,仍然直接登录游客账户
                var user = {
                    user_id: '1',
                    nim_user_token: 'fde1aab0afa2589bbf2e3144ce3029a8',
                    user_type: '0'
                };
                afterLogin(user);
            }
        });

        function afterLogin(user) {
            project.data.user = user;
            project.autoCreateIModules();

            if (user.user_id == '1' || user.guestid == '1') {
                project.data.isGuestIM = true;
            }
            //im login
            // if(!webimConfigs.getSession()){
            webimConfigs.login(user, {
                succ: function () {
                    // webimConfigs.setSession("{}");
                    // potato.application.dispatch(new potato.Event('IMLogined'));
                    // $(window).bind('unload',function(){
                    //     sessionStorage.removeItem("webim_messages");
                    // })
                }
            });
            // }
        }


    })
    ;

})
();
