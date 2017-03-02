"use strict";
(function () {

    var baseIWidgets = project.baseIWidgets;

    var BaseIModule = (function () {
        var CON = function (dom, parent, options) {
            options = options || {};
            potato.UModule.call(this, dom, parent, options);
            this._$dom = $(dom);
            this._els = {};
            if (!options.container) {
                this._watchEvent();
                this._els = this._getElements();
            }
        };
        var CID = potato.createClass(CON, potato.UModule);

        CON.prototype._update = function () {

        };
        CON.prototype.find = function (expr, obj, ele) {
            return this._$dom.find(expr, obj, ele);
        };
        CON.prototype._getTpl = function () {
            if (this._tpls) {
                var map = {};
                var html;
                for (var k in this._tpls) {
                    html = this._tpls[k].toString();
                    html = html.substring(html.indexOf("/*") + 2, html.lastIndexOf("*/"));
                    map[k] = html.trim();
                }
            }
            return map;
        };
        CON.prototype._getElements = function () {
            return $(this.dom).find("[idom]").groupBy("idom");
        };
        CON.prototype._watchEvent = function (actions, dom) {
            actions = actions || this;
            var that = this;
            var callAction = function (action, type, target, hit) {
                //console.log(type,target,hit);
                var arr = action.split("@");
                var action = arr[0];
                var data = arr[1];
                var fun, s, e;
                fun = actions["_ievent_" + action];
                if (fun) {
                    if (data) {
                        s = data.substr(0, 1);
                        e = data.substr(data.length - 1, 1);
                        if ((s == "{" && e == "}") || (s == "[" && e == "]")) {
                            data = JSON.parse(data);
                        }
                    }
                    //project.addActive(target);
                    return fun.call(that, data, target, hit);
                } else {
                    return true;
                }
            };
            var handler = function (e) {
                var type = e.type;
                var hit = e.target;
                var target = e.target;
                var nodeName = target.nodeName;
                var propagation = true;
                var i, k;
                if (type == "focusin" && nodeName != "INPUT" && nodeName != "TEXTARE") {
                    return true;
                }
                if (type == "click" && (nodeName == "FORM" || nodeName == "SELECT" || nodeName == "OPTION" || nodeName == "TEXTARE" || nodeName == "INPUT" || (nodeName == "LABEL" && target.htmlFor))) {
                    return true;
                }
                if (type == "change" && (nodeName == "FORM" || nodeName == "TEXTARE" || nodeName == "INPUT")) {
                    return true;
                }
                var root = this;
                while (target && target != root) {
                    var action = target.getAttribute("ievent");
                    if (action && (!target.hasAttribute("disabled") || target.getAttribute("disabled")=='false')) {
                        var arr = action.split("|");
                        for (i = 0, k = arr.length; i < k; i++) {
                            propagation = (callAction(arr[i], type, target, hit) === false ? false : true) && propagation;
                        }
                        return propagation;
                    }
                    target = target.parentNode;
                    if (target.nodeName == "FORM") {
                        return true;
                    }
                }
                return true;
            };
            $(dom || this.dom).on("click focusin submit change", handler);
        };
        /*CON.prototype._ievent_layer = function(options){
         var imodule = project.getIModule(options.umid);
         var target = options.target || "_blank";
         switch(target){
         case "_blank":
         break;
         case "_self":
         var dialog = potato.getCurDialog();
         dialog.setData(imodule, options);
         break;
         }
         return false;
         };*/
        CON.prototype._ievent_open = function (options) {
            if (options.url.indexOf("idom://") == 0) {
                var id = options.url.substr(7);
                options.url = this._els[id][0];
            }
            project.open(options.url, options.target, options.dialog, options.data);
            return false;
        };

        CON.prototype._ievent_qqTalk = function (arr) {
            window.open("http://wpa.qq.com/msgrd?v=3&uin=4009929033&site=qq&menu=yes");
        };
        CON.prototype._ievent_track = function (arr) {
            var methon = arr[0];
            var args = arr[1];
            var track = project.getIModule('imodule://Track');
            track[methon](args);
        };
        return CON;
    })();

    var BaseIPage = (function () {
        var CON = function (dom, options) {
            options = options || {container: true};
            BaseIModule.call(this, dom, null, options);
            potato.Dialog.call(this, dom, null, null, "focused");
            this._createSubModule();
            this._globalLoadingMask = $('<div class="-immy-loading-mask"><div class="icon"><img width="40px" height="40px" src="/global/images/loading.gif" /></div></div>').appendTo(document.body);
            potato.setConfig({
                "application": this
            });
            var that = this;
            project._globalLoading.addListener("change",function (e) {
                if(e.data>0){
                    that._globalLoadingMask.removeClass('busy').show();
                }
            });
            project._globalLoading.addListener("busy",function () {
                that._globalLoadingMask.addClass('busy').show();
            });
            project._globalLoading.addListener("free",function () {
                that._globalLoadingMask.hide();
            });
        };
        var CID = potato.createClass(CON, BaseIModule);
        potato.extendPrototype(CON, potato.Dialog);


        CON.prototype._createSubModule = function () {
        };

        CON.prototype.addLoadingItem = function (btn) {
            if(btn && btn.addClass){
                btn.addClass('btn-loading');
            }
            project._addInitLoading();
        };
        CON.prototype.removeLoadingItem = function (btn) {
            if(btn && btn.removeClass){
                btn.removeClass('btn-loading');
            }
            project._removeInitLoading();
        };
        CON.prototype.setLoadingNote = function () {

        };
        return CON;
    })();

    var BaseDialog = (function () {
        function CON(dom, opts) {
            var options = potato.copy({
                container: true,
                fixed: true,
                offset: null,
                pos: "clientCenterCenter",
                mask: true,
                size: "content",
                title: "",
                controls: ["close"],
                closeAble: true,
                tools: [],
                buttons: [],
                history: [3, 4],
                className: ''
            }, opts);
            BaseIModule.call(this, dom, null, options);
            potato.Dialog.call(this, document.createElement("div"), document.createElement("div"), "", "closed", PT._createHistory.call(this, options.history), new baseIWidgets.IWidgetLoader(dom, this));
            $.addClass(this.body, "-immy-dialog-window " + this.options.className);
            $.addClass(this.mask, "-immy-dialog-mask " + this.options.className);
            this.mask.innerHTML = '<span class="tool-close icon-cross"></span>';

            var lang = potato.lang;
            var str = '<div class="-immy-dialog-header" idom="header">';
            str += '<div class="controls" idom="controls">' +
                '<a class="tool-refresh button" ievent="dialog@refresh" title="refresh"></a>' +
                '<a class="tool-redo button" ievent="dialog@redo" title="redo"></a>' +
                '<a class="tool-close button" idom="close" ievent="dialog@close" title="close"><span class="icon-cross"></span></a>' +
                '</div><div class="tools" idom="tools">' +
                '<a class="tool-undo button" idom="undo" ievent="dialog@undo" title="undo"></a>' +
                '<a class="tool-config button" idom="config" ievent="dialog@config"></a>' +
                '<a class="tool-option button" idom="option" ievent="dialog@option"></a>' +
                '<a class="tool-edit button" idom="edit" ievent="dialog@edit"></a>' +
                '<a class="tool-add button" idom="add" ievent="dialog@add"></a>' +
                '<a class="tool-complete button" idom="complete" ievent="dialog@complete"></a>' +
                '<a class="tool-delete button" idom="deleteItem" ievent="dialog@deleteItem"></a></div>' +
                '<h3 class="subject" idom="title">Dialog</h3></div><div class="-immy-dialog-content" idom="content"></div>';
            this.body.innerHTML = str;
            var els = $(this.body).find("[idom]").groupBy("idom");
            this.header = els["header"][0];
            this.content = els["content"][0];
            this.content.appendChild(dom);
            this.title = els["title"][0];
            this.tools = els['tools'][0];
            this.controls = els['controls'][0];
            this.buttons = {
                "close": els["close"][0],
                "undo": els["undo"][0],
                "config": els["config"][0],
                "option": els["option"][0],
                "edit": els["edit"][0],
                "add": els["add"][0],
                "deleteItem": els["deleteItem"][0],
                "complete": els["complete"][0]
            };
            PT._setFixed.call(this);
            PT._setTitle.call(this);
            PT._setControls.call(this);
            PT._setTools.call(this);
            PT._setMask.call(this);
            var that = this;
            $(this.mask).on("click", function (e) {
                that.close();
                return false;
            });
            this._tempData = null;
            this._watchEvent(PT, this.header);
            els = null;
        }

        var CID = potato.createClass(CON, BaseIModule);
        potato.extendPrototype(CON, potato.Dialog);

        var PT = {
            _refreshSizeByFixed: function (rect) {
                var max = PT._setWindowSzie.call(this, rect);
                var pos = this.options.pos;
                switch (pos) {
                    case "leftTop" :
                        PT._setWindowPos.call(this, rect.left, rect.top, max[0], max[1]);
                        break;
                    case "leftTop2" :
                        PT._setWindowPos.call(this, rect.left + rect.scrollLeft, rect.top + rect.scrollTop, max[0], max[1]);
                        break;
                    case "rightBottom":
                        this.posRightBottom();
                        break;
                    case "clientCenterCenter":
                        var top = (rect.clientHeight - this.body.offsetHeight) / 2;
                        var left = (rect.clientWidth - this.body.offsetWidth) / 2;
                        PT._setWindowPos.call(this, left, top, max[0], max[1]);
                        break;
                    case "clientCenterBottom":
                        var bottom = 0;
                        var left = (rect.clientWidth - this.body.offsetWidth) / 2;
                        PT._setWindowPos.call(this, left, null, max[0], max[1], null, bottom);
                        break;
                    default :
                        pos = pos.offset();
                        PT._setWindowPos.call(this, pos.left, pos.top, max[0], max[1]);
                }
            },
            _refreshSizeByScroll: function (rect) {
                this.body.style.position = "absolute";
                var max = PT._setWindowSzie.call(this, rect);
                var pos = this.options.pos;
                switch (pos) {
                    case "leftTop" :
                        PT._setWindowPos.call(this, rect.left, rect.top, max[0], max[1]);
                        break;
                    case "leftTop2" :
                        PT._setWindowPos.call(this, rect.left + rect.scrollLeft, rect.top + rect.scrollTop, max[0], max[1]);
                        break;
                    case "rightBottom":
                        this.posRightBottom();
                        break;
                    case "clientCenterCenter":
                        var top = (rect.clientHeight - this.body.offsetHeight) / 2;
                        var left = (rect.clientWidth - this.body.offsetWidth) / 2;
                        PT._setWindowPos.call(this, left, top, max[0], max[1]);
                        break;
                    case "bodyCenter":
                        var top = (rect.clientHeight - this.body.offsetHeight) / 2 + rect.scrollTop;
                        var left = (rect.clientWidth - this.body.offsetWidth) / 2 + rect.scrollLeft;
                        PT._setWindowPos.call(this, left, top, max[0], max[1]);
                        break;
                    case "centerTop":
                        var left = rect.left + (rect.clientWidth - this.body.offsetWidth) / 2;
                        PT._setWindowPos.call(this, left, rect.top, max[0], max[1]);
                        break;
                    default :
                        var offset = $(pos).offset();
                        PT._setWindowPos.call(this, offset.left, offset.top + pos.offsetHeight, max[0], max[1]);
                }
            },
            _createHistory: function (history) {
                var cmd = new potato.Cmd();
                var that = this;
                cmd._undo = function () {
                    that.close();
                };
                return new potato.ViewHistory(history[0], history[1], cmd, function () {
                });
            },
            _ievent_dialog: function (data, target) {
                var mod = this.loader.widget || {};
                if (mod[data]) {
                    mod[data]();
                } else {
                    this[data]();
                }
                return false;
            },
            _setWindowSzie: function (rect) {
                var headerHeight = this.header.offsetHeight;
                var maxLeft, maxTop, size = this.options.size;
                var dom = this.loader.widget.dom;
                var panel = dom.parentNode;
                if(size == "content" || size[0] == "content" || size[1] == "content"){
                    dom.style.position = "absolute";
                    project._hideDiv.appendChild(dom);
                    var offsetWidth = dom.offsetWidth;
                    var offsetHeight = dom.offsetHeight;
                    panel.appendChild(dom);
                }
                if (size == "content") {
                    this.dom.style.height = offsetHeight + "px";
                    this.dom.style.width = offsetWidth + "px";
                } else if (size == "full") {
                    this.content.style.height = (rect.clientHeight - headerHeight - 10) + "px";
                    this.content.style.width = (rect.clientWidth) + "px";
                } else {
                    if (size[0] == "content") {
                        this.dom.style.width = offsetWidth + "px";
                    } else {
                        this.dom.style.width = (size[0].substr(-1) == "%" ? (rect.clientWidth * parseFloat(size[0]) / 100) + "px" : size[0]);
                    }
                    if (size[1] == "content") {
                        this.dom.style.height = offsetHeight + "px";
                    } else {
                        this.dom.style.height = (size[1].substr(-1) == "%" ? (rect.clientHeight * parseFloat(size[1]) / 100) + "px" : size[1]);
                    }
                }
                var bodyWidth = this.body.offsetWidth;
                var bodyHeight = this.body.offsetHeight;
                if (this.body.style.position == "absolute") {
                    if (bodyWidth > rect.bodyWidth) {
                        this.content.style.width = rect.bodyWidth + "px";
                    }else{
                        this.content.style.width = 'auto';
                    }
                    if (bodyHeight > rect.bodyHeight) {
                        this.content.style.height = (rect.bodyHeight - headerHeight - 10) + "px";
                    }else{
                        this.content.style.height = 'auto';
                    }
                    maxLeft = rect.bodyWidth - this.body.offsetWidth;
                    maxTop = rect.bodyHeight - this.body.offsetHeight;
                    this.mask.style.width = rect.bodyWidth + 'px';
                    this.mask.style.height = rect.bodyHeight + 'px';
                } else {
                    if (bodyWidth > rect.clientWidth) {
                        this.content.style.width = rect.clientWidth + "px";
                    }else{
                        this.content.style.width = 'auto';
                    }
                    if (bodyHeight > rect.clientHeight) {
                        this.content.style.height = (rect.clientHeight - headerHeight - 10) + "px";
                    }else{
                        this.content.style.height = 'auto';
                    }
                    maxLeft = rect.clientWidth - this.body.offsetWidth;
                    maxTop = rect.clientHeight - this.body.offsetHeight;
                    this.mask.style.width = '100%';
                    this.mask.style.height = '100%';
                }
                return [maxLeft, maxTop];
            },
            _setWindowPos: function (left, top, maxLeft, maxTop, right, bottom) {
                var offset = this.options.offset;
                if (offset) {
                    if (left !== null) {
                        left += offset[0];
                    } else {
                        right += offset[0];
                    }
                    if (top !== null) {
                        top += offset[1];
                    } else {
                        bottom += offset[1];
                    }

                }
                var style = this.body.style;
                if (left !== null) {
                    if (left < 0) {
                        left = 0;
                    }
                    if (left > maxLeft) {
                        left = maxLeft;
                    }
                    style.left = Math.round(left) + 'px';
                    style.right = "inherit";
                } else {
                    style.right = Math.round(right) + 'px';
                    style.left = "inherit";
                }
                if (top !== null) {
                    if (top < 0) {
                        top = 0;
                    }
                    if (top > maxTop) {
                        top = maxTop;
                    }
                    style.top = Math.round(top) + 'px';
                    style.bottom = "inherit";
                } else {
                    style.bottom = Math.round(bottom) + 'px';
                    style.top = "inherit";
                }
            },
            _setFixed: function () {
                var style = this.body.style;
                var style2 = this.mask.style;
                if (this.options.fixed) {
                    if (this.container == document.documentElement) {
                        style.position = "fixed";
                        style2.position = "fixed";
                    } else {
                        style.position = "absolute";
                        style2.position = "absolute";
                    }
                } else {
                    style.position = "absolute";
                }
            },
            _setTitle: function () {
                this.title.innerHTML = this.options.title;
            },
            _setControls: function (arr) {
                var div = this.controls;
                var btns = this.buttons;
                var childs = div.childNodes;
                for (var i = childs.length - 1; i >= 0; i--) {
                    div.removeChild(childs[i]);
                }
                this.options.controls && this.options.controls.forEach(function (str) {
                    div.appendChild(btns[str]);
                });
            },
            _setTools: function () {
                var div = this.tools;
                var btns = this.buttons;
                var childs = div.childNodes;
                for (var i = childs.length - 1; i >= 0; i--) {
                    div.removeChild(childs[i]);
                }
                this.options.tools && this.options.tools.forEach(function (str) {
                    div.appendChild(btns[str]);
                });
            },
            _setMask: function () {
                if (this.options.mask) {
                    $(this.mask).show();
                } else {
                    $(this.mask).hide();
                }
            },
            _setClassName: function () {
                $.addClass(this.body, this.options.className);
                $.addClass(this.mask, this.options.className);
            }
        };
        CON.prototype._onFocus = function(data){
        	var list = potato.dialogs;
        	if(list.length==1){
	            $('html').css("height","100%").css("overflow","hidden");
        	}
            return this.options.closeAble;
        }
        CON.prototype._onClose = function(data){
        	if(this.options.closeAble){
        		var list = potato.dialogs;
	        	if(list.length==2){
	                $('html').css("height","auto").css("overflow", "auto");
	        	}
        	}
        	return this.options.closeAble;
        }
        CON.prototype._onSetState = function (states, data) {
            $.removeClass(this.mask, "-potato-dialog-" + states.from);
            $.removeClass(this.body, "-potato-dialog-" + states.from);
            $.addClass(this.mask, "-potato-dialog-" + states.to);
            $.addClass(this.body, "-potato-dialog-" + states.to);
            if (states.to == "closed") {
                this.setOptions({
                    fixed: true,
                    offset: null,
                    pos: "clientCenterCenter",
                    mask: true,
                    size: "content",
                    title: "",
                    controls: ["close"],
                    tools: [],
                    buttons: [],
                    className: ''
                });
                if (states.from == "closed") {

                }
            }
        };
        CON.prototype._setIndex = function (index) {
            $(this.mask).css("z-index", (index * 2 - 1) + 1000);
            $(this.body).css("z-index", index * 2 + 1000);
        };
        CON.prototype.refreshSize = function (rect) {
            var container = this.container;
            rect = rect || {
                    bodyHeight: container.scrollHeight,
                    bodyWidth: container.scrollWidth,
                    clientHeight: container.clientHeight,
                    clientWidth: container.clientWidth,
                    scrollLeft: container.scrollLeft || window.pageXOffset || 0,
                    scrollTop: container.scrollTop || window.pageYOffset || 0
                };
            if (this.options.fixed) {
                PT._refreshSizeByFixed.call(this, rect);
            } else {
                PT._refreshSizeByScroll.call(this, rect);
            }
        };
        CON.prototype.refreshPos = function () {
            if (!this.options.fixed) {
                return true;
            }
            if (this.container == document.documentElement) {
                return true;
            }
            console.log("scroll");
        };

        /*CON.prototype.setHeader = function(title, tools){
         if(title!==null){
         this.header.style.display = "block";
         this.title.innerHTML = title;
         if(this.tools){
         var div = this.tools;
         var childs = div.childNodes;
         for(var i = childs.length - 1; i >= 0; i--) {
         div.removeChild(childs[i]);
         }
         if(tools){
         for(var key in tools){
         var item = tools[key];
         var btn;
         if(typeof(item)=="boolean"){
         btn = this.buttons[key];
         btn.innerHTML = potato.lang.Button[key];
         }else if(typeof(item)=="string"){
         btn = this.buttons[key];
         btn.innerHTML = item;
         }
         div.appendChild(btn);
         }
         }
         }
         }else{
         this.header.style.display = "none";
         }
         };*/
        /*CON.prototype._onSetState = function (states,data) {
         BaseDialog.prototype._onSetState.call(this,states,data);
         if(states.to=="closed"){
         if(this._callback){
         console.log(data);
         this._callback(data);

         }
         }
         };*/
        CON.prototype.setOptions = function (opts) {
            opts = opts || {};
            if (opts.hasOwnProperty("className")) {
                $.removeClass(this.body, this.options.className);
                $.removeClass(this.mask, this.options.className);
            }
            this.options = potato.copy(this.options, opts);
            if (opts.hasOwnProperty("fixed")) {
                PT._setFixed.call(this);
            }
            if (opts.hasOwnProperty("title")) {
                PT._setTitle.call(this);
            }
            if (opts.hasOwnProperty("controls")) {
                PT._setControls.call(this);
            }
            if (opts.hasOwnProperty("tools")) {
                PT._setTools.call(this);
            }
            if (opts.hasOwnProperty("mask")) {
                PT._setMask.call(this);
            }
            if (opts.hasOwnProperty("className")) {
                PT._setClassName.call(this);
            }
        };
        return CON;
    }());

    /*var BaseAlert = (function() {
     function CON(dom){
     BaseDialog.call(this,dom,{className:"-potato-alert"});
     var els = $(dom).find("[idom]").groupBy("idom");
     this._textDiv = els["text"][0];
     this._conDiv = els["con"][0];
     this._callback = null;
     var that = this;
     $(this._conDiv).on("click",function(e){
     if(e.target.nodeName == "BUTTON"){
     that.close(e.target.innerHTML);
     }
     return false;
     });
     els = null;
     }
     var CID = potato.createClass(CON, BaseDialog);

     CON.prototype._onSetState = function (states,data) {
     BaseDialog.prototype._onSetState.call(this,states,data);
     if(states.to=="closed"){
     if(this._callback){
     console.log(data);
     this._callback(data);

     }
     }
     };
     CON.prototype.setData = function(text, callback, buttons, selected){
     this._textDiv.innerHTML = text;
     var btns = buttons.map(function(item,i){
     return "<button class='btn3"+(i===selected?" on":"")+"' type='button'>"+item+"</button>"
     });
     this._conDiv.innerHTML = btns.join(" ");
     this._callback = callback;
     };
     return CON;
     }());*/

    var open = function (content, target, dialogOptions, data) {
        target = target || "_blank";
        var getDialog = function () {
            var dialog;
            if (target == "_self") {
                dialog = potato.getCurDialog();
            } else if (target == "_blank") {
                var list = project._dialogRecycle;
                for (var i = 0, k = list.length; i < k; i++) {
                    if (list[i].dialogState == "closed") {
                        break;
                    }
                }
                if (i == k) {
                    var div = document.createElement("div");
                    dialog = project.getIModule(div, {con: BaseDialog});
                    list.push(dialog);
                } else {
                    dialog = list[i];
                }
            }
            return dialog;
        };
        
        var pop = function (iwidget) {
            var dialog = getDialog();
            if (dialogOptions) {
                var opts;
                if (typeof(dialogOptions) == "string") {
                    dialogOptions = {type: dialogOptions};
                }
                if (dialogOptions.type == "slideUp") {
                    dialogOptions = $.extend({"pos": "clientCenterBottom", "offset": [0, 20], "className": "slideUp"},dialogOptions);
                } else if (dialogOptions.type == "maxWidth") {
                    dialogOptions = $.extend({"pos": "clientCenterCenter", "size": ["84%", "content"]},dialogOptions);
                } else if (dialogOptions.type == "maxWidthHeight") {
                    dialogOptions = $.extend({"pos": "clientCenterCenter", "size": ["84%", "90%"]},dialogOptions);
                }
                dialog.setOptions(dialogOptions);
            }
            dialog.load(iwidget, data);
            dialog.focus();
            this.replaceResult && this.replaceResult(dialog);
            return dialog;
        };
        
        if (!(content instanceof potato.Widget)) {
            if (content.nodeType === 1 && !content.hasAttribute("imodule")) {
                content = new potato.Widget(content);
            } else {
                content = project.getIModule(content, data);
            }
        }
        if (content instanceof potato.Proxy) {
            content.addSuccessCaller(pop);
            return content;
        } else {
            return pop(content);
        }
    };

    project.open = open;

    project.baseIModules = {
        BaseIPage: BaseIPage,
        BaseIModule: BaseIModule,
        BaseDialog: BaseDialog
    };

    potato2.setConfig({
        requireJS: require,
        application: new pdom.DomApplication(),
    });

})();



