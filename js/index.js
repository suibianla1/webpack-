import tools from './tools'
import sha1 from './sha1'
import $ from 'jquery'

window.onload = function(){
  // tools.isLogin();

  //设置iframe的高
  function resize() {
    var mw = $(".container").width();
    // $("#inner-frame").width(mw);
    var mh = $(window).height() - 80;
    $("#inner-frame").height(mh);
    //console.log(mh);
  }
  $(window).on("resize", resize);
  resize();

  //获取用户名称
  (function(){
    $('.storeName span').text('欢迎，'+localStorage.getItem('user'))
  })()
  

  $('.aside div a').on('click', function(){
    $('.aside div a').removeClass('active').css('text-decoration', 'none')
    $(this).addClass('active');
    $('#inner-frame').attr('src', $(this).attr('href'))
    return false;
  })

  //退出登录
  $('.logout').on('click', function(){
    localStorage.clear();
    location.href = 'login.html';
  })

  $('.shopSetting').on('click', function(){
    
  })
}