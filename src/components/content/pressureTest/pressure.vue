<style lang="less" rel="stylesheet/less">
  .vertical-center-modal {
    display: flex;
    align-items: center;
    justify-content: center;
    .ivu-modal {
      top: 0;
    }
  }

  .ivu-table .table-info-cell-result-success {
    /*background-color: #19be6b;*/
    color: #19be6b;
  }

  .ivu-table .table-info-cell-result-fail {
    /*background-color: #19be6b;*/
    color: #ed3f14;
  }

  .border-bt {
    border-bottom: 1px solid #e9eaec;
  }

  .editor-wrap {
    width: 100%;
    padding-top: 15px;
  }

  .demo-upload-list {
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
    margin-right: 4px;
  }

  .demo-upload-list img {
    width: 100%;
    height: 100%;
  }

  .demo-upload-list-cover {
    display: block;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: #5cadff;
  }

  .demo-upload-list:hover .demo-upload-list-cover {
    display: block;
  }

  .demo-upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }

</style>
<template>
  <div>
    <!--<Row style="margin-bottom:15px;margin-top: 10px">-->
    <!--<i-col span="1" offset="0">-->
    <!--<Button type="primary" icon="ios-search" @click="searchBy">搜索</Button>-->
    <!--</i-col>-->
    <!--</Row>-->
    <row>
      <br>
      <Table :columns="jobtable" :data="jobdatalist" height="665" :border="showBorder" :loading="loading"
             :stripe="showStripe"
             :show-header="showHeader" :showIndex="true" :no-data-text="nodataContent"></Table>
    </row>
    <br>

    <row>
      <i-col span="14" offset="8" style="font-size: 12px; color: #495060;">
        <Page :total="pageHelp.totalNum" show-elevator show-sizer show-total placement="top" :current="pageHelp.curPage"
              :page-size="pageHelp.pageSize" @on-change="getPageIndex" @on-page-size-change="getPageSize"
              :page-size-opts="pageSizeOptions"></Page>
      </i-col>
    </row>

    <br>
    <!-- 分页 -->
    <!--<row>-->
    <!--<i-col span="14" offset="8">-->
    <!--<Page :total="pageHelp.totalNum" show-elevator show-sizer show-total placement="top" :current="pageHelp.curPage"-->
    <!--:page-size="pageHelp.pageSize" @on-change="getPageIndex" @on-page-size-change="getPageSize"-->
    <!--:page-size-opts="pageSizeOptions"></Page>-->
    <!--</i-col>-->
    <!--</row>-->
    <result-record :data="pressureData" v-if="pressureData.vshowFlag" @update="updateChildDate"></result-record>

  </div>
</template>
<script>
  import $ from 'jquery'
  import { Col, Row } from 'iview'
  import resultRecord from './result'

  export default {
    components: {
      Row,
      'i-col': Col,
      resultRecord: resultRecord,
      'name': 'skillcheck'
    },
    data () {
      return {
        pressureData: {
          id: 0,
          showFlag: false,
          vshowFlag: false
        },
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
        jobdatalist: [],
        executeButton: false,
        jobtable: [
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
            title: '任务描述',
            key: 'description',
            align: 'center'
          },
          // {
          //   title: '线程数',
          //   key: 'threadNum',
          //   align: 'center'
          // },
          // {
          //   title: '执行时间',
          //   key: 'time',
          //   align: 'center'
          // },
          // {
          //   title: 'voipath',
          //   key: 'voipath',
          //   align: 'center'
          // },
          {
            title: '任务进度',
            key: 'status',
            align: 'center'
          },
          {
            title: '操作',
            key: 'action',
            width: 230,
            align: 'center',
            render: (h, params) => {
              // let buttonLoading = false
              if (params.row.status === 'running') {
                this.buttonLoading = true
              }
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
                      this.pressureData.vshowFlag = true
                      console.log('>>>>>' + JSON.stringify(this.jobdatalist[params.index]))
                      this.pressureData.id = this.jobdatalist[params.index].id
                      this.pressureData.showFlag = true
                      // this.editTask(params.index)
                    }
                  }
                }, '查看记录'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.removeTask(params.index)
                    }
                  }
                }, '删除'),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                    // loading: buttonLoading
                  },
                  style: {
                    marginLeft: '7px'
                  },
                  on: {
                    click: () => {
                      // this.executeButton = true
                      this.jobdatalist[params.index].status = 'running'
                      this.pressureData.id = this.jobdatalist[params.index].id
                      this.executeTask(params.index)
                    }
                  }
                }, '执行')
              ])
            }
          },
          {
            title: '创建时间',
            key: 'createTime',
            align: 'center'
          }
        ]
      }
    },
    created () {
      this.getAll()
    },
    methods: {
      updateChildDate () {
        this.pressureData.showFlag = false
        this.pressureData.vshowFlag = false
      },
      removeTask (index) {
        $.ajax({
          type: 'DELETE',
          async: true,
          url: window.myurl + '/pressure/delete/' + this.jobdatalist[index].id,
          dataType: 'json',
          success: (result) => {
            if (result.code === 200) {
              this.$Message.success('删除成功')
              this.getAll()
            } else {
              this.$Message.error('删除失败')
            }
          },
          error: (errorMsg) => {
            this.$Message.error('删除失败')
            console.log(errorMsg)
          }
        })
      },
      executeTask (index) {
        console.log('url: ' + window.myurl + '/pressure/execute/' + this.jobdatalist[index].id)
        $.ajax({
          type: 'POST',
          async: true,
          url: window.myurl + '/pressure/execute/' + this.jobdatalist[index].id,
          dataType: 'json',
          success: (result) => {
            if (result.code === 200) {
              this.$Message.success('执行结束')
              this.jobdatalist[index].status = 'finished'
            } else {
              this.$Message.error('执行失败')
              this.jobdatalist[index].status = 'finished'
            }
            this.executeButton = false
          },
          error: (errorMsg) => {
            this.executeButton = false
            console.log(errorMsg)
          }
        })
      },
      getAll () {
        this.loading = true
        console.log('url: ' + window.myurl + '/pressure/getAll?pageNo=' + this.pageHelp.curPage + '&pageSize=' + this.pageHelp.pageSize)
        $.ajax({
          type: 'GET',
          async: true,
          url: window.myurl + '/pressure/getAll?pageNo=' + this.pageHelp.curPage + '&pageSize=' + this.pageHelp.pageSize,
          dataType: 'json',
          success: (result) => {
            this.jobdatalist = result.data.list
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
      searchBy () {
        this.loading = true
        console.log('url: ' + window.myurl + '/check/queryByCondition?page_num=' + this.pageHelp.curPage + '&page_size=' + this.pageHelp.pageSize + '&startTime=' + this.searchDate[0] + '&endTime=' + this.searchDate[1] + '&jobName=' + this.checkoduleName)
        $.ajax({
          type: 'GET',
          async: true,
          url: window.myurl + '/check/queryByCondition?page_num=' + this.pageHelp.curPage + '&page_size=' + this.pageHelp.pageSize + '&startTime=' + this.searchDate[0] + '&endTime=' + this.searchDate[1] + '&jobName=' + this.checkoduleName,
          dataType: 'json',
          success: (result) => {
            this.jobdatalist = result.pageInfo.list
            this.pageHelp.totalNum = result.pageInfo.total
            this.pageHelp.totalPageNum = result.pageInfo.pages
            this.monitorData.failCounts = result.failCounts
            this.monitorData.successCounts = result.successCounts
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
      }
    },
    mounted () {
    }
  }
</script>
