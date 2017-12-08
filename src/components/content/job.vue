<style lang="less" rel="stylesheet/less">
  .vertical-center-modal {
    display: flex;
    align-items: center;
    justify-content: center;
    .ivu-modal {
      top: 0;
    }
  }

  .ivu-radio-wrapper {
    padding-top: 6px;
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
    <Row>
      <i-col span="2">
        <Button type="primary" @click="addScheduleJob" style="margin-bottom:15px;">新增</Button>
      </i-col>
      <i-col span="3" offset="15">
        <Input v-model="searchStr" icon="ios-search-strong" placeholder="请输入..."
               style="width: 200px"></Input>
      </i-col>
      <i-col span="1" offset="2">
        <Button type="primary" icon="ios-search" @click="searchJob">搜索</Button>
      </i-col>
    </Row>

    <row>
      <Table :columns="jobtable" :data="jobdatalist" height="690" :border="showBorder" :loading="loading"
             :stripe="showStripe"
             :show-header="showHeader" :showIndex="true" :no-data-text="nodataContent"></Table>
    </row>
    <br>
    <!-- 分页 -->
    <row>
      <i-col span="14" offset="8">
        <Page :total="pageHelp.totalNum" show-elevator show-sizer show-total placement="top" :current="pageHelp.curPage"
              :page-size="pageHelp.pageSize" @on-change="getPageIndex" @on-page-size-change="getPageSize"
              :page-size-opts="pageSizeOptions"></Page>
      </i-col>
    </row>

  </div>
</template>
<script>
  import $ from 'jquery'
  import { Col, Row } from 'iview'

  export default {
    components: {
      Row,
      'i-col': Col,
      'name': 'skillcheck'
    },
    data () {
      return {
        searchStr: '',
        checkoduleName: '',
        classlist: [],
        pageHelp: {
          totalNum: 0,
          curPage: 1,
          pageSize: 15
        },
        nodataContent: '暂无数据',
        pageSizeOptions: [15, 30, 50, 100],
        showBorder: true,
        showStripe: true,
        showHeader: true,
        jobdatalist: [],
        jobtable: [
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: 'JobName',
            width: 300,
            key: 'job_NAME',
            align: 'center'
          },
          {
            title: 'JobGroup',
            width: 200,
            key: 'job_GROUP',
            align: 'center'
          },
          {
            title: 'JobClassName',
            width: 300,
            key: 'job_CLASS_NAME',
            align: 'center'
          },
          {
            title: 'cron_EXPRESSION',
            width: 200,
            key: 'cron_EXPRESSION',
            align: 'center'
          },
          {
            title: '操作',
            key: 'action',
            width: 300,
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
//                      this.editTemplate(params.index)
                    }
                  }
                }, '编辑'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  style: {
                    marginRight: '7px'
                  },
                  on: {
                    click: () => {
                      this.deleteJob(params.index)
                    }
                  }
                }, '删除'),
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
                      this.pauseJob(params.index)
                    }
                  }
                }, '暂停'),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.resumeJob(params.index)
                    }
                  }
                }, '恢复')
              ])
            }
          }
        ]
      }
    },
    created () {
      this.getAllCheckResult()
    },
    methods: {
      deleteJob (index) {
        $.ajax({
          type: 'POST',
          async: true,
          data: 'jobClassName=' + this.jobdatalist[index].job_NAME + '&jobGroupName=' + this.jobdatalist[index].job_GROUP,
          url: window.myurl + '/job/delete',
//          dataType: 'json',
          success: (result) => {
            console.log(11111)
            this.getAllCheckResult()
            console.log(result.toString())
          },
          error: (errorMsg) => {
            console.log(errorMsg)
          }
        })
      },
      pauseJob (index) {
        $.ajax({
          type: 'POST',
          async: true,
          data: 'jobClassName=' + this.jobdatalist[index].job_NAME + '&jobGroupName=' + this.jobdatalist[index].job_GROUP,
          url: window.myurl + '/job/pause',
//          dataType: 'json',
          success: (result) => {
            console.log(result)
          },
          error: function (errorMsg) {
            console.log(errorMsg)
          }
        })
      },
      resumeJob (index) {
        $.ajax({
          type: 'POST',
          async: true,
          data: 'jobClassName=' + this.jobdatalist[index].job_NAME + '&jobGroupName=' + this.jobdatalist[index].job_GROUP,
          url: window.myurl + '/job/resume',
//          dataType: 'json',
          success: (result) => {
            console.log(result)
          },
          error: function (errorMsg) {
            console.log(errorMsg)
          }
        })
      },
      handleSuccess (res, file, fileList) {
        this.uploadShowFlag = false
      },
      addScheduleJob () {},
      searchJob () {},
      selectCheckModule () {
        console.log('module: ' + this.checkoduleName)
      },
      selectCheckType () {
      },
      searchBy () {
      },
      getAllCheckResult () {
        this.loading = true
        $.ajax({
          type: 'GET',
          async: true,
          url: window.myurl + '/job/query?pageNum=1&pageSize=15',
          dataType: 'json',
          success: (result) => {
            this.$set(this.jobdatalist, result.JobAndTrigger.list)
            this.jobdatalist = result.JobAndTrigger.list
            this.pageHelp.totalNum = result.JobAndTrigger.total
            this.pageHelp.totalPageNum = result.JobAndTrigger.pages
            this.loading = false
          },
          error: function (errorMsg) {
            console.log(errorMsg)
          }
        })
      },
      getPageIndex (pageIndex) {
        this.pageHelp.curPage = pageIndex
        this.loading = true
        $.ajax({
          type: 'GET',
          async: true,
          url: window.myurl + '/job/query?pageNum=' + this.pageHelp.curPage + '&pageSize=' + this.pageHelp.pageSize,
          dataType: 'json',
          success: (result) => {
            this.jobdatalist = result.JobAndTrigger.list
            this.pageHelp.totalNum = result.JobAndTrigger.total
            this.loading = false
          },
          error: function (errorMsg) {
            console.log(errorMsg)
          }
        })
      },
      getPageSize (pageSize) {
        this.pageHelp.pageSize = pageSize
      }
    },
    mounted () {
    }
  }
</script>
