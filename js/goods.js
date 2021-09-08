import $ from 'jquery'
import sha1 from '../js/sha1'
import tools from './tools'
import ajax from './ajax'
import api from './api'


window.onload = function () {
  // tools.isLogin();

  let page = 1, goods_name = '', keyword = '', count = 0, currentPage = 1, pageCount = 0;

  getList();

  // function getList() {
  //   let url = '/Goods/getList';
  //   let timestamp = new Date().getTime();
  //   let signature = sha1.hex_sha1('timestamp=' + timestamp)
  //   let data = {
  //     timestamp,
  //     signature,
  //     page: page,
  //     page_size_sel: 10,
  //     goods_name: goods_name,
  //     category_id: '',
  //     status: 0,
  //     stock_type: 0,
  //     max_stock: '',
  //     min_stock: '',
  //     order_by: '',
  //     keyword: keyword
  //   }
  //   ajax.get(url, data, res => {
  //     let html = '';
  //     count = res.data.count;
  //     pageCount = res.data.page_count;
  //     res.data.goods_list.forEach((item, index) => {
  //       html += `<tr>
  //         <td>
  //           <input type="checkbox" class="checkItem">
  //         </td>
  //         <td>
  //           <a href="javascript:;" id-data="${item.gid}">${item.goods_name}</a>
  //         </td>
  //         <td>${item.parent_name + '-' + item.child_name}</td>
  //         <td>${item.goods_price}</td>
  //         <td>${item.stock}</td>
  //         <td>${item.status === 1 ? '上架' : '下架'}</td>
  //         <td>
  //           <a class="stockOut" href="javascript:;" id-data=${item.gid}>出库</a>
  //           <a class="stockIn" href="javascript:;" id-data=${item.gid}>入库</a>
  //           <a class="putOn" href="javascript:;" id-data=${item.gid}>上架</a>
  //           <a class="putOff" href="javascript:;" id-data=${item.gid}>下架</a>
  //           <a class="del" href="javascript:;" id-data=${item.gid}>删除</a>
  //         </td>
  //       </tr> `;
  //     })
  //     $('#tbody').html(html)
  //     if (res.data.goods_list.length === 0) {
  //       $('.noData').css('display', 'block');
  //     }
  //   })
  // }

  function getList(){
    let url = api.goodsList
    let data = {
      page,
      page_size: 10,
      user_id: localStorage.getItem('user_id')
    }
    $.get(url, data).then(res=>{
      let html = ''
      res.data.goods_list.forEach((item, index) => {
        html += `<tr>
          <td>
            <input type="checkbox" class="checkItem">
          </td>
          <td>
            <a href="javascript:;" id-data="${item.gid}">${item.goods_name}</a>
          </td>
          <td>${item.goods_cate}</td>
          <td>${item.goods_price}</td>
          <td>${item.stock}</td>
          <td status-data=${item.status}> ${item.status === 1 ? '上架' : '下架'}</td>
          <td status-data=${item.status}>
            <a class="stockOut" href="javascript:;" id-data=${item.gid}>出库</a>
            <a class="stockIn" href="javascript:;" id-data=${item.gid}>入库</a>
            <a class="putOn" href="javascript:;" id-data=${item.gid} >上架</a>
            <a class="putOff" href="javascript:;" id-data=${item.gid}>下架</a>
            <a class="del" href="javascript:;" id-data=${item.gid}>删除</a>
          </td>
        </tr> `;
      })

      $('#tbody').html(html)

      if (res.data.goods_list.length === 0) {
        $('.noData').css('display', 'block');
      }

      pageCount = Math.ceil(res.data.count/10)

      //分页
      tools.pageNation(pageCount, currentPage=>{
        page = currentPage;
        getList();
      });

    })
  }

  //渲染分页按钮

  //操着之后的函数
  function afterOp(res, content){
    if(res.code === 0){
      tools.tipBox('s', content+'成功');
      page = 1;
      getList();
    }else{
      tools.tipBox('e', content+'失败');
    }
  }

  //全选
  $('.checkAll').on('click', function(){
    let status = $(this).prop('checked');
    //设置全部checkbox为选择状态
    $('.checkItem').prop('checked', status)
  })

  //判断是不是全选
  $('tbody').on('click', '.checkItem' , function(){
    //获取全部checkbox的数量
    let allCheckNum = $('.checkItem').length;
    //获取已选择的checkbox的长度
    let checkedNum = $('.checkItem:checked').length;
    //如果选择的checkbox数量等于全部checkbox的数量，全选按钮勾上
    $('.checkAll').prop('checked', allCheckNum == checkedNum);
  })

  //删除
  $('tbody').on('click', '.del', function (){
    let gid = $(this).attr('id-data')
    // operation('del',gid)
    let url = api.goodsDel
    let params = {
      user_id: 1,
      gid
    }
    $.post(url, params).then(res=>{
      afterOp(res, '删除商品')
    })
  })

  //出库
  $('tbody').on('click', '.stockOut', function(){
    tools.showPopup('出库操作', '是否出库该商品？', function () {
      
    })
  })

  //入库
  $('tbody').on('click', '.stockIn', function () {
    tools.showPopup('入库操作', '是否入库该商品？', function () {
      console.log(123);
    })
  })

  //上架
  $('tbody').on('click', '.putOn', function () {

    let stauts = $(this).parent().attr('status-data')
    if(stauts == 1){
      tools.tipBox('i', '该商品已上架')
      return
    }

    let _this = $(this)

    tools.showPopup('上架操作', '是否上架该商品？', function () {
      let gid = _this.attr('id-data')
      // operation('on', gid)
      let url = api.goodsOn
      let params = {
        user_id: localStorage.getItem('user_id'),
        gid
      }
      $.post(url, params).then(res=>{
        afterOp(res, '上架商品')
      })
    })
    
  })

  //下架
  $('tbody').on('click', '.putOff', function () {

    let stauts = $(this).parent().attr('status-data')
    if(stauts == 0){
      tools.tipBox('i', '该商品已下架')
      return
    }

    let _this = $(this)

    tools.showPopup('上架操作', '是否下架该商品？', function () {
      let gid = _this.attr('id-data')
      let url = api.goodsOff
      let params = {
        user_id: localStorage.getItem('user_id'),
        gid
      }

      $.post(url, params).then(res=>{
        afterOp(res, '下架商品')
      })
    })
  })

  //上下架及删除操作函数
  function operation(type, gid){
    let url = '';
    let content= ''
    if (type === 'on') {
      url = '/Goods/on'
      content = '是否上架该商品？'
    }else if (type === 'off'){
      url = '/Goods/off'
      content = '是否下架该商品？'
    }else if(type === 'del'){
      url = '/Goods/del'
      content = '是否删除该商品？'
    }

    tools.showPopup('操作提示', content, function () {
      let timestamp = new Date().getTime();
      let signature = sha1.hex_sha1('gid=' + gid + '&timestamp=' + timestamp)
      let params = {
        timestamp,
        gid,
        signature
      }
      ajax.post(url, params, res => {
        afterOp(res)
      })
    })
  }

  //添加商品
  $('.addGoods').on('click', function(){
    $('.addGoodsBox').css('display', 'block')
  })

  $('.comfirn').on('click', function(){
    let url = api.goodAdd
      
    let goods_name = $('.goods_name').val()
    let goods_cate = $('.goods_cate').val()
    let goods_price = $('.goods_price').val()
    let stock = $('.stock').val()
    let status = $('.status').val()

    let params = {
      user_id: localStorage.getItem('user_id'),
      goods_name,
      goods_cate,
      goods_price,
      stock,
      status
    }

    $.post(url, params).then(res=>{
      if(res.code === 0){
        $('.goods_name').val('')
        $('.goods_cate').val('')
        $('.goods_price').val('')
        $('.stock').val('')
        $('.status').val('')
        $('.addGoodsBox').css('display', 'none')
        afterOp(res, '添加商品')
      }
    })
  })

  $('.cancel').on('click', function(){
    $('.addGoodsBox').css('display', 'none')
    $('.goods_name').val('')
    $('.goods_cate').val('')
    $('.goods_price').val('')
    $('.stock').val('')
    $('.status').val('')
  })

}