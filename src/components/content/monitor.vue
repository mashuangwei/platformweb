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
        <Button type="primary" @click="addTemplate" style="margin-bottom:15px;">新增Job</Button>
      </i-col>
      <i-col span="3" offset="12">
        <Input v-model="condition" icon="ios-search-strong" placeholder="请输入..."
               style="width: 200px"></Input>
      </i-col>
      <i-col span="1" offset="2">
        <Button type="primary" icon="ios-search" @click="searchBy">搜索</Button>
      </i-col>
    </Row>

    <row>
      <Table :columns="jobtable" :data="jobdatalist"  height="690" :border="showBorder" :loading="loading"
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
            width: 470,
            key: 'description',
            align: 'center'
          },
          {
            title: '测试时间',
            width: 180,
            key: 'createTime',
            align: 'center'
          },
          {
            title: '操作',
            key: 'action',
            width: 250,
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
                  on: {
                    click: () => {
//                      this.removeTemplate(params.index)
                    }
                  }
                }, '删除')
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
      handleSuccess (res, file, fileList) {
        this.uploadShowFlag = false
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
      },
      drawGraph () {
        $.ajax({
          type: 'GET',
          async: true,
          url: window.myurl + '/check/query?page_num=1&page_size=60',
          dataType: 'json',
          success: (result) => {
            this.jobdatalist = result.list
          },
          error: function (errorMsg) {
            console.log(errorMsg)
          }
        })
      }
    },
    mounted () {
    }
  }
</script>
