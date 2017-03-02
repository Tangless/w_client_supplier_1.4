(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["potato2"] = factory();
	else
		root["potato2"] = factory();
})(this, function() {
return __webpackBootstrap
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(1)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, cache) {
	    "use strict";
	    exports.cache = cache;
	    var namespace = 'potato';
	    exports.namespace = namespace;
	    exports.TaskCountEvent = {
	        Added: "TaskCountEvent.Added",
	        Completed: "TaskCountEvent.Completed",
	        Busy: "TaskCountEvent.Busy",
	        Free: "TaskCountEvent.Free"
	    };
	    Object.freeze(exports.TaskCountEvent);
	    exports.VPresenterEvent = {
	        Installed: "CPresenterEvent.Installed",
	        Uninstalled: "CPresenterEvent.Uninstalled",
	        ChildAppended: "CPresenterEvent.ChildAppended",
	        ChildRemoved: "CPresenterEvent.ChildRemoved",
	    };
	    exports.VPresenterTransaction = {
	        AllowInstall: "AllowInstall"
	    };
	    exports.DialogEvent = {
	        Focused: "DialogEvent.Focused",
	        Blured: "DialogEvent.Blured",
	        Closed: "DialogEvent.Closed",
	    };
	    Object.freeze(exports.VPresenterEvent);
	    var PEvent = (function () {
	        function PEvent(name, data, bubbling) {
	            if (bubbling === void 0) { bubbling = false; }
	            this.name = name;
	            this.data = data;
	            this.bubbling = bubbling;
	        }
	        PEvent.prototype._setTarget = function (target) {
	            this.target = target;
	            return this;
	        };
	        return PEvent;
	    }());
	    exports.PEvent = PEvent;
	    var PError = (function () {
	        function PError(name, note, data) {
	            if (note === void 0) { note = "potato.PError"; }
	            this.name = name;
	            this.note = note;
	            this.data = data;
	        }
	        PError.prototype.getNamespace = function () {
	            return namespace;
	        };
	        return PError;
	    }());
	    exports.PError = PError;
	    function emptyObject(obj) {
	        Object.keys(obj).forEach(function (key) {
	            delete obj[key];
	        });
	        return obj;
	    }
	    var PDispatcher = (function () {
	        function PDispatcher(parent) {
	            this.parent = parent;
	            this._handlers = {};
	        }
	        PDispatcher.prototype.addListener = function (ename, handler) {
	            var dictionary = this._handlers[ename];
	            if (!dictionary) {
	                this._handlers[ename] = dictionary = [];
	            }
	            dictionary.push(handler);
	            return this;
	        };
	        PDispatcher.prototype.removeListener = function (ename, handler) {
	            if (!ename) {
	                emptyObject(this._handlers);
	            }
	            else {
	                var handlers = this._handlers;
	                if (handlers.propertyIsEnumerable(ename)) {
	                    var dictionary = handlers[ename];
	                    if (!handler) {
	                        delete handlers[ename];
	                    }
	                    else {
	                        var n = dictionary.indexOf(handler);
	                        if (n > -1) {
	                            dictionary.splice(n, 1);
	                        }
	                        if (dictionary.length == 0) {
	                            delete handlers[ename];
	                        }
	                    }
	                }
	            }
	            return this;
	        };
	        PDispatcher.prototype.dispatch = function (e) {
	            if (!e.target) {
	                e._setTarget(this);
	            }
	            var dictionary = this._handlers[e.name];
	            if (dictionary) {
	                for (var i = 0, k = dictionary.length; i < k; i++) {
	                    dictionary[i](e);
	                }
	            }
	            if (this.parent && e.bubbling) {
	                this.parent.dispatch(e);
	            }
	            return this;
	        };
	        PDispatcher.prototype.setParent = function (parent) {
	            this.parent = parent;
	            return this;
	        };
	        return PDispatcher;
	    }());
	    exports.PDispatcher = PDispatcher;
	    (function (TaskCounterState) {
	        TaskCounterState[TaskCounterState["Free"] = 0] = "Free";
	        TaskCounterState[TaskCounterState["Busy"] = 1] = "Busy";
	    })(exports.TaskCounterState || (exports.TaskCounterState = {}));
	    var TaskCounterState = exports.TaskCounterState;
	    ;
	    var TaskCounter = (function (_super) {
	        __extends(TaskCounter, _super);
	        function TaskCounter(deferSecond) {
	            _super.call(this);
	            this.deferSecond = deferSecond;
	            this.list = [];
	            this.state = TaskCounterState.Free;
	        }
	        TaskCounter.prototype.addItem = function (promise, note) {
	            var _this = this;
	            if (!this.list.find(function (item) { return item.promise === promise; })) {
	                this.list.push({ promise: promise, note: note });
	                promise.then(function (value) { return _this._completeItem(promise); }, function (reason) { return _this._completeItem(promise); });
	                this.dispatch(new PEvent(exports.TaskCountEvent.Added));
	                if (!this._timer) {
	                    this._timer = window.setTimeout(function () {
	                        _this._timer = 0;
	                        if (_this.list.length > 0 && _this.state == TaskCounterState.Free) {
	                            _this.state = exports.TaskCountEvent.Busy;
	                            _this.dispatch(new PEvent(exports.TaskCountEvent.Busy));
	                        }
	                    }, this.deferSecond * 1000);
	                }
	            }
	            return this;
	        };
	        TaskCounter.prototype._completeItem = function (promise) {
	            var i = this.list.findIndex(function (item) { return item.promise === promise; });
	            if (i > -1) {
	                this.list.splice(i, 1);
	                this.dispatch(new PEvent(exports.TaskCountEvent.Completed));
	                if (this.list.length == 0) {
	                    if (this._timer) {
	                        clearTimeout(this._timer);
	                        this._timer = 0;
	                    }
	                    if (this.state == TaskCounterState.Busy) {
	                        this.state = exports.TaskCountEvent.Free;
	                        this.dispatch(new PEvent(exports.TaskCountEvent.Free));
	                    }
	                }
	            }
	            return this;
	        };
	        return TaskCounter;
	    }(PDispatcher));
	    exports.TaskCounter = TaskCounter;
	    var taskCounter = new TaskCounter(3);
	    exports.taskCounter = taskCounter;
	    var VPresenter = (function (_super) {
	        __extends(VPresenter, _super);
	        function VPresenter(view, parent) {
	            _super.call(this, parent);
	            this.view = view;
	        }
	        VPresenter.prototype._allowInstallTo = function (parent) {
	            return true;
	        };
	        VPresenter.prototype._allowUninstallTo = function (parent) {
	            return true;
	        };
	        VPresenter.prototype._allowAppendChild = function (child) {
	            return true;
	        };
	        VPresenter.prototype._allowRemoveChild = function (child) {
	            return true;
	        };
	        VPresenter.prototype._installTo = function (parent) {
	            _super.prototype.setParent.call(this, parent);
	            this.dispatch(new PEvent(exports.VPresenterEvent.Installed));
	        };
	        VPresenter.prototype._uninstallTo = function (parent) {
	            _super.prototype.setParent.call(this, undefined);
	            this.dispatch(new PEvent(exports.VPresenterEvent.Uninstalled));
	        };
	        VPresenter.prototype._afterRemoveChild = function (member) {
	            this.view.removeChild(member.view);
	        };
	        VPresenter.prototype._afterAppendChild = function (member) {
	            this.view.appendChild(member.view);
	        };
	        VPresenter.prototype._beforeRemoveChild = function (member) {
	        };
	        VPresenter.prototype._beforeAppendChild = function (member) {
	        };
	        VPresenter.prototype._checkRemoveChild = function (member) {
	            if (member.parent != this) {
	                return true;
	            }
	            if (!member._allowUninstallTo(this) ||
	                !this._allowRemoveChild(member)) {
	                return false;
	            }
	            return true;
	        };
	        VPresenter.prototype.removeChild = function (member, checked) {
	            if (member.parent != this) {
	                return false;
	            }
	            if (!checked && !this._checkRemoveChild(member)) {
	                return false;
	            }
	            this._beforeRemoveChild(member);
	            member._uninstallTo(this);
	            this._afterRemoveChild(member);
	            this.dispatch(new PEvent(exports.VPresenterEvent.ChildRemoved));
	            return true;
	        };
	        VPresenter.prototype._checkAppendChild = function (member) {
	            if (member.parent == this) {
	                return true;
	            }
	            if (!member._allowInstallTo(this) ||
	                !this._allowAppendChild(member) ||
	                (member.parent && (!member._allowUninstallTo(this) || !member.parent._allowRemoveChild(member)))) {
	                return false;
	            }
	            return true;
	        };
	        VPresenter.prototype.appendChild = function (member, checked) {
	            if (member.parent == this) {
	                return false;
	            }
	            if (!checked && !this._checkAppendChild(member)) {
	                return false;
	            }
	            if (member.parent) {
	                member.parent.removeChild(member, true);
	            }
	            this._beforeAppendChild(member);
	            member._installTo(this);
	            this._afterAppendChild(member);
	            this.dispatch(new PEvent(exports.VPresenterEvent.ChildAppended));
	            return true;
	        };
	        VPresenter.prototype._update = function () {
	            return Promise.resolve(this);
	        };
	        return VPresenter;
	    }(PDispatcher));
	    exports.VPresenter = VPresenter;
	    var alert = window.alert;
	    exports.alert = alert;
	    var request = function (request) {
	        return Promise.resolve('foo');
	    };
	    function load(requestOptions) {
	        var cacheResult = cache.getItem(requestOptions.url);
	        if (cacheResult && !cacheResult.version) {
	            return Promise.resolve(cacheResult.toData());
	        }
	        else {
	            if (cacheResult && cacheResult.version) {
	                requestOptions.version = cacheResult.version;
	            }
	            return request(requestOptions).then(function (requestResult) {
	                var data, dataType, type, expired, version, encryption;
	                var cacheData = requestResult.cache;
	                var result;
	                if (cacheData) {
	                    type = cacheData.type;
	                    expired = cacheData.expired;
	                    version = cacheData.version;
	                    encryption = cacheData.encryption;
	                    if (type === undefined && requestResult.notModified && cacheResult) {
	                        type = cacheResult.from;
	                    }
	                }
	                if (!requestResult.notModified) {
	                    data = requestResult.data;
	                    dataType = requestResult.dataType;
	                    if (typeof data == 'string') {
	                        result = cache.parseContent(dataType, data);
	                    }
	                    else {
	                        result = data;
	                    }
	                }
	                else if (cacheResult) {
	                    result = cacheResult.toData();
	                }
	                else {
	                    result = null;
	                }
	                if (type !== undefined) {
	                    cache.setItem(requestOptions.url, new cache.CacheContent(data, dataType, expired, version, encryption), type);
	                }
	                return result;
	            });
	        }
	    }
	    exports.load = load;
	    var requireJS;
	    function getVPresenter(url) {
	        var vpm, vp, promise;
	        try {
	            vpm = requireJS(url);
	            vp = vpm.main;
	            promise = Promise.resolve(vp);
	        }
	        catch (e) {
	            promise = new Promise(function (resolve, reject) {
	                requireJS([url], function (vpm) {
	                    vp = vpm.main;
	                    resolve(vp);
	                }, function (error) {
	                    reject(error);
	                });
	            });
	        }
	        return promise.then(function (vp) {
	            return vp._update();
	        });
	    }
	    exports.getVPresenter = getVPresenter;
	    (function (DialogState) {
	        DialogState[DialogState["Focused"] = 0] = "Focused";
	        DialogState[DialogState["Blured"] = 1] = "Blured";
	        DialogState[DialogState["Closed"] = 2] = "Closed";
	    })(exports.DialogState || (exports.DialogState = {}));
	    var DialogState = exports.DialogState;
	    ;
	    (function (DialogPosition) {
	        DialogPosition[DialogPosition["Left"] = 0] = "Left";
	        DialogPosition[DialogPosition["Center"] = 1] = "Center";
	        DialogPosition[DialogPosition["Right"] = 2] = "Right";
	        DialogPosition[DialogPosition["Top"] = 3] = "Top";
	        DialogPosition[DialogPosition["Middle"] = 4] = "Middle";
	        DialogPosition[DialogPosition["Bottom"] = 5] = "Bottom";
	    })(exports.DialogPosition || (exports.DialogPosition = {}));
	    var DialogPosition = exports.DialogPosition;
	    (function (DialogSize) {
	        DialogSize[DialogSize["Content"] = 0] = "Content";
	        DialogSize[DialogSize["Full"] = 1] = "Full";
	    })(exports.DialogSize || (exports.DialogSize = {}));
	    var DialogSize = exports.DialogSize;
	    var Dialog = (function (_super) {
	        __extends(Dialog, _super);
	        function Dialog(els, config) {
	            _super.call(this, els.view, undefined);
	            this.state = DialogState.Closed;
	            this.content = null;
	            this._dialogList = [];
	            this._zindex = -1;
	            this.config = {
	                className: '',
	                masked: true,
	                position: { x: DialogPosition.Center, y: DialogPosition.Middle },
	                size: { width: "50%", height: "50%" },
	                fixed: true,
	                offset: { x: 0, y: 0 },
	                effect: "",
	                asideOnRight: false,
	                asideInBody: false,
	                headerEffect: undefined,
	                footerEffect: undefined,
	                asideEffect: undefined,
	                bodyEffect: undefined
	            };
	            this.dialog = els.dialog;
	            this.mask = els.mask;
	            this.body = els.body;
	            this.header = els.header;
	            this.footer = els.footer;
	            this.aside = els.aside;
	            this.view.addClass("pt-" + DialogState[this.state]);
	            if (config) {
	                this.setConfig(config);
	            }
	        }
	        Dialog.prototype.setConfig = function (config) {
	            var oldConfig = this.config;
	            this.config = Object.assign({}, this.config, config);
	            this._afterConfigChange(oldConfig);
	        };
	        Dialog.prototype.getZIndex = function () {
	            return this._zindex;
	        };
	        Dialog.prototype._afterConfigChange = function (oldConfig) {
	            this.view.removeClass([oldConfig.className, oldConfig.effect, oldConfig.masked ? "pt-masked" : "", oldConfig.asideOnRight ? "pt-asideOnRight" : "pt-asideOnLeft", oldConfig.asideInBody ? "pt-asideInBody" : "pt-asideOutBody"].join(" "));
	            this.view.addClass([this.config.className, this.config.effect, this.config.masked ? "pt-masked" : "", this.config.asideOnRight ? "pt-asideOnRight" : "pt-asideOnLeft", this.config.asideInBody ? "pt-asideInBody" : "pt-asideOutBody"].join(" "));
	        };
	        Dialog.prototype._setZIndex = function (i) {
	            this._zindex = i;
	            this.view.setZIndex(i);
	        };
	        Dialog.prototype._countIndex = function () {
	            this._dialogList.forEach(function (dialog, index) {
	                dialog._setZIndex(index);
	            });
	        };
	        Dialog.prototype._beforeFocus = function () {
	        };
	        Dialog.prototype._afterFocus = function () {
	        };
	        Dialog.prototype._beforeClose = function () {
	        };
	        Dialog.prototype._afterClose = function () {
	        };
	        Dialog.prototype._beforeBlur = function () {
	        };
	        Dialog.prototype._afterBlur = function () {
	        };
	        Dialog.prototype._allowFocus = function (closeAction) {
	            /*
	            close{
	                需要将第2个focus{
	                    不需要将第1个blur
	                    不需要将父focus
	                }
	                不需要将第2个focus
	            }
	            focus{
	                新加入的{
	                    将第一个blur
	                    将父focus
	                }
	                已存在的{
	                    将第一个blur
	                    将父focus
	                }
	            }
	            */
	            return true;
	        };
	        Dialog.prototype._allowBlur = function () {
	            return true;
	        };
	        Dialog.prototype._allowClose = function () {
	            return true;
	        };
	        Dialog.prototype._checkFocus = function () {
	            if (this == application) {
	                return true;
	            }
	            if (!this.parent) {
	                return false;
	            }
	            var parentDialog = this.parent;
	            if (this.state != DialogState.Focused) {
	                if (!this._allowFocus()) {
	                    return false;
	                }
	                var list = parentDialog._dialogList;
	                var dialog = list[list.length - 1];
	                if (dialog && dialog != this && !dialog._allowBlur()) {
	                    return false;
	                }
	            }
	            return parentDialog._checkFocus();
	        };
	        Dialog.prototype._checkClose = function () {
	            if (this.state == DialogState.Closed) {
	                return true;
	            }
	            if (!this.parent) {
	                return false;
	            }
	            if (!this._allowClose()) {
	                return false;
	            }
	            var parentDialog = this.parent;
	            if (this.state == DialogState.Focused) {
	                var list = parentDialog._dialogList;
	                var dialog = list[list.length - 2];
	                if (dialog && !dialog._allowFocus()) {
	                    return false;
	                }
	            }
	            return true;
	        };
	        Dialog.prototype.focus = function (checked) {
	            /* 三种调用场景：1.由close()上文调用；2.当前为closed状态; 3.当前为blured状态 */
	            //if (this.state == DialogState.Focused) { return false; }
	            if (!checked && !this._checkFocus()) {
	                return false;
	            }
	            var parentDialog = this.parent;
	            var list = parentDialog._dialogList;
	            var blurDialog = list[list.length - 1];
	            var initiative = true;
	            if (this.state != DialogState.Focused) {
	                if (blurDialog == this) {
	                    blurDialog = undefined;
	                    initiative = false;
	                }
	                this._beforeFocus();
	                if (initiative) {
	                    if (this.state == DialogState.Blured) {
	                        var i = list.indexOf(this);
	                        (i > -1) && list.splice(i, 1);
	                    }
	                    list.push(this);
	                    parentDialog._countIndex();
	                }
	            }
	            if (initiative) {
	                parentDialog.focus();
	            }
	            if (this.state != DialogState.Focused) {
	                blurDialog && blurDialog._blur();
	                var curState = this.state;
	                this._setState(DialogState.Focused);
	                if (curState == DialogState.Closed) {
	                    this.refreshSize();
	                    this.refreshPosition();
	                    this.refreshLayout();
	                }
	                this._afterFocus();
	                this.dispatch(new PEvent(exports.DialogEvent.Focused));
	            }
	            return true;
	        };
	        Dialog.prototype.close = function () {
	            if (this.state == DialogState.Closed || !this._checkClose()) {
	                return false;
	            }
	            this._beforeClose();
	            var parentDialog = this.parent;
	            var list = parentDialog._dialogList;
	            var focusDialog = null;
	            if (list[list.length - 1] == this) {
	                list.pop();
	                focusDialog = list[list.length - 1];
	            }
	            else {
	                var i = list.indexOf(this);
	                (i > -1) && list.splice(i, 1);
	                this._countIndex();
	            }
	            this._setZIndex(-1);
	            this._setState(DialogState.Closed);
	            this.refreshSize();
	            this.refreshPosition();
	            this.refreshLayout();
	            this._afterClose();
	            this.dispatch(new PEvent(exports.DialogEvent.Closed));
	            focusDialog && focusDialog.focus(true);
	            return true;
	        };
	        Dialog.prototype._blur = function () {
	            if (this.state == DialogState.Blured) {
	                return;
	            }
	            this._beforeBlur();
	            this._setState(DialogState.Blured);
	            this._afterBlur();
	            this.dispatch(new PEvent(exports.DialogEvent.Blured));
	        };
	        Dialog.prototype._setState = function (state) {
	            this.view.removeClass("pt-" + DialogState[this.state]);
	            this.state = state;
	            this.view.addClass("pt-" + DialogState[this.state]);
	        };
	        Dialog.prototype._allowAppendChild = function (member) {
	            if (member instanceof Dialog) {
	                if (member.state != DialogState.Closed) {
	                    return false;
	                }
	            }
	            return true;
	        };
	        Dialog.prototype.appendChild = function (child) {
	            if (child.parent == this) {
	                return false;
	            }
	            if (!this._checkAppendChild(child)) {
	                return false;
	            }
	            if (!(child instanceof Dialog)) {
	                var oldContent = this.content;
	                if (this.content) {
	                    var member = this.content;
	                    if (member.parent != this) {
	                        return false;
	                    }
	                    if (!this._checkRemoveChild(member)) {
	                        return false;
	                    }
	                    this.removeChild(member, true);
	                }
	                this.content = child;
	            }
	            return _super.prototype.appendChild.call(this, child, true);
	        };
	        Dialog.prototype._afterAppendChild = function (member) {
	            if (member instanceof Dialog) {
	                this.view.appendChild(member.view);
	            }
	            else {
	                if (this.body) {
	                    this.body.appendChild(member.view);
	                }
	                else {
	                    this.dialog.appendChild(member.view);
	                }
	                if (member instanceof WholeVPresenter) {
	                    var view = member.getHeader();
	                    if (view && this.header) {
	                        this.header.appendChild(view);
	                    }
	                    view = member.getFooter();
	                    if (view && this.footer) {
	                        this.footer.appendChild(view);
	                    }
	                    view = member.getAside();
	                    if (view && this.aside) {
	                        this.aside.appendChild(view);
	                    }
	                }
	                if (this.state != DialogState.Closed) {
	                    if (this.config.size.width == DialogSize.Content || this.config.size.height == DialogSize.Content) {
	                        this.refreshSize();
	                        this.refreshPosition();
	                        this.refreshLayout();
	                    }
	                    else {
	                        this.refreshLayout();
	                    }
	                }
	            }
	        };
	        Dialog.prototype._afterRemoveChild = function (member) {
	            if (member instanceof Dialog) {
	                this.view.removeChild(member.view);
	            }
	            else {
	                if (this.body) {
	                    this.body.removeChild(member.view);
	                }
	                else {
	                    this.dialog.removeChild(member.view);
	                }
	                if (member instanceof WholeVPresenter) {
	                    var view = member.getHeader();
	                    if (view && this.header) {
	                        this.header.removeChild(view);
	                    }
	                    view = member.getFooter();
	                    if (view && this.footer) {
	                        this.footer.removeChild(view);
	                    }
	                    view = member.getAside();
	                    if (view && this.aside) {
	                        this.aside.removeChild(view);
	                    }
	                }
	            }
	        };
	        Dialog.prototype.refreshSize = function () {
	        };
	        Dialog.prototype.refreshPosition = function () {
	        };
	        Dialog.prototype.refreshLayout = function () {
	        };
	        return Dialog;
	    }(VPresenter));
	    exports.Dialog = Dialog;
	    // export interface WholeVPresenter {
	    //     getHeader: ()=>View|null;
	    //     getFooter: ()=>View|null;
	    //     getAside: ()=>View|null;
	    // }
	    var WholeVPresenter = (function (_super) {
	        __extends(WholeVPresenter, _super);
	        function WholeVPresenter() {
	            _super.apply(this, arguments);
	        }
	        WholeVPresenter.prototype.getHeader = function () { return null; };
	        WholeVPresenter.prototype.getFooter = function () { return null; };
	        WholeVPresenter.prototype.getAside = function () { return null; };
	        return WholeVPresenter;
	    }(VPresenter));
	    exports.WholeVPresenter = WholeVPresenter;
	    function emptyFun(arg) {
	    }
	    exports.emptyFun = emptyFun;
	    var Application = (function (_super) {
	        __extends(Application, _super);
	        function Application(els) {
	            _super.call(this, els);
	            this._setZIndex(0);
	            this._setState(DialogState.Focused);
	        }
	        Application.prototype.close = function () {
	            return false;
	        };
	        Application.prototype.focus = function (checked) {
	            return false;
	        };
	        return Application;
	    }(Dialog));
	    exports.Application = Application;
	    var application;
	    exports.application = application;
	    function include() {
	        var args = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            args[_i - 0] = arguments[_i];
	        }
	        //console.log(resource);
	    }
	    exports.include = include;
	    function setConfig(data) {
	        if (data.namespace) {
	            exports.namespace = namespace = data.namespace;
	        }
	        if (data.alert) {
	            exports.alert = alert = data.alert;
	        }
	        if (data.request) {
	            request = data.request;
	        }
	        if (data.requireJS) {
	            requireJS = data.requireJS;
	        }
	        if (data.application) {
	            exports.application = application = data.application;
	        }
	    }
	    exports.setConfig = setConfig;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
	    var CacheDataProps = ['cipher', 'expired', 'version', 'encryption', 'wtime', 'rtime'];
	    var CacheOptionsProps = ['value', 'expired', 'version', 'encryption'];
	    function nowTime() {
	        return Math.floor(Date.now() / 1000);
	    }
	    var CacheResult = (function () {
	        /**
	         * Comment for method ´doSomething´.
	         * @param value  Comment for parameter ´target´.
	         * @returns       Comment for return value.
	         */
	        function CacheResult(value, version, from) {
	            this.value = value;
	            this.version = version;
	            this.from = from;
	        }
	        CacheResult.prototype.toData = function () {
	            if (this._data === undefined) {
	                var n = this.value.indexOf(",");
	                var code = this.value.substr(n + 1);
	                var type = this.value.substr(0, n);
	                this._data = parseContent(type, code);
	            }
	            return this._data;
	        };
	        return CacheResult;
	    }());
	    exports.CacheResult = CacheResult;
	    function parseContent(contentType, content) {
	        var serialization = config.serializations[contentType];
	        return serialization ? serialization.decode(content) : content;
	    }
	    exports.parseContent = parseContent;
	    var CacheContent = (function () {
	        function CacheContent(data, dataType, expired, version, encryption) {
	            this.data = data;
	            this.dataType = dataType;
	            this.expired = expired;
	            this.version = version;
	            this.encryption = encryption;
	        }
	        CacheContent.prototype.toValue = function () {
	            if (this._str === undefined && this.data !== undefined) {
	                var dataType = this.dataType || 'text';
	                if (typeof (this.data) == 'string') {
	                    this._str = dataType + "," + this.data;
	                }
	                else {
	                    var serialization = config.serializations[dataType];
	                    this._str = dataType + "," + (serialization ? serialization.encode(this.data) : this.data.toString());
	                }
	            }
	            return this._str;
	        };
	        CacheContent.prototype.toOptions = function () {
	            var options = assign(CacheOptionsProps, {}, this);
	            options.value = this.toValue();
	            return options;
	        };
	        return CacheContent;
	    }());
	    exports.CacheContent = CacheContent;
	    var CacheItem = (function () {
	        function CacheItem(item) {
	            this._checkValidTime = -1;
	            this.expired = '20';
	            this.version = '';
	            this.encryption = false;
	            this.wtime = '0';
	            this.rtime = '0';
	            if (item) {
	                if (item instanceof CacheItem) {
	                    assign(CacheItem.Props, this, item.toPropsData());
	                }
	                else {
	                    this.expired = item.expired;
	                    this.version = item.version;
	                    this.encryption = item.encryption;
	                    this.wtime = item.wtime;
	                    this.rtime = item.rtime;
	                    this._cipher = item.cipher;
	                }
	            }
	        }
	        CacheItem.prototype.getValue = function () {
	            if (this._value === undefined) {
	                if (this.encryption && this._cipher) {
	                    this._value = config.encryption.decrypt(this._cipher);
	                }
	                else {
	                    this._value = this._cipher + '';
	                }
	            }
	            return this._value;
	        };
	        CacheItem.prototype.getCipher = function () {
	            if (this._cipher === undefined) {
	                if (this.encryption && this._value) {
	                    this._cipher = config.encryption.encrypt(this._value);
	                }
	                else {
	                    this._cipher = this._value + '';
	                }
	            }
	            return this._cipher;
	        };
	        CacheItem.prototype.getValid = function () {
	            var now = Date.now();
	            if (now - this._checkValidTime > 1000) {
	                this._valid = this._countValid();
	                this._checkValidTime = now;
	            }
	            return this._valid;
	        };
	        CacheItem.prototype._countValid = function () {
	            var valid = true;
	            var num = parseInt(this.expired);
	            if (!isNaN(num)) {
	                if (num > 0) {
	                    valid = (nowTime() - parseInt(this.wtime)) < parseInt(this.expired);
	                }
	                else if (num = 0) {
	                    valid = false;
	                }
	                else {
	                    valid = true;
	                }
	            }
	            else {
	                valid = new Date() < new Date(this.expired);
	            }
	            if (!valid && !this.version) {
	                return -1;
	            }
	            return valid ? 1 : 0;
	        };
	        CacheItem.prototype.toObject = function () {
	            var valid = this.getValid();
	            if (valid == -1) {
	                return null;
	            }
	            else if (valid == 0) {
	                return { value: this.getValue(), version: this.version };
	            }
	            else {
	                return { value: this.getValue(), version: '' };
	            }
	        };
	        CacheItem.prototype.toCacheData = function () {
	            return {
	                cipher: this.getCipher(),
	                expired: this.expired,
	                version: this.version,
	                encryption: this.encryption,
	                wtime: this.wtime,
	                rtime: this.rtime
	            };
	        };
	        CacheItem.prototype.toPropsData = function () {
	            return assign(CacheItem.Props, {}, this);
	        };
	        CacheItem.prototype.setCacheOptions = function (options) {
	            this.rtime = this.wtime = nowTime() + '';
	            if (options.value !== undefined) {
	                if (options.value != this._value) {
	                    this._value = options.value;
	                    this._cipher = undefined;
	                }
	            }
	            if (options.encryption !== undefined) {
	                if (options.encryption != this.encryption) {
	                    this.encryption = options.encryption;
	                    this._cipher = undefined;
	                }
	            }
	            if (options.expired !== undefined) {
	                this.expired = options.expired;
	            }
	            if (options.version !== undefined) {
	                this.version = options.version;
	            }
	        };
	        CacheItem.prototype.clone = function () {
	            return new CacheItem(this);
	        };
	        CacheItem.prototype.updateReadTime = function () {
	            this.rtime = nowTime() + '';
	        };
	        CacheItem.Props = ['_value', '_cipher', '_valid', '_checkValidTime', 'expired', 'version', 'encryption', 'wtime', 'rtime'];
	        return CacheItem;
	    }());
	    function assign(props, target) {
	        var objs = [];
	        for (var _i = 2; _i < arguments.length; _i++) {
	            objs[_i - 2] = arguments[_i];
	        }
	        for (var _a = 0, objs_1 = objs; _a < objs_1.length; _a++) {
	            var obj = objs_1[_a];
	            for (var _b = 0, props_1 = props; _b < props_1.length; _b++) {
	                var key = props_1[_b];
	                if (obj.hasOwnProperty(key)) {
	                    target[key] = obj[key];
	                }
	            }
	        }
	        return target;
	    }
	    function objectAssign(target) {
	        var objs = [];
	        for (var _i = 1; _i < arguments.length; _i++) {
	            objs[_i - 1] = arguments[_i];
	        }
	        for (var _a = 0, objs_2 = objs; _a < objs_2.length; _a++) {
	            var obj = objs_2[_a];
	            for (var key in obj) {
	                if (obj.hasOwnProperty(key)) {
	                    target[key] = obj[key];
	                }
	            }
	        }
	        return target;
	    }
	    var RamEntity = (function () {
	        function RamEntity() {
	            this._data = {};
	        }
	        RamEntity.prototype.getItem = function (key) {
	            var data = this._data[key];
	            if (!data) {
	                return null;
	            }
	            return assign(CacheDataProps, {}, data);
	        };
	        RamEntity.prototype.setItem = function (key, data) {
	            this._data[key] = assign(CacheDataProps, {}, data);
	        };
	        RamEntity.prototype.removeItem = function (key) {
	            delete this._data[key];
	        };
	        RamEntity.prototype.keys = function () {
	            return Object.keys(this._data);
	        };
	        RamEntity.prototype.clear = function () {
	            this._data = {};
	        };
	        return RamEntity;
	    }());
	    var StorageEntity = (function () {
	        function StorageEntity(storage) {
	            this.storage = storage;
	        }
	        StorageEntity.prototype.keys = function () {
	            var list = [];
	            for (var i = 0, k = this.storage.length; i < k; i++) {
	                var key = this.storage.key(i) || '';
	                if (key.indexOf(config.namespace) == 0) {
	                    list.push(key.substr(config.namespace.length));
	                }
	            }
	            return list;
	        };
	        StorageEntity.prototype.clear = function () {
	            for (var _i = 0, _a = this.keys(); _i < _a.length; _i++) {
	                var key = _a[_i];
	                this.removeItem(key);
	            }
	        };
	        StorageEntity.prototype.getItem = function (key) {
	            var str = this.storage.getItem(config.namespace + key);
	            if (!str) {
	                return null;
	            }
	            var n = str.indexOf("|");
	            var _a = str.substr(0, n).split(','), expired = _a[0], version = _a[1], encryptionString = _a[2], wtime = _a[3], rtime = _a[4];
	            var encryption = encryptionString ? true : false;
	            var cipher = str.substr(n + 1);
	            return { cipher: cipher, expired: expired, version: version, encryption: encryption, wtime: wtime, rtime: rtime };
	        };
	        StorageEntity.prototype.setItem = function (key, data) {
	            key = config.namespace + key;
	            var value = data.expired + "," + data.version + "," + (data.encryption ? '1' : '') + "," + data.wtime + "," + data.rtime + "|" + data.cipher;
	            this.storage.setItem(key, value);
	        };
	        StorageEntity.prototype.removeItem = function (key) {
	            this.storage.removeItem(config.namespace + key);
	        };
	        return StorageEntity;
	    }());
	    var Shim = (function () {
	        function Shim(enity) {
	            this.enity = enity;
	            this._data = {};
	            this._clearUpUnitNum = 1 * 1024 * 1024;
	        }
	        Shim.prototype.clear = function () {
	            this._data = {};
	            this.enity.clear();
	        };
	        Shim.prototype._clearUp = function (size) {
	            var keys = this.enity.keys();
	            var free = 0;
	            var recover = function (item) {
	                free += item.getCipher().length;
	            };
	            var list = [];
	            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
	                var key = keys_1[_i];
	                var item = this._getItem(key, recover);
	                if (item) {
	                    list.push({ key: key, rtime: parseInt(item.rtime), item: item });
	                }
	            }
	            if (free - size < this._clearUpUnitNum) {
	                list.sort(function (o, p) {
	                    var a = o.rtime;
	                    var b = p.rtime;
	                    if (a == b) {
	                        return 0;
	                    }
	                    return (a < b ? -1 : 1);
	                });
	                for (var _a = 0, list_1 = list; _a < list_1.length; _a++) {
	                    var obj = list_1[_a];
	                    var key = obj.key;
	                    this._data[key] = null;
	                    this.enity.removeItem(key);
	                    recover(obj.item);
	                    if (free - size >= this._clearUpUnitNum) {
	                        return;
	                    }
	                }
	            }
	        };
	        Shim.prototype.getItem = function (key) {
	            var item = this._getItem(key);
	            if (item) {
	                item.updateReadTime();
	                this._setItem(key, item);
	                return item.toObject();
	            }
	            else {
	                return null;
	            }
	        };
	        Shim.prototype._getItem = function (key, recover) {
	            if (!this._data.hasOwnProperty(key)) {
	                var item_1 = this.enity.getItem(key);
	                this._data[key] = item_1 ? new CacheItem(item_1) : null;
	            }
	            var item = this._data[key];
	            if (!item) {
	                return null;
	            }
	            var valid = item.getValid();
	            if (valid == -1) {
	                this._data[key] = null;
	                this.enity.removeItem(key);
	                recover && recover(item);
	                return null;
	            }
	            return item.clone();
	        };
	        Shim.prototype.setItem = function (key, options) {
	            var item = this._getItem(key);
	            if (!item) {
	                item = new CacheItem();
	            }
	            item.setCacheOptions(options);
	            return this._setItem(key, item);
	        };
	        Shim.prototype._setItem = function (key, item) {
	            var cacheData = item.toCacheData();
	            try {
	                this.enity.setItem(key, cacheData);
	            }
	            catch (error) {
	                this._clearUp(cacheData.cipher.length);
	                try {
	                    this.enity.setItem(key, cacheData);
	                }
	                catch (error) {
	                    return false;
	                }
	            }
	            this._data[key] = item;
	            return true;
	        };
	        Shim.prototype.removeItem = function (key) {
	            this.enity.removeItem(key);
	        };
	        return Shim;
	    }());
	    var config = {
	        namespace: '_pt_',
	        encryption: {
	            encrypt: function (str) { return str; },
	            decrypt: function (str) { return str; }
	        },
	        serializations: {
	            json: {
	                encode: function (data) { return JSON.stringify(data); },
	                decode: function (str) { return JSON.parse(str); }
	            },
	            text: {
	                encode: function (data) { return data; },
	                decode: function (str) { return str; }
	            }
	        },
	        mappingKey: function (key) { return key; },
	    };
	    (function (CacheType) {
	        CacheType[CacheType["Ram"] = 0] = "Ram";
	        CacheType[CacheType["Session"] = 1] = "Session";
	        CacheType[CacheType["Local"] = 2] = "Local";
	    })(exports.CacheType || (exports.CacheType = {}));
	    var CacheType = exports.CacheType;
	    ;
	    var pool = {};
	    pool[CacheType.Ram] = new Shim(new RamEntity());
	    pool[CacheType.Session] = new Shim(new StorageEntity(sessionStorage));
	    pool[CacheType.Local] = new Shim(new StorageEntity(localStorage));
	    function setConfig(options) {
	        if (options.namespace) {
	            config.namespace = options.namespace;
	        }
	        if (options.encryption) {
	            config.encryption = options.encryption;
	        }
	        if (options.mappingKey) {
	            config.mappingKey = options.mappingKey;
	        }
	        if (options.serializations) {
	            objectAssign(config.serializations, options.serializations);
	        }
	    }
	    exports.setConfig = setConfig;
	    function getItem(key, type) {
	        key = config.mappingKey(key);
	        var cacheObject;
	        if (type !== undefined) {
	            cacheObject = pool[type].getItem(key);
	        }
	        else {
	            type = CacheType.Ram;
	            cacheObject = pool[type].getItem(key);
	            if (!cacheObject) {
	                type = CacheType.Session;
	                cacheObject = pool[type].getItem(key);
	            }
	            if (!cacheObject) {
	                type = CacheType.Local;
	                cacheObject = pool[type].getItem(key);
	            }
	        }
	        if (cacheObject) {
	            return new CacheResult(cacheObject.value, cacheObject.version, type);
	        }
	        else {
	            return null;
	        }
	    }
	    exports.getItem = getItem;
	    function setItem(key, content, type) {
	        key = config.mappingKey(key);
	        var options = content.toOptions();
	        if (type === undefined) {
	            type = CacheType.Ram;
	        }
	        return pool[type].setItem(key, options);
	    }
	    exports.setItem = setItem;
	    function removeItem(key, type) {
	        key = config.mappingKey(key);
	        if (type !== undefined) {
	            pool[type].removeItem(key);
	        }
	        else {
	            pool[CacheType.Ram].removeItem(key);
	            pool[CacheType.Session].removeItem(key);
	            pool[CacheType.Local].removeItem(key);
	        }
	    }
	    exports.removeItem = removeItem;
	    function clear(type) {
	        if (type !== undefined) {
	            pool[type].clear();
	        }
	        else {
	            pool[CacheType.Ram].clear();
	            pool[CacheType.Session].clear();
	            pool[CacheType.Local].clear();
	        }
	    }
	    exports.clear = clear;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	// Cache.setConfig(encryption:
	//     {
	//         encode : function(str){
	//             var key = 'dsfsdfsdfe';
	//             var iv = key.substr(0,16);
	//             key = CryptoJS.enc.Utf8.parse(key);
	//             iv = CryptoJS.enc.Utf8.parse(iv);
	//             str = CryptoJS.AES.encrypt(str,key,{iv:iv,padding:CryptoJS.pad.ZeroPadding});
	//             return str.ciphertext.toString(CryptoJS.enc.Base64);
	//         },
	//         decode : function(str){
	//             var key = 'dsfsdfsdfe';
	//             var iv = key.substr(0,16);
	//             key = CryptoJS.enc.Utf8.parse(key);
	//             iv = CryptoJS.enc.Utf8.parse(iv);
	//             str = CryptoJS.AES.decrypt(str,key,{iv:iv,padding:CryptoJS.pad.ZeroPadding});
	//             return CryptoJS.enc.Utf8.stringify(str);
	//         }
	//     }
	// )


/***/ }
/******/ ])
});
;