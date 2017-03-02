$(function(){
	$(".sc-search").click(function(){
		if($('.sc-search').attr('select')=="no"){
			$(".sc-search").css("box-shadow","none")
			$(".search-input").val("");
			$(".search-input").removeHide();
			$('.sc-search').attr('select',"yes");
		}else{
			$(".search-input").addHide();
			$(".sc-search").css("box-shadow","3px 3px 6px rgba(0, 0, 0, .25)")
			$('.sc-search').attr('select',"no");
		}
	})
	$('#screen-input').focus(function(){
		if($('#search-input').val()==""){
			$('.no-result').css('display','none');
		}
		$('.hid').css("display","none");
		$('.search-page').removeHide();
		$('.stop-rubber').removeHide();
		$('#search-input').focus()
		$('.header').css('zIndex','55');
	})
	$('.go-back').click(function(){
		$('.hid').css("display","block")
		$('.ui-autocomplete').css('display','none');
		$('.search-page').addHide();
		$('.stop-rubber').addHide();
		$(".search-input").addHide();
		$('.header').css('zIndex','');
		$('.sc-search').attr('select',"no");
		$('body,html').css('overflow','');
	})
	$('#search-input').bind('input propertychange', function() {
		if($('#search-input').val()!='' && $('.ui-autocomplete').css('display')=='none'){
			$('.no-result').css('display','block');

			/*解决搜索列表的滚动条和body的滚动条冲突导致搜索结果滑出可视范围*/
			$('body,html').css('overflow','');
		}else{
			$('.no-result').css('display','none');
			
			/*解决搜索列表的滚动条和body的滚动条冲突导致搜索结果滑出可视范围*/
			$('body,html').css('overflow','hidden');
		}
	});
})
