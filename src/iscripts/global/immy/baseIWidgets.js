"use strict";
(function () {

    var BaseIWidget = (function(){
        function CON(dom, parent){
            potato.Widget.call(this, dom, parent);
            this._$dom = $(dom);
            this._els = {};
            this._watchEvent();
            this._els = this._getElements();
        }
        var CID = potato.createClass(CON, potato.Widget);

        CON.prototype.find = function (expr, obj, ele) {
            return this._$dom.find(expr, obj, ele);
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
                    if (action) {
                        var arr = action.split("|");
                        for (i = 0, k = arr.length; i < k; i++) {
                            propagation = (callAction(arr[i], type, target, hit) === true ? true : false) && propagation;
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
        return CON;
    })();

    var IWidgetLoader = (function(){
        function CON(dom, parent){
            potato.Widget.call(this, dom, parent);
            $.addClass(dom,"-immy-loader");
            dom.innerHTML = '<div idom="panel" class="-immy-loader-panel -immy-loader-in">'+
                '<div idom="page" class="-immy-loader-page -immy-loader-cur"></div>'+
                '<div idom="page" class="-immy-loader-page -immy-loader-old"></div>'+
                '</div>';
            var els = $(dom).find("[idom]").groupBy("idom");
            this[CID] = {
                _page : els['page'],
                _panel : els['panel'][0]
            };
            this.widget = null;
            els = null;
        }
        var CID = potato.createClass(CON, potato.Widget);
        CON.prototype.load = function(widget, forward){
            var _this = this[CID];
            var pos,page,dom,div,scroller;
            if(this.widget){
                if(this.widget == widget){
                    this.reload();
                    return true;
                }
                dom = this.widget.dom;
                page = dom.parentNode;
                scroller = page;
                pos = scroller.scrollLeft+","+scroller.scrollTop;
                dom.setAttribute("data-pos",pos);
                this.widget._uninstall();
                if(!dom.parentNode){
                    page.appendChild(dom);//uninstall有可能调用remove消毁
                }
            }else{
                page = _this._page[0];
            }
            page.className = "-immy-loader-page -immy-loader-old";
            this.widget = widget;
            dom = this.widget.dom;
            pos = (dom.getAttribute("data-pos") || "0,0").split(",");
            page = _this._page[0]==page?_this._page[1]:_this._page[0];
            if(page.firstChild){page.removeChild(page.firstChild);}
            page.appendChild(dom);
            this.widget._install(this.parent);
            page.className = "-immy-loader-page -immy-loader-cur";
            div = _this._panel;
            if(forward){
                div.className = "-immy-loader-panel -immy-loader-out -immy-loader-transform";
            }else{
                div.className = "-immy-loader-panel -immy-loader-in -immy-loader-transform";
            }
            div.offsetHeight;
            $.removeClass(div, "-immy-loader-transform");
            scroller = page;
            scroller.scrollLeft = pos[0];
            scroller.scrollTop = pos[1];
        };
        CON.prototype.reload = function(){
            var _this = this[CID];
            var div = _this._panel;
            $.addClass(div, "-immy-loader-reload");
            div.offsetHeight;
            $.removeClass(div, "-immy-loader-reload");
        };
        /*CON.prototype.empty = function () {


            this.widget = null;
            var _this = this[CID];
            var pos,page,dom,div,scroller;
            if(this.widget){
                dom = this.widget.dom;
                page = dom.parentNode;
                scroller = page;
                pos = scroller.scrollLeft+","+scroller.scrollTop;
                dom.setAttribute("data-pos",pos);
                this.widget._uninstall();
                if(!dom.parentNode){
                    page.appendChild(dom);//uninstall有可能调用remove消毁
                }
            }else{
                page = _this._page[0];
            }
            page.className = "-immy-loader-page -immy-loader-old";
            this.widget = widget;
            dom = this.widget.dom;
            pos = (dom.getAttribute("data-pos") || "0,0").split(",");
            page = _this._page[0]==page?_this._page[1]:_this._page[0];
            if(page.firstChild){page.removeChild(page.firstChild);}
            page.appendChild(dom);
            this.widget._install(this.parent);
            page.className = "-immy-loader-page -immy-loader-cur";
            div = _this._panel;
            if(forward){
                div.className = "-immy-loader-panel -immy-loader-out -immy-loader-transform";
            }else{
                div.className = "-immy-loader-panel -immy-loader-in -immy-loader-transform";
            }
            div.offsetHeight;
            $.removeClass(div, "-immy-loader-transform");
            scroller = page;
            scroller.scrollLeft = pos[0];
            scroller.scrollTop = pos[1];
        };*/
        return CON;
    })();

    project.baseIWidgets = {
        IWidgetLoader: IWidgetLoader,
        BaseIWidget: BaseIWidget
    };

})();