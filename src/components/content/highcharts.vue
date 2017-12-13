<template>
  <div id="main" style="min-width:800px;height:400px"></div>

</template>
<script>
  import HighCharts from 'highcharts'
//  import $ from 'jquery'

  export default {
    name: 'app',
    data () {
      return {
        highCharts: null,
        id: 'test',
        option: {
          title: {
            text: 'Speech性能测试',
            x: -20
          },
          subtitle: {
            text: '数据来源: rokid',
            x: -20
          },
          xAxis: {
            categories: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
          },
          yAxis: {
            title: {
              text: 'TPS'
            },
            plotLines: [{
              value: 0,
              width: 1,
              color: '#808080'
            }]
          },
          tooltip: {
            valueSuffix: '°C'
          },
          legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
          },
          // 版权信息是否展示,false：不展示
          credits: {
            text: 'Rokid',
            enabled: false,
            href: 'https://developer.rokid.com/#/'
          },
          series: [{
            name: 'Speech',
            data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
          }]
        }
      }
    },
    mounted () {
      this.highCharts = HighCharts.chart(document.getElementById('main'), this.option)
    },
    methods: {
      drawGraph (id) {
      }
    }
  }
</script>

<style>

</style>
