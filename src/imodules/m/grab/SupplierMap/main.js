define(['/iscripts/imodules/_SupplierPublic.js'],function() {
    var baseIModules = project.baseIModules;
    var Module = (function(){
        var CON = function(dom){
            baseIModules.BaseIModule.call(this, dom);
            this.map = "";
            this.initMap();
        };

        potato.createClass(CON, baseIModules.BaseIModule);
        CON.prototype.initMap = function(){
            var map = new AMap.Map('container', {
                resizeEnable: true,
                zoom:14,
                center: [116.408061,39.896449],

            });
            this.map = map;
            map.plugin('AMap.Geolocation', function () {
            geolocation = new AMap.Geolocation({
                enableHighAccuracy: true,//是否使用高精度定位，默认:true
                timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                maximumAge: 0,           //定位结果缓存0毫秒，默认：0
                convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                showButton: true,        //显示定位按钮，默认：true
                buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
                buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
                showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
                panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
                zoomToAccuracy:true    //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            });
            map.addControl(geolocation);
        })
        
            

            

        }
        CON.prototype.addBigMarker = function(lat,lng){
            this.map.clearMap();
            var c = new AMap.LngLat(lng,lat);
            this.map.setZoomAndCenter(13,c);
            var _this = this;
            var marker = new AMap.Marker({
                position: [lng,lat],
                map:_this.map,
                content:'<div class="marker"></div>'
            });
        }
        CON.prototype.addSmallMarker = function(lat,lng){
            this.find('.marker1').remove();
            var _this = this;
            var marker = new AMap.Marker({
                position: [lng,lat],
                map:_this.map,
                content:'<div class="marker1"></div>'
            });
        }
        CON.prototype.showAll = function(){
            this.map.setFitView();
        }
        
        return CON;
    })();
    return Module;
});

