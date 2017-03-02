"use strict";
(function($){
    var tempTextarea = document.createElement("textarea");
    var staticMethods = {
        supports: (function(){
            var list = {};
            list.supportsTouch = false;
            return list;
        })(),
        addClass: function (dom, cls) {
            if(!cls){return dom;}
            var rclass = /\s+/g;
            var c = dom.className.replace(rclass, " ");
            if ((" " + c + " ").indexOf(" " + cls + " ") < 0) {
                dom.className = c + (c == "" ? "" : " ") + cls;
            }
            return dom;
        },
        removeClass: function (dom, cls) {
            if(!cls){return dom;}
            var dclass = new RegExp(cls, "g");
            var rclass = /\s+/g;
            var s = /^\s*|\s*$/g;
            dom.className = dom.className.replace(dclass, " ").replace(rclass, " ").replace(s, "");
            return dom;
        },
        hasClass: function (dom, cls) {
            var rclass = /\s+/g;
            var c = dom.className.replace(rclass, " ");
            if ((" " + c + " ").indexOf(" " + cls + " ") >= 0) {
                return true;
            }
            return false;
        },
        /*replaceFirstChild: function (parent, child) {
            var away = parent.children[0];
            if(!away){
                parent.appendChild(child);
            }else if(away != child){
                parent.removeChild(away);
                parent.appendChild(child);
            }
            return away;
        },
        nextSibling: function (dom) {
            var node = dom.nextSibling;
            return node.nodeType==1?node:node.nextSibling;
        },*/
        base64Encode: function(str){
            if(window.btoa){
                return window.btoa(unescape(encodeURIComponent(str)));
            }else{
                var enc = CryptoJS.enc;
                return enc.Base64.stringify(enc.Utf8.parse(str));
            }
        },
        base64Decode: function(str){
            if(window.atob){
                return decodeURIComponent(escape(window.atob(str)));
            }else{
                var enc = CryptoJS.enc;
                return enc.Base64.parse(str).toString(enc.Utf8);
            }
        },
        md5 : function(str){
            return CryptoJS.MD5(str).toString();
        },
        setUrl : function(url, args){
            var pattern = /^([^?#]+)\??([^#]+)?#?(.*)/;
            var arr = pattern.exec(url);
            var key;
            arr.shift();
            var parames = {};
            if(arr[1]){
                var pattern = /([^&]+)=([^&]*)/ig;
                arr[1].replace(pattern, function(a, b, c){
                    parames[b] = c;
                });
            }
            for(key in args){
                parames[key] = encodeURIComponent(args[key]);
            }
            var list = [];
            for(key in parames){
                list.push(key+"="+parames[key]);
            }
            arr[1] = list.join("&");
            return arr[0]+(arr[1]?"?"+arr[1]:"")+(arr[2]?"#"+arr[2]:"");
        },
        parseUrl : function(url){
            var arr;
            var fields = {  
                'Username' : 4,   
                'Password' : 5,   
                'Port' : 7,   
                'Protocol' : 2,   
                'Host' : 6,   
                'Pathname' : 8,   
                'URL' : 0,   
                'Querystring' : 9,   
                'Fragment' : 10  
            };
            var pattern = /^((\w+):\/\/)?((\w+):?(\w+)?@)?([^\/\?:]+):?(\d+)?(\/?[^\?#]+)?\??([^#]+)?#?(.*)/;
            var arr = pattern.exec(url);
            var result = {};
            for(var key in fields){
                result[key] = arr[fields[key]];
            }
            if(result.Querystring){
                var obj = {};
                result.Querystring.split("&").forEach(function (o) {
                    var arr = o.split("=");
                    obj[arr[0]] = decodeURI(arr[1]);
                });
                result.Query = obj;
            }
            return result; 
        },
        render: function (tpl, data) {
            if (typeof (tpl) != "string") {
                tpl = tpl.text;
            }
            var render = template.compile(tpl);
            return render(data);
        },
        fillSelect : function(select, data){
            var html = [];
            for(var i=0,k=data.length; i<k; i++){
                html.push("<option value='"+data[i].value+"'>"+data[i].text+"</option>");
            }
            select.innerHTML = html.join("");
        },
        getText : function(select){
            var option = select.options[select.selectedIndex];
            return option.text;
        },
        /*proxyDom: function (dom) {
            var name = dom.getAttribute('proxy');
            if(name){
                if(name == "parent"){
                    dom = dom.parentNode;
                }else{
                    dom = $(dom).closest(name).get(0);
                }
            }
            return dom;
        },*/
        searchArray: function(arr,key,value){
            if(!arr || !key){return -1;}
            for(var i=0,k=arr.length; i<k; i++){
                if(arr[i][key] == value){
                    return i;
                }
            }
            return -1;
        },
        /*copyEach: function(obj,list){
            var arr = [];
            for(var i=0,k=list.length; i<k; i++){
                arr[i] = $.extend(true,{},obj);
                window.copy(true, arr[i], list[i]);
            }
            return arr;
        },
        equalData: function(data, odata){
            var type = typeof(data);
            var i,k;
            if(data===odata){return true;}
            if(type!="object" || data==null || odata==null){return false;}
            if(data.constructor == Array){
                if(data.length != odata.length){return false;}
                for(i=0,k=data.length; i<k; i++){
                    if(!$.equalData(data[i], odata[i])){
                        return false;
                    }
                }
            }else{
                for(i in data){
                    if(!$.equalData(data[i], odata[i])){
                        return false;
                    }
                }
            }
            return true;
        },*/
        uniqueObjects: function(arr) {
            var sid = "__$__" + new Date().getTime();
            var list = [];
            var item;
            for (var i = 0, k = arr.length; i < k; i++) {
                item = arr[i];
                if (!item.hasOwnProperty(sid)) {
                    item[sid] = 1;
                    list.push(item);
                }
            }
            for (var i = 0, k = arr.length; i < k; i++) {
                item = arr[i];
                delete item[sid];
            }
            return list;
        },
        decodeEntities : function(str){
            tempTextarea.innerHTML = str;
            return tempTextarea.textContent.replace(/<br \/>/g,"\r");
        },
        fillForm: function(form, data){
            for(var name in data){
                var item = form[name];
                var value = data[name];
                if(item){
                    switch(item.nodeName){
                        case 'TEXTAREA':
                        case 'INPUT':
                            if(item.getAttribute("genre")){
                                var ins = $(item).data("ins");
                                ins.setValue(value);
                            }else if(item.type=="text"){
                                item.value = $.decodeEntities(value);
                            }else{
                                item.value = value;
                            }
                        break;
                        case "SELECT":
                        item.value = value;
                        break;
                    }
                }
            }
        },
        serializeForm: function (form, format) {
          var i,j,q=[],n,f;
          for(i=form.elements.length-1; i>=0; i--){
            f = form.elements[i];
            n = f.name;
            if(n==""){continue;}
            switch(f.nodeName){
              case 'INPUT':
                switch(f.type){
                  case 'text':
                  case 'hidden':
                  case 'number':
                  case 'password':
                    q.push({"name":n,"value":f.value});
                    break;
                  case 'checkbox':
                  case 'radio':
                    if(f.checked){
                      q.push({"name":n,"value":f.value});
                    }           
                    break;
                }
                break;
              case 'TEXTAREA':
                q.push({"name":n,"value":f.value});
                break;
              case 'SELECT':
                switch (f.type){
                  case 'select-one':
                    q.push({"name":n,"value":f.value});
                    break;
                  case 'select-multiple':
                    for(j=f.options.length-1; j>=0; j--) {
                      if(f.options[j].selected) {
                        q.push({"name":n,"value":f.options[j].value});
                      }
                    }
                    break;
                }
                break;
            }
          }
          if(format=="string"){
            return q;
          }else if(format=="array"){
            return q;
          }else{
            var obj = {};
            for(i=q.length-1; i>=0; i--){
              var key = q[i].name;
              var value = q[i].value;
              if(obj.hasOwnProperty(key)){
                if(typeof obj[key] == "object"){
                  obj[key].push(value);
                }else{
                  obj[key] = [obj[key],value];
                }
              }else{
                obj[key] = value;
              }
            }
            return obj;
          }
        },
        /*getInputValue : function (els){
            if(els.nodeName){els=[els];}
            for(var i=0,k=els.length; i<k; i++){
                if(els[i].checked){
                    return els[i].value;
                }
            }
        },
        getInputSelected : function (els){
            if(els.nodeName){els=[els];}
            for(var i=0,k=els.length; i<k; i++){
                if(els[i].checked){
                    return els[i];
                }
            }
        },
        getSelectValue : function (select){
            var vals = [];
            if(select.type == 'select-one'){
                vals.push(select.value);
            }else{
                var options = select.options;
                for(var i=0,k=options.length; i>k; i++){
                    if(options[i].selected) {
                        vals.push(options[i].value);
                    }
                }
            }
            return vals;
        }*/
    };
    staticMethods.mevent = {
        "click": "click",
        "mousedown": staticMethods.supports.supportsTouch ? "touchstart" : "mousedown",
        "mouseup": staticMethods.supports.supportsTouch ? "touchend" : "mouseup",
        "mousemove": staticMethods.supports.supportsTouch ? "touchmove" : "mousemove"
    };
    for(var p in staticMethods){
        if($.hasOwnProperty(p)){
            $[p] = staticMethods[p];
            console.log(p + " is override!")
        }else{
            $[p] = staticMethods[p];
        }
    }

    var jdomMethods = {
        groupBy: function (attr) {
            var dlist = {}, key, i, k, o;
            attr = attr || "dom";
            for (i = 0, k = this.length; i < k; i++) {
                o = this[i];
                key = o.getAttribute(attr);
                if (key) {
                    if (dlist[key]) {
                        dlist[key].push(o);
                    } else {
                        dlist[key] = [o];
                    }
                }
            }
            return dlist;
        }
    };
    for(var p in jdomMethods){
        if($.fn.hasOwnProperty(p)){
            console.log(p + " is override!")
        }else{
            $.fn[p] = jdomMethods[p];
        }
    }
})($)
