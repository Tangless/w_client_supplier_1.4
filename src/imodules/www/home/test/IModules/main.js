define(function() {
    var baseIModules = project.baseIModules;
    var baseWidgets = project.baseWidgets;
    var Module = (function(){
        var CON = function(dom){
            baseIModules.BaseIPage.call(this, dom);
            this._els = this._getElements();
            this._panel = this._els.panel;
            this._bindEvent();
            this._pframe = this._els.pageIframe[0];
            this._tips = this._els.tips[0];
            this._data = {};
            var that = this;
            $.getJSON("../imodules.json",function (imodules) {
                $.getJSON("../pages.json",function (pages) {
                    that._setNavData(imodules,pages);
                });
            });
        };
        potato.createClass(CON, baseIModules.BaseIPage);


        CON.prototype._bindEvent = function () {
            var that = this;
            $([this._els.nav,this._tips]).on("click",function (e) {
                if(e.target.nodeName=="A"){
                    that._showIModule(e.target.href.split("#")[1]);
                }
            });
            $(this.dom).on("mouseover",function (e) {
                var tip = e.target.getAttribute("data-tip");
                if(tip=="hold"){
                    return true;
                }else if(tip=="show"){
                    that._showIncludes(e.target.href.split("#")[1]);
                    return true;
                }
                that._hideIncludes();
            });
            $(this._els.pagesBtn).on("click",function (e) {
                that._showTab("pages")
                return false;
            });
            $(this._els.modulesBtn).on("click",function (e) {
                that._showTab("modules")
                return false;
            });

            $(this._els.fixSize).on("click",function (e) {
                var arr = e.target.getAttribute("data-size").split("x").map(function (s) {
                    return parseInt(s);
                });
                if(arr[0]==9999){
                    $(that._panel[0]).css({width:"initial",height:"initial",bottom:0,right:0});
                }else{
                    $(that._panel[0]).css({width:arr[0],height:arr[1],bottom:"initial",right:"initial"});
                }

                $(that._els.fixSize).addClass("active");
                $(e.target).removeClass("active");
            });
        };
        CON.prototype._showTab = function (tab) {
            if(tab=="pages"){
                $(this._els.pagesBtn).removeClass("active");
                $(this._els.modulesBtn).addClass("active");
                $(this._els.pagesTab).show();
                $(this._els.modulesTab).hide();
            }else{
                $(this._els.modulesBtn).removeClass("active");
                $(this._els.pagesBtn).addClass("active");
                $(this._els.pagesTab).hide();
                $(this._els.modulesTab).show();
            }

        };
        CON.prototype._showIModule = function (imid) {
            var obj = this._data[imid];
            if(!obj){return true;}
            this._pframe.src = obj.href;
            var a = this._els.title[0];
            a.href = a.innerHTML = obj.href;
        };
        CON.prototype._showIncludes = function (imid) {
            var data = this._data[imid];
            if(!data){return true;}
            var arr = [];
            var that = this;
            arr.push('<a target="_blank" data-type="ititle" data-tip="hold" class="-test-link" title="'+data.src+'" href="'+data.href+'">'+imid+'</a><br/><span data-tip="hold" class="-test-sml">('+(data.children?"Includes":"In Pages")+':)</span><ul>');
            (data.children||data.parents).forEach(function (key) {
                var id = key;
                var data = that._data[id];
                if(data){
                    arr.push("<li><a class='"+(data.task?"-test-on":"")+"' data-tip='hold' title='"+data.src+"' href='#"+id+"'>"+id+"</a></li>");
                }
            });
            arr.push("</ul>");
            this._tips.innerHTML = arr.join("");
            this._tips.style.display = "block";
        };
        CON.prototype._hideIncludes = function () {
            this._tips.style.display = "none";
        };
        CON.prototype._setNavData = function (imodules,pages) {
            var ul, ul1 = [],ul2 = [],id,key,file,arr,obj,maps= {},item;
            for(key in pages){
                arr = key.split("/");
                id = arr[arr.length-2];
                if(id=="IModules" || id=="IModuleTest" || id.substr(0,1)=="_"){continue;}
                file = arr[arr.length-1];
                if(file.substr(-1)=="_"){file = file.substr(0,file.length-1);}
                arr = file.replace(".pg","").split("@");
                item = {id:id,src:key,href:("{{VERSION}}"?"/{{VERSION}}/":"/")+arr.join("/"),task:(key.substr(-1)!="_"),children:pages[key].map(function (key) {
                    var arr = key.split("/");
                    return arr[arr.length-2];
                })};
                ul = item.task?ul1:ul2;
                ul.push({"id":id,"html":"<li><a class='"+(item.task?"-test-on":"")+"' title='"+item.src+"' data-tip='show' href='#"+id+"'>"+id+"</a></li>"});
                this._data[id] = item;

                pages[key].forEach(function (o) {
                    var arr = o.split("/");
                    var mid = arr[arr.length-2];
                    if(!maps[mid]){
                        maps[mid] = {};
                    }
                    maps[mid][id] = 1;
                });
            }
            for(key in maps){
                arr = [];
                for(id in maps[key]){
                    arr.push(id);
                }
                maps[key] = arr;
            }
            ul1.sort(potato.sortNumericBy("id"));
            ul2.sort(potato.sortNumericBy("id"));
            $(this._els.pagesTab).html(ul2.concat(ul1).map(function(o){return o.html}).join(""));

            ul1 = [], ul2 = [];
            for(key in imodules){
                arr = key.split("/");
                id = arr[arr.length-2];
                if(id.substr(0,1)=="_"){continue;}
                item = {id:id,src:key,task:(key.substr(-1)!="_"),href:"/test/imodule.html?id="+id,parents:maps[id]||[]};
                ul = item.task?ul1:ul2;
                ul.push({"id":id,"html":"<li><a class='"+(item.task?"-test-on":"")+"' title='"+item.src+"' data-tip='show' href='#"+id+"'>"+id+"</a></li>"});
                this._data[id] = item;
            }
            ul1.sort(potato.sortNumericBy("id"));
            ul2.sort(potato.sortNumericBy("id"));
            $(this._els.modulesTab).html(ul2.concat(ul1).map(function(o){return o.html}).join(""));
        };
        return CON;
    })();

    return Module;
});