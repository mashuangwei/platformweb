<style scoped>

</style>
<template>
  <Modal
    :mask-closable="false"
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
                     :stripe="showStripe"
                     :show-header="showHeader" :showIndex="true" :no-data-text="nodataContent"></Table>
            <br>
              <Page :total="pageHelp.totalNum" show-elevator show-sizer show-total placement="top"
                    :current="pageHelp.curPage"
                    :page-size="pageHelp.pageSize" @on-change="getPageIndex" @on-page-size-change="getPageSize"
                    :page-size-opts="pageSizeOptions"></Page>
          </row>
        </i-col>
        <i-col span="12">
          <div id="main" style="min-width:700px;height:300px"></div>
          <br/>
          <div id="asr" style="min-width:700px;height:300px"></div>
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
        },
        highCharts: null,
        asrHighCharts: null,
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
            align: 'center'
          },
          {
            title: '创建时间',
            key: 'createTime',
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
                      // this.chartPara.showRecordCharts = true
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
      this.highCharts = HighCharts.chart(document.getElementById('main'), this.option)
      this.asrHighCharts = HighCharts.chart(document.getElementById('asr'), this.options)
    },
    created () {
      this.getAll()
    },
    methods: {
      getAll () {
        this.loading = true
        console.log('url: ' + window.myurl + '/pressure/getResultById/' + '1' + '?pageNo=' + this.pageHelp.curPage + '&pageSize=' + this.pageHelp.pageSize)
        $.ajax({
          type: 'GET',
          async: true,
          url: window.myurl + '/pressure/getResultById/' + '1' + '?pageNo=' + this.pageHelp.curPage + '&pageSize=' + this.pageHelp.pageSize,
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
