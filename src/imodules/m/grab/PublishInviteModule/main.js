define(function() {
    var baseIModules = project.baseIModules;
    var Module = (function(){
        var CON = function(dom,parent,option){
            baseIModules.BaseIModule.call(this, dom, parent, option);

            var _this = this;
            //如果是编辑招标,填充信息
            if(option.edit){
                this._fillInput(option.data);

                //编辑招标时,部分字段不能为空
                $('input[must="true"]').on('input propertychange blur',function(){
                    var value = $(this).val();
                    //再做一次判断是否空数据
                    if(!_this._isFullInput()) {
                        $(_this._els.submit).attr('disabled', 'disabled');
                    }else{
                        $(_this._els.submit).removeAttr('disabled');
                    }
                })
            }
            this.img="";
            if($('.image-panel img').attr('src')){
                this.img=$('.image-panel img').attr('src')
            }
            this.upload();
        };

        potato.createClass(CON, baseIModules.BaseIModule);

        CON.prototype.upload = function(){
            var _this = this;

            // var url = "http://api.xxtao.com/index.php?r=demand/image";
            var url = make_api_origin() + "/index.php?r=demand/c23";
            $("#upload").dropzone({ 
                url: url,
                withCredentials: true,// 带上cookies 
                paramName: "pic",   // 指定图片数据参数名
                maxFiles: 1,        // 只能上传一张
                maxFilesize: 10,    // 指定图片最大size，MB
                acceptedFiles: "image/*", // 限制只能上传图片
                previewsContainer:".image-panel",

                thumbnailWidth: 300, // 生成预览所用的缩略图，宽。宽和高其中之一设为null，则为保持纵横比预览。否则是方方的
                thumbnailHeight: null,

                success: function(x, json) {
                    olog('resp json: ', json);
                    _this.find('.loadImgDiv').addHide()
                    _this.img = json.image;
                },
                // 上传时隐藏上传按钮
                processing: function(file) {
                    _this.find('.file-upload').addHide();
                    
                    _this.find('.image-panel').removeHide();
                    _this.find('.loadImgDiv').removeHide()
                },
                complete: function(file) {
                    var _this = this;
                    $(".icon-delete").removeHide().off('click').click(function() {
                        _this.removeFile(file); 

                    })
                }
            });
        };
        //提交招标信息
        CON.prototype._ievent_submitInfo = function(data,target,hit){
            var type = $(this._els.type).attr('num')
            var color = $(this._els.color).attr('num');
            var span = $(this._els.span).val();
            var location = $(this._els.location).attr('num');
            var budget = $(this._els.budget).val();
            var size = $(this._els.size).val();
            var address = $(this._els.address).val();
            var note = $(this._els.note).val();

            var _this = this;
            a_auth_req_demand_create(type,color,span,location,budget,size,address,note,_this.img,{
                succ: function(){
                    _this.delData();
                    project.tip("提交成功","succ","24小时内，我们的工程商会为您提供方案和报价",true)
                },
                fail: function(json){
                    _this.delData();
                }
            })
        };
        //编辑招标信息的提交
        CON.prototype._ievent_submitEdit = function(data,target,hit){
            //再做一次判断是否空数据
            if(!this._isFullInput()){
                $(this._els.submit).attr('disabled','disabled');
            }else{
                var color = $(this._els.color).attr('num');
                var type = $(this._els.type).attr('num');
                var span = $(this._els.span).val();
                var location = $(this._els.location).attr('num');
                var budget = $(this._els.budget).val();
                var size = $(this._els.size).val();
                var address = $(this._els.address).val();
                var note = $(this._els.note).val();
                var id = qs('demand_id');
                var _this = this;
                //c25接口
                a_auth_req_demand_c27update(id,type,color,span,location,budget,size,address,note,_this.img,{
                    succ: function(json){
                        _this.parent.close();
                        project.tip("提交成功","succ","24小时内，我们的工程商会为您提供方案和报价",true);
                        setTimeout(function () {
                            window.location.reload();
                        },1500);
                    },
                    fail: function(json){
                        _this.delData();
                    }
                })
            }
        };
        //清空用户输入数据
        CON.prototype.delData = function(){
            $('.file-upload').removeHide();
            $('.image-panel').addHide();
            $('.image-panel img').remove();
            this.find('input').val('');
            this.find('textsrea').val('');
            this.parent.close();
        };
        //展开下拉菜单
        CON.prototype._ievent_showMenu = function (data, obj) {
            $(obj).next('div').slideToggle();
            $(obj).find('.icon-circle-down').toggleClass('rotate');
        };
        //下拉选项点击选中事件
        CON.prototype._ievent_chooseLocation = function (data, obj, hit) {
            var choosed = $(hit).text();
            var num = $(hit).attr('num');
            console.log(num);
            $(this._els.location).text(choosed).attr('num',num);
            $(obj).slideToggle();
            $(obj).prev().find('.icon-circle-down').removeClass('rotate');
        };
        CON.prototype._ievent_chooseColor = function (data, obj, hit) {
            var choosed = $(hit).text();
            var num = $(hit).attr('num');
            $(this._els.color).text(choosed).attr('num',num);
            $(obj).slideToggle();
            $(obj).prev().find('.icon-circle-down').removeClass('rotate');
        };
        CON.prototype._ievent_chooseType = function (data, obj, hit) {
            var choosed = $(hit).text();
            var num = $(hit).attr('num');
            $(this._els.type).text(choosed).attr('num',num);
            $(obj).slideToggle();
            $(obj).prev().find('.icon-circle-down').removeClass('rotate');
        };

        //上传图片
        //待完善


        //删除已上传的图片
        CON.prototype._ievent_deleteImg = function () {
            //隐藏图片预览去,显示图片上传按钮
            $('.file-upload').removeHide();
            $('.image-panel').addHide();
            $('.image-panel img').remove();
            this.img = '';
        };
        //判断必填项是否为空
        CON.prototype._isFullInput = function () {
            var flag = false;
            
            var span = $(this._els.span).val();
            var budget = $(this._els.budget).val();
            var size = $(this._els.size).val();
            var address = $(this._els.address).val();
            //如果都不为空
            if(span && budget && size && address && span != '0' && parseInt(size) != 0 && parseInt(budget) != 0){
                flag = true;
            }
            return flag;
        };
        //编辑招标情况下,填充招标信息
        CON.prototype._fillInput = function (json) {
            $(this._els.type).text(api_dict.demand.type[json.type]).attr('num',json.type);
            $(this._els.color).text(api_dict.demand.color[json.color]).attr('num',json.color);
            $(this._els.span).val(json.span);
            $(this._els.location).text(api_dict.demand.loc[json.location]).attr('num',json.location);
            $(this._els.budget).val(json.budget);
            $(this._els.size).val(json.size);
            $(this._els.address).val(json.address);
            $(this._els.note).css('height','auto').val(json.note);

            //图片存在则显示
            if(json.image){
                $('.file-upload').addClass('hide');
                $('.image-panel').prepend('<img src="'+json.image+'"/>').removeClass('hide');
            }
            if(!this._isFullInput()){
                $(this._els.submit).attr('disabled','disabled');
            }
            //改变提交按钮的点击事件
            $(this._els.submit).attr('ievent','submitEdit');


        };

        return CON;
    })();
    return Module;
});

