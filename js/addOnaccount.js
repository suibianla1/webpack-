import $ from 'jquery'
import sha1 from './sha1'
import tools from './tools'
import ajax from './ajax'

$(function () {
  let companyData = [{ name: '', phone: '' }], type = 2, companyName = '', name = '', phone = '';

  innitCompanyData()
  function innitCompanyData() {
    let html = '';
    companyData.forEach(item => {
      html += `<div class="inputs">
        <input class="name" type="text" value="${item.name}">
        <input class="phone" type="text" value=${item.phone}>
        <span class="del">删除</span>
      </div>`
    })
    $('.containerB').html(html)
  }

  //选择类型
  $('.type').on('click', function () {
    if ($(this).children('.optionList').hasClass('show')) {
      $(this).children('.optionList').removeClass('show')
    } else {
      $(this).children('.optionList').addClass('show')
      $('.type .optionList li').unbind().on('click', function () {
        $(this).siblings().removeClass('selected')
        $(this).addClass('selected')
        type = $(this).data('type')
        if (type === 1) {
          $('.mainBox .item.personal').css('display', 'block')
          $('.mainBox .item.company').css('display', 'none')
        } else {
          $('.mainBox .item.personal').css('display', 'none')
          $('.mainBox .item.company').css('display', 'block')
        }
        $(this).parent('.optionList').removeClass('show')
        return false;
      })
    }
  })

  //添加挂账人
  $('.addOnaccount').on('click', function () {
    companyData.push({
      name: '',
      phone: ''
    })
    innitCompanyData();
  })
  //删除挂账人
  $('.containerB').on('click', '.del', function () {
    let index = $(this).parent().index()
    if (companyData.length <= 1) {
      return
    }
    companyData.splice(index, 1)
    innitCompanyData()
  })

  //公司类型输入联系人
  $('.containerB').on('blur', '.name', function () {
    let index = $(this).parent().index()
    let name = $(this).val();
    companyData[index].name = name;
  })
  $('.containerB').on('blur', '.phone', function () {
    let index = $(this).parent().index()
    let phone = $(this).val();
    companyData[index].phone = phone;
  })
  $('.companyName').on('blur', function () {
    companyName = $(this).val()
  })

  //个人类型输入
  $('.name input').on('blur', function () {
    name = $(this).val()
  })
  $('.name phone').on('blur', function () {
    phone = $(this).val()
  })

  //提交
  $('.submit').on('click', function(){
    let url = '/OnAccount/add';
    let timestamp = new Date().getTime();
    let signature = sha1.hex_sha1('timestamp=' + timestamp+'&type='+type)
    let params = {
      type,
      company: companyName,
      timestamp,
      signature,
    }
    if(type === 2){
      params.individuals = companyData
    }
    params = JSON.stringify(params)
    ajax.post(url,params, res=>{
      if(res.code === 0){
        tools.tipBox('s', '添加成功')
        companyData = [{name: '', phone: ''}]
        name=''
        phone=''
        companyName=''
      }
    })
  })

  $('.goback').on('click', function(){
    window.history.go(-1)
  })
})