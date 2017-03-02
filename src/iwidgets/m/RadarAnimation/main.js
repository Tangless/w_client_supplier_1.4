define(function() {
    project.embedCss('{{GetWCSS}}');
    var baseIWidgets = project.baseIWidgets;
    var Widget = (function(){
        var CON = function(dom){
            baseIWidgets.BaseIWidget.call(this, dom);

        };

        potato.createClass(CON, baseIWidgets.BaseIWidget);

        return CON;
    })();

    return Widget;
});

