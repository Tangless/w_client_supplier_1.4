define(['/global/iscripts/tools/jquery.autocomplete.min.js'],function () {
    var baseIModules = project.baseIModules;
    var Module = (function() {
        var CON = function (dom) {
            baseIModules.BaseIModule.call(this, dom);
            var data = @@include("{{MPATH}}/citys.json");
            var source = [];
            var HOTS = ["<dl class='selected hots'><dd>"];
            var ABCDE = ["<dl>"];
            var FGHIJ = ["<dl>"];
            var KLMNOP = ["<dl>"];
            var QRSTUV = ["<dl>"];
            var WXYZ = ["<dl>"];
            for(var key in data){
                var list = data[key];
                var html = [];
                if("ABCDE".indexOf(key)>-1){
                   ABCDE.push("<dt>"+key+"</dt><dd>");
                   html = ABCDE;
                }else if("FGHIJ".indexOf(key)>-1){
                   FGHIJ.push("<dt>"+key+"</dt><dd>");
                   html = FGHIJ;
                }else if("KLMNOP".indexOf(key)>-1){
                   KLMNOP.push("<dt>"+key+"</dt><dd>");
                   html = KLMNOP;
                }else if("QRSTUV".indexOf(key)>-1){
                   QRSTUV.push("<dt>"+key+"</dt><dd>");
                   html = QRSTUV;
                }else if("WXYZ".indexOf(key)>-1){
                   WXYZ.push("<dt>"+key+"</dt><dd>");
                   html = WXYZ;
                }
                for(var i=0,k=list.length; i<k; i++){
                    var item = list[i];
                    html.push("<a data-city='"+item.city_id+"' href='#'>"+item.city_name+"</a>")
                    source.push({label:item.city_name,value:item.city_id});
                    if(item.is_common == "1"){
                        HOTS.push("<a data-city='"+item.city_id+"' href='#'>"+item.city_name+"</a>");
                    }
                }
                html.push('</dd>');
            }
            HOTS.push("</dd></dl>");
            ABCDE.push("</dl>");
            FGHIJ.push("</dl>");
            KLMNOP.push("</dl>");
            QRSTUV.push("</dl>");
            WXYZ.push("</dl>");
            $(this._els.list).html(HOTS.join("")+ABCDE.join("")+FGHIJ.join("")+KLMNOP.join("")+QRSTUV.join("")+WXYZ.join(""));
            this.selected = 0;
            this.cards = $(this._els.list).find("dl");
            this.tabs = $(this._els.index).find("a");

            var that = this;
             $('#CitySelector-search').autocomplete({source: source,
                select: function (event, ui) {
                $(this).val(ui.item.label);
                    that.selectCity(ui.item.label,ui.item.value);
                    event.preventDefault();
                } 
                })
             .autocomplete('instance')._renderItem = function (ul, item) {
                return $("<li><a href='#'>"+item.label+"</a></li>").appendTo(ul);
            }            

            this.cb = null;
        };
        potato.createClass(CON, baseIModules.BaseIModule);
        
        CON.prototype._update = function(){
            this.find('#CitySelector-search').val('');
        }
        CON.prototype.initCallback = function (cb,curCity) {
            $(this._els.curCity).html(curCity);
            this.cb = cb;
        }
        CON.prototype._ievent_changeCard = function(data,target,hit){
            var n = parseInt(hit.getAttribute("card"));
            $(this.cards.get(this.selected)).removeClass("selected");
            $(this.cards.get(n)).addClass("selected");
            $(this.tabs.get(this.selected)).removeClass("selected");
            $(this.tabs.get(n)).addClass("selected");
            this.selected = n;
            return false;
        }

        CON.prototype.selectCity = function(label,value){
            this.parent.close();
            this.cb && this.cb(label, value);
        }

        CON.prototype._ievent_changeCity = function(data,target,hit){
            var cid = hit.getAttribute("data-city");
            if(cid){
                this.selectCity(hit.innerHTML,cid);
            }   
            return false;
        }
        return CON;
    })();

    return Module;
});
