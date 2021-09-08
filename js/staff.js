import $ from 'jquery'
import sha1 from '../js/sha1'
import tools from './tools'
import ajax from './ajax'
import api from './api'

$(function () {
  let page = 1, keyword = '', status = 2, pageCount = 1, type='', staff_id=-1;
  //获取列表
  getList();

  // function getList(){
  //   let url = '/Employees/getList';
  //   let timestamp = new Date().getTime();
  //   let signature = sha1.hex_sha1('timestamp=' + Math.floor(1.3 * timestamp));
  //   let params = {
  //     timestamp,
  //     page,
  //     status,
  //     keyword,
  //     signature
  //   }
  //   ajax.get(url, params, res=>{
  //     page = 1;
  //     pageCount = res.data.page_count;
  //     let html = '';
  //     if (res.data.employees_list.length === 0) {
  //       $('.onData').css('display', 'block');
  //     }
  //     res.data.employees_list.forEach(item => {
  //       html += `<tr>
  //         <td style="width: 45px">
  //           <input type="checkbox" class="checkItem">
  //         </td>
  //         <td>${item.status === 0? '离职':'在职'}</td>
  //         <td>${item.name}</td>
  //         <td>${item.account}</td>
  //         <td id-data="${item.id}">
  //           <a class="modifyStaff" href="javascript:;">修改</a>
  //           <a class="modifyStatus" href="javascript:;">${item.status === 0? '恢复':'离职'}</a>
  //         </td>
  //       </tr>`;
  //     });
  //     $('#tbody').html(html);
  //   })
  // }

  function getList(){
    let url = api.staffList
    let params = {
      user_id: localStorage.getItem('user_id'),
      page,
      page_size: 10,
      keyword,
      status
    }

    $.get(url, params).then(res=>{
      if(res.code === 0){
        let html = ''
        res.data.staff_list.forEach(item => {
          html += `<tr>
                  <td style="width: 45px">
                    <input type="checkbox" class="checkItem">
                  </td>
                  <td>${item.status === 0? '离职':'在职'}</td>
                  <td>${item.name}</td>
                  <td>${item.account}</td>
                  <td id-data="${item.staff_id}">
                    <a class="modifyStaff" href="javascript:;">修改</a>
                    <a class="modifyStatus" href="javascript:;" status-data=${item.status} style="margin:0 5px">${item.status === 0? '恢复':'离职'}</a>
                    <a class="delete" href="javascript:;">删除</a>
                  </td>
                </tr>`;
        });
        $('#tbody').html(html)
      }
    })
  }

  //选择状态
  $('.dropdown button').stop().on('click', function (res) {
    if($('.optionList').hasClass('show')){
      $('.optionList').removeClass('show')
    }else{
      $('.optionList').addClass('show')
    }
  })

  $('.dropdown ul li').on('click',function(e){
    status = parseInt($(this).attr('status-data'));
    $('.dropdown ul li').removeClass('selected')
    $(this).addClass('selected')
    getList();
    $('.optionList').removeClass('show')
    return false
  })

  //关键字查询
  $('.inputBox input').on('focus',function(){
    $('.inputBox').css({
      border: '1px solid #2d8cf0',
      boxShadow: '0 0 3px 0 #67acf7'
    })
  })

  $('.inputBox input').on('blur', function(){
    $('.inputBox').css({
      border: '1px solid #ccc',
      boxShadow: 'none'
    })
  })

  $('.inputBox .glyphicon').on('click', function(){
    keyword = $('.inputBox input').val();
    if(keyword === ''){
      tools.tipBox('e', '姓名不能为空')
      return
    }
    getList();
  })

  //翻页
  tools.pageNation(pageCount, function(currentPage){
    page = currentPage;
    getList();
  });

  //
  function staffOp(){
    let url = ''
    if(type === 'add'){
      url = api.staffAdd
    }else{
      url = api.staffModify
    }

    let params = {
      user_id: localStorage.getItem('user_id'),
      name: $('.name input').val(),
      account: $('.account input').val(),
      pwd: $('.password input').val(),
      id_num: $('.identify input').val(),
      staff_id
    }

    $.post(url, params).then(res=>{
      if(res.code === 0){
        $('.name input').val('')
        $('.account input').val('')
        $('.password input').val('')
        $('.identify input').val('')
        staff_id = -1
        page = 1
        getList()
        $('#mask').css('display', 'none')
        $('#mask .changeInfo').css('display', 'none');
      }
    })
  }

  //添加员工
  $('.addStaff').on('click',function(){
    $('#mask').css('display', 'block')
    $('#mask .changeInfo').css('display', 'block');
    type = 'add'
  })

  //修改员工信息
  $('#tbody').on('click', '.modifyStaff', function(){
    $('#mask').css('display', 'block');
    $('#mask .changeInfo').css('display', 'block');
    staff_id = $(this).parent().attr('id-data')
    type = 'modify'
  })

  $('#mask .changeInfo .comfirm').on('click', staffOp)

  $('#mask .changeInfo .cancel').on('click', function(){
    $('.name input').val('')
    $('.account input').val('')
    $('.password input').val('')
    $('.identify input').val('')
    $('#mask').css('display', 'none')
    $('#mask .changeInfo').css('display', 'none');
  })

  // 修改员工状态
  $('#tbody').on('click', '.modifyStatus', function(){
    staff_id = $(this).parent().attr('id-data')
    let status = -1
    if($(this).attr('status-data') == 0){
      status = 1
    }else {
      status = 0
    }
    $('#mask').css('display', 'block');
    $('#mask .changeStatus').css('display', 'block');
    $('#mask .changeStatus .comfirm').on('click', function () {
      
      let url = api.staffModifyStatus
      let params = {
        user_id: localStorage.getItem('user_id'),
        staff_id, 
        user_pwd: $('.user_pwd').val(),
        status
      }

      $.post(url, params).then(res=>{
        if(res.code === 0){
          staff_id = -1
          page = 1
          getList()
          $('.user_pwd').val('')
          $('#mask').css('display', 'none')
          $('#mask .changeStatus').css('display', 'none');
          tools.tipBox('s','修改成功')
        }else if(res.code === 2004){
          tools.tipBox('e', res.msg)
        }else{
          tools.tipBox('e','修改失败')
        }
      })

    })
    $('#mask .changeStatus .cancel').on('click', function () {
      $('#mask').css('display', 'none')
      $('#mask .changeStatus').css('display', 'none');
    })
  })

  //删除
  $('#tbody').on('click', '.delete', function(){
    staff_id = $(this).parent().attr('id-data')
    tools.showPopup('删除员工', '是否删除该员工', ()=>{
      let url = api.staffDel
      let params = {
        user_id: localStorage.getItem('user_id'),
        staff_id
      }
      $.post(url, params).then(res=>{
        if(res.code === 0){
          staff_id = -1
          page = 1
          getList()
          tools.tipBox('s', '删除成功')
        }else{
          tools.tipBox('s', '删除失败')
        }
      })
    })
  })
})