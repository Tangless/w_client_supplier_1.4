define(function() {
    var Module = (function() {
		var baseIModules = project.baseIModules;
        var CON = function(dom) {
            baseIModules.BaseIModule.call(this, dom);
            this.init();

            this.count = 1;
            this.test_req_merge();
            this.test_req_merge();
            this.test_req_merge();
            this.test_req_merge();
        };
        potato.createClass(CON, baseIModules.BaseIModule);
		
        CON.prototype.test_req_merge = function () {
            var id = "8681";
            var _this = this;
            a_demand_req_info(id, {
                succ: function(json) {
                    if (1 == qs('alert')) {
                        tlog(_this.count);
                        alert(_this.count++)
                    } else {
                        tlog(_this.count++);
                    }
                }
            }); 
        }

        // ref: http://www.dropzonejs.com
        CON.prototype.init = function() {
            //var url = "http://api.xxtao.com/index.php?r=demand/image";
            var url = make_api_origin() + "/index.php?r=demand/c23";
            $("#upload").dropzone({
                url: url,
                withCredentials: true, // 带上cookies 
                paramName: "pic",   // 指定图片数据参数名
                maxFiles: 1,        // 只能上传一张
                maxFilesize: 10,    // 指定图片最大size，MB
                acceptedFiles: "image/*", // 限制只能上传图片
                previewsContainer: "#previewDiv",

                thumbnailWidth: 300, // 生成预览所用的缩略图，宽。宽和高其中之一设为null，则为保持纵横比预览。否则是方方的
                thumbnailHeight: null,

                // response
                success: function(x, json) {
                    olog('resp json: ', json);
                },

                // 上传时, 隐藏上传按钮
                processing: function(file) {
                    $("#upload").addHide();
                },

                // 上传完成时, 显示删除按钮
                complete: function(file) {
                    var _this = this;
                    $("#del").removeHide().off('click').click(function() {
                        _this.removeFile(file); 

                        $(this).addHide();
                        $("#upload").removeHide();
                    })
                }
            });
		}
		
        return CON;
    })();

    return Module;
})
