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
          title: {
            text: '日常检查'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['离线编译']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: []
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: '离线编译错误次数',
              type: 'line',
              stack: '总量',
              data: []
            }
          ]
        }
      }
    },
    methods: {
      drawGraph (id) {
        $.ajax({
          type: 'GET',
          async: true,
          url: window.myurl + '/check/query?curPage=1' + '&page_size=40',
          dataType: 'json',
          success: (result) => {
            for (let i = 0; i < result.list.length; i++) {
              this.option.xAxis.data.push(result.list[i].createTime)
              if (result.list[i].result === 'success') {
                this.option.series[0].data.push(1)
              } else {
                this.option.series[0].data.push(0)
              }
            }
            this.chart.setOption(this.option, true)
            this.chart.hideLoading()
          },
          error: function (errorMsg) {
            console.log(errorMsg)
          }
        })
      }
    },
    created () {
//      this.drawGraph('main')
    },
    mounted () {
      this.chart = echarts.init(document.getElementById('main'))
      this.chart.showLoading()
      this.drawGraph('main')
    }
  }
</script>

