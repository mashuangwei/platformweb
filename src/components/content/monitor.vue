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
    <Row style="margin-bottom:15px;margin-top: 10px">
      <i-col span="2" offset="0">
        <div style="margin-top: 5px"><label style="color: black">监控项：</label></div>
      </i-col>
      <i-col span="1" offset="0">
        <div>
          <Select v-model="checkoduleName" style="width:160px" @on-change="selectCheckModule">
            <Option v-for="(item, idx) in checkModuleList" :value="item" :key="idx"></Option>
          </Select>
        </div>
      </i-col>

      <i-col l span="4" offset="3" style="font-size: 12px; color: #495060;">
        <DatePicker type="daterange" :options="options2" placement="bottom-end" placeholder="请选择日期" style="width: 200px" @on-change="dateChange"></DatePicker>
      </i-col >

      <!--<i-col span="3" offset="0">-->
        <!--<Input v-model="searchStr" icon="ios-search-strong" placeholder="请输入..."-->
               <!--style="width: 200px"></Input>-->
      <!--</i-col>-->
      <i-col span="1" offset="0">
        <Button type="primary" icon="ios-search" @click="searchBy">搜索</Button>
      </i-col>
    </Row>
    <row>
      <i-col span="3" offset="0">
        <div style="font-size: 12px; color: #495060;"><label>总数：{{monitorData.successCounts + monitorData.failCounts}}</label></div>
      </i-col>
      <i-col span="3" offset="0">
        <div style="font-size: 12px; color: #495060;"><label>success：{{monitorData.successCounts}}</label></div>
      </i-col>
      <i-col span="3" offset="0">
        <div style="font-size: 12px; color: #495060;"><label>fail：{{monitorData.failCounts}}</label></div>
      </i-col>
    </row>
    <!--<div class="border-bt editor-wrap" v-show="true">-->
    <!--</div>-->
    <br>
    <row>
      <Table :columns="jobtable" :data="jobdatalist" height="640" :border="showBorder" :loading="loading"
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
        monitorData: {
          successCounts: 0,
          failCounts: 0,
          data: null
        },
        searchDate: [],
        options2: {
          shortcuts: [
            {
              text: 'A week',
              value: () => {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                return [start, end]
              }
            },
            {
              text: 'A month',
              value: () => {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                return [start, end]
              }
            },
            {
              text: '3 month',
              value: () => {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                return [start, end]
              }
            },
            {
              onClick: () => {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                return [start, end]
              }
            }
          ]
        },
        searchStr: '',
        checkoduleName: '',
        checkModuleList: ['All', 'dev环境离线编译', '线上环境离线编译'],
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
            title: 'Job',
            width: 230,
            key: 'jobName',
            align: 'center'
          },
          {
            title: '状态',
            width: 170,
            key: 'result',
            align: 'center'
          },
          {
            title: '结果描述',
            width: 700,
            key: 'description',
            align: 'center'
          },
          {
            title: '测试时间',
            width: 194,
            key: 'createTime',
            align: 'center'
          }
        ]
      }
    },
    created () {
      this.getAllCheckResult()
    },
    methods: {
      handleSuccess (res, file, fileList) {
        this.uploadShowFlag = false
      },
      dateChange (newDate) {
        console.log('newDate: ', newDate)
        this.searchDate = newDate
      },
      selectCheckModule () {
        console.log('module: ' + this.checkoduleName)
      },
      selectCheckType () {
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
      getAllCheckResult () {
        this.loading = true
        $.ajax({
          type: 'GET',
          async: true,
          url: window.myurl + '/check/query?page_num=1&page_size=15',
          dataType: 'json',
          success: (result) => {
            this.jobdatalist = result.list
            this.pageHelp.totalNum = result.total
            this.pageHelp.totalPageNum = result.pages
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
          url: window.myurl + '/check/query?page_num=' + this.pageHelp.curPage + '&page_size=' + this.pageHelp.pageSize,
          dataType: 'json',
          success: (result) => {
            this.jobdatalist = result.list
            this.pageHelp.totalNum = result.total
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
