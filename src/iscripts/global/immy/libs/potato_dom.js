(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("potato2"), require("jquery"));
	else if(typeof define === 'function' && define.amd)
		define(["potato2", "jquery"], factory);
	else if(typeof exports === 'object')
		exports["pdom"] = factory(require("potato2"), require("jquery"));
	else
		root["pdom"] = factory(root["potato2"], root["jquery"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__) {
return __webpackBootstrap
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(2), __webpack_require__(3), __webpack_require__(4), __webpack_require__(8), __webpack_require__(9), __webpack_require__(10)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, potato, $, css, tpl_CommonDialog, tpl_Application, tpl_TurnContainer) {
	    "use strict";
	    var $ = jQuery;
	    potato.include(css, tpl_CommonDialog);
	    var jdomMethods = {
	        groupBy: function (attr) {
	            var dlist = {};
	            var key, i, k, o;
	            attr = attr || "data-dom";
	            for (i = 0, k = this.length; i < k; i++) {
	                o = this[i];
	                key = o.getAttribute(attr);
	                if (key) {
	                    if (dlist[key]) {
	                        dlist[key].push(o);
	                    }
	                    else {
	                        dlist[key] = [o];
	                    }
	                }
	            }
	            return dlist;
	        },
	        removeChild: function (child) {
	            child.remove();
	        },
	        appendChild: $.fn.append,
	        setZIndex: function (index) {
	            this.css('z-index', index + 100);
	        }
	    };
	    for (var p in jdomMethods) {
	        if ($.fn.hasOwnProperty(p)) {
	            console.log(p + " is override!");
	        }
	        else {
	            $.fn[p] = jdomMethods[p];
	        }
	    }
	    // let commandTemplate = potato.includeResource('html!./tpl.html') ;
	    // console.log(commandTemplate);
	    // export interface $View extends JQuery {
	    //     removeChild(view: $View): void;
	    //     appendChild(view: $View): void;
	    // }
	    // export interface $Layer extends $View {
	    //     
	    // }
	    // export function view(...args): $View {
	    //     let result: $View = ($ as any)(...args);
	    //     (result as any).removeChild = function (view: $View) { view.remove(); };
	    //     (result as any).appendChild = result.append;
	    //     return result;
	    // }
	    // export function layer(...args): $Layer {
	    //     let result: $Layer = ($ as any)(...args);
	    //     (result as any).removeChild = function (view: $View) { view.remove(); };
	    //     (result as any).appendChild = result.append;
	    //     (result as any).setZIndex = function (index: number): void {
	    //         $(this).css('z-index', index);
	    //     }
	    //     return result;
	    // }
	    exports.DialogEffect = {
	        scale: "pdom-scale",
	        swipeUp: "pdom-swipeUp",
	        swipeDown: "pdom-swipeDown",
	        swipeLeft: "pdom-swipeLeft",
	        swipeRight: "pdom-swipeRight",
	        slideUp: "pdom-slideUp",
	        slideDown: "pdom-slideDown",
	        slideLeft: "pdom-slideLeft",
	        slideRight: "pdom-slideRight",
	    };
	    exports.TurnEffect = {
	        slid: "pdom-slid",
	        fade: "pdom-fade",
	    };
	    var AnimationEnd = (function () {
	        var style = document.documentElement.style;
	        if ('animation' in style) {
	            return 'animationend';
	        }
	        if ('WebkitAnimation' in style) {
	            return 'webkitAnimationEnd';
	        }
	        return '';
	    })();
	    function getWindowSize() {
	        return { width: window.innerWidth || $(window).width(), height: window.innerHeight || $(window).height() };
	        //var zoomLevel:number = document.documentElement.clientWidth / window.innerWidth;
	        //return {width:document.documentElement.clientWidth,height:zoomLevel?Math.round(window.innerHeight * zoomLevel):document.documentElement.clientHeight};
	    }
	    exports.getWindowSize = getWindowSize;
	    var DomApplication = (function (_super) {
	        __extends(DomApplication, _super);
	        function DomApplication(els) {
	            var _this = this;
	            if (!els) {
	                var dialog = $(tpl_Application).appendTo(document.body);
	                var comps = dialog.find("[data-dom]").groupBy();
	                els = { view: $(document.body), dialog: dialog, body: $(comps['body']), header: $(comps['header']), footer: $(comps['footer']), aside: $(comps['aside']) };
	            }
	            _super.call(this, els);
	            this.globalLoadingLayer = $('<div class="pdom-globalLoadingLayer"></div>');
	            this.view.append(this.globalLoadingLayer);
	            potato.taskCounter.addListener(potato.TaskCountEvent.Added, function (e) {
	                _this.globalLoadingLayer.show();
	            }).addListener(potato.TaskCountEvent.Busy, function (e) {
	                _this.globalLoadingLayer.addClass("pdom-busy");
	            }).addListener(potato.TaskCountEvent.Free, function (e) {
	                _this.globalLoadingLayer.removeClass("pdom-busy");
	                _this.globalLoadingLayer.hide();
	            });
	        }
	        return DomApplication;
	    }(potato.Application));
	    exports.DomApplication = DomApplication;
	    var CommonDialog = (function (_super) {
	        __extends(CommonDialog, _super);
	        function CommonDialog(config, els) {
	            var _this = this;
	            if (!els) {
	                var view = $(tpl_CommonDialog);
	                var comps = view.find("[data-dom]").groupBy();
	                els = { view: view, dialog: $(comps['dialog']), mask: $(comps['mask']), body: $(comps['body']), header: $(comps['header']), footer: $(comps['footer']), aside: $(comps['aside']) };
	            }
	            _super.call(this, els, config);
	            if (this.config.headerEffect && this.header) {
	                turnContainer(this.header).addClass(this.config.headerEffect);
	            }
	            if (this.config.footerEffect && this.footer) {
	                turnContainer(this.footer).addClass(this.config.footerEffect);
	            }
	            if (this.config.asideEffect && this.aside) {
	                turnContainer(this.aside).addClass(this.config.asideEffect);
	            }
	            if (this.config.bodyEffect && this.body) {
	                turnContainer(this.body).addClass(this.config.bodyEffect);
	            }
	            $(window).on("resize", function () {
	                if (_this.state != potato.DialogState.Closed) {
	                    _this.refreshSize();
	                    _this.refreshPosition();
	                    _this.refreshLayout();
	                }
	            });
	            this.mask && this.mask.on("click", function () {
	                _this.close();
	            });
	            var that = this;
	            AnimationEnd && this.view.on(AnimationEnd, function () {
	                that._animationEnd();
	            });
	        }
	        CommonDialog.prototype._animationEnd = function () {
	            this.view.removeClass("pdom-transiting");
	            if (this.state == potato.DialogState.Closed) {
	                this.view.hide();
	            }
	        };
	        CommonDialog.prototype._afterConfigChange = function (oldConfig) {
	            _super.prototype._afterConfigChange.call(this, oldConfig);
	            this.dialog.css({
	                position: this.config.fixed ? "fixed" : "absolute"
	            });
	        };
	        CommonDialog.prototype._setState = function (state) {
	            if (this.state == potato.DialogState.Closed) {
	                this.view.show();
	                this.view[0].offsetHeight;
	            }
	            _super.prototype._setState.call(this, state);
	            this.view.addClass("pdom-transiting");
	            !AnimationEnd && this._animationEnd();
	        };
	        CommonDialog.prototype._parseExpr = function (value, worh) {
	            var target = undefined, expr = '';
	            var els, multiple, multipleNum, increment, incrementNum;
	            if (typeof value == "function") {
	                return value(this);
	            }
	            else if (typeof value == "number") {
	                return value;
	            }
	            else if (Array.isArray(value)) {
	                target = value[0], expr = value[1];
	                expr = 'target' + expr;
	            }
	            else if (typeof value == "object") {
	                target = value;
	            }
	            else if (typeof value == "string") {
	                if (/^\d+.*$/.test(value)) {
	                    return parseInt(value);
	                }
	                else {
	                    expr = value;
	                }
	            }
	            if (expr) {
	                var arr = expr.match(/^([^*/+-]+)(([*/])([\d.]+))?(([+-])(\d+))?$/);
	                if (arr) {
	                    els = arr[1], multiple = arr[3], multipleNum = arr[4], increment = arr[6], incrementNum = arr[7];
	                    if (!target) {
	                        target = $(els);
	                    }
	                }
	            }
	            if (target && target.length) {
	                var methon = { "width": "outerWidth", "height": "outerHeight" };
	                var outerWorH = methon[worh];
	                var value_1 = (worh == "width" || worh == "height") ? target[outerWorH]() : target.offset()[worh];
	                if (multiple) {
	                    multipleNum = parseFloat(multipleNum);
	                    if (multiple == '*') {
	                        value_1 *= multipleNum;
	                    }
	                    else {
	                        value_1 /= multipleNum;
	                    }
	                }
	                if (increment) {
	                    incrementNum = parseInt(incrementNum);
	                    if (increment == '+') {
	                        value_1 += incrementNum;
	                    }
	                    else {
	                        value_1 -= incrementNum;
	                    }
	                }
	                return value_1;
	            }
	            else {
	                return NaN;
	            }
	        };
	        CommonDialog.prototype.refreshSize = function () {
	            var _this = this;
	            if (this.state == potato.DialogState.Closed) {
	                return;
	            }
	            var dialogSize = { width: 0, height: 0 };
	            var obj = getWindowSize();
	            ['width', 'height'].forEach(function (worh) {
	                var value = _this.config.size[worh];
	                if (typeof value == "number") {
	                    if (value == potato.DialogSize.Full) {
	                        dialogSize[worh] = "100%";
	                        return;
	                    }
	                    else if (value == potato.DialogSize.Content) {
	                    }
	                }
	                else if (typeof value == "string" && /^\d{1,3}%$/.test(value)) {
	                    dialogSize[worh] = parseInt(value) / 100 * obj[worh];
	                    return;
	                }
	                dialogSize[worh] = _this._parseExpr(value, worh);
	            });
	            this._setSize(dialogSize.width || 100, dialogSize.height || 100);
	        };
	        CommonDialog.prototype._setSize = function (width, height) {
	            this.dialog.css({ width: Math.round(width), height: Math.round(height) });
	        };
	        CommonDialog.prototype.refreshLayout = function () {
	            if (this.state == potato.DialogState.Closed) {
	                return;
	            }
	            var headerHeight = 0, footerHeight = 0, asideWidth = 0;
	            if (this.content instanceof potato.WholeVPresenter) {
	                var view = void 0;
	                view = this.content.getHeader();
	                if (view) {
	                    headerHeight = Math.ceil(view.outerHeight(true));
	                }
	                view = this.content.getFooter();
	                if (view) {
	                    footerHeight = Math.ceil(view.outerHeight(true));
	                }
	                view = this.content.getAside();
	                if (view) {
	                    asideWidth = Math.ceil(view.outerWidth(true));
	                }
	            }
	            this.header && (headerHeight ? this.header.height(headerHeight).show() : this.header.hide());
	            this.footer && (footerHeight ? this.footer.height(footerHeight).show() : this.footer.hide());
	            this.aside && (asideWidth ? this.aside.width(asideWidth).show() : this.aside.hide());
	            var width = this.dialog.width();
	            var height = this.dialog.height();
	            if (this.config.asideInBody) {
	                this.body && this.body.css({ width: width - asideWidth, height: height - headerHeight - footerHeight, marginLeft: this.config.asideOnRight ? 0 : asideWidth });
	                this.aside && this.aside.height(height - headerHeight - footerHeight);
	            }
	            else {
	                this.header && this.header.css(this.config.asideOnRight ? "margin-right" : "margin-left", asideWidth);
	                this.footer && this.footer.css(this.config.asideOnRight ? "margin-right" : "margin-left", asideWidth);
	                this.body && this.body.css(this.config.asideOnRight ? "margin-right" : "margin-left", asideWidth).height(height - headerHeight - footerHeight);
	            }
	        };
	        CommonDialog.prototype.refreshPosition = function () {
	            var _this = this;
	            if (this.state == potato.DialogState.Closed) {
	                return;
	            }
	            var obj = getWindowSize();
	            var dialogSize = { x: this.dialog.outerWidth(), y: this.dialog.outerHeight() };
	            var windowSize = { x: obj.width, y: obj.height };
	            var offset = this.config.offset;
	            var dialogPos = { x: 0, y: 0 };
	            var offsetPos = { x: 0, y: 0 };
	            var minPos = { x: 0, y: 0 };
	            var maxPos = { x: windowSize.x - dialogSize.x, y: windowSize.y - dialogSize.y };
	            var dialogOffset;
	            var dialogPosition;
	            var parentOffset;
	            var pageScroll = { x: $(window).scrollLeft(), y: $(window).scrollTop() };
	            ;
	            if (!this.config.fixed) {
	                dialogOffset = this.dialog.offset();
	                dialogPosition = this.dialog.position();
	                parentOffset = { x: dialogOffset.left - dialogPosition.left, y: dialogOffset.top - dialogPosition.top };
	                minPos = { x: -parentOffset.x, y: -parentOffset.y };
	                maxPos = { x: NaN, y: NaN };
	            }
	            ['x', 'y'].forEach(function (xory) {
	                var lort = xory == "x" ? "left" : "top";
	                var positionValue = _this.config.position[xory];
	                var element = null;
	                if (typeof positionValue == "number") {
	                    if (_this.config.fixed) {
	                        switch (positionValue) {
	                            case potato.DialogPosition.Left:
	                                dialogPos.x = 0;
	                                return;
	                            case potato.DialogPosition.Right:
	                                dialogPos.x = windowSize.x - dialogSize.x;
	                                return;
	                            case potato.DialogPosition.Center:
	                                dialogPos.x = (windowSize.x - dialogSize.x) / 2;
	                                return;
	                            case potato.DialogPosition.Top:
	                                dialogPos.y = 0;
	                                return;
	                            case potato.DialogPosition.Bottom:
	                                dialogPos.y = windowSize.y - dialogSize.y;
	                                return;
	                            case potato.DialogPosition.Middle:
	                                dialogPos.y = (windowSize.y - dialogSize.y) / 2;
	                                return;
	                        }
	                    }
	                    else {
	                        switch (positionValue) {
	                            case potato.DialogPosition.Left:
	                                dialogPos.x = pageScroll.x - parentOffset.x;
	                                return;
	                            case potato.DialogPosition.Right:
	                                dialogPos.x = pageScroll.x - parentOffset.x + windowSize.x - dialogSize.x;
	                                return;
	                            case potato.DialogPosition.Center:
	                                dialogPos.x = pageScroll.x - parentOffset.x + (windowSize.x - dialogSize.x) / 2;
	                                return;
	                            case potato.DialogPosition.Top:
	                                dialogPos.y = pageScroll.y - parentOffset.y;
	                                return;
	                            case potato.DialogPosition.Bottom:
	                                dialogPos.y = pageScroll.y - parentOffset.y + windowSize.y - dialogSize.y;
	                                return;
	                            case potato.DialogPosition.Middle:
	                                dialogPos.y = pageScroll.y - parentOffset.y + (windowSize.y - dialogSize.y) / 2;
	                                return;
	                        }
	                    }
	                }
	                else if (typeof positionValue == "string" && /^\d{1,3}%$/.test(positionValue)) {
	                    if (_this.config.fixed) {
	                        dialogPos[xory] = parseInt(positionValue) / 100 * windowSize[xory];
	                    }
	                    else {
	                        dialogPos[xory] = parseInt(positionValue) / 100 * windowSize[xory] + pageScroll[xory] - parentOffset[xory];
	                    }
	                    return;
	                }
	                var value = _this._parseExpr(positionValue, lort);
	                if (_this.config.fixed) {
	                    dialogPos[xory] = value - pageScroll[xory];
	                }
	                else {
	                    dialogPos[xory] = value - parentOffset[xory];
	                }
	            });
	            ['x', 'y'].forEach(function (xory) {
	                var offsetValue = _this.config.offset[xory];
	                var worh = xory == "x" ? "width" : "height";
	                if (typeof offsetValue == "string" && /^\d{1,3}%$/.test(offsetValue)) {
	                    offsetPos[xory] = dialogSize[xory] * parseInt(offsetValue) / 100;
	                    return;
	                }
	                offsetPos[xory] = _this._parseExpr(offsetValue, worh);
	            });
	            ['x', 'y'].forEach(function (xory) {
	                dialogPos[xory] += offsetPos[xory];
	                if (!isNaN(minPos[xory]) && dialogPos[xory] < minPos[xory]) {
	                    dialogPos[xory] = minPos[xory];
	                }
	                if (!isNaN(maxPos[xory]) && (dialogPos[xory] > maxPos[xory])) {
	                    dialogPos[xory] = maxPos[xory];
	                }
	            });
	            this._setPosition(dialogPos.x, dialogPos.y);
	        };
	        CommonDialog.prototype._setPosition = function (left, top) {
	            this.dialog.css({ left: left, top: top });
	        };
	        return CommonDialog;
	    }(potato.Dialog));
	    exports.CommonDialog = CommonDialog;
	    function turnContainer(container) {
	        console.log(tpl_TurnContainer);
	        var comps = container.html(tpl_TurnContainer).addClass("pdom-turnContainer").find("[data-dom]").groupBy();
	        var content;
	        container.removeChild = function (view) {
	        };
	        container.appendChild = function (view) {
	            var pos, page, panel, scroller, inOrOut = "pdom-in", outOrIn = "pdom-out";
	            if (content) {
	                if (content[0] == view[0]) {
	                    //this.reload();
	                    return;
	                }
	                page = content.parent();
	                scroller = page[0];
	                content.attr("data-pos", scroller.scrollLeft + "," + scroller.scrollTop);
	            }
	            else {
	                page = $(comps['page'][0]);
	            }
	            page.removeClass("pdom-current").addClass("pdom-previous");
	            pos = (view.attr("data-pos") || "0,0").split(",");
	            page = comps['page'][0] == page[0] ? $(comps['page'][1]) : $(comps['page'][0]);
	            panel = $(comps['panel']);
	            var oview = page[0].firstChild;
	            if (oview == view[0]) {
	                if (panel.hasClass("pdom-in")) {
	                    inOrOut = "pdom-out";
	                    outOrIn = "pdom-in";
	                }
	                else {
	                    inOrOut = "pdom-in";
	                    outOrIn = "pdom-out";
	                }
	            }
	            $(oview).detach();
	            page.append(view);
	            content = view;
	            page.removeClass("pdom-previous").addClass("pdom-current");
	            panel.removeClass(outOrIn).addClass(inOrOut + " pdom-transform");
	            panel[0].offsetWidth;
	            panel.removeClass("pdom-transform");
	            scroller = page[0];
	            scroller.scrollLeft = parseInt(pos[0]);
	            scroller.scrollTop = parseInt(pos[1]);
	        };
	        return container;
	    }
	    exports.turnContainer = turnContainer;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(5);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(7)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/sass-loader/index.js!./css.scss", function() {
				var newContent = require("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/sass-loader/index.js!./css.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(6)();
	// imports


	// module
	exports.push([module.id, ".pdom-commonDialog.pdom-slideDown > .pdom-dialog, .pdom-commonDialog.pdom-slideUp > .pdom-dialog, .pdom-commonDialog.pdom-slideLeft > .pdom-dialog, .pdom-commonDialog.pdom-slideRight > .pdom-dialog {\n  box-shadow: none;\n  transition: none; }\n\n.pdom-globalLoadingLayer {\n  position: fixed;\n  width: 100%;\n  height: 100%;\n  background: rgba(0, 0, 0, 0.1);\n  left: 0;\n  top: 0;\n  display: none;\n  z-index: 100000; }\n\n.pdom-commonDialog {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%; }\n  .pdom-commonDialog.pt-masked > .pdom-mask {\n    display: block; }\n  .pdom-commonDialog.pt-asideOnRight > .pdom-dialog > .pdom-container > .pdom-aside {\n    right: 0; }\n  .pdom-commonDialog.pt-asideOnLeft > .pdom-dialog > .pdom-container > .pdom-aside {\n    left: 0; }\n  .pdom-commonDialog.pt-Closed {\n    display: none; }\n    .pdom-commonDialog.pt-Closed.pdom-scale > .pdom-dialog {\n      transform: scale(0, 0);\n      opacity: 0; }\n    .pdom-commonDialog.pt-Closed.pdom-swipeDown > .pdom-dialog {\n      transform: translateY(-50%);\n      opacity: 0; }\n    .pdom-commonDialog.pt-Closed.pdom-swipeUp > .pdom-dialog {\n      transform: translateY(50%);\n      opacity: 0; }\n    .pdom-commonDialog.pt-Closed.pdom-swipeLeft > .pdom-dialog {\n      transform: translateX(50%);\n      opacity: 0; }\n    .pdom-commonDialog.pt-Closed.pdom-swipeRight > .pdom-dialog {\n      transform: translateX(-50%);\n      opacity: 0; }\n    .pdom-commonDialog.pt-Closed.pdom-slideDown > .pdom-dialog > .pdom-container {\n      -webkit-transform: translateY(-100%);\n      transform: translateY(-100%); }\n    .pdom-commonDialog.pt-Closed.pdom-slideUp > .pdom-dialog > .pdom-container {\n      -webkit-transform: translateY(100%);\n      transform: translateY(100%); }\n    .pdom-commonDialog.pt-Closed.pdom-slideLeft > .pdom-dialog > .pdom-container {\n      -webkit-transform: translateX(100%);\n      transform: translateX(100%); }\n    .pdom-commonDialog.pt-Closed.pdom-slideRight > .pdom-dialog > .pdom-container {\n      -webkit-transform: translateX(-100%);\n      transform: translateX(-100%); }\n    .pdom-commonDialog.pt-Closed > .pdom-mask {\n      opacity: 0; }\n  .pdom-commonDialog.pt-asideOutBody > .pdom-dialog > .pdom-container > .pdom-aside {\n    top: 0; }\n  .pdom-commonDialog.pdom-transiting {\n    animation: dialogEffect 200ms;\n    -webkit-animation: dialogEffect 200ms; }\n  .pdom-commonDialog > .pdom-mask {\n    display: none;\n    position: fixed;\n    width: 100%;\n    height: 100%;\n    background: #000;\n    left: 0;\n    top: 0;\n    opacity: 0.5;\n    -ms-filter: \"progid:DXImageTransform.Microsoft.Alpha(opacity=60)\";\n    transition: opacity 200ms ease-out; }\n  .pdom-commonDialog > .pdom-dialog {\n    position: fixed;\n    transition: opacity 200ms ease-out;\n    transition-property: transform, opacity;\n    box-shadow: 0 0 5px rgba(0, 0, 0, 0.6);\n    background: transparent;\n    overflow: hidden;\n    width: 100px;\n    height: 100px; }\n    .pdom-commonDialog > .pdom-dialog > .pdom-container {\n      height: 100%;\n      width: 100%;\n      position: relative;\n      transition: transform 200ms ease-out; }\n      .pdom-commonDialog > .pdom-dialog > .pdom-container > .pdom-component {\n        overflow: hidden;\n        position: relative; }\n      .pdom-commonDialog > .pdom-dialog > .pdom-container > .pdom-aside {\n        height: 100%;\n        position: absolute; }\n\n@keyframes dialogEffect {\n  to {\n    opacity: 1; } }\n\n@-webkit-keyframes dialogEffect {\n  to {\n    opacity: 1; } }\n\n.pdom-turnContainer {\n  position: relative; }\n  .pdom-turnContainer.pdom-fade > .pdom-panel > .pdom-page {\n    position: absolute;\n    overflow-x: hidden;\n    overflow-y: auto;\n    -webkit-overflow-scrolling: touch;\n    width: 100%;\n    height: 100%;\n    left: 0;\n    top: 0;\n    transition: opacity 300ms ease-in; }\n  .pdom-turnContainer.pdom-fade > .pdom-panel > .pdom-current {\n    opacity: 1;\n    z-index: 2; }\n  .pdom-turnContainer.pdom-fade > .pdom-panel > .pdom-previous {\n    opacity: 0;\n    z-index: 1; }\n  .pdom-turnContainer.pdom-slid {\n    overflow: hidden; }\n    .pdom-turnContainer.pdom-slid > .pdom-panel {\n      position: absolute;\n      width: 200%;\n      height: 100%;\n      transform: none;\n      transition: transform 300ms ease-in; }\n      .pdom-turnContainer.pdom-slid > .pdom-panel > .pdom-page {\n        position: absolute;\n        width: 50%;\n        height: 100%;\n        overflow-x: hidden;\n        overflow-y: auto;\n        -webkit-overflow-scrolling: touch; }\n    .pdom-turnContainer.pdom-slid > .pdom-in {\n      left: -100%; }\n      .pdom-turnContainer.pdom-slid > .pdom-in > .pdom-current {\n        left: 50%; }\n      .pdom-turnContainer.pdom-slid > .pdom-in.pdom-transform {\n        transition: none;\n        transform: translateX(50%); }\n    .pdom-turnContainer.pdom-slid > .pdom-out > .pdom-previous {\n      left: 50%; }\n    .pdom-turnContainer.pdom-slid > .pdom-out.pdom-transform {\n      transition: none;\n      transform: translateX(-50%); }\n\n.pdom-transiting .pdom-transition {\n  transition: none !important; }\n", ""]);

	// exports


/***/ },
/* 6 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = "<div class=\"pdom-commonDialog\">\r\n\t<div class=\"pdom-mask\" data-dom=\"mask\"></div>\r\n\t<div class=\"pdom-dialog\" data-dom=\"dialog\">\r\n\t\t<div class=\"pdom-container\">\r\n\t\t\t<div class=\"pdom-header pdom-component\" data-dom=\"header\"></div>\r\n\t\t\t<div class=\"pdom-aside pdom-component\" data-dom=\"aside\"></div>\r\n\t\t\t<div class=\"pdom-body pdom-component\" data-dom=\"body\"></div>\r\n\t\t\t<div class=\"pdom-footer pdom-component\" data-dom=\"footer\"></div>\r\n\t\t</div>\r\n\t</div>\r\n</div>";

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = "<div class=\"pdom-application\">\r\n\t<div class=\"pdom-header\" data-dom=\"header\"></div>\r\n\t<div class=\"pdom-body\" data-dom=\"body\"></div>\r\n\t<div class=\"pdom-aside\" data-dom=\"aside\"></div>\r\n\t<div class=\"pdom-footer\" data-dom=\"footer\"></div>\r\n</div>";

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = "<div data-dom=\"panel\" class=\"pdom-panel pdom-transition\">\r\n\t<div data-dom=\"page\" class=\"pdom-page pdom-current pdom-transition\"></div>\r\n\t<div data-dom=\"page\" class=\"pdom-page pdom-previous pdom-transition\"></div>\r\n</div>";

/***/ }
/******/ ])
});
;