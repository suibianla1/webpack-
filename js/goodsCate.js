import $ from 'jquery'
import sha1 from './sha1'
import tools from './tools'
import ajax from './ajax'

$(function(){
  let page = 1, count = 0, pageCount = 0;

  getList();

  function getList() {
    let url = '/Category/getList';
    let timestamp = new Date().getTime();
    let signature = sha1.hex_sha1('timestamp='+timestamp)
    let params = {
      page: page,
      page_size_sel: 10,
      timestamp,
      signature
    }
    ajax.get(url, params, res=>{
      count = res.data.total_parent;
      pageCount = res.data.page_count;
      let html = '';
      res.data.category_list.forEach((item, index)=>{
        let innerHtml = '';
        item._child.forEach((el, index) => {
          innerHtml += `<li>
            <div class="smallCateName">${el.name}</div>
            <div class="smallGoodsNum">${el.goods_num}种商品</div>
            <div class="smallOperation" id-data="${el.category_id}">
              <button class="modify">修改</button>
              <button class="delSamall">删除</button>
            </div>
          </li>`
        });
        html += `<div class="cateItem" id-data="${item.category_id}">
          <div class="tiemTitle">
            <div class="cataName">
              <span class="glyphicon glyphicon-triangle-bottom"></span>
              <span class="glyphicon glyphicon-triangle-right"></span>
              <span class="name" style="margin-left: 10px;">${item.name}</span>
            </div>
            <div class="itemOperation">
              <div class="info">
                <span class="smallCate">${item.child_num} 个小分类</span>
                <span class="goodsNum">${item.goods_num} 种商品</span>
              </div>
              <div class="operation" id-data="${item.category_id}">
                <p class="changeName">
                  <span class="glyphicon glyphicon-edit"></span>
                  <span>修改名称</span>
                </p>
                <p class="delCate" >
                  <span class="glyphicon glyphicon-trash"></span>
                  <span>删除大分类</span>
                </p>
              </div>
            </div>
          </div>
          <div class="itemContent">
            <ul class="clear">
              ${innerHtml}
              <li>
                <p class="addIcon"><span class="glyphicon glyphicon-plus"></span></p>
                <p class="addSmallCate">添加小分类</p>
              </li>
            </ul>
          </div>
        </div> `;
        
      })
      $('.cateList').html(html); 
    })
  }

  $('.cateList').on('click', '.cateItem', function(){
    if($(this).hasClass('active')) {
      $(this).removeClass('active').find('.itemContent').css('display', 'none'); 
      $(this).find('.glyphicon-triangle-right').css('display', 'inline-block');
      $(this).find('.glyphicon-triangle-bottom').css('display', 'none')
    }else{
      $('.cateItem').removeClass('active');
      $('.cateItem').find('.itemContent').css('display', 'none');
      $(this).addClass('active').find('.itemContent').css('display', 'block'); 
      $('.cateList').find('.glyphicon-triangle-bottom').css('display', 'none')
      $('.cateList').find('.glyphicon-triangle-right').css('display', 'inline-block')
      $(this).find('.glyphicon-triangle-right').css('display', 'none')
      $(this).find('.glyphicon-triangle-bottom').css('display', 'inline-block')
    }
  })

  //
  $('.delCate').on('click',function(e){
    e.stopPropagation();
    let category_id = $(this).parent().attr('id-data');
    tools.showPopup('删除操作', '确定删除该分类', function(){
      let url = '/Category/del';
      let timestamp = new Date().getTime();
      let signature = sha1.hex_sha1('category_id=' + category_id + '&timestamp=' + timestamp);
      let params = {
        timestamp,
        signature,
        category_id
      }
      ajax.post(url, params, res=>{
        tools.tipBox('s', '删除成功');
        page = 1;
        getList();
      })
    })
  })

  // 修改名称
  $('.cateList').on('click', '.changeName', function(e){
    e.stopPropagation();
    let category_id = $(this).parent().attr('id-data');
    $('#mask').css('display', 'block');
    $('#mask .comfirm').off('click').on('click', function () {
      let new_name = $('#mask .cateName').val();
      if (new_name === '') {
        tools.tipBox('e', '请输入分类名称')
        return;
      }
      let url = '/Category/modify';
      let timestamp = new Date().getTime();
      let signature = sha1.hex_sha1('category_id=' + category_id + '&new_name=' + new_name + '&timestamp=' + timestamp)
      let params = {
        timestamp,
        category_id,
        new_name,
        parent_id: '',
        signature
      }
      ajax.post(url, params, res=>{
        $('#mask').css('display', 'none')
        tools.tipBox('s', '修改成功')
        page = 1;
        getList();
      })
    })
    $('#mask .cancel').on('click', function () {
      $('#mask').css('display', 'none')
    })
  })
})