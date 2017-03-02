define(['/global/iscripts/libs/cropper/cropper.js',
        '/global/iscripts/libs/canvas-to-blob.js',
        '/global/iscripts/libs/canvasResize/binaryajax.js',
        '/global/iscripts/libs/canvasResize/exif.js',
        '/global/iscripts/libs/canvasResize/canvasResize.js'], function() {
    var Module = (function() {
		var baseIModules = project.baseIModules;
        var CON = function(dom, parent, option) {
            baseIModules.BaseIModule.call(this, dom, parent, option);
            this.isFromChat = option.isFromChat;
            this.init();
            this.post;
        };
        potato.createClass(CON, baseIModules.BaseIModule);

        CON.prototype.setParams = function(params) {
            if (params.orgAvatar.length > 0) {
                this.onDataReady(params.orgAvatar);
            }
            this.post = params.post || null; 
        }

        CON.prototype.onDataReady = function(data) {
            //ref: https://github.com/fengyuanchen/cropper
            $('#crop').attr('src', data);
            $('#crop').cropper({
                dragMode: 'move',
                aspectRatio: 1,
                autoCropArea: 0.8,
                cropBoxMovable: false,
                cropBoxResizable: false,
                crop: function (e) {
                }
            });
            $('#upload').attr('disabled', false);
        }

        CON.prototype.clear = function () {
            $('#crop').cropper('destroy');
            $('#crop').attr('src', ""); 
            $('#upload').attr('disabled', true);
        }
		
        CON.prototype.showSelect = function(jq, b) {
            var label = jq + ' + label';
            if (b) {
                $(jq).removeHide();
                $(label).removeHide();
            } else {
                $(jq).addHide();
                $(label).addHide();
            }
        }
		
        CON.prototype.init = function() {
            var _this = this;

            $('#init-select, #re-select').change(function () {
                if (this.files && this.files[0]) {
                    if ($('#crop').attr('src').length > 0) {
                        _this.clear();
                    }

                    _this.showSelect('#init-select', false);
                    _this.showSelect('#re-select', true);

                    // canvasResize（压缩图片）在android上不能用，见demo: http://gokercebeci.com/dev/canvasresize
                    // 结果：android上传的头像偏大
                    var file = this.files[0];
                    if (isAndroid()) {
                        var reader = new FileReader();
                        reader.onload = function (e) {
                            _this.onDataReady(e.target.result);
                        }
                        reader.readAsDataURL(file);
                    } else {
                        canvasResize(file, {
                            width: 800,
                            height: 0,
                            crop: false,
                            quality: 80, 
                            callback: function(data, width, height) {
                                _this.onDataReady(data);
                            }   
                        }); 
                    }
                }
            })

            $('#upload').click(function () {
                var canvas = $('#crop').cropper('getCroppedCanvas');
                if (canvas.toBlob) {
                    canvas.toBlob(
                        function (blob) {
                            var formData = new FormData();
                            formData.append('pic', blob, 'some.jpg');

                            potato.application.addLoadingItem(this);
                            api_ajax_post_form_data('user/c29', formData, {
                                always: function (json) {
                                    potato.application.removeLoadingItem(this);
                                    _this.post && _this.post(json);
                                },
                                succ: function(json) {
                                    _this.clear();
                                    _this.showSelect('#init-select', true);
                                    _this.showSelect('#re-select', false);
                                    _this.parent.close();

                                    //如果是聊天页面请求的上传头像,上传成功后刷新页面
                                    var href = window.location.href;
                                    if(href.indexOf('demand.html') > 0){
                                        window.location.reload();
                                    }
                                },
                                fail: function(json) {
                                }
                            });
                        },
                        'image/jpeg'
                    );
                } else {
                    tlog('抱歉，不支持此浏览器');
                }
    
                if (1 == qs('verbose')) {
                    window.open(canvas.toDataURL());
                }
            })
		}

        return CON;
    })();

    return Module;
})
