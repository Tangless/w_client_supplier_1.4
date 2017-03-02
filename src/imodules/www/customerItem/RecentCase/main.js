define(["/global/iscripts/tools/slick.js"],function(slick) {
    var baseIModules = project.baseIModules;
    var Module = (function(){
        var CON = function(dom){
            baseIModules.BaseIModule.call(this, dom);
            this.callSlick();
            var that = this;

            // $(window).resize(function(){
            //     that.callSlick();
            // })
            setTimeout(function(){
              $(that._els.case).css('visibility','visible');
            },300)
        };
        potato.createClass(CON, baseIModules.BaseIModule);

        CON.prototype.callSlick = function(){
          var that = this;
          $(that._els.Case).slick({
            infinite: true,
            slidesToShow: 3,
            arrows:true,
            autoplay: true,
            autoplaySpeed: 3000,
            lazyLoad:'ondemand'
          });
          $('.slick-next').addClass('icon-flip-pc').html('');
          $('.slick-prev').addClass('icon-left-pc').html('');
         
        }

        return CON;
    })();

    return Module;
});

