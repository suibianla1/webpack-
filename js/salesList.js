import tools from './tools'
import sha1 from './sha1'
import $ from 'jquery'
import ajax from './ajax';

$(function () {
  let page = 1, pageCount = 1;
  getList();
  function getList() {
    let url = '/Sales/getList'
    let timestamp = new Date().getTime();
    let signature = sha1.hex_sha1('timestamp=' + timestamp)
    let params = {
      page_size_sel: 10,
      page,
      cid: '',
      pay_type: - 1,
      sale_type: '',
      serial_num: '',
      user_key: '',
      date_type: 'time',
      diffday: 365,
      bg_time: '',
      ed_time: '',
      order_state: -1,
      pickup_code: '',
      channel: 0,
      timestamp,
      signature
    }
    ajax.get(url, params, res=>{
      pageCount = res.data.page_count;
      $('.count').text(res.data.count)
      $('.num').text(res.data.total_sale)
      $('.total').text(res.data.total_price)
      if (!res.data.sales_record_list || res.data.sales_record_list.length == 0) {
        $('.noData').css('display', 'block')
        $('#tbody').html('');
      }else{
        let html = '';
        res.data.sales_record_list.forEach((item, index) => {
          let innerHtml = '';
          item.sales_list.forEach(el =>{
            innerHtml += `
            <div class="clear">
              <div class="goodsName" style="width: 175px; position: relative">
                <span style="position: absolute; left: 0">商品名称：</span>
                <p style="padding-left: 69px">${el.goods_name}</p>
              </div>
              <div class="price" style="width: 130px">
                <span>商品单价: </span>
                <span>${el.goods_price}</span>
              </div>
              <div class="price" style="width: 86px">
                <span>购买数量: </span>
                <span>${el.goods_number}</span>
              </div>
              <div class="price" style="width: 100px">
                <span>应收: </span>
                <span>${el.real_money}</span>
              </div>
              <div class="price" style="width: 86px">
                <span>折扣: </span>
                <span>${el.discount}</span>
              </div>
              <div class="price" style="width: 100px">
                <span>实收: </span>
                <span>${el.able_money}</span>
              </div>
              <div class="price" style="min-width:208px; position: relative; height: 20px">
                <span style="position: absolute; left: 0">备注: </span>
                <p style="padding-left: 35px">${el.msg}</p>
              </div>
              <div class="price" style="width: 75px; margin-right:0">
                <a href="javascript:;" style="color: #2b85e4">退换货</a>
                <a href="javascript:;" style="color: #2b85e4">详情</a>
              </div>
            </div>`
          })
          html += `<tr>
            <td class="showBtn" index="${index}">
              <span class="glyphicon glyphicon-chevron-right"></span>
            </td>
            <td>${item.sale_num}</td>
            <td>${item.prices}</td>
            <td>${item.action_id}</td>
            <td>${item.serial_num}</td>
            <td>${item.paytime}</td>
            <td>${item.type_name}</td>
            <td>${item.name}</td>
            <td>
              <a href="javascript:;">发货</a>
              <a href="javascript:;">整单退货</a>
            </td>
          </tr>
          <tr class="infoRow">
            <td colspan="9" class="info clear" >
            ${innerHtml}
            </td>
          </tr>`
        })
        $('#tbody').html(html);
      } 
    })
  }

  $('#tbody').on('click', '.showBtn', function(){
    let index = $(this).attr('index');
    if ($('#tbody .infoRow').eq(index).hasClass('selected')) {
      $('#tbody .infoRow').eq(index).removeClass('selected')
    }else{
      $('#tbody .infoRow').removeClass('selected')
      $('#tbody .infoRow').eq(index).addClass('selected')
    }
  })

  tools.pageNation(pageCount, function(currentPage){
    page = currentPage
    getList();
  })
})