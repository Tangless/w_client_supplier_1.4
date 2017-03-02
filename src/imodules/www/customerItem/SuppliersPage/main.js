define(function () {
    var baseIModules = project.baseIModules;
    var Module = (function () {
        var CON = function (dom) {
            baseIModules.BaseIPage.call(this,dom);
            this.initSize()
            var _this = this;

            $(window).resize(function(){
            	var width = document.getElementById('SuppliersPage').scrollWidth;
            	var listWidth = $('#SupplierList').width();
        		_this.initSize();
        	})
        };
        potato.createClass(CON, baseIModules.BaseIPage);
        CON.prototype.initSize = function(){
        	var _this = this;
        	var width = document.getElementById('SuppliersPage').scrollWidth;
        	var listWidth = $('#SupplierList').width();
        	var height = $(window).height();
        	this.find('#SupplierMap').css('width',width-listWidth);
        	this.find('#SupplierList').css('height',height-91);
        	this.find('#SupplierMap').css('height',height-91);
        	
        }
        return CON;
    })();

    return Module;
});

