define(function() {
    project.embedCss('{{GetWCSS}}');
    var baseIWidgets = project.baseIWidgets;
    var Widget = (function(){
        var CON = function(dom){
            baseIWidgets.BaseIWidget.call(this, dom);
            $(dom).find('li').click(function(){
                if($(this).hasClass('active')){
                    $(this).removeClass('active');
                    $(this).find('.grab-open').removeClass('grab-stop');
                }else{
                    $(this).addClass('active').siblings().removeClass('active');
                    $(dom).find('li').find('.grab-open').removeClass('grab-stop');
                    $(this).find('.grab-open').addClass('grab-stop');
                }
            });

        };

        potato.createClass(CON, baseIWidgets.BaseIWidget);

        return CON;
    })();

    return Widget;
});

