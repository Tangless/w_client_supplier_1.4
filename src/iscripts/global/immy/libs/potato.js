"use strict";

// 暂时注释，看能否解决地图上的屏不出来的毛病
if(!Date.now){
    Date.now = function() {
        return new Date().getTime();
    };
}
if(!Array.isArray){
    Array.isArray = function(o){
        return $.isArray(o);
        // Object.prototype.toString.call(o) == "[object Array]";
    }
}
if(!Array.prototype.indexOf){
    Array.prototype.indexOf = function(sought, fromIndex){
        var length = this.length;
        if(!length){return -1;}
        fromIndex = fromIndex || 0;
        if(fromIndex < 0){fromIndex = length+fromIndex;}
        if(fromIndex < 0){fromIndex = 0;}
        for(; fromIndex<length; fromIndex++){
            if(this[fromIndex] === sought){
                return fromIndex;
            }
        }
        return -1;
    }
}
if(!Array.prototype.lastIndexOf){
    Array.prototype.lastIndexOf = function(sought, fromIndex){
        var length = this.length;
        if(!length){return -1;}
        fromIndex = fromIndex || length-1;
        if(fromIndex < 0){fromIndex = length+fromIndex;}
        if(fromIndex > length-1){fromIndex = length-1;}
        for (; fromIndex>=0; fromIndex--) {
            if(this[fromIndex] === sought){
                return fromIndex;
            }
        }
        return -1;
    }
}
if(!Array.prototype.forEach){
    Array.prototype.forEach = function(fun, thisp){
        var i=-1,length=this.length;
        thisp = thisp || null;
        while(++i<length) {
            if(i in this){
                fun.call(thisp, this[i], i, this);
            }
        }
    }
}
if(!Array.prototype.map){
    Array.prototype.map = function(fun, thisp){
        var i=-1,length=this.length;
        var result = Array(length);
        thisp = thisp || null;
        while(++i<length){
            if(i in this){
                result[i] = fun.call(thisp, this[i], i, this);
            }
        }
        return result;
    }
}
if(!Array.prototype.filter){
    Array.prototype.filter = function(fun, thisp){
        var i=-1,length=this.length;
        var result = [];
        var value;
        thisp = thisp || null;
        while(++i<length){
            if(i in this){
                value = this[i];
                if(fun.call(thisp, value, i, this)) {
                    result.push(value);
                }
            }
        }
        return result;
    }
}
if(!Array.prototype.every){
    Array.prototype.every = function(fun, thisp){
        var i=-1,length=this.length;
        thisp = thisp || null;
        while(++i<length){
            if(i in this && !fun.call(thisp, this[i], i, this)){
                return false;
            }
        }
        return true;
    }
}
if(!Array.prototype.some){
    Array.prototype.some = function(fun, thisp){
        var i=-1,length=this.length;
        thisp = thisp || null;
        while(++i<length){
            if(i in this && fun.call(thisp, this[i], i, this)){
                return true;
            }
        }
        return false;
    }
}

if(!String.prototype.trim){
    String.prototype.trim = function(){
        var ws = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' + '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028' + '\u2029\uFEFF';
        var wsRegexChars = '[' + ws + ']';
        var trimBeginRegexp = new RegExp('^' + wsRegexChars + wsRegexChars + '*');
        var trimEndRegexp = new RegExp(wsRegexChars + wsRegexChars + '*$');
        return String(this).replace(trimBeginRegexp, '').replace(trimEndRegexp, '');
    };
}


if(!window.FormData){
    window.FormData = function(){

    };
}

(function () {
    var _pt = {
        "__CID__" : 0,
        "__UID__" : 0
    };
    var CreateClass = function (A, B) {
        _pt.__CID__++;
        var CID = "__"+_pt.__CID__+"__";
        A.__CID__ = CID;
        if(B){
            var fun = function(){this.constructor = A;};
            fun.prototype = B.prototype;
            A.prototype = new fun();
            A.prototype[CID] = B.prototype;
        }
        fun = null;
        return CID;
    };
    var DefineReadOnly = function(o){
        if(Object.defineProperties){
            var opts = {};
            for(var i=1,k=arguments.length; i<k; i++){
                opts[arguments[i]] = {writable : false};
            }
            Object.defineProperties(o, opts);
        }
    };
    var SetReadOnly = function(o, prop, value){
        if(Object.defineProperties){
            Object.defineProperty(o, prop, {value:value,writable:false});
        }else{
            o[prop] = value;
        }
    };
    var potato,newFun,newCls,temp;
    var bindEventListener = function(tag, type, fun){
        if(window.addEventListener){
            tag.addEventListener(type, fun, false);
        }else{
            tag.attachEvent("on"+type, fun);
        }
    };
    var unbindEventListener = function(tag, type, fun){
        if(window.addEventListener){
            tag.removeEventListener(type, fun, false);
        }else{
            tag.detachEvent("on"+type, fun);
        }
    };

    newCls = (function(){
        function CON(){
            this[CID] = {
                _handlers : {}
            };
        }
        var CID = CreateClass(CON);
        CON.prototype.addListener = function (type, handler) {
            var _this = this[CID];
            var dictionary = _this._handlers[type];
            if (!dictionary) {
                _this._handlers[type] = dictionary = [];
            }
            dictionary.push(handler);
            return this;
        };
        CON.prototype.removeListener = function (type, handler) {
            var _this = this[CID];
            if(!type) {
                _this._handlers = {};
            }else{
                var _handlers = _this._handlers;
                var dictionary = _handlers[type];
                if (dictionary != null) {
                    if (!handler) {
                        delete _handlers[type];
                    } else {
                        var n = dictionary.indexOf(handler);
                        if(n > -1){
                            dictionary.splice(n, 1);
                        }
                        if (dictionary.length == 0) {
                            delete _handlers[type];
                        }
                    }
                }
            }
            return this;
        };
        CON.prototype.dispatch = function (event) {
            var _this = this[CID];
            var dictionary = _this._handlers[event.type];
            var i,k,f;
            if (dictionary != null) {
                for (i = 0, k = dictionary.length; i < k; i++) {
                    dictionary[i](event);
                }
            }
            return this;
        };
        return CON;
    })();
    potato = window.potato = new newCls();
    potato.Dispatcher = newCls;

    potato.alert = window.alert;

    newCls = (function(){
        function CON(type, data){
            this.type = type;
            this.data = data;
            DefineReadOnly(this,"type","data");
        }
        var CID = CreateClass(CON);
        return CON;
    })();
    potato.Event = newCls;

    newCls = (function(){
        function CON(id, data){
            this.id = id;
            data = data || {};
            this.note = data.note;
            this.detail = data.detail;
            this.file = data.file;
            this.line = data.line;
            this.source = data.source;
            this.nid = data.nid;
            DefineReadOnly(this,"id","note","detail","file","line", "source", "nid");
        }
        var CID = CreateClass(CON, window.Error);
        CON.prototype.format = function () {
            return (this.note||potato.errors[this.id])+"["+this.id+"]";
        };
        return CON;
    })();
    potato.Error = newCls;

    newCls = (function(){
        function CON(options){
            this.url = options.url;
            this.method = options.method;
            this.data = options.data;
            this.send = options.send;
            this.header = options.header;
            this.timeout = options.timeout;
            this.cache = options.cache;
            this.async = true;
            this.disableCommonFailureCaller = options.disableCommonFailureCaller;
        }
        var CID = CreateClass(CON);
        return CON;
    })();
    potato.RequestOptions = newCls;


    newCls = (function(){
        function CON(connection,options){
            this[CID] = {
                _completeCallbacks : [],
                _successCallbacks : [],
                _failureCallbacks : [],
                _stopPropagation : false,
                _redata : undefined,
                _result : undefined
            };
            this.options = options;
            this.connection = connection;
            DefineReadOnly(this,"options","connection");
        }
        var CID = CreateClass(CON);
        var PT = {
            _setResultData : function(callbacks){
                var _this = this[CID];
                _this._stopPropagation = false;
                _this._redata = undefined;
                var i, k, item;
                for (i = 0, k = callbacks.length; i < k; i++) {
                    item = callbacks[i];
                    if(item.past) {continue;}
                    item.past = true;
                    item.fun.apply(this, [_this._result, item.args]);
                    if(_this._redata!==undefined){return false;}
                }
                callbacks.length = 0;
                return true;
            }
        };
        CON.prototype.addCompleteCaller = function (callback, reverse, args) {
            var _this = this[CID];
            if (reverse) {
                _this._completeCallbacks.unshift({ "fun": callback, "args": args, "past":false });
            } else {
                _this._completeCallbacks.push({ "fun": callback, "args": args, "past":false});
            }
            return this;
        };
        CON.prototype.addSuccessCaller = function (callback, reverse, args) {
            var _this = this[CID];
            if (reverse) {
                _this._successCallbacks.unshift({ "fun": callback, "args": args, "past":false});
            } else {
                _this._successCallbacks.push({ "fun": callback, "args": args, "past":false});
            }
            return this;
        };
        CON.prototype.addFailureCaller = function (callback, reverse, args) {
            var _this = this[CID];
            if (reverse) {
                _this._failureCallbacks.unshift({ "fun": callback, "args": args, "past":false});
            } else {
                _this._failureCallbacks.push({ "fun": callback, "args": args, "past":false});
            }
            return this;
        };
        CON.prototype.setConnection = function(connection){
            SetReadOnly(this, "connection", connection);
        };
        CON.prototype.success = function (data) {
            if(data instanceof window.Error){throw new potato.Error("b3.2");}
            var _this = this[CID];
            this.setConnection(null);
            _this._result = data;
            if(PT._setResultData.call(this, _this._completeCallbacks)){
                PT._setResultData.call(this, _this._successCallbacks);
            }
            if(_this._redata === undefined || _this._stopPropagation){
                this.clearAllCaller();
            }else{
                this.complete(_this._redata);
            }
        };
        CON.prototype.failure = function (error) {
            if(!(error instanceof window.Error)){throw new potato.Error("b3.2");}
            var _this = this[CID];
            this.setConnection(null);
            _this._result = error;
            if(PT._setResultData.call(this, _this._completeCallbacks)){
                PT._setResultData.call(this, _this._failureCallbacks);
            }
            if(_this._redata === undefined || _this._stopPropagation){
                this.clearAllCaller();
            }else{
                this.complete(_this._redata);
            }
        };
        CON.prototype.complete = function (data) {
            if(data instanceof window.Error){
                this.failure(data);
            }else{
                this.success(data);
            }
        };
        CON.prototype.stopPropagation = function () {
            var _this = this[CID];
            _this._redata = true;
            _this._stopPropagation = true;
        };
        CON.prototype.replaceResult = function (data) {
            var _this = this[CID];
            _this._redata = data;
            _this._stopPropagation = false;
        };
        
        CON.prototype.clearAllCaller = function () {
            var _this = this[CID];
            _this._completeCallbacks.length = 0;
            _this._successCallbacks.length = 0;
            _this._failureCallbacks.length = 0;
            _this._redata = undefined;
            _this._stopPropagation = false;
            _this._result = undefined;
        };
        CON.prototype.abort = function () {
            if(Array.isArray(this.connection)){
                this.connection.forEach(function(o,i){
                    o.abort();
                });
            }else{
                this.connection && this.connection.abort();
            }
        };
        return CON;
    })();
    potato.Proxy = newCls;

    newCls = (function(){
        function CON(busyDelay){
            potato.Dispatcher.call(this);
            this[CID] = {
                _loadingItems : 0,
                _loadingTimer : 0,
                _loadingTimeout : busyDelay,
                _itemList : []
            };
        }
        var CID = CreateClass(CON, potato.Dispatcher);
        var PT = {
            _count : function(bool){
                var _this = this[CID];
                if(bool){
                    _this._loadingItems++;
                }else{
                    _this._loadingItems--;
                }
                //console.log(_this._loadingItems,'++++');
                if(_this._loadingItems<0){
                    _this._loadingItems = 0;
                }
                this.dispatch(new potato.Event("change",_this._loadingItems));
                var that = this;
                if(_this._loadingItems && !_this._loadingTimer){
                    _this._loadingTimer = window.setTimeout(function(){
                        if(_this._loadingItems){
                            that.dispatch(new potato.Event("busy"));
                        }
                        _this._loadingTimer = 0;
                    },_this._loadingTimeout);
                }
                if(!_this._loadingItems){
                    if(_this._loadingTimer){
                        clearTimeout(_this._loadingTimer);
                        _this._loadingTimer = 0;
                    }
                    _this._itemList = [];
                    that.dispatch(new potato.Event("free"));
                }
            }
        };
        CON.prototype.add = function (item) {
            item = item || true;
            var _this = this[CID];
            _this._itemList.push(item);
            PT._count.call(this, true);
        };
        CON.prototype.remove = function (item) {
            item = item || true;
            var _this = this[CID];
            var i = _this._itemList.indexOf(item);
            if(i>-1){
                _this._itemList.splice(i,1);
            }
            PT._count.call(this, false);
        };
        return CON;
    })();
    potato.LoadingDelay = newCls;

    newCls = (function(){
        function CON(dom,parent,options){
            potato.Dispatcher.call(this);
            this.dom = dom;
            this.parent = parent==window?null:parent;
            this.options = options;
            DefineReadOnly(this,"dom","parent");
        }
        var CID = CreateClass(CON, potato.Dispatcher);
        CON.prototype.setParent = function (parent){
            SetReadOnly(this, "parent", parent);
        };
        CON.prototype._uninstall = function () {
            this.dispatch(new potato.Event("uninstalled"));
            this.parent.dispatch(new potato.Event("removed"));
            this.setParent(null);
        };
        CON.prototype._install = function (parent) {
            this.setParent(parent);
            this.dispatch(new potato.Event("installed"));
            this.parent.dispatch(new potato.Event("appended"));
        };
        return CON;
    })();
    potato.Widget = newCls;


    newCls = (function(){
        function CON(dom,parent,options){
            potato.Widget.call(this,dom,parent,options);
        }
        var CID = CreateClass(CON, potato.Widget);
        
        return CON;
    })();
    potato.UModule = newCls;


    newCls = (function(){
        function CON(){
            potato.Dispatcher.call(this);
            this.queue = null;
            DefineReadOnly(this,"queue");
        }
        var CID = CreateClass(CON, potato.Dispatcher);
        CON.prototype._addToQueue = function (queue){
            SetReadOnly(this, "queue", queue);
        };
        CON.prototype._destroy = function () {
            return true;
        };
        CON.prototype._execute = function(){
            this._success();
        };
        CON.prototype._redo = function(){
            this._success();
        };
        CON.prototype._undo = function(){
            this._success();
        };
        CON.prototype._success = function () {
            if(this.queue){this.queue._success();}
        };
        CON.prototype._failure = function () {
            if(this.queue){this.queue._failure();}
        };
        return CON;
    })();
    potato.Cmd = newCls;


    newCls = (function(){
        function CON(historyMax, firstCmd){
            potato.Dispatcher.call(this);
            this.historyMax = historyMax;
            this.firstCmd = firstCmd;
            this.history = [];
            this.cache = [];
            this.cur = -1;
            this.goto = -1;
            this.curItem = null;
            if(firstCmd){
                firstCmd._addToQueue(this);
            }
            var that = this;
            DefineReadOnly(this,"historyMax","firstCmd","history","cache","cur","goto","curItem");
        }
        var CID = CreateClass(CON, potato.Dispatcher);
        
        var PT = {
            _next : function(bool){
                var history = this.history;
                var h = history.length;
                var c = this.cur;
                var g = this.goto;
                var m = this.historyMax;
                var cmd,del,index;
                if(c != g){
                    if(this.firstCmd && g==-1){
                        cmd = this.firstCmd;
                        SetReadOnly(this, "curItem", {cmd:cmd,method:"undo",index:g});
                        cmd._undo();
                    }else if(g < c){
                        if(this.firstCmd){
                            cmd = history[g];
                            index = g;
                        }else{
                            cmd = history[c];
                            index = c-1;
                        }
                        SetReadOnly(this, "curItem", {cmd:cmd,method:"undo",index:index});
                        cmd._undo();
                    }else{
                        if(this.firstCmd){
                            cmd = history[g];
                            index = g;
                        }else{
                            cmd = history[c+1];
                            index = c+1;
                        }
                        SetReadOnly(this, "curItem", {cmd:cmd,method:"redo",index:c+1});
                        cmd._redo();
                    }
                }else if(this.cache.length){
                    cmd = this.cache.shift();
                    if(c < (h-1)){
                        del = history.slice(c+1);
                        history.length = h = c+1;
                    }
                    history.push(cmd);
                    if(m < (h+1)){
                        del = [history.shift()];
                        SetReadOnly(this, "cur", c-1);
                    }else{
                        SetReadOnly(this, "goto", g+1);
                    }
                    PT._delItems.call(this, del);
                    SetReadOnly(this, "curItem", {cmd:cmd,method:"execute",index:this.goto});
                    cmd._addToQueue(this);
                    cmd._execute();
                }else{
                    SetReadOnly(this, "curItem", null);
                    this.dispatch(new potato.Event("success"));
                    this.dispatch(new potato.Event("complete"));
                }
            },
            _delItems : function(arr){
                if(arr && arr.length>0){
                    for(var i=0,k=arr.length; i<k; i++){
                        arr[i]._destroy();
                    }    
                }
            }
        };
        CON.prototype.push = function (cmd){
            var cache = this.cache;
            if(this.firstCmd){
                PT._delItems.call(this, cache);
                cache.length = 0;
                cache[0] = cmd;
            }else{
                cache.push(cmd);
            }
            if(!this.curItem){
                 PT._next.call(this);
            }
        };
        CON.prototype.add = function (arr){
            var cache = this.cache;
            if(this.firstCmd){
                PT._delItems.call(this, cache);
                cache.length = 0;
                cache[0] = arr.pop();
                PT._delItems.call(this, arr);
            }else{
                cache.push.apply(cache, arr);
            }
            if(!this.curItem){
                PT._next.call(this);
            }
        };
        CON.prototype.empty = function(){
            this.cancel(true);
            PT._delItems.call(this, this.cache);
            PT._delItems.call(this, this.history);
            this.history.length = 0;
            this.cache.length = 0;
            SetReadOnly(this, "cur", -1);
            SetReadOnly(this, "goto", -1);
            if(this.curItem){
                this.curItem.cmd._addToQueue(null);
            }
            SetReadOnly(this, "curItem", null);
        };
        CON.prototype.cancel = function (abort){
            PT._delItems.call(this, this.cache);
            this.cache.length = 0;
            if(this.curItem){
                var curItem = this.curItem;
                var index = curItem.index;
                SetReadOnly(this, "goto", index);
                if(abort){
                    var cmd = curItem.cmd;
                    var method = "abort_"+curItem.method;
                    if(cmd[method]){
                        SetReadOnly(this, "goto", this.cur);
                        if(!curItem.aborted){
                            curItem.aborted = true;
                            cmd[method]();
                        }
                    }
                }
            }
        };
        CON.prototype._success = function (){
            SetReadOnly(this, "cur", this.curItem.index);
            PT._next.call(this);
        };
        CON.prototype._failure = function (){
            if(this.curItem && this.curItem.aborted){
                PT._next.call(this);
            }else{
                PT._delItems.call(this, this.cache);
                this.cache.length = 0;
                SetReadOnly(this, "goto", this.cur);
                SetReadOnly(this, "curItem", null);
                this.dispatch(new potato.Event("failure"));
                this.dispatch(new potato.Event("complete"));
            }
        };
        CON.prototype.to = function(n){
            var arr = [this.goto, 0];
            if(n==0){return arr;}
            n = this.goto+n;
            var l = this.history.length-1;
            if(n < -1){
                arr[0] = -1;
                arr[1] = n+1;
            }else if(n > l){
                arr[0] = l;
                arr[1] = n-l;
            }else{
                arr[0] = n;
                arr[1] = 0;
            }
            return arr;
        };
        CON.prototype.go = function(n){
            var l = this.history.length-1;
            if(n < -1){
                n = -1;
            }else if(n > l){
                n = l;
            }
            if(n==-1 && this.goto==-1){
                this.dispatch(new potato.Event("overflow"));
                return false;
            }
            SetReadOnly(this, "goto", n);
            if(!this.curItem){
                PT._next.call(this);
            }
        };
        CON.prototype.isRunning = function(){
            return this.curItem!=null;
        };
        return CON;
    })();
    potato.Queue = newCls;


    newCls = (function(){
        function CON(uriMax, actMax, firstUriCmd, exitCallback){
            this.uriQueue = new potato.Queue(uriMax, firstUriCmd);
            this.actQueue = new potato.Queue(actMax);
            this.uriCache = [];
            this.actCache = [];
            var that = this;
            this.uriQueue.addListener("complete", function(){
                PT._onUriComplete.call(that);
            });
            this.actQueue.addListener("complete", function(){
                PT._onActComplete.call(that);
            });
            this.uriQueue.addListener("overflow", function(){
                exitCallback();
            });
            DefineReadOnly(this,"uriQueue","actQueue","uriCache","actCache");
        }
        var CID = CreateClass(CON);
        var PT = {
            _delItems : function(arr){
                if(arr && arr.length>0){
                    for(var i=0,k=arr.length; i<k; i++){
                        arr[i]._destroy();
                    }    
                }
            },
            _onUriComplete : function(){
                this.actQueue.empty();
                if(this.actCache.length){
                    this.actQueue.add(this.actCache);
                    this.actCache.length = 0;
                }
            },
            _onActComplete : function(){
                if(this.uriCache.length){
                    this.uriQueue.add(this.uriCache);
                    this.uriCache.length = 0;
                }
            }
        };
        
        CON.prototype.uriPush = function(cmd){
            this.actQueue.cancel(true);
            this.uriQueue.cancel(true);
            PT._delItems.call(this, this.actCache);
            this.actCache.length = 0;
            if(this.actQueue.isRunning()){
                PT._delItems.call(this, this.uriCache);
                this.uriCache.length = 0;
                this.uriCache[0] = cmd;
            }else{
                this.uriQueue.push(cmd);
            }
        };
        CON.prototype.actPush = function(cmd){
            if(this.uriQueue.isRunning() || this.uriCache.length){
                this.actCache.push(cmd);
            }else{
                this.actQueue.push(cmd);
            }
        };
        CON.prototype.go = function(n){
            var arr = this.actQueue.to(n);
            if(arr[1]){
                arr = this.uriQueue.to(arr[1]);
                this.uriQueue.go(arr[0]);
            }else{
                this.actQueue.go(arr[0]);
            }
        };
        CON.prototype.uriGo = function(n){
            var arr = this.uriQueue.to(n);
            this.uriQueue.go(arr[0]);
        };
        CON.prototype.empty = function(){
            this.actQueue.empty();
            this.uriQueue.empty();
        };
        return CON;
    })();
    potato.ViewHistory = newCls;


    newCls = (function(){
        function CON(expires, etag, encryption, data, update){
            this.expires = expires
            this.etag = etag;
            this.data = data;
            this.encryption = encryption;
            this.update = update;
            DefineReadOnly(this,"expires","etag","data","encryption","update");
        }
        var CID = CreateClass(CON);
        return CON;
    })();
    _pt.UncertainCache = newCls;


    newCls = (function(){
        function CON(){
            this.storage = {};
            var that = this;
            var k;
            setInterval(function(){
                PT._recoverExpired.call(this);
                var i=0;
                for(k in that.storage){
                    i++;
                }
                if(i>150){
                    pt._recoverRate.call(this, i-150);
                }
            },3600*1000*5);
            DefineReadOnly(this,"storage");
        }
        var CID = CreateClass(CON);
        var PT = {
            _recoverExpired : function(){
                var head,key,dels={},nowTime=PT._nowTime.call(this),time;
                for(key in this.storage){
                    head = this.storage[key][0];
                    time = parseInt(head[2]) || 0;
                    if(time && (nowTime-head[1])>time && !head[3]){
                        dels[key] = 1;
                    }
                }
                for(key in dels){
                    PT._removeItem.call(this, key);
                }
            },
            _recoverRate : function(k){
                var key,i,arr=[];
                for(key in this.storage){
                    arr.push({key:key,time:parseInt(this.storage[key][0][0])||0});
                }
                if(!arr.length){return false;}
                arr.sort(potato.sortNumericBy("time"));
                for(i=0; i<k; i++){
                    PT._removeItem.call(this, arr[i].key);
                }
                return true;
            },
            _removeItem : function(key){
                var storage = this.storage;
                if(storage[key]){
                    var data = storage[key][1];
                    if(typeof(data.removeFormCache) == "function"){
                        data.removeFormCache(key);
                    }
                    delete storage[key];
                }
            },
            _nowTime : function(){
                return Math.floor(Date.now()/1000);
            }
        };
        
        CON.prototype.clear = function(namespace){
            var key,data,storage = this.storage;
            if(namespace===undefined){
                for(key in storage){
                    data = storage[key][1];
                    if(typeof(data.removeFormCache) == "function"){
                        data.removeFormCache(key);
                    }
                }
                SetReadOnly(this, "storage", {});
            }else{
                var str = namespace+"_";
                var len = str.length;
                var dels = {};
                for(key in storage){
                    if(key.substr(0,len) == str){
                        dels[key] = 1;
                    }
                }
                for(key in dels){
                    data = storage[key][1];
                    if(typeof(data.removeFormCache) == "function"){
                        data.removeFormCache(key);
                    }
                    delete storage[key];
                }
            };
        };
        CON.prototype.removeItem = function(key, namespace){
            namespace = namespace || "";
            key = namespace+"_"+key;
            PT._removeItem.call(this, key);
        };
        CON.prototype.setItem = function(key, value, expired, tag, encryption, namespace){
            value = potato.deepJsonClone(value);
            expired = parseInt(expired) || 0;
            tag = tag || "";
            namespace = namespace || "";
            key = namespace+"_"+key;
            var nowTime = PT._nowTime.call(this);
            var storage = this.storage;
            var data = storage[key]?storage[key][1]:null;
            if(data!=value){
                if(data && typeof(data.removeFormCache)=="function"){
                    data.removeFormCache(key);
                }
                if(value && typeof(value.addToCache)=="function"){
                    value.addToCache(key);
                }
            }
            storage[key] = [[(namespace=="sys"?9999999999:nowTime),nowTime,expired,tag],value]; 
        };
        CON.prototype.updateItem = function(key, data, namespace){
            data = potato.deepJsonClone(data);
            namespace = namespace || "";
            key = namespace+"_"+key;
            var item = this.storage[key];
            if(item){
                item[1] = data;
            }
        };
        CON.prototype.getItem = function(key, namespace){
            namespace = namespace || "";
            key = namespace+"_"+key;
            var item = this.storage[key];
            if(item){
                var that = this;
                var head = item[0];
                var content = potato.deepJsonClone(item[1]);
                var nowTime = PT._nowTime.call(this);
                if(head[0] < nowTime){
                    head[0] = nowTime;
                }
                if(head[2]==0){
                    if(head[3]){
                        return new _pt.UncertainCache(head[2], head[3], head[4], content, function(expired,etag){
                            head[1] = nowTime;
                            head[2] = expired;
                            head[3] = etag;
                            that.storage[key][0] = head;
                        });
                    }else{
                        return content;
                    }
                }else if((nowTime-head[1])<=head[2]){
                    return content;
                }else{
                    if(head[3]){
                        return new _pt.UncertainCache(head[2], head[3], head[4], content, function(expired){
                            head[1] = nowTime;
                            head[2] = expired;
                            that.storage[key][0] = head;
                        });
                    }else{
                        PT._removeItem.call(this, key);
                        return undefined;
                    }
                }
            }else{
                return undefined;
            }
        };
        return CON;
    })();
    _pt.Cache = newCls;


    newCls = (function(){
        function CON(storage){
            this[CID] = {
                _shimAllCompleted : false,
                _shim : {}
            };
            this.storage = storage;
            var i,k,key,item,_this=this[CID];
            var shim = _this._shim;
            for(i=0,k=storage.length; i<k; i++){
                key = storage.key(i);
                if(key.substr(0,3) == '_b_'){
                    shim[key.substr(3)] = null;
                }
            }
            DefineReadOnly(this,"storage");
        }
        var CID = CreateClass(CON);
        var PT = {
            _recoverExpired : function(){
                var _this = this[CID];
                var head,key,dels={},nowTime=PT._nowTime.call(this),time;
                PT._shimAll.call(this);
                for(key in _this._shim){
                    if(_this._shim[key]){
                        head = _this._shim[key][0];
                        time = parseInt(head[2]) || 0;
                        if(time && (nowTime-head[1])>time && !head[3]){
                            dels[key] = 1;
                        }   
                    }
                }
                for(key in dels){
                    PT._removeItem.call(this, key);
                }
            },
            _recoverRate : function(){
                var _this = this[CID];
                var key,i,k,arr=[];
                _this._shimAll();
                for(key in _this._shim){
                    if(_this._shim[key]){
                        arr.push({key:key,time:parseInt(_this._shim[key][0][0])||0});
                    }
                }
                if(!arr.length){return false;}
                arr.sort(potato.sortNumericBy("time"));
                k = Math.min(10, arr.length);
                for(i=0; i<k; i++){
                    PT._removeItem.call(this, arr[i].key);
                }
                return true;
            },
            _removeItem : function(key){
                var _this = this[CID];
                this.storage.removeItem('_b_'+key);
                delete _this._shim[key];
            },
            _updateItemHead : function(key,head){
                var _this = this[CID];
                var item = this.storage.getItem('_b_'+key);
                var content = item.substr(item.indexOf("|")+1);
                if(PT._write.call(this,'_b_'+key, head.join(",")+"|"+content)){
                    _this._shim[key][0] = head;
                }else{
                    throw(this.storage+"is full!");
                }
            },
            _setItem : function(key,head,content){
                var _this = this[CID];
                var ocontent = potato.deepJsonClone(content);
                content = potato.cacheEncode(content);
                if(head[4]){content = potato.cacheEncrypt(content);}
                if(PT._write.call(this,'_b_'+key, head.join(",")+"|"+content)){
                    _this._shim[key] = [head,ocontent];//0访问时间，1写入时间，2过期时间，3版本, 4是否加密
                }else{
                    throw(this.storage+"is full!");
                }
            },
            _getItem : function(key, primeval){
                var _this = this[CID];
                if(_this._shim[key]===undefined){return undefined;}
                if(_this._shim[key]===null){
                    var arr;
                    var item = this.storage.getItem('_b_'+key);
                    if(item){
                        var p = item.indexOf("|");
                        var head = item.substr(0,p).split(",");
                        var content = item.substr(p+1);
                        head[0] = parseInt(head[0]);
                        head[1] = parseInt(head[1]);
                        head[4] = parseInt(head[4]);
                        if(!primeval){
                            if(head[4]){
                                content = potato.cacheDecrypt(content);
                            }
                            content = potato.cacheDecode(content);
                            arr = [head, content];
                        }else{
                            arr = [head, content, 1];
                        }
                        _this._shim[key] = arr;
                    }
                }
                return _this._shim[key];
            },
            _nowTime : function(){
                return Math.floor(Date.now()/1000);
            },
            _write : function(key,value){
                var _this = this[CID];
                var e,error;
                try{
                    error = false;
                    this.storage.setItem(key,value);
                }catch(e){
                    error = true;
                    PT._recoverExpired.call(this);
                }
                while(error){
                    try{
                        error = false;
                        this.storage.setItem(key,value);
                    }catch(e){
                        error = PT._recoverRate.call(this);
                        if(!error){return false;}
                    }
                }
                return true;
            },
            _shimAll : function(){
                var _this = this[CID];
                if(!_this._shimAllCompleted){
                    var shim = _this._shim;
                    for(var key in shim){
                        if(shim[key] === null){
                            PT._getItem.call(this, key, true);
                        }
                    }
                    _this._shimAllCompleted = true;
                }
            }
        };
        CON.prototype.clear = function(namespace){
            var _this = this[CID];
            var i,k,key,dels={},storage=this.storage;
            if(namespace===undefined){
                for(i=0,k=storage.length; i<k; i++){
                    key = storage.key(i);
                    if(key.substr(0,3) == '_b_'){
                        dels[key] = 1;
                    }
                }
                for(key in dels){
                    storage.removeItem(key);
                }
                _this._shim = {};
            }else{
                var str = '_b_'+namespace+"_";
                var len = str.length;
                for(i=0,k=storage.length; i<k; i++){
                    key = storage.key(i);
                    if(key.substr(0,len) == str){
                        dels[key.substr(3)] = 1;
                    }
                }
                for(key in dels){
                    delete _this._shim[key];
                    this.storage.removeItem('_b_'+key);
                }
            }
        };
        CON.prototype.removeItem = function(key, namespace){
            namespace = namespace || "";
            key = namespace+"_"+key;
            PT._removeItem.call(this, key);
        };
        CON.prototype.setItem = function(key, value, expired, tag, encryption, namespace){
            expired = expired || 0;
            tag = tag || "";
            encryption = encryption?1:0;
            namespace = namespace || "";
            key = namespace+"_"+key;
            var nowTime = PT._nowTime.call(this);
            PT._setItem.call(this,key,[(namespace=="sys"?9999999999:nowTime),nowTime,expired,tag,encryption],value);
        };
        CON.prototype.updateItem = function(key, data, namespace){
            namespace = namespace || "";
            key = namespace+"_"+key;
            var item = PT._getItem.call(this,key,true);
            if(item){
                PT._setItem.call(this,key,item[0],data);
            }
        };
        CON.prototype.getItem = function(key, namespace){
            /*
                0,0 永不过期
                0,1 每次需验证，验证304可重设过期时间和etag
                1,0 没过期直接返回，过期直接删除
                1,1 没过期直接返回，过期验证304可重设过期时间
            */
            namespace = namespace || "";
            key = namespace+"_"+key;
            var item = PT._getItem.call(this, key);
            if(!item){return undefined;}
            var nowTime = PT._nowTime.call(this);
            var that = this;
            var head = item[0];
            var content = potato.deepJsonClone(item[1]);
            if(item.length==3){
                if(head[4]){
                    content = potato.cacheDecrypt(content);
                }
                content = potato.cacheDecode(content);
                item[1] = content;
                item.length = 2;
            }
            if(head[0] < nowTime){
                head[0] = nowTime;
                PT._updateItemHead.call(this,key,head);
            }
            var type = head[2].substr(-1,1);
            var time = parseInt(head[2]) || 0;
            if(time==0||type=="r"||type=="s"){
                if(head[3]){
                    return new _pt.UncertainCache(head[2], head[3], head[4], content, function(expired,etag){
                        head[1] = head[0];
                        head[2] = expired;
                        head[3] = etag;
                        PT._updateItemHead.call(that,key,head);
                    });
                }else{
                    return content;
                }
            }else if((head[0]-head[1])<=time){
                return content;
            }else{
                if(head[3]){
                    return new _pt.UncertainCache(head[2], head[3], head[4], content, function(expired){
                        head[1] = head[0];
                        head[2] = expired;
                        PT._updateItemHead.call(that,key,head);
                    });
                }else{
                    PT._removeItem.call(this, key);
                    return undefined;
                }
            }
        };

        return CON;
    })();
    _pt.Storage = newCls;

    newCls = (function(){
        function CON(body,mask,container,defaultState,history,loader){
            container = container || document.documentElement;
            this[CID] = {
                _undo : function(){
                    that.undo();
                },
                _redo : function(){
                    that.redo();
                },
                _resizeHandler : function(){
                    that.refreshSize();
                },
                _scrollHandler : function(){
                    that.refreshPos();
                },
                _layout : container==document.documentElement?window:container
            };
            this.body = body;
            this.mask = mask;
            this.container = container;
            this.history = history;
            this.loader = loader;
            this.dialogState = defaultState || "closed";
            this.index = 0;
            var that = this;
            var _this = this[CID];
            if(this.dialogState == "focused"){
                if(potato.history){
                    potato.addListener("historyUndo",_this._undo);
                    potato.addListener("historyRedo",_this._redo);
                }
            }
            if(this.dialogState != "closed"){
                bindEventListener(_this._layout,"resize",_this._resizeHandler);
                bindEventListener(_this._layout,"scroll",_this._scrollHandler);
                _this._resizeHandler();
            }
            DefineReadOnly(this,"dialogState","index","history","loader","container","body","mask");
        }
        var CID = CreateClass(CON);
        var PT = {
            _setState : function(state,data){
                var _this = this[CID];
                var ostate = this.dialogState;
                SetReadOnly(this, "dialogState", state);
                if(potato.history){
                    if(state=="focused"){
                        potato.addListener("historyUndo",_this._undo);
                        potato.addListener("historyRedo",_this._redo);
                    }else{
                        potato.removeListener("historyUndo",_this._undo);
                        potato.removeListener("historyRedo",_this._redo);
                    }
                }
                if(state == "closed"){
                    if(this.history){
                        this.history.empty();
                    }
                    document.body.removeChild(this.body);
                    document.body.removeChild(this.mask);
                    unbindEventListener(_this._layout,"resize",_this._resizeHandler);
                    unbindEventListener(_this._layout,"scroll",_this._scrollHandler);
                }else{
                    if(ostate == "closed"){
                        document.body.appendChild(this.body);
                        document.body.appendChild(this.mask);
                    
                        bindEventListener(_this._layout,"resize",_this._resizeHandler);
                        bindEventListener(_this._layout,"scroll",_this._scrollHandler);
                        _this._resizeHandler();
                    }
                }
                var states = {from:ostate, to:state};
                this._onSetState(states,data);
                if(this.loader){
                    var mod = this.loader.widget;
                    if(mod){mod.dispatch(new potato.Event("stateChanged",states));}
                }
                this.dispatch(new potato.Event("stateChanged",states));
            }
        };
        CON.prototype.focus = function (data, exit) {
            if(this.dialogState == "focused"){return true;}
            if(!this._onFocus(data)){return false;}
            var list = potato.dialogs;
            var dialog = list[list.length-1];
            if(!exit){
                var o = dialog._blur(data);
                if(!o){return false;}
            }
            var index =  dialog.index;
            if(this.dialogState == "blured"){
                var n = list.indexOf(this);
                list.splice(n, 1);
            }
            index++;
            SetReadOnly(this, "index", index);
            this._setIndex(index);
            list.push(this);
            PT._setState.call(this, "focused",data);
            return true;           
        };
        CON.prototype.close = function (data) {
            if(this.dialogState == "closed"){return true;}
            if(!this._onClose(data)){return false;}
            var list = potato.dialogs;
            if(this.dialogState == "focused"){
                var dialog = list[list.length-2];
                if(dialog){
                    var rs = dialog.focus(data, true);
                    if(!rs){return false;}
                }else{
                    this.exit(data);
                    return false;
                }
            }
            var n = list.indexOf(this);
            list.splice(n, 1);
            SetReadOnly(this, "index", 0);
            this._setIndex(0);
            PT._setState.call(this, "closed",data);
            this.removeListener();
            return true;
        };
        CON.prototype._blur = function (data) {
            if(this.dialogState == "blured"){return true;}
            if(!this._onBlur(data)){return false;}
            PT._setState.call(this,"blured",data);
            return true;
        };
        CON.prototype.refreshSize = function(){
        };
        CON.prototype.refreshPos = function(){
        };
        CON.prototype._setIndex = function(n){
        };
        CON.prototype.undo = function (uri) {
            if(this.history){
                if(uri){
                    this.history.uriGo(-1);
                }else{
                    this.history.go(-1);
                }
            }else{
                this.close();
            }
        };
        CON.prototype.redo = function (uri) {
            if(this.history){
                if(uri){
                    this.history.uriGo(1);
                }else{
                    this.history.go(1);
                }
            }else{
                this.focus();
            }
        };
        CON.prototype.exit = function (data) {
        };
        CON.prototype._onFocus = function (data) {
            return true;
        };
        CON.prototype._onBlur = function (data) {
            return true;
        };
        CON.prototype._onClose = function (data) {
            return true;
        };
        CON.prototype._onSetState = function (states,data) {
        };
        CON.prototype.load = function(widget,options){
            if(this.loader){
                var that = this;
                var cmd = new potato.Cmd();
                var load = function(flag, action){
                    that.loader.load(widget, flag);
                    cmd._success();
                    that.refreshSize();
                };
                cmd._execute = function(){
                    load(false, "execute");
                };
                cmd._undo = function(){
                    load(true, "undo");
                };
                cmd._redo = function(){
                    load(false, "redo");
                };
                this.history.uriPush(cmd);
            }
        };

        return CON;
    })();
    potato.Dialog = newCls;

    potato.load = function(options, async) {
        if(!(options instanceof potato.RequestOptions)){
            options = new potato.RequestOptions(options);
        }
        var cache,url,result,returned,request,connection;
        url = options.url;
        options.method = options.method ? options.method.toLowerCase() : "get";
        if(options.method == "get"){
            cache = potato.getCache(potato._remoteRoute(url));
        }
        if(async === undefined){
            async = options.async;
        }
        var callback = function(result, end){
            if(async && !request){
                window.setTimeout(function(){
                    callback(result, end);
                },0);             
            }else{
                if(!end && !(result instanceof window.Error)) {
                    var cachePlan = result.cache;
                    result = result.data;
                    if(result !== undefined){
                        if(cachePlan){
                            cachePlan = cachePlan.split("/");
                            potato.setCache(url, result, cachePlan[0], cachePlan[1], cachePlan[2], cachePlan[3]);
                        }
                    }else{
                        result = cache.data;
                        if(cachePlan.etag==""){cachePlan.etag = cache.etag;}
                        if(cachePlan.expires==""){cachePlan.expires = cache.expires;}
                        cache.update(cachePlan.expires, cachePlan.etag);
                        var type = cachePlan.expires.substr(-1,1);
                        var time = parseInt(cachePlan.expires) || 0;
                        if(type == "r"){
                            potato.ramStorage.setItem(url, result, time, '', cache.encryption);
                        }else if(type == "s"){
                            potato.sessionStorage.setItem(url, result, time, '', cache.encryption);
                        }
                    }
                }
                result = potato._remoteRenderer(url, result);
                if(result instanceof window.Error){
                    if(!options.disableCommonFailureCaller){
                        potato.commonFailureCaller(result,options);
                    }
                }
                if(request){
                    request.complete(result);
                }else{
                    returned = result;
                }
            }
        };
        
        if(cache!==undefined && !(cache instanceof _pt.UncertainCache)){
            callback(cache, true);
        }else{
            result = potato.loadData(options, cache?cache.etag:undefined);
            if(result instanceof potato.Proxy){
                result.addCompleteCaller(callback);
                connection = result;
            }else{
                callback(result);
            }
        }
        if(returned === undefined){
            request = new potato.Proxy(connection, options);
            return request;
        }else{
            return returned;
        }
    };
    potato.parseResult = function(node, callback){        
        var type = node.getAttribute("type");
        var children,data,key,child,i,k,n,root,list,arr,proxy,value;
        if(type=="list"){
            if(!callback){
                root = true;
                callback = function(result, path){
                    path.obj[path.key] = result;
                    callback.proxy --;
                    if(callback.proxy == 0){
                        console.log(data);
                        proxy.setConnection(null);
                        proxy.complete(data);
                    }
                }
                callback.proxy = 0;
                callback.proxys = [];
            }
            children = node.childNodes;
            list = {};
            arr = [];
            n = 0;
            i = 0;           
            for(n=0,k=children.length; n<k; n++){
                child = children[n];
                if(child.nodeType != 1){continue;}
                key = child.nodeName;
                arr[i] = potato.parseResult(child, callback);
                if(list){
                    if(list[key]){
                        list = null;
                    }else{
                        list[key] = arr[i];
                    }
                }
                i++;
            }
            data = list || arr;
            for(i in data){
                if(data[i] instanceof potato.Proxy){
                    callback.proxy ++;
                    callback.proxys.push(data[i]);
                    data[i].addCompleteCaller(callback,'',{obj:data, key:i});
                }
            }
            if(root && callback.proxy){
                proxy = new potato.Proxy(callback.proxys);
                return proxy;
            }else{
                return data;
            }
        }else{
            value = node.textContent || node.text || "";
            switch (type){
                case "text" :
                    return value;
                    break;
                case "number" :
                    return parseFloat(value);
                    break;
                case "json" : 
                    return JSON.parse(value);
                    break;
                case "eval" :
                    return eval(value);
                    break;
                case "request" :
                    value = new potato.RequestOptions(JSON.parse(value));
                    return potato.load(value, async);
                    break;
                case "function" :
                    value = new Function(value);
                    return value();
                    break;
                case "script" :
                    var script = document.createElement("script");
                    script.text = value;
                    document.head.appendChild(script);
                    return true;
                    break;
                case "require" :
                    return potato.loadList(JSON.parse(value),async);
                    break;
            }
            return "";
        }
    };
    potato.loadList = function(list, async) {
        var key,rs=[],connection,cur,returned,request;
        var result = Array.isArray(list)?[]:{};
        for (key in list) {
            rs.push([key, list[key]]);
        }
        var complete = function(data){
            if(data instanceof window.Error){
                callback(data);
            }else{
                var key = cur[0];
                result[key] = data;
                if(rs.length){
                    next();
                }else{
                    callback(result);
                }
            }
        };
        var callback = function(result){
            if(async && !request){
                window.setTimeout(function(){
                    callback(result, end);
                },0);             
            }else{
                if(request){
                    request.complete(result);
                }else{
                    returned = result;
                }
            }
        };
        var next = function () {
            if(request){
                request.setConnection(null);
            }
            cur = rs.shift();
            var key = cur[0];
            var item = cur[1];
            var data;
            if(item instanceof potato.RequestOptions){
                item.disableCommonFailureCaller = true;
                data = potato.load(item, async);
            }else if(typeof(item) == "function"){
                try{
                    data = item(result);
                }catch(e){
                    console.log(e);
                    data = new potato.Error("d9", e.message);
                }
            }else{
                data = item;
            }
            if(data instanceof potato.Proxy){
                if(returned === undefined){
                    connection = data;
                }else{
                    returned.setConnection(data);
                }
                data.addCompleteCaller(complete);
            }else{
                complete(data);
            }
        };
        next();
        if(returned === undefined){
            request = new proxy.Proxy(connection);
            return request;
        }else{
            return returned;
        }
    };

    potato.setHash = function(hash){
        var supportState = window.history.pushState?true:false;
        if(supportState){
            window.history.replaceState("","","#"+hash);
        }else{
            window.location.replace("#"+hash);
        }
    };

    potato.setCache = function(url, data, expired, etag, encryption, namespace){
        expired = expired+"";
        var type = expired.substr(-1,1);
        var time = parseInt(expired) || 0;
        if(type=="r"||type=="s"){
            if(etag){
                potato.localStorage.setItem(url, data, expired, etag, encryption, namespace);
            }
            if(type == "r"){
                potato.ramStorage.setItem(url, data, time, '', encryption, namespace);
            }else if(type == "s"){
                potato.sessionStorage.setItem(url, data, time, '', encryption, namespace);
            }
        }else{
            potato.localStorage.setItem(url, data, expired, etag, encryption, namespace);
        }
    };
    potato.updateCache = function(url, data, namespace){
        potato.ramStorage.updateItem(url, data, namespace);
        potato.sessionStorage.updateItem(url, data, namespace);
        potato.localStorage.updateItem(url, data, namespace);
    };
    potato.getCache = function(url, namespace){
        return potato.ramStorage.getItem(url, namespace) || potato.sessionStorage.getItem(url, namespace) || potato.localStorage.getItem(url, namespace);
    };
    potato.delCache = function(url, namespace){
        potato.ramStorage.removeItem(url, namespace);
        potato.sessionStorage.removeItem(url, namespace);
        potato.localStorage.removeItem(url, namespace);
    };
    potato.clearCache = function(namespace){
        potato.ramStorage.clear(namespace);
        potato.sessionStorage.clear(namespace);
        potato.localStorage.clear(namespace);
    };
    _pt.countLayoutSize = function(){
        var doc = document.documentElement;
        var body = document.body;
        /*var maxH = Math.max(document.body.parentNode.offsetHeight, document.body.offsetHeight, doc.clientHeight);
        var maxW = document.body.parentNode.offsetWidth;*/
        var layoutSize = {bodyHeight:body.offsetHeight, bodyWidth:body.offsetWidth, clientHeight:doc.clientHeight, clientWidth:doc.clientWidth, scrollLeft:doc.scrollLeft||window.pageXOffset, scrollTop:doc.scrollTop||window.pageYOffset, left:0, top:0};
        return layoutSize;
    };
    potato.countPageSize = _pt.countLayoutSize;
    _pt.initResizeDelay = function(){
        SetReadOnly(_pt,"initResizeDelay",null);
        var resizeTimer;
        bindEventListener(window,"resize",function(){
            if (!resizeTimer) {
                resizeTimer = window.setTimeout(function () {
                    resizeTimer = 0;
                    potato.dispatch(new potato.Event("resize", _pt.countLayoutSize()));
                },  potato.resizeDelay);
            }
        });
    };
    _pt.initHistory = function(){
        SetReadOnly(_pt,"initHistory",null);
        var curHash = window.location.hash;
        curHash = curHash?curHash:"#";
        var disableChange = 0;
        var cid = Date.now();
        var undoHash = "#undo@"+cid;
        var redoHash = "#redo@"+cid;
        var supportState = window.history.pushState?true:false;
        var ready = false;
        var evt = null;
        if(supportState){
            window.history.replaceState("","",undoHash);
            window.history.pushState("","",curHash);
            window.history.pushState("","",redoHash);
        }else{
            window.location.replace(undoHash);
            window.location.href = curHash;
            window.location.href = redoHash;
        }
        var dispatchEvent = function(e){
            window.setTimeout(function(){//避免在dispatch过程中再次引起hashchange事件
                potato.dispatch(new potato.Event(e));
                if(e=="historyReady"){
                    SetReadOnly(potato, "historyReady", true);
                }
            },0);
        };
        var handler = function(e){
            if(ready){
                ready = false;
                dispatchEvent("historyReady");
                return true;
            }
            if(disableChange){
                disableChange--;
                if(evt){
                    dispatchEvent(evt);
                    evt = null;
                }
                return true;
            }
            var hash = window.location.hash;
            hash = hash?hash:"#";
            if(hash == undoHash){
                disableChange++;
                window.history.go(1);
                evt = "historyUndo";
            }else if(hash == redoHash){
                disableChange++;
                window.history.go(-1);
                evt = "historyRedo";
            }else{
                potato.alert(potato.errors.a10);
                potato.setHash(redoHash.substr(1));
                disableChange++;
                window.history.go(-1);
            }
        }
        window.setTimeout(function(){
            bindEventListener(window, 'hashchange', handler);
            ready = true;
            window.history.go(-1);                    
        },0);
        SetReadOnly(potato, "setHash", function(hash){
            var curhash = window.location.hash;
            curhash = curhash?curhash:"#";
            if(curhash=="#"+hash){return true;}
            if(supportState){
                window.history.replaceState("","","#"+hash);
            }else{
                disableChange++;
                window.location.replace("#"+hash);
            }
        });
    };

    DefineReadOnly(_pt,"Cache","Storage","UncertainCache","initHistory","initResizeDelay","countLayoutSize");

    potato.ramStorage = new _pt.Cache();
    potato.sessionStorage = new _pt.Storage(window.sessionStorage);
    potato.localStorage = new _pt.Storage(window.localStorage);
    potato.application = {focus:function(){return true;},_blur:function(){return true;},close:function(){return true;},addLoadingItem:function(){},removeLoadingItem:function(){},setLoadingNote:function(){}};
    potato.dialogs = [potato.application];
    potato.lang = {};
    potato.errors = {"a10":"a10","a1":"a1","a8":"a8"};
    potato.loadData = null;
    potato.history = false;
    potato.historyReady = false;
    potato.resizeDelay = 0;
    potato.commonFailureCaller = function(error){potato.alert(error.format());}
    
    potato.cacheEncode = function(data){return data.toString();}
    potato.cacheDecode = function(data){return data;}
    potato.cacheEncrypt = function(str){return str;}
    potato.cacheDecrypt = function(str){return str;}
    potato.getCurDialog = function(){
        var list = potato.dialogs;
        return list[list.length-1];
    }
    potato.extendPrototype = function (A, B) {
        for(var key in B.prototype){
            A.prototype[key] = B.prototype[key];
        }
    };
    potato.embString = function(template, data, splitter) {
        if (!splitter) {
            splitter = { start: "{", end: "}" };
        }
        var re = new RegExp("\\" + splitter.start + "([^\\" + splitter.start + "\\" + splitter.end + "]*)\\" + splitter.end, "gm");
        if (re.test(template)) {
            template = template.replace(re, function (substring) {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 1); _i++) {
                    args[_i] = arguments[_i + 1];
                }
                var value = data[arguments[1]];
                return (value !== undefined) ? value : substring;
            });
        }
        return template;
    };
    potato.parseXML = function(xmlString){
        xmlString = xmlString.trim();
        if(!xmlString){return null;}
        var xmlDoc=null;
        if(window.DOMParser){
            try{
                var domParser = new  DOMParser();
                xmlDoc = domParser.parseFromString(xmlString, 'text/xml');
            }catch(e){
                console.log(e);
            }
        }else{
            var arr = ['MSXML.2.DOMDocument.6.0','Microsoft.XMLDOM'];
            for(var i=0,k=arr.length; i<k; i++){
                try{
                    xmlDoc = new ActiveXObject(arr[i]);
                    xmlDoc.async = false;
                    xmlDoc.loadXML(xmlString);
                }catch(e){
                    
                }
            }
        }
        return xmlDoc;
    };
    potato.deepJsonClone = function(data){
        if(!data){return data;}
        var con = data.constructor;
        var i,k,obj;
        if(con==Array || con==Object){
            if(con == Array){
                obj = [];
                for(i=0,k=data.length; i<k; i++){
                    obj[i] = potato.deepJsonClone(data[i]);
                }
            }else if(con == Object){
                obj = {};
                for(i in data){
                    obj[i] = potato.deepJsonClone(data[i]);
                }
            }
            return obj;
        }else{
            return data;
        }
    };
    potato.sortNumericBy = function(name){
        return function(o, p){  
            var a, b;  
            a = o[name];  
            b = p[name];  
            if (a === b) { return 0; }
            return (a < b ? -1 : 1);
        };
    };
    potato.copy = function(obj) {
        var i, k, key, item, deep;
        if(typeof(obj)=="boolean"){
            deep = true;
            obj = arguments[1];
            i = 2;
        }else{
            i = 1;
        }
        for(i,k=arguments.length; i<k; i++){
            item = arguments[i];
            if(!item){
                continue;
            }
            for(key in obj){
                if(item[key] !== undefined){
                    if(deep){
                        var type = typeof(obj[key]);
                        if(type=="object" && obj[key]!=null){
                            potato.copy(true,obj[key],item[key]);
                        }else{
                            obj[key] = item[key]; 
                        }
                    }else{
                       obj[key] = item[key]; 
                    }
                }
            }
        }
        return obj;
    };
    potato.createClass = CreateClass;
    potato.getUniqueID = function () {
        _pt.__UID__++;
        return 'u'+_pt.__UID__;
    };
    //potato.defineReadOnly = DefineReadOnly;
    //potato.setReadOnly = SetReadOnly;
    potato._remoteRoute = function(url){return url;}
    potato._ajaxRoute = function(options){return options;}
    potato._ajaxRenderer = function(url, content){return content;}
    potato._remoteRenderer = function(url, data){return data;}
    potato.setConfig = function(options){
        var allow = {"application":1,"_remoteRoute":1,"_ajaxRoute":1,"loadData":1,"lang":1,"errors":1,"alert":1,"commonFailureCaller":1,"history":1,"resizeDelay":1,"_ajaxRenderer":1,"_remoteRenderer":1,"cacheEncode":1,"cacheEncrypt":1,"cacheDecode":1,"cacheDecrypt":1,"parseResult":1};
        var key,item;
        for(key in options){
            item = options[key];
            if(!allow[key]){continue;}
            if(key=="application"){
                potato.dialogs[0] =  item;
            }else if(key=="history" && item && _pt.initHistory){
                _pt.initHistory();
            }else if(key=="resizeDelay" && item && _pt.initResizeDelay){
                _pt.initResizeDelay();
            }
            SetReadOnly(potato,key,item);
        }
    };

    temp = [potato,"Dispatcher","Event","Error","Result","RequestOptions","Proxy","LoadingDelay","Widget","UModule","Cmd","Queue","ViewHistory","cacheDecrypt","Dialog","load","loadData","lang","errors","commonFailureCaller","history","historyReady","cacheEncode","cacheDecode","alert","setHash","setCache","updateCache","getCache","delCache","clearCache","ramStorage","sessionStorage","localStorage","cacheEncrypt","_remoteRoute","_ajaxRoute","application","dialogs","resizeDelay","setConfig","createClass","defineReadOnly","setReadOnly","extendPrototype","embString","parseXML","deepJsonClone","sortNumericBy","_ajaxRenderer","_remoteRenderer","parseResult","loadList","getCurDialog"];
    DefineReadOnly.apply(null,temp);
})();


(function () {
    var CreateClass = potato.createClass;
    var DefineReadOnly = potato.defineReadOnly;
    var SetReadOnly = potato.setReadOnly;
    var FormData = window.FormData;
    var newFun,newCls;

    function toParam(data) {
        if(typeof(data)=="object"){
            var str = [];
            for(var key in data){
                str.push(key+"="+encodeURI(data[key]));
            }
            return str.join("&");
        }else{
            return data;
        }
    }

    function onprogress (evt){
        var loaded = evt.loaded;  
        var tot = evt.total;  
        var per = (Math.floor(100*loaded/tot) || 10)+"%";
        potato.application.setLoadingNote(per);
    }

    function ajax(options, cache) {
        //decodeURIComponent(_$.param(get)));encodeURI(url)
        var XHR = new XMLHttpRequest();
        try{
            XHR.timeout = 30000;
        }catch(e){

        }
        var uri = options.url;
        options = potato._ajaxRoute(options);
        var method = options.method ? options.method.toLowerCase() : "get";
        var url = options.url;
        var header = options.header || {};
        var contentType = header.contentType;
        var send = options.send;
        if(method == "put"){ method = "post";}
        var args,i,callback,connection,request,returned;
        if (method == "get" && send) {
            args = toParam(send);
            url += ((url.indexOf("?") > -1) ? "&" : "?") + args;
            args = null;
        }
        potato.application.addLoadingItem(XHR);
        XHR.open(method, url, options.async);
        XHR.setRequestHeader("X-Requested-With", "Ajax");
        XHR.withCredentials = true;
        for(i in header){
            XHR.setRequestHeader(i, header[i]);
        }
        if(cache){
            XHR.setRequestHeader("If-None-Match", cache);
        }
        if (send && method=="post") {
            if(window.FormData && send instanceof window.FormData){
                args = send;
            }else{
                if(contentType===undefined){
                    contentType = "application/json";
                }
                if(contentType){
                    XHR.setRequestHeader("Content-Type", contentType);
                }
                if(contentType == "application/json"){
                    args = JSON.stringify(send);
                }else{
                    args = send;
                }
            }
        }
        if(XHR.upload){
            XHR.upload.onprogress = onprogress;
        }
        XHR.onreadystatechange = function () {
            if (this.readyState == 4){
                var response,complete,result,cachePlan,expires;
                potato.application.removeLoadingItem(this);
                response = {status:0,text:"",xml:"",cache:this.getResponseHeader("X-Cache"),uri:uri};
                try{
                    response.status = this.status;
                    response.text = this.responseText;
                    response.xml = this.responseXML;
                }catch(e){
                    console.log(e);
                    response.status = 0;
                    response.text = "";
                    response.xml = null;
                }
                if(this.aborted){response.status = -1;}
                if(response.status == 1223){response.status = 204;}

                if(response.status == -1){
                    callback(new potato.Error("c7"));
                }else if(response.status == 404){
                    callback(new potato.Error("c1"));
                }else if(response.status == 304 && cache){
                    cachePlan ={etag:this.getResponseHeader("Etag")||"", expires:""};
                    expires = this.getResponseHeader("Cache-Control");
                    if(expires){
                        expires = expires.split("=");
                        expires = parseInt(expires[1]);
                        cachePlan.expires = isNaN(expires)?"":expires;
                    }
                    callback({cache:cachePlan});
                }else if(!response.text){
                    callback(new potato.Error("d9"));
                }else{
                    result = potato._ajaxRenderer(uri, response.text);
                    result = potato.parseXML(result);
                    if(!result){
                        callback(new potato.Error("d9"));
                    }else{
                        complete = function(result){
                            if(result.error){
                                var eid = result.error.id;
                                if(eid.substring(0,1)=='a'){
                                    eid = 'c'+ eid.substring(1);
                                }else{
                                    eid = 'd'+ eid.substring(1);
                                }
                                result.error.id = eid;
                                callback(new potato.Error(result.error.id, {detail:result.data, note:result.error.note}));
                            }else{
                                if(response.cache){result.cache = response.cache;}
                                callback(result);
                            }
                        };
                        result = potato.parseResult(result.lastChild);
                        if(!result){
                            callback(new potato.Error("d9"));
                        }else if(result instanceof potato.Proxy){
                            result.addCompleteCaller(complete);
                            if(request){
                                request.setConnection(result);
                            }else{
                                connection = result;
                            }
                        }else{
                            complete(result);
                        }
                    }
                }
                XHR = null;
            }
        };
        callback = function(result){
            if(request){
                request.complete(result);
            }else{
                returned = result;
            }
        }
        connection = XHR;
        XHR.send(args);
        if(returned === undefined){
            request = new potato.Proxy(connection, options);
            return request;
        }else{
            return returned;
        }
    }

    potato.setConfig({
        loadData:function(options, cache) {
            return ajax(options, cache);
        }
    });

})();
