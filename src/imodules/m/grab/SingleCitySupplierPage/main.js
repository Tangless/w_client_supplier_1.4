define(function () {
    var baseIModules = project.baseIModules;
    var Module = (function () {
        var CON = function (dom) {
            baseIModules.BaseIPage.call(this, dom);
            $('#Header').find('.top-left').click(function () {
                window.location.href = 'index.html'
            })
            $('.header').css('position','fixed')
            $('#SuppliersList').css("margin-top","2.81rem")
            
            // this.initData();
        };
        potato.createClass(CON, baseIModules.BaseIPage);
        CON.prototype.initData = function(){
            var _this = this;
        	var screenH = $(window).height();
            var bodyH = $('body').height();
            if(bodyH<screenH){
            	$('#Footer .footer').css('position','fixed');
            	$('#Footer .footer').css("bottom",'0')
            }

        }
        return CON;
    })();

    return Module;
});

