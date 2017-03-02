//
// 尽量不要在此文件中加东西了。因其中代码书写太无序（所以叫ugly），待重构
//

//滚动条事件
function z_docScroll() {
  var t, n, i;
  t = 390;
  getScrollTop() + getClientHeight() >= $(document.body).height() - t ? (i = t - ($(document.body).height() - (getScrollTop() + getClientHeight())), $('.right_pos').css("bottom", i + "px")) : $('.right_pos').css("bottom", "10px");
}

function getScrollTop() {
  var n = 0;
  return document.documentElement && document.documentElement.scrollTop ? n = document.documentElement.scrollTop : document.body && (n = document.body.scrollTop), n
}

function getClientHeight() {
  var n = 0;
  return document.body.clientHeight && document.documentElement.clientHeight ? document.body.clientHeight < document.documentElement.clientHeight ? document.body.clientHeight : document.documentElement.clientHeight : document.body.clientHeight > document.documentElement.clientHeight ? document.body.clientHeight : document.documentElement.clientHeight
}
z_docScroll();

$('#ca-container').contentcarousel({scroll:1});

wow = new WOW({
  animateClass: 'animated',
  offset: 100
});
wow.init();


$(function() {
 
  $(window).scroll(function() {
    z_docScroll();
  });

 

});


// 尽量不要在此文件中加东西了。因其中代码书写太无序（所以叫ugly），待重构
