<template>

  <Modal
    :mask-closable="false"
    @on-ok="okButtonClick"
    @on-cancel="cancelButtonClick"
    :width="850"
    :title=title
    :okText=okText
    v-model="data.showRecordCharts"
    :styles="{top: '20px'}">

    <div>
      <div id="main" style="min-width:800px;height:400px"></div>
      <br/>
      <div id="asr" style="min-width:800px;height:400px"></div>
    </div>

  </Modal>


</template>
<script>
  import HighCharts from 'highcharts'
//  import $ from 'jquery'

  export default {
    name: 'app',
    props: {
      data: Object
    },
    data () {
      return {
        highCharts: null,
        asrHighCharts: null,
        id: 'test',
        title: '性能测试结果',
        okText: '确定',
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
        },
        options: {
          title: {
            text: 'Asr性能测试',
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
            name: 'Asr',
            data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
          }]
        }
      }
    },
    mounted () {
      this.highCharts = HighCharts.chart(document.getElementById('main'), this.option)
      this.asrHighCharts = HighCharts.chart(document.getElementById('asr'), this.options)
    },
    methods: {
      okButtonClick () {},
      cancelButtonClick () {}
      // drawGraph (id) {
      // }
    }
  }
</script>

<style>

</style>
