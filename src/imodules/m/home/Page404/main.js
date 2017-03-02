/**
 * Created by gaoyue on 16/8/17.
 */
define(function() {
    var baseIModules = project.baseIModules;
    var Module = (function(){
        var CON = function(dom){
            baseIModules.BaseIPage.call(this, dom);

            var vhref = window.location.protocol + '//'+ window.location.host + '/?pgv_ref=404';
			    document.getElementById("host").href=vhref; 
			    var oTime=document.getElementById('time');
			    var oSecs=7;
			    function time()
			    {
			        oSecs --;
			        if (oSecs < 0)
			        {
			          clearInterval();
			          return;
			        }
			        
			        if (oSecs == 0)
			        {
			          clearInterval();
			          window.location.href = vhref;
			        }
			        oTime.innerHTML = oSecs;
			    }
			    setInterval(time,1000)
	        };
	        potato.createClass(CON, baseIModules.BaseIPage);
	        return CON;

    })();

    return Module;
});

