<template>
  <div id="container" style="min-width:800px;height:400px"></div>

</template>
<script>
  import HighCharts from 'highcharts'

  export default {
    name: 'app',
    mounted () {
      HighCharts.chart(document.getElementById('container'), this.option)
    },
    data () {
      let option = {
        chart: {
          type: 'column'
        },
        credits: {
          enabled: false
        },
        title: {
          text: '我的第一个图表'
        },
        colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00',
          '#24CBE5'],
        xAxis: {
          categories: ['1号', '2号', '3号', '3号', '3号']
        },
        yAxis: {
          title: {
            text: '最近七天'
          }
        },
        plotOptions: {
          column: {
            colorByPoint: true
          }
        },
        series: [{
          name: '小明',
          data: [{
            y: 1000,
            color: 'red'
          }, 5000, 4000, 5000, 2000]
        }]
      }
      return {
        id: 'test',
        option: option
      }
    }
  }
</script>

<style>

</style>
