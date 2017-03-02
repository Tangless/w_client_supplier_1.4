define(function() {
    var baseIModules = project.baseIModules;
    var Module = (function(){
        var CON = function(dom, parent, option){
            baseIModules.BaseIModule.call(this, dom, parent, option);
            this.parentId = option.parentId;
            this._replayKeyup();
            this._initEntity();
            this.entity;
            //this._initTitle();
        };
        potato.createClass(CON, baseIModules.BaseIModule);

        //键盘弹起事件
        CON.prototype._replayKeyup=function(){
            setTimeout(function(){
                $(that._els.replay).focus();
            },100)
            var that = this;
            $(that._els.replay).keyup(function(){
            });
            $('#text').bind('input propertychange','textarea',function(){
                that._RemainingNumber();
            });

            //改变下边线的颜色
            $(that._els.replay).focus(function(){
                $('.c-zishu').css('borderColor','#4785f9');
            }).blur(function(){
                $('.c-zishu').css('borderColor','#e0e1e6');
            })
        }

        //剩余字符
        CON.prototype._RemainingNumber=function(){
            var that = this;
            var curLength=$(that._els.replay).val().trim().length;
            if(curLength > 0){
                $(that._els.submitBtn).removeClass('not-click');
            }else{
                $(that._els.submitBtn).addClass('not-click');
            }
            if(curLength>140)
            {
                var num=$(that._els.replay).val().trim().substr(0,140);
                $(that._els.replay).val(num);
                //alert("超过字数限制，多出的字将被截断！" );
            }
            $("#textCount").text($(that._els.replay).val().trim().length);
        }

        //请求数据-b28
        CON.prototype._initEntity=function(){
            var that = this;
            var demand_id = qs('demand_id');
            a_demand_comment_supplier(demand_id,{
                succ:function(json){
                    that.entity = json.entity;
                }
            })
        }

        CON.prototype._ievent_Send = function(){
            var that=this;
            var entity = that.entity;
            var content = $(that._els.replay).val();
            var parentId = that.parentId;
            potato.application.addLoadingItem($("#goSend"));
            if($.trim($(that._els.replay).val()).length > 0){
                a_demand_discuss_comment_supplier(entity,content,parentId,{
                    succ:function(json){
                        potato.application.removeLoadingItem($("#goSend"));
                        window.location.reload();
                    },
                    fail:function(json){
                        potato.application.removeLoadingItem($("#goSend"));
                    }
                })
            }
        }

        CON.prototype.setPid=function(pid){
            var that=this;
            var parentPid = pid;
            if(parentPid <= 0){
                //alert('parentPid默认为0')
                $(that._els.reTitle).text('留言给客户...');
                $(that._els.replay).attr('placeholder','想说点什么，通过留言来联系Ta吧！');
            }else{
                //alert('parentPid的值大于0')
                $(that._els.reTitle).text('回复工程商...');
                $(that._els.replay).attr('placeholder','在这里写下回复，帮助工程商答疑解惑。');
            }
        }

        
       

      
        
        return CON;
    })();

    return Module;
});
