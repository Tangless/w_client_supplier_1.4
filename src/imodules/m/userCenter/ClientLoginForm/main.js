"use strict";
define(['/iscripts/imodules/_LoginForm.js'],function(baseLoginForm) {
    var Module = (function(){
        var CON = function(dom){
            baseLoginForm.call(this, dom, {role:'c'});
        };
        potato.createClass(CON, baseLoginForm);


        return CON;
    })();

    return Module;
});