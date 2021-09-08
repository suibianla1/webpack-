import tools from './tools'
import sha1 from './sha1'
import md5 from './md5'
import $ from 'jquery'
import api from './api'

window.onload = function(){
  $('.login').on('click', function(){
    // let url = 'http://183.62.12.15/haoappAdmin//Member/signIn';
    let url = api.login
    let userName = $('.uerName').val();
    let pwd = $('.pwd').val();
    let timestamp = new Date().getTime();
    let signature = sha1.hex_sha1('phone=' + userName + '&pwd=' + md5.hexMd5(pwd) + '&timestamp='+timestamp);
    let data = {
      phone: userName,
      pwd: md5.hexMd5(pwd),
      timestamp,
      signature
    }
    let headers = {
      Authorization: 'Beaer ' + localStorage.getItem('token')
    }
    $.post(url, data, {headers}).then(res=>{
      res = JSON.parse(res)
      if(res.code === 0){
        localStorage.setItem('token', res.data)
        localStorage.setItem('refresh_token', res.refresh_token);
        window.location.href = window.location.origin
      }
    })

    // let url = api.login
    // let userName = $('.uerName').val()
    // let pwd = $('.pwd').val()
    // let data = {
    //   user_name: userName,
    //   pwd,
    // }

    // $.post(url, data).then(res => {
    //   console.log(res)
    //   if(res.code === 0){
    //     localStorage.setItem('user', res.user_name)
    //     localStorage.setItem('user_id', res.user_id)
    //     window.location.href = window.location.origin
    //   }
    // })
  })
}