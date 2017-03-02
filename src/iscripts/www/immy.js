project.showLoginForm = function (role, phone) {

    var url;
    if (role == 's') {
        url = 'imodule://SLoginForm';
    } else {
        url = 'imodule://CLoginForm';
    }

    //请求成功的回调方法
    var successCallback = function (imodule) {
        imodule.showLogin();
        if (!phone) {
            imodule._mobileInput.val(phone);
        }
    };

    project.getIModule(url, null, successCallback);
};
project._removeInitLoading = function () {
    this._globalLoading.remove();
    this._initLoading--;
    if (this._initLoading == 0) {
        if (document.documentElement.className) {
            document.documentElement.className = "";
            $("img.lazy").lazyload();
            /*var js = document.createElement("script");
            js.id = "zhichiload";//智齿客服（也是融云实际用的客服）暂屏蔽融云，直接用智齿
            js.src = "http://www.sobot.com/chat/pc/pc.min.js?sysNum=41bb788b51064ca6a77b7f0fefc23bb3";
            document.getElementsByTagName('head')[0].appendChild(js);*/

            /*window.intercomSettings = {
                app_id: "vgxs1lcc"
            };*/
            //var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',intercomSettings);}else{var d=document;var i=function(){i.c(arguments)};i.q=[];i.c=function(args){i.q.push(args)};w.Intercom=i;function l(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/vgxs1lcc';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);}if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}

            //滚动条滚动到相应位置时触发的效果工具
            wow = new WOW({
                animateClass: 'animated',
                offset: 100
            });
            wow.init();
            project.getCurCity();
        }
    }
}