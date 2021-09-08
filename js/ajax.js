import $ from 'jquery'
import sha1 from './sha1'
import tools from './tools';
let ajax = {
  get: (url, data, callback)=>{
    let baseUrl = '';
    $.ajax({
      type:'get', 
      url: baseUrl + url,
      data,
      dataType: 'json',
      async: false,
      // contenttype: 'application/json;charset=utf-8',
      headers:{
        Authorization: 'Bearer '+localStorage.getItem('token')
      },
      success: res=>{
        if (res.code === 1003) {
          this.refreshToken();
        }else if(res.code === 0){
          callback(res)
        }
      },
      error: err=>{
        console.log(err);
        if (err.responseJSON.code === 1003) {
          refreshToken();
        }
      }
    })
  },
  post: (url, data, callback)=>{
    let baseUrl = '';
    $.ajax({
      type: 'post',
      url: baseUrl + url,
      data,
      dataType: 'json',
      // contentType: 'application/json;charset=utf-8',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      },
      success: res=>{
        if (res.code === 1003) {
          this.refreshToken();
        } else if (res.code === 0) {
          callback(res)
        }else{
          tools.tipBox('e', res.msg)
        }
      },
      error: err=>{
        console.log(err);
        if (err.responseJSON.code === 1003) {
          refreshToken();
        }
      }
    })
  }
}

function refreshToken() {
  let timestamp = new Date().getTime();
  let refresh_token = localStorage.getItem('refresh_token')
  let signature = sha1.hex_sha1('refresh_token=' + refresh_token +'&timestamp=' + timestamp)
  let data = {
    timestamp,
    signature,
    refresh_token
  }
  $.ajax({
    type: 'post',
    url: 'http://183.62.12.15/haoappAdmin/Public/refreshToken',
    dataType: 'json',
    data,
    success: res => {
      if (res.code == 0) {
        localStorage.setItem('token', res.data)
        location.reload();
      } else if (res.code == 1003){
        alert('登录超时,请重新登录')
        top.location.href = window.location.origin + '/login.html';
      }
    },
    error: err => {
      console.log(err);
      if (err.responseJSON.code === 1003) {
        alert('登录超时,请重新登录')
        top.location.href = window.location.origin + '/login.html';
      }
    }
  })
}

export default ajax;