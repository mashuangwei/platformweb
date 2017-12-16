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
    <div id="main" style="width: 1219px;height:659px;"></div>
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
          tooltip: {
            formatter: '{a} <br/>{b} : {c}%'
          },
          toolbox: {
            feature: {
              restore: {},
              saveAsImage: {}
            }
          },
          series: [
            {
              name: '业务指标',
              type: 'gauge',
              detail: {formatter: '{value}%'},
              data: [{value: 50, name: '完成率'}]
            }
          ]
        }
      }
    },
    methods: {
//      setInterval: (function () {
//        option.series[0].data[0].value = (Math.random() * 100).toFixed(2) - 0
//        myChart.setOption(option, true)
//      }, 2000 ),
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

