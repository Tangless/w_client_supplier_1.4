define(function() {
    var Module = (function() {
		var baseIModules = project.baseIModules;
        var CON = function(dom) {
            baseIModules.BaseIModule.call(this, dom);
        };
        potato.createClass(CON, baseIModules.BaseIModule);
		
		CON.prototype._ievent_popAvatar = function(data, target, hit) {
            project.getIModule('imodule://AvatarUploader', null, function (modal) {
                project.open(modal, '_blank', 'maxWidth');
            
                //var org = "http://cdn.xxtao.com/cms/pics/avatar/000/494/457/494457_14669.jpg";
                var org = "{{MIMAGE}}/avatar.png";
                modal.setParams({
                    orgAvatar: 1 == qs("org") ? org : "",
                    post: function (json) {
                        tlog('new image: ' + json.image);
                    }
                })

                modal.addListener('stateChanged', function (e) {
                    if (e.data.to == 'closed') {
                        tlog('closed');
                    }
                })
            });
		}
        
        return CON;
    })();

    return Module;
})

