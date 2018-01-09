<template>
  <div id="totalMain" style="min-width:300px;height:300px"></div>

</template>

<script>
  import HighCharts from 'highcharts'
  import * as Exporting from 'highcharts/modules/exporting'
  import * as HighchartsMore from 'highcharts/highcharts-more'
  HighchartsMore(HighCharts)
  // 初始化导出模块
  Exporting(HighCharts)
  export default {
    components: {
      HighCharts
    },
    data () {
      return {
        option: {
          chart: {
            type: 'column'
          },
          title: {
            text: '总得分统计'
          },
          xAxis: {
            categories: ['A系统', 'B系统', 'C系统', '喜马拉雅系统', 'TTS模型系统']
          },
          yAxis: {
            title: ''
          },
          credits: {
            enabled: false
          },
          plotOptions: {
            column: {
              // 关于柱状图数据标签的详细配置参考：https://api.hcharts.cn/highcharts#plotOptions.column.dataLabels
              dataLabels: {
                enabled: true,
                // verticalAlign: 'top', // 竖直对齐方式，默认是 center
                inside: true
              }
            }
          },
          series: [{
            name: '总得分',
            data: [45, 23, 24, 67, 22]
          }]
        }
      }
    },
    methods: {
    },
    created () {
      // this.initCharts()
    },
    mounted () {
      HighCharts.chart(document.getElementById('totalMain'), this.option)
    }
  }
</script>

<style>
</style>
