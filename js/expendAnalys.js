import tools from './tools'
import sha1 from './sha1'
import $ from 'jquery'
import ajax from './ajax'
import echarts from '../js/echarts.common.min.js'

$(function(){
  let lineData = [], 
      dateArr = [], 
      pieTitle = [], 
      pieData = [], 
      bg_time = '', 
      ed_time = '';

  getData();
  getPie();

  $('.inputBox input').on('blur', function(){
    getPie();
  })

  function getData(){
    let url = '/Expenses/analyLine';
    let timestamp = new Date().getTime();
    let signature = sha1.hex_sha1('timestamp='+timestamp)
    let params = {
      timestamp,
      signature
    }
    ajax.get(url, params, res=>{
      if (res.data.line) {
        $('.dayExpend').text(res.data.day)
        $('.monthExpend').text(res.data.month)
        $('.yearExpend').text(res.data.year)
        lineData = []
        dateArr = [] 
        res.data.line.forEach(item =>{
          lineData.push(item['金额'])
          dateArr.push(item['日期'])
        })
        initChart();
      }
    })
  }

  function getPie(){
    let url = '/Expenses/analyMaxClassPie';
    let timestamp = new Date().getTime();
    let signature = sha1.hex_sha1('timestamp=' + timestamp)
    let time = $('.inputBox input').val();
    
    bg_time = time.split('/')[0]
    ed_time = time.split('/')[1]

    if (!bg_time) {
      bg_time = ''
      ed_time = ''
    }

    let params = {
      bg_time,
      ed_time,
      timestamp,
      signature
    }
    ajax.get(url, params, res=>{
      if (res.data) {
        pieTitle = []
        pieData = []
        res.data.forEach(item=>{
          pieTitle.push(item['分类'])
          pieData.push({
            value: item['金额'],
            name: item['分类']
          })
        })
        initPie();
      }
    })
  }

  function initChart() {
    var myChart = echarts.init(document.getElementById('main'));
    var option = {
      tooltip: {
        show: true,
        trigger: 'axis'
      },
      legend: {
        data: ['金额']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: dateArr
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '金额',
          type: 'line',
          stack: '总量',
          data: lineData,
          smooth: true
        }
      ]
    };
    myChart.setOption(option);
  }
  
  function initPie(){
    var myPie = echarts.init(document.getElementById('pie'));
    var option2 = {
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        orient: 'horizontal',
        left: 'center',
        data: pieTitle
      },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: '65%',
          center: ['50%', '60%'],
          data: pieData,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    myPie.setOption(option2);
  }
})