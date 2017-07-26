<style scoped>
  .content {
    /*自行添加样式即可*/
  }

  #main {
    height: 400px;
  }
</style>
<template>
  <div class="content">
    <div id="main" style="width: 800px;height:600px;"></div>
  </div>
</template>
<script>
  import echarts from 'echarts'
  import $ from 'jquery'

  export default {
    data () {
      return {
        // 初始化空对象
        chart: null,
        // 初始化图表配置
        option: {
          title: {
            text: 'ECharts 入门示例'
          },
          tooltip: {},
          legend: {
            data: ['销量']
          },
          xAxis: {
            data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
          },
          yAxis: {},
          series: [{
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }]
        }
      }
    },
    methods: {
      drawGraph (id) {
        this.chart = echarts.init(document.getElementById(id))
        this.chart.showLoading()
        var that = this
        $.ajax({
          type: 'GET',
          async: true,
          url: 'xxx',
          dataType: 'json',
          success: function (result) {
            that.opinionData = result
          },
          error: function (errorMsg) {
            console.log(errorMsg)
          }
        })
        this.chart.setOption(this.option)
        this.chart.hideLoading()
      }
    },
    mounted () {
      this.$nextTick(function () {
        this.drawGraph('main')
      })
    }
  }
</script>

