define(function () {
    var baseIModules = project.baseIModules;
    var Module = (function () {
        var CON = function (dom) {
            baseIModules.BaseIPage.call(this, dom);
        };
        potato.createClass(CON, baseIModules.BaseIPage);
        CON.prototype.initData = function(){
            if(this.find('.list a').length==0){
                this.find('.upMore').addHide();
                this.find('#Footer').addHide();
                this.find('.noInfo').removeHide();
            }else{
               this.find('.upMore').addHide(); 
                var screenH = $(window).height();
                var bodyH = $('body').height();
                if(bodyH<screenH){
                    $('#Footer .footer').css('position','fixed');
                    $('#Footer .footer').css("bottom",'0')
                }
            }
        }
        return CON;
    })();

    return Module;
});

