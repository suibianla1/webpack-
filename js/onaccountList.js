import $ from 'jquery'
import sha1 from './sha1'
import tools from './tools'
import ajax from './ajax'

$(function(){
  let page = 1, type = 0, status = 0, pageCount = 1;

  getList();
  function getList() {
    let url = '/OnAccount/getList';
    let timestamp = new Date().getTime();
    let signature = sha1.hex_sha1('timestamp=' + timestamp)
    let params = {
      timestamp,
      signature,
      page,
      status,
      type,
      page_size_sel: 10
    }
    ajax.get(url, params, res=>{
      if (res.data.account.length === 0){
        $("#tbody").html('')
        $('.noData').css('display', 'block')
      }else{
        pageCount = res.data.page_count;
        let html = '';
        res.data.account.forEach(item => {
          let innHtml = '';
          let innHtmlP = '';
          item.individuals.forEach(el => {
            innHtml += `<div>${el.name}</div>`
            innHtmlP += `<div>${el.phone}</div>`
          })
          html += `<tr>
            <td>${item.type === 1 ? '个人' : '公司'}</td>
            <td>${item.company === '' ? '--' : item.company}</td>
            <td>${innHtml}</td>
            <td>${innHtmlP}</td>
            <td>${item.owe_amt}</td>
            <td>${item.status === 1 ? '有效' : '无效'}</td>
            <td data-id="${item.aid}">
              <a class="modify" href="javascript:;">修改</a>
              <a class="disable" href="javascript:;">${item.status === 1 ? '禁用' : '启用'}</a>
              <a class="repayment" href="javascript:;">还款</a>
              <a class="detail" href="javascript:;">订单明细</a>
            </td>
          </tr>`
        })
        $("#tbody").html(html)
      }
    })
  }

  //分页
  tools.pageNation(page, page=>{
    page = page;
    getList()
  })

  //选择type
  $('.type').on('click', function(){
    dropDown('.type .optionList', 'type')
  })
  //选择status
  $('.status').on('click', function(){
    dropDown('.status .optionList', 'status')
  })
  //下拉操作
  function dropDown(node, opreationType){
    if ($(node).hasClass('show')) {
      $(node).removeClass('show')
    } else {
      $(node).addClass('show')
      $(node).children().unbind().on('click', function (e) {
        $(this).siblings().removeClass('selected')
        $(this).addClass('selected')
        let chosen = $(this).data(opreationType)
        if (opreationType === 'type'){
          type = chosen
        }else{
          status = chosen
        }
        getList()
        $(node).removeClass('show')
        e.stopPropagation()
      })
    }
  }

  //禁用
  $('#tbody').on('click', '.disable', function(e){
    let content = $(this).text();
    let id = $(this).parent().data('id')
    tools.showPopup(content + '操作', '是否' + content + '该选项', function () {
      if (content === '禁用') {
        stopOrRestart(id, 'disable')
      } else {
        stopOrRestart(id, 'start')
      }
    })
    return false
  })

  function stopOrRestart(aid, type){
    let url = ''
    if(type === 'disable'){
      url = '/OnAccount/stop'
    }else{
      url = '/OnAccount/start'
    }
    let timestamp = new Date().getTime();
    let signature = sha1.hex_sha1('aid='+aid+'&timestamp='+timestamp)
    let params = {
      timestamp,
      signature,
      aid
    }
    ajax.post(url, params, res=>{
      if(res.code === 0) {
        tools.tipBox('s', '操作成功')
        getList()
      }
    })
  }


  //添加挂账主体
  $('.addCate').on('click',function(){
    window.location.href = '../page/addOnaccount.html'
  })
})