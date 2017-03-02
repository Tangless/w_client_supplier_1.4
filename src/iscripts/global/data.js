"use strict";
(function () {
    project.data = {
        gname : 'SITE1',
        user : null,
        uid : "",
        uname : "",
        ukey : "",
        serverRoot : null,
        isGuestIM: false,
        demand: {}
    };
    var opts = {
        lang : {"Errors":{"illegalRequest":"illegalRequest","500.1":"result format error","404":"not found","405":"request aborted"}},
        _ajaxRoute : function (options) {
            var arr = options.url.split("://");
            switch (arr[0]){
                case 'imodule':
                    options.url = '/{{VERSION}}/imodules/'+arr[1]+'.html';
                    break;
            }
            return options;
        },
        _ajaxRenderer : function(url, str){
            var arr = url.split("://");
            switch (arr[0]){
                case 'imodule':
                    str = '<?xml version="1.0" encoding="utf-8"?><root type="list"><error type="text"><![CDATA[]]></error><data type="text"><![CDATA['+str+']]></data><cache type="text"><![CDATA[]]></cache></root>';
                    break;
            }
            return str;
        },
        commonFailureCaller : function (error, opts) {
            if(error.id=="c3"){
                project.showLoginForm();
            }
        }
    };
    potato.setConfig(opts);

    require.config({
        // enforceDefine: true,
        paths:{
          'jquery': '/global/iscripts/libs/jquery.shim',

        },
        waitSeconds : 30
    });
    requirejs.onError = function(error){
        throw error;
    };

})();
