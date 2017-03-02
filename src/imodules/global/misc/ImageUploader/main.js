define(['/global/iscripts/libs/blueimp/JQueryFileUpload/jquery.fileupload.js', 
        '/global/iscripts/libs/blueimp/JQueryFileUpload/jquery.fileupload-process.js',
        '/global/iscripts/libs/blueimp/JQueryFileUpload/jquery.fileupload-image.js'], function() {
    var Module = (function() {
		var baseIModules = project.baseIModules;
        var CON = function(dom) {
            baseIModules.BaseIModule.call(this, dom);
            this._init();
            this.cb = null;
        };
        potato.createClass(CON, baseIModules.BaseIModule);
    		
        CON.prototype.initCallback = function(cb) {
            this.cb = cb;
        }

        // 设置原有图片(作为预览区显示内容)
        CON.prototype.setOrgImage = function(url) {
            if (url && url.length > 0) {
                // 先保证没有预览canvas 
                if (this.find('.preview canvas').length > 0) {
                    this.onDone();
                }

                // 如果没有img，就加；有，则更新url
                if (0 == this.find('.preview img').length) {
                    var img = '<div class="img-frame"><img src="' + url + '"></div>';
                    var preview = this.find('.preview'); 
                    preview.append(img).removeHide();
                    var upload = this.find('.btn-upload').addHide();

                    // 绑定'删除预览，恢复原始状态'
                    var cb = this.cb;
                    preview.find('.remove').click(function () {
                        $(this).siblings('.img-frame').remove(); 
                        preview.addHide();
                        upload.removeHide();

                        cb && cb.on_delete && cb.on_delete(url);
                        $(this).off('click');
                    });
                } else {
                    this.find('.preview img').attr('src', url);
                }
            }
        }

        // “提交”时，也即“上传图片”模块的使命已完成，调用我, 以恢复到初始状态
        CON.prototype.onDone = function() {
            this.find('.remove').click();
        }

        CON.prototype._init = function() {
            var mod = this;
            var url = make_api_origin() + "/index.php?r=demand/c23";
            $('.input-upload').fileupload({
                url: url, 
                dataType: 'json',
                autoUpload: false,
                acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
                maxFileSize: 999000,
                previewMaxWidth: 114,
                previewMaxHeight: 70,
                previewThumbnail: false,
//                previewCrop: true,
                
//                disableImageResize: false,
//                imageMaxHeight: 800,
//                imageMaxWidth: 500,
//                imageCrop: true,

                xhrFields: {
                    withCredentials: true
                }
            }).on('fileuploadadd', function (e, data) {
                // 上传数据，隐藏按钮
                var _this = this;
                var cb = mod.cb;
                $.each(data.files, function (index, file) {
                    $(_this).parent().addHide();

                    data.submit().success(function (json, textStatus, jqXHR) {
                        olog('[<resp]: ', json);
                        if ('1' == json.succ) {
                            $(_this).parents('.filearea').find('i.hide').text(json.image);
                        }
                        api_std_succ_callback(cb, json);
                    }).error(function (jqXHR, textStatus, errorThrown) {
                        tlog('error: ' + textStatus);
                        cb && cb.always && cb.always();
                    });
                });
            }).on('fileuploadprocessalways', function (e, data) {
                var _this = this;
                var cb = mod.cb;
                var file = data.files[data.index];
                if (file.preview) {
                    // 显示图片预览
                    var preview = $(this).parent().siblings('.preview');
                    preview.append(file.preview).removeHide();

                    // 绑定'删除预览，恢复原始状态'
                    preview.find('.remove').click(function () {
                        $(this).siblings('canvas').remove(); 
                        preview.addHide();
                        $(_this).parent().removeHide();

                        var url = $(this).siblings('i.hide').text();
                        cb && cb.on_delete && cb.on_delete(url);
                        $(this).off('click');
                    });
                }
            });
        }
		
        return CON;
    })();

    return Module;
})
