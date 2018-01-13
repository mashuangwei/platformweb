<template>
  <div id="container" style="min-width:300px;height:300px"></div>

</template>

<script>
  // import $ from 'jquery'
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
    props: {
      data: Object
    },
    data () {
      return {
        option: {
          chart: {
            type: 'column'
          },
          title: {
            text: '测试系统各项得分统计'
          },
          xAxis: {
            categories: this.data.categories
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
          series: this.data.series
        }
      }
    },
    methods: {
      initCharts () {
        // HighCharts.chart(document.getElementById('container'), )
        // $('#container').highcharts()
      }
    },
    created () {
      // this.initCharts()
    },
    mounted () {
      HighCharts.chart(document.getElementById('container'), this.option)
    }
  }
</script>

<style>
</style>
