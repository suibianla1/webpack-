import $ from 'jquery'
import sha1 from './sha1'
import tools from './tools'
import ajax from './ajax'

$(function(){
  let page = 1, pageCount = 1, log_type = 0, goods_name = '', diffday = 30;
  getList()
  function getList(){
    let url = '/Stock/getList';
    let timestamp = new Date().getTime();
    let signature = sha1.hex_sha1('timestamp=' + timestamp)
    let params = {
      timestamp,
      page,
      pageSize: 10,
      date_type: 'time',
      diffday,
      bg_time: '',
      ed_time: '',
      log_type,
      goods_name,
      gid: '',
      signature
    }
    ajax.get(url, params, res=>{
      pageCount = res.data.page_count;
      let html = '';
      if (res.data.log_list) {
        res.data.log_list.forEach(item => {
          html += `<tr>
          <td>${item.update_time}</td>
          <td>${item.goods_name}</td>
          <td>${item.parent_name}-${item.category_name}</td>
          <td>${item.cost_price}</td>
          <td>${item.change_price}</td>
          <td>${item.original_stock}</td>
          <td>${item.change_num}</td>
          <td>${item.final_stock}</td>
          <td>${item.operator}</td>
          <td>${item.desc}</td>
        </tr>`;
        });
        $('#tbody').html(html)
      }else{
        pageCount = 1;
        $('#tbody').html('')
        $('.noData').css('display', 'block')
      }
    })
  }

  $('.date button').on('click',function () {
    if ($('.date .optionList').hasClass('show')) {
      $('.date .optionList').removeClass('show')
    }else{
      $('.date .optionList').addClass('show')
      $('.date .optionList li').on('click', function (e) {
        e.stopPropagation();
        $('.date .optionList li').removeClass('selected')
        $(this).addClass('selected')
        $('.date .optionList').removeClass('show')
        diffday = parseInt($(this).attr('time-data'))
        getList();
      })
    }
  })
  $('.type button').on('click', function () {
    if ($('.type .optionList').hasClass('show')) {
      $('.type .optionList').removeClass('show')
    } else {
      $('.type .optionList').addClass('show')
      $('.type .optionList li').on('click', function (e) {
        e.stopPropagation();
        $('.type .optionList li').removeClass('selected')
        $(this).addClass('selected')
        $('.type .optionList').removeClass('show')
        log_type = parseInt($(this).attr('type-data'))
        getList();
      })
    }
  })

  tools.pageNation(pageCount, function (currentPage) {
    page = currentPage;
    getList();
  });

  $('.inputBox input').on('focus', function () {
    $(this).parent().css({
      border: '1px solid #2d8cf0',
      boxShadow: '0 0 5px 0 #5fa9f8'
    })
  })
  $('.inputBox input').on('blur', function(){
    $(this).parent().css({
      border: '1px solid #ccc',
      boxShadow: 'none'
    })
    goods_name = $(this).val();
    getList();
  })
})