<style scoped>

</style>
<template>
  <Modal
    @on-ok="okButton"
    @on-cancel="cancelButton"
    :mask-closable="true"
    :scrollable="true"
    :width="1500"
    :title=title
    v-model="data.showFlag"
    :styles="{top: '20px'}">
    <div>
      <br>
      <row>
        <br>
        <i-col span="12">
          <row>
              <Table :columns="chartRecordTable" :data="chartdatalist" height="650" :border="showBorder" :loading="loading"
                     :stripe="showStripe" @on-row-click="showChartData"
                     :show-header="showHeader" :showIndex="true" :no-data-text="nodataContent"></Table>
            <br>
              <Page :total="pageHelp.totalNum" show-elevator show-sizer show-total placement="top"
                    :current="pageHelp.curPage"
                    :page-size="pageHelp.pageSize" @on-change="getPageIndex" @on-page-size-change="getPageSize"
                    :page-size-opts="pageSizeOptions"></Page>
          </row>
        </i-col>
        <i-col span="12">
          <div id="tps" style="min-width:700px;height:300px"></div>
          <br/>
          <div id="maxRT" style="min-width:700px;height:300px"></div>
          <br/>
          <div id="AvgRT" style="min-width:700px;height:300px"></div>
        </i-col>
      </row>
      <br>


    </div>

  </Modal>

</template>
<script>
  import Breadcrumb from 'iview/src/components/breadcrumb/breadcrumb'
  // import recordCharts from './recordcharts'
  import ICol from 'iview/src/components/grid/col'
  import HighCharts from 'highcharts'
  import $ from 'jquery'

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
        tpsoption: {
          title: {
            text: 'TPS数据',
            x: -20
          },
          subtitle: {
            text: '数据来源: rokid',
            x: -20
          },
          xAxis: {
            categories: ['1513607888', '1513607889', '1513607884', '1513607885', '1513607886', '1513607880', '1513607881', '1513607882']
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
            valueSuffix: ''
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
            name: 'TPS',
            data: [1, 1, 1, 1, 1, 1, 1, 1]
          }]
        },
        maxRToption: {
          title: {
            text: 'maxRT数据',
            x: -20
          },
          subtitle: {
            text: '数据来源: rokid',
            x: -20
          },
          xAxis: {
            categories: []
          },
          yAxis: {
            title: {
              text: 'maxRT'
            },
            plotLines: [{
              value: 0,
              width: 1,
              color: '#808080'
            }]
          },
          tooltip: {
            valueSuffix: ''
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
            name: 'maxRT',
            data: []
          }]
        },
        AvgRToption: {
          title: {
            text: 'maxRT数据',
            x: -20
          },
          subtitle: {
            text: '数据来源: rokid',
            x: -20
          },
          xAxis: {
            categories: []
          },
          yAxis: {
            title: {
              text: 'AvgRT'
            },
            plotLines: [{
              value: 0,
              width: 1,
              color: '#808080'
            }]
          },
          tooltip: {
            valueSuffix: ''
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
            name: 'AvgRT',
            data: []
          }]
        },
        tpsHighCharts: null,
        maxRTHighCharts: null,
        avgRTHighCharts: null,
        chartPara: {
          showRecordCharts: false,
          id: 0
        },
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
          pageSize: 13
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
            width: 275,
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
            width: 200,
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
      // this.tpsHighCharts = HighCharts.chart(document.getElementById('tps'), this.tpsoption)
      // this.maxRTHighCharts = HighCharts.chart(document.getElementById('maxRT'), this.maxRToption)
      // this.avgRTHighCharts = HighCharts.chart(document.getElementById('AvgRT'), this.AvgRToption)
    },
    created () {
      this.getAll()
    },
    destroyed () {
      this.$emit('update')
    },
    methods: {
      addOptionData (result) {
        this.tpsoption.xAxis.categories.splice(0, this.tpsoption.xAxis.categories.length)
        this.tpsoption.series[0].data.splice(0, this.tpsoption.series[0].data.length)
        for (let i = 0; i < result.data.tps.key.length; i++) {
          this.tpsoption.xAxis.categories.push(result.data.tps.key[i])
          this.tpsoption.series[0].data.push(result.data.tps.value[i])
        }

        this.maxRToption.xAxis.categories.splice(0, this.maxRToption.xAxis.categories.length)
        this.maxRToption.series[0].data.splice(0, this.maxRToption.series[0].data.length)
        for (let i = 0; i < result.data.maxRT.key.length; i++) {
          this.maxRToption.xAxis.categories.push(result.data.maxRT.key[i])
          this.maxRToption.series[0].data.push(result.data.maxRT.value[i])
        }

        this.AvgRToption.xAxis.categories.splice(0, this.AvgRToption.xAxis.categories.length)
        this.AvgRToption.series[0].data.splice(0, this.AvgRToption.series[0].data.length)
        for (let i = 0; i < result.data.avgRT.key.length; i++) {
          this.AvgRToption.xAxis.categories.push(result.data.avgRT.key[i])
          this.AvgRToption.series[0].data.push(result.data.avgRT.value[i])
        }
      },
      showDataResult (index) {
        $.ajax({
          type: 'GET',
          async: true,
          url: window.myurl + '/pressure/getResultByResultId/' + this.chartdatalist[index].id,
          dataType: 'json',
          success: (result) => {
            this.addOptionData(result)
            this.tpsHighCharts = HighCharts.chart(document.getElementById('tps'), this.tpsoption)
            this.maxRTHighCharts = HighCharts.chart(document.getElementById('maxRT'), this.maxRToption)
            this.avgRTHighCharts = HighCharts.chart(document.getElementById('AvgRT'), this.AvgRToption)
          },
          error: (errorMsg) => {
            console.log(errorMsg)
          }
        })
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
          error: function (errorMsg) {
            // window.utils.ajaxFail(errorMsg);
            console.log(errorMsg)
          }
        })
      },
      getPageIndex (pageIndex) {
        this.pageHelp.curPage = pageIndex
        this.loading = true
        this.getAll()
      },
      getPageSize (pageSize) {
        this.pageHelp.pageSize = pageSize
      },
      add () {
        // this.$emit('update', this.data.addData)
      },
      cancel () {
        console.log('hights')
      }
    }
  }
</script>
