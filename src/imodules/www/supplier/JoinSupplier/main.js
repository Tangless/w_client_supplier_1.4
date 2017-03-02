define(function () {
    var baseIModules = project.baseIModules;
    var Module = (function () {
        var CON = function (dom) {
            baseIModules.BaseIModule.call(this, dom);
            this.paragraphOne = this.find(".paragraph-1");
            this.paragraphTwo = this.find(".paragraph-2");
            var flag;
            var that = this;
            $('#carousel-example-generic').on('slid.bs.carousel', function (obj) {
                flag = $(this).find(".carousel-inner").find(".active").attr('name');
                switch (flag) {
                    case "1":
                        that.paragraphTwo.css("display", "none");
                        that.paragraphOne.css("display", "block");
                        break;
                    case "2":
                        that.paragraphOne.css("display", "none");
                        that.paragraphTwo.css("display", "block");
                        break;
                    default:
                        that.paragraphTwo.css("display", "none");
                        that.paragraphOne.css("display", "block");
                        break;
                }
            });
        };
        potato.createClass(CON, baseIModules.BaseIModule);
        CON.prototype._ievent_downLoad=function(){
            window.scrollTo(0,document.body.scrollHeight);
        }
        return CON;
    })();
    return Module;
});


