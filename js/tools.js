import $ from 'jquery'

function isLogin(){
  let path = window.location.pathname;
  if (localStorage.getItem('user') === null) {
    if (path !== '/login.html') {
      window.location.href = window.location.origin + '/login.html';
    }
  }
}

function renderBtn(pageCount, ){
  let html = `<button class="pageOne">第一页</button>
              <button class="pre">
                <span class="glyphicon glyphicon-chevron-left"></span>
              </button>`
  for(let i=0; i<pageCount; i++){
    html += `<button class="number">${i+1}</button>`
  }
  html += `<button class="next">
            <span class="glyphicon glyphicon-chevron-right"></span>
           </button>
           <button class="pageLast">最尾页</button>`
  $('#page').html(html)
}

function pageNation(pageCount, callback) {

  renderBtn(pageCount)

  let page = 1;
  //第一页
  $('#page').on('click', '.pageOne', function () {
    page = 1;
    pageNum(page, pageCount);
    callback(page)
    
  })
  //最后一页
  $('#page').on('click', '.pageLast', function () {
    page = pageCount;
    pageNum(page, pageCount);
    callback(page)
  })
  //上一页
  $('#page').on('click', '.pre', function () {
    if (page === 1) {
      return;
    }
    page--;
    pageNum(page, pageCount);
    callback(page)
  })
  //下一页
  $('#page').on('click', '.next', function () {
    if (page >= pageCount) {
      return;
    }
    page++;
    pageNum(page, pageCount);
    callback(page)
  })
  //中间页码
  $('#page').on('click', '.number', function () {
    page = parseInt($(this).html());
    console.log(page)
    if (page > pageCount) {
      return;
    }
    pageNum(page, pageCount);
    callback(page)
  })
}

//页码分布
function pageNum(page, pageCount) {
  let pageList = $('.number');
  for (let i = 0; i < pageList.length; i++) {
    $(pageList[i]).removeClass('pageActive')
  }
  if (page == 1 || page == 2) {
    for (let i = 0; i < pageList.length; i++) {
      pageList[i].innerHTML = i + 1;
    }
    if (page == 1) {
      $(pageList[0]).addClass('pageActive')
    } else {
      $(pageList[1]).addClass('pageActive')
    }
  } else if (page == pageCount || page == (pageCount - 1)) {
    pageList[0].innerHTML = pageCount - 4;
    pageList[1].innerHTML = pageCount - 3;
    pageList[2].innerHTML = pageCount - 2;
    pageList[3].innerHTML = pageCount - 1;
    pageList[4].innerHTML = pageCount;

    if (page == (pageCount - 1)) {
      $(pageList[3]).addClass('pageActive')
    } else {
      $(pageList[4]).addClass('pageActive')
    }
  } else {
    pageList[0].innerHTML = page - 2;
    pageList[1].innerHTML = page - 1;
    pageList[2].innerHTML = page;
    pageList[3].innerHTML = page + 1;
    pageList[4].innerHTML = page + 2;
    $(pageList[2]).addClass('pageActive')
  }
}

//弹窗
function showPopup(title, content, callback) {
  $(window.parent.document).find("#mask").css('display', 'block');
  $(window.parent.document).find('#mask .title p').html(title);
  $(window.parent.document).find('#mask .content p').html(content);
  $(window.parent.document).find('#mask .bottom .cancel').on('click', function () {
    $(window.parent.document).find('#mask').css('display', 'none');
  })
  $(window.parent.document).find('#mask .bottom .comfirm').off('click').on('click', function () {
    // 此处先添加事件解绑是防止点击事件执行两次，是因为冒泡原因
    $(window.parent.document).find('#mask').css('display', 'none');
    callback&&callback();
  })
}

//提示框
function tipBox(type, content) {
  if (type === 'e') {
    $(window.parent.document).find(".tipsBox .glyphicon-remove").css('display', 'block');
    $(window.parent.document).find(".tipsBox .glyphicon-ok").css('display', 'none');
  }else if(type === 's'){
    $(window.parent.document).find(".tipsBox .glyphicon-remove").css('display', 'none');
    $(window.parent.document).find(".tipsBox .glyphicon-ok").css('display', 'block');
  }
  $(window.parent.document).find(".tipsBox .content span").html(content)
  $(window.parent.document).find(".tipsBox").stop().animate({ right: '20px' }, 200, function () {
    setTimeout(() => {
      $(window.parent.document).find(".tipsBox").stop().animate({ right: '-250px' }, 200)
    }, 3000);
  })
}

export default { isLogin, pageNation, showPopup, tipBox}