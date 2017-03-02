define(function() {
    var Module = (function() {
		var baseIModules = project.baseIModules;
        var CON = function(dom) {
            baseIModules.BaseIModule.call(this, dom);

            project.getIModule('imodule://ImageUploader', null, function(mod) {
                mod.initCallback({
                    // 上传至服务端的结果回调succ/fail
                    succ: function(json) {
                        tlog('uploaded image: ' + json.image);
                    },
                    fail: function(json) {
                        tlog('fail: ' + json.msg);
                    },

                    // 删除图片时的回调
                    on_delete: function(url) {
                        tlog('you deleted image: ' + url);
                    }
                });
            })        

//            var org = 'http://cdn.xxtao.com/cms/pics/demand/7_1/483/760/599/494457_1483760599_67754.jpg';
            var org = 'http://cdn.xxtao.com/cms/pics/demand/7_1/483/783/595/494457_1483783595_29484.jpg';
            project.getIModule('imodule://ImageUploader', null, function(mod) {
                mod.setOrgImage(org);
            });
        };
        potato.createClass(CON, baseIModules.BaseIModule);

        CON.prototype._ievent_onDone = function() {
          console.log("on done");
            project.getIModule('imodule://ImageUploader', null, function(mod) {
                mod.onDone();
            });
        }

        CON.prototype._ievent_onDad = function() {
          console.log("[ievent]onDad");
        }
		
        CON.prototype._ievent_onSon = function() {
          console.log("[ievent]onSon");
        }

        return CON;
    })();

    return Module;
})
