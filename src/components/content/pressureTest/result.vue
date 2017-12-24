<style scoped>

</style>
<template>
  <Modal
    @on-ok="okButton"
    @on-cancel="cancelButton"
    :mask-closable="true"
    :scrollable="true"
    :width="1150"
    :title=title
    v-model="data.showFlag"
    :styles="{top: '20px'}">
    <div>
      <row>
        <row>
          <Table :columns="chartRecordTable" :data="chartdatalist" height="200" :border="showBorder"
                 :loading="loading"
                 :stripe="showStripe" @on-row-click="showChartData"
                 :show-header="showHeader" :showIndex="true" :no-data-text="nodataContent"></Table>
          <br>
          <Page :total="pageHelp.totalNum" show-elevator show-sizer show-total placement="top"
                :current="pageHelp.curPage"
                :page-size="pageHelp.pageSize" @on-change="getPageIndex" @on-page-size-change="getPageSize"
                :page-size-opts="pageSizeOptions"></Page>
        </row>
      </row>
      <div id="tps" style="min-width:700px;height:300px; width:1100px"></div>
      <br/>
      <div id="maxRT" style="min-width:700px;height:300px; width:1100px"></div>
      <br/>
      <div id="AvgRT" style="min-width:700px;height:300px; width:1100px"></div>
      <br>

    </div>

  </Modal>

</template>
<script>
  import Breadcrumb from 'iview/src/components/breadcrumb/breadcrumb'
  import ICol from 'iview/src/components/grid/col'
  import $ from 'jquery'
  import HighCharts from 'highcharts/highstock'
  import * as Exporting from 'highcharts/modules/exporting'
  import * as HighchartsMore from 'highcharts/highcharts-more'

  HighchartsMore(HighCharts)

  import * as HighchartsDrilldown from 'highcharts/modules/drilldown'

  HighchartsDrilldown(HighCharts)

  import * as Highcharts3D from 'highcharts/highcharts-3d'

  Highcharts3D(HighCharts)

  Highcharts3D(HighCharts)
  // 初始化导出模块
  Exporting(HighCharts)
  export default {
    components: {
      ICol,
      Breadcrumb
    },
    props: {
      data: Object
    },
    data () {
      return {
        showRecord: false,
        okText: '确定',
        title: '性能测试任务记录列表',
        nodataContent: '没有数据',
        searchStr: '',
        loading: false,
        pageSizeOptions: [10, 20, 30, 50, 100],
        pageHelp: {
          totalNum: 0,
          curPage: 1,
          pageSize: 10
        },
        showBorder: true,
        showStripe: true,
        showHeader: true,
        chartdatalist: [],
        chartRecordTable: [
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: 'TaskName',
            key: 'caseName',
            align: 'center'
          },
          {
            title: '创建时间',
            key: 'createTime',
            width: 200,
            align: 'center'
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '7px'
                  },
                  on: {
                    click: () => {
                      this.showDataResult(params.index)
                    }
                  }
                }, '查看')
              ])
            }
          }
        ]
      }
    },
    mounted () {
    },
    created () {
      this.getAll()
    },
    destroyed () {
      this.$emit('update')
    },
    methods: {
      showDataResult (index) {
        $.ajax({
          type: 'GET',
          async: true,
          url: window.myurl + '/pressure/getResultByResultId/' + this.chartdatalist[index].id,
          dataType: 'json',
          success: (result) => {
            let tpsoption = {
              chart: {
                zoomType: 'x'
              },
              tooltip: {
                split: false,
                shared: true
              },
              rangeSelector: {
                allButtonsEnabled: true,
                buttons: [{
                  type: 'second',
                  count: 30,
                  text: '30s'
                }, {
                  type: 'minute',
                  count: 1,
                  text: '1m'
                }, {
                  type: 'hour',
                  count: 1,
                  text: '1h'
                }, {
                  type: 'day',
                  count: 1,
                  text: '1d'
                }, {
                  type: 'all',
                  text: 'All'
                }],
                selected: 3
              },
              yAxis: {
                title: {
                  text: 'TPS'
                }
              },
              title: {
                text: 'TPS'
              },
              subtitle: {
                text: ''
              },
              credits: {
                enabled: false
              },
              series: [{
                name: 'TPS',
                data: result.data.tps,
                pointStart: Date.UTC(result.data.startTime.year, result.data.startTime.month - 1, result.data.startTime.day, result.data.startTime.hour, result.data.startTime.minutes, result.data.startTime.seconds),
                pointInterval: 1000,
                tooltip: {
                  valueDecimals: 1,
                  valueSuffix: ''
                }
              }]
            }
            let maxRToption = {
              chart: {
                zoomType: 'x'
              },
              tooltip: {
                split: false,
                shared: true
              },
              rangeSelector: {
                allButtonsEnabled: true,
                buttons: [{
                  type: 'second',
                  count: 30,
                  text: '30s'
                }, {
                  type: 'minute',
                  count: 1,
                  text: '1m'
                }, {
                  type: 'hour',
                  count: 1,
                  text: '1h'
                }, {
                  type: 'day',
                  count: 1,
                  text: '1d'
                }, {
                  type: 'all',
                  text: 'All'
                }],
                selected: 3
              },
              yAxis: {
                title: {
                  text: 'maxRT'
                }
              },
              title: {
                text: 'maxRT'
              },
              subtitle: {
                text: ''
              },
              credits: {
                enabled: false
              },
              series: [{
                name: 'maxRT',
                data: result.data.maxRT,
                pointStart: Date.UTC(result.data.startTime.year, result.data.startTime.month - 1, result.data.startTime.day, result.data.startTime.hour, result.data.startTime.minutes, result.data.startTime.seconds),
                pointInterval: 1000,
                tooltip: {
                  valueDecimals: 1,
                  valueSuffix: ''
                }
              }]
            }
            let AvgRToption = {
              chart: {
                zoomType: 'x'
              },
              tooltip: {
                split: false,
                shared: true
              },
              rangeSelector: {
                allButtonsEnabled: true,
                buttons: [{
                  type: 'second',
                  count: 30,
                  text: '30s'
                }, {
                  type: 'minute',
                  count: 1,
                  text: '1m'
                }, {
                  type: 'hour',
                  count: 1,
                  text: '1h'
                }, {
                  type: 'day',
                  count: 1,
                  text: '1d'
                }, {
                  type: 'all',
                  text: 'All'
                }],
                selected: 3
              },
              yAxis: {
                title: {
                  text: 'AvgRT'
                }
              },
              title: {
                text: 'AvgRT'
              },
              subtitle: {
                text: ''
              },
              credits: {
                enabled: false
              },
              series: [{
                name: 'AvgRT',
                data: result.data.avgRT,
                pointStart: Date.UTC(result.data.startTime.year, result.data.startTime.month - 1, result.data.startTime.day, result.data.startTime.hour, result.data.startTime.minutes, result.data.startTime.seconds),
                pointInterval: 1000,
                tooltip: {
                  valueDecimals: 1,
                  valueSuffix: ''
                }
              }]
            }
            HighCharts.stockChart(document.getElementById('tps'), tpsoption)
            HighCharts.stockChart(document.getElementById('maxRT'), maxRToption)
            HighCharts.stockChart(document.getElementById('AvgRT'), AvgRToption)
          },
          error: (errorMsg) => {
            console.log(errorMsg)
          }
        }
        )
      },
      okButton () {
        this.$destroy()
      },
      cancelButton () {
        this.$destroy()
      },
      showChartData (data) {
        // console.log('data: ' + JSON.stringify(this.chartdatalist[index]))
        // console.log('index: ' + JSON.stringify(index))
        // console.log('index1: ' + JSON.stringify(index[1]))
      },
      getAll () {
        this.loading = true
        $.ajax({
          type: 'GET',
          async: true,
          url: window.myurl + '/pressure/getResultById/' + this.data.id + '?pageNo=' + this.pageHelp.curPage + '&pageSize=' + this.pageHelp.pageSize,
          dataType: 'json',
          success: (result) => {
            this.chartdatalist = result.data.list
            this.pageHelp.totalNum = result.data.total
            this.pageHelp.totalPageNum = result.data.pages
            this.loading = false
          },
          error: (errorMsg) => {
            this.loading = false
            console.log(errorMsg)
          }
        })
      },
      getPageIndex (pageIndex) {
        this.pageHelp.curPage = pageIndex
        this.getAll()
      },
      getPageSize (pageSize) {
        this.pageHelp.pageSize = pageSize
        this.getAll()
      },
      cancel () {
      }
    }
  }
</script>
