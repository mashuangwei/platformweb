<template>
  <div>
    <Row style="margin-bottom:15px;margin-top: 10px">
      <i-col span="2" offset="0" style="font-size: 12px; color: #495060;">
        <div style="line-height: 32px;"><label>日期时间：</label></div>
      </i-col>
      <i-col span="2" offset="0" style="font-size: 12px; color: #495060;">
        <div>
          <DatePicker type="datetimerange" placeholder="请选择日期时间" style="width: 300px"
                      @on-change="dateChange"></DatePicker>
        </div>
      </i-col>
      <i-col span="3" offset="5">
        <Input v-model="deviceid" placeholder="请输入deviceid"
               style="width: 200px"></Input>
      </i-col>
      <i-col span="1" offset="2">
        <Button type="primary" icon="ios-search" @click="searchByDateAndDeviceid">搜索</Button>
      </i-col>
    </Row>

    <br>
    <row>
      <Table :columns="column" :data="data" :border="showBorder" :loading="loading" :height="660"
             :stripe="showStripe"
             :show-header="showHeader" :showIndex="true" :no-data-text="nodataContent"></Table>
    </row>
    <br>
    <!-- 分页 -->
    <row>
      <i-col span="14" offset="8" style="font-size: 12px; color: #495060;">
        <Page :total="pageHelp.totalNum" show-elevator show-sizer show-total placement="top" :current="pageHelp.curPage"
              :page-size="pageHelp.pageSize" @on-change="pageChange" @on-page-size-change="sizeChange"
              :page-size-opts="pageSizeOptions"></Page>
      </i-col>
    </row>
  </div>
</template>

<script>
  import audio from './audio.vue'
  import $ from 'jquery'

  var today = new Date()

  function subDate (date) {
    var d = new Date(date)
    d.setDate(d.getDate())
    var m = ('0' + (d.getMonth() + 1)).slice(-2)
    return d.getFullYear() + '-' + m + '-' + d.getDate() + '-00:00:00'
  }

  function addDate (date) {
    var d = new Date(date)
    d.setDate(d.getDate())
    var m = ('0' + (d.getMonth() + 1)).slice(-2)
    return d.getFullYear() + '-' + m + '-' + d.getDate() + '-23:59:59'
  }

  export default {
    data () {
      return {
        loading: false,
        searchDate: [],
        nodataContent: '暂无数据',
        pageSizeOptions: [15, 30, 50, 100],
        showBorder: true,
        showStripe: true,
        showHeader: true,
        pageHelp: {
          totalNum: 0,
          curPage: 1,
          pageSize: 15
        },
        column: [
          {
            title: '时间',
            key: 'asrtime',
            align: 'center'
          },
          {
            title: 'deviceId',
            key: 'asrdeviceid',
            align: 'center'
          },
          {
            title: 'asr',
            key: 'asr',
            align: 'center'
          },
          {
            title: 'OPU文件',
            key: 'codecfile',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    icon: 'ios-cloud-download-outline',
                    size: 'small'
                  },
                  style: {
                    marginRight: '7px'
                  },
                  on: {
                    click: () => {
                      window.open('http://openrokid:50003/asrlog/' + params.row.asrthedate + '/' + params.row.codecfile)
                    }
                  }
                }, '下载')
              ])
            }
          },
          {
            title: '语音文件',
            key: 'wavfile',
            align: 'center',
            render (h, data) {
              return h(audio, {
                props: {
                  src: 'http://openrokid:50003/asrlog/' + data.row.asrthedate + '/' + data.row.wavfile,
                  name: 'wav文件'
                }
              })
            }
          }
        ],
        data: [],
        deviceid: '',
        startDate: subDate(today),
        endDate: addDate(today)
      }
    },
    created () {
      this.getListData('', 1, this.pageHelp.pageSize, this.startDate, this.endDate)
    },
    methods: {
      dateChange (date) {
        this.startDate = date[0].toString().replace(' ', '-')
        this.endDate = date[1].toString().replace(' ', '-')
      },
      searchByDateAndDeviceid () {
        this.getListData(this.deviceid, this.pageHelp.curPage, this.pageHelp.pageSize, this.startDate, this.endDate)
      },
      getListData (deviceid, pageNo, pageSize, startDate, endDate) {
        this.loading = true
        var url = window.opboss + '/opboss/getmongodata/?deviceid=' + this.deviceid + '&page=' + pageNo + '&size=' + pageSize + '&startdate=' + startDate + '&enddate=' + endDate
        $.ajax({
          type: 'GET',
          async: true,
          url: url,
          dataType: 'json',
          success: (result) => {
            this.data = result.data
            this.pageHelp.totalNum = result.count
            this.loading = false
            console.log('success')
          },
          error: (errorMsg) => {
            console.log(errorMsg)
          }
        })
      },
      search () {
        this.getListData(this.deviceid, this.pageHelp.curPage, this.pageHelp.pageSize, this.startDate, this.endDate)
      },
      pageChange (curPage) {
        this.pageHelp.curPage = curPage
        this.getListData(this.deviceid, curPage, this.pageHelp.pageSize, this.startDate, this.endDate)
      },
      sizeChange (pageSize) {
        this.pageHelp.pageSize = pageSize
        this.getListData(this.deviceid, this.pageHelp.curPage, pageSize, this.startDate, this.endDate)
      }
    }
  }
</script>


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
