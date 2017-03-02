define(function () {
    var baseIModules = project.baseIModules;
    var Module = (function () {
        var CON = function (dom) {
            baseIModules.BaseIPage.call(this,dom);
            var _this = this;
            $(window).scroll(function(){
            	if($(window).scrollTop()>495){
            		_this.find('#InquiryMap').removeHide();
            	}else{
            		_this.find('#InquiryMap').addHide();
            	}
            })
        };
        potato.createClass(CON, baseIModules.BaseIPage);
        

        return CON;
    })();

    return Module;
});

