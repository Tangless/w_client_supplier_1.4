define(['/global/iscripts/libs/cropper/cropper.js',
        '/global/iscripts/libs/canvas-to-blob.js'], function() {
    var Module = (function() {
		var baseIModules = project.baseIModules;
        var CON = function(dom) {
            baseIModules.BaseIModule.call(this, dom);
            this.init();
        };
        potato.createClass(CON, baseIModules.BaseIModule);
		
        CON.prototype.init = function() {
            // 选取图片的动作
            $('#select').change(function () {
                if (this.files && this.files[0]) {
                    var file = this.files[0];
                    var data_ready = function (data) {
                        $('#crop').attr('src', data);
                        $('#crop').cropper({
                            aspectRatio: 1,
                            preview: '#preview',
                            crop: function (e) {
                            }
                        });
                        $('#upload').attr('disabled', false);
                    }

                    // canvasResize（压缩图片）在android上不能用，见demo: http://gokercebeci.com/dev/canvasresize
                    // 结果：android上传的头像偏大
                    if (isAndroid()) {
                        var reader = new FileReader();
                        reader.onload = function (e) {
                            data_ready(e.target.result);
                        }
                        reader.readAsDataURL(file);
                    } else {
                        canvasResize(file, {
                            width: 800,
                            height: 0,
                            crop: false,
                            quality: 80, 
                            callback: function(data, width, height) {
                                data_ready(data);
                            }   
                        }); 
                    }
                }
            })

            // 上传按钮的动作
            $('#upload').click(function () {
                var canvas = $('#crop').cropper('getCroppedCanvas');
                if (canvas.toBlob) {
                    canvas.toBlob(
                        function (blob) {
                            var formData = new FormData();
                            formData.append('pic', blob, 'some.jpg');

                            // 暂上传至从c23接口（工程图片接口），实际需上传至图像接口
                            api_ajax_post_form_data('demand/c23', formData, {
                                succ: function(json) {
                                },
                                fail: function(json) {
                                }
                            });
                        },
                        'image/jpeg'
                    );
                } else {
                    tlog('抱歉，不能支持此浏览器');
                }
    
                if (1 == qs('v')) {
                    window.open(canvas.toDataURL());
                }
            })
		}
		
        return CON;
    })();

    return Module;
})
