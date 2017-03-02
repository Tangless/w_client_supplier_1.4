define(function() {
    project.embedCss('{{GetWCSS}}');
    var baseIWidgets = project.baseIWidgets;
    var Widget = (function(){
        var CON = function(dom){
            baseIWidgets.BaseIWidget.call(this, dom);

            $(dom).each(function(){
                if($(this).hasClass('active')){
                    if(!$(this).find('.part-doucon').is(':animated')){
                        $(this).addClass('active');
                        //$(this).find('.grab-open').addClass('icon-circle-up');
                        $(this).find('.grab-open').addClass('rotate');
                        $(this).find('.part-doucon').slideDown();
                    }
                }else{
                    if(!$(this).find('.part-doucon').is(':animated')){
                        $(this).removeClass('active');
                        //$(this).find('.grab-open').removeClass('icon-circle-up');
                        $(this).find('.grab-open').removeClass('rotate');
                        $(this).find('.part-doucon').slideUp();
                    }
                }
            });

            $(dom).click(function(){
                if($(this).hasClass('active')){
                    if(!$(this).find('.part-doucon').is(':animated')){
                        $(this).removeClass('active');
                       // $(this).find('.grab-open').removeClass('icon-circle-up');
                        $(this).find('.grab-open').removeClass('rotate');
                        $(this).find('.part-doucon').slideUp();
                    }
                }else{
                    if(!$(this).find('.part-doucon').is(':animated')){
                        $(this).addClass('active');
                        //$(this).find('.grab-open').addClass('icon-circle-up');
                        $(this).find('.grab-open').addClass('rotate');
                        $(this).find('.part-doucon').slideDown();
                    }
                }
            });

        };

        potato.createClass(CON, baseIWidgets.BaseIWidget);

        return CON;
    })();

    return Widget;
});

