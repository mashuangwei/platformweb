<style scoped>
  .content {
    /*自行添加样式即可*/
  }

  #main {
    height: 500px;
  }
</style>
<template>
  <div class="content">
    <div id="main"></div>
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
        opinion: ['高富帅', '矮富帅', '高富挫', '矮富挫', '女生'],
        opinionData: [{
          value: 26,
          name: '高富帅'
        }, {
          value: 31,
          name: '矮富帅'
        }, {
          value: 18,
          name: '高富挫'
        }, {
          value: 28,
          name: '矮富挫'
        }, {
          value: 21,
          name: '女生'
        }]
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
        this.chart.setOption({
          title: {
            text: '女生喜欢的男生种类',
            subtext: '纯属扯犊子',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            x: 'center',
            y: 'bottom',
            data: this.opinion
          },
          toolbox: {
            show: true,
            feature: {
              mark: {
                show: true
              },
              dataView: {
                show: true,
                readOnly: false
              },
              magicType: {
                show: true,
                type: ['pie']
              },
              restore: {
                show: true
              },
              saveAsImage: {
                show: true
              }
            }
          },
          calculable: true,
          series: [{
            name: '种类',
            type: 'pie',
            radius: [30, 100],
            center: ['50%', '50%'],
            roseType: 'area',
            data: this.opinionData

          }]
        })
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

