<template>
  <div>
    <row style="margin-top: -5px">
      <Card>
        <p slot="title">
          <Icon type="search"></Icon>
          搜索
        </p>
        <Form :model="formItem" :label-width="80">
          <FormItem label="文本" style="margin-left: -10px">
            <Input v-model="searchContent" placeholder="输入搜索内容" style="width: 200px; margin-left: 0px"></Input>
            <Button type="primary" @click="searchCase" :loading="searchLoading" style="margin-left: 10px">
              <Icon type="ios-search"></Icon>
              Search
            </Button>
            <Button type="primary" @click="addCaseClick" style="margin-left: 10px">
              <Icon type="ios-plus-empty"></Icon>
              新增
            </Button>
          </FormItem>
        </Form>
      </Card>
    </row>
    <row style="margin-top: 5px">
      <Card>
        <p slot="title">
          <Icon type="ios-list"></Icon>
          Task列表
        </p>
        <Table :loading="loading" :columns="caseTable" :data="caseTableData" :border="showBorder" no-data-text="没有数据"
               :stripe="showStripe" style="margin-top: -10px;margin-left: -10px" height="555"
               :show-header="showHeader" showIndex="true"></Table>
        <i-col span="14" offset="9" style="margin-top: 20px">
          <Page :total="pageHelp.totalNum" :current="pageHelp.curPage" :page-size="pageHelp.pageSize"
                @on-change="getPageIndex" @on-page-size-change="getPageSize"
                :page-size-opts="pageSizeOptions" size="small" show-elevator show-sizer show-total
                placement="top"></Page>
        </i-col>
        <br>
        <br>
        <br>
      </Card>
    </row>

    <!-- 添加case话框 -->
    <Modal
      :mask-closable="false"
      width="500"
      :title="titleText"
      :ok-text="okText"
      @on-ok="okbuttonClick"
      v-model="caseModal"
      :styles="{top: '20px'}">
      <Form :model="caseParam" :label-width="80">
        <FormItem label="任务名称">
          <Input v-model="caseParam.taskName" placeholder="请输入任务名称"></Input>
        </FormItem>
        <FormItem label="测试环境">
          <Select v-model="caseParam.environment" style="width:200px" @on-change="selectChange">
            <Option v-for="item in envlist" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>

    <!-- 历史详细记录 -->
    <Modal
      :mask-closable="false"
      width="1100"
      title="执行记录"
      ok-text="关闭"
      v-model="recordcaseModal"
      :styles="{top: '20px'}">
      <div>
        <Card>
          <p slot="title">
            <Icon type="ios-list"></Icon>
            用例列表
          </p>
          <Table :loading="recordloading" :columns="recordCaseTable" :data="recordCaseTableData" :border="showBorder"
                 no-data-text="没有数据"
                 :stripe="showStripe" style="margin-top: -10px;margin-left: -10px" height="555"
                 :show-header="showHeader" showIndex="true">
          </Table>
          <row>
            <i-col span="14" offset="9" style="margin-top: 20px">
              <Page :total="recordpageHelp.totalNum" :current="recordpageHelp.curPage"
                    :page-size="recordpageHelp.pageSize"
                    @on-change="getRecordPageIndex" @on-page-size-change="getRecordPageSize"
                    :page-size-opts="recordpageSizeOptions" size="small" show-elevator show-sizer show-total
                    placement="top"></Page>
            </i-col>
          </row>
          <br>
        </Card>
      </div>
    </Modal>

  </div>
</template>

<script>
  import $ from 'jquery'
  import Row from 'iview/src/components/grid/row'
  import expandRow from './table-expand-data.vue'
  import Monaco from 'monaco-editor-forvue'

  export default {
    components: {
      Row,
      expandRow,
      Monaco
    },
    data () {
      return {
        taskId: 0,
        intervalTmp: null,
        recordCaseTableData: [],
        recordCaseTable: [
          {
            type: 'expand',
            width: 50,
            render: (h, params) => {
              return h(expandRow, {
                props: {
                  row: params.row
                }
              })
            }
          },
          // {
          //   type: 'index',
          //   width: 50,
          //   align: 'center'
          // },
          {
            title: '用例名称',
            key: 'name',
            align: 'center',
            ellipsis: true,
            render: (h, params) => {
              return h('Poptip', {
                props: {
                  trigger: 'hover',
                  title: '',
                  placement: 'bottom'
                }
              }, [
                h('div', params.row.name),
                h('div', {
                  slot: 'content'
                }, [
                  h('div', params.row.name)
                ])
              ])
            }
          },
          {
            title: 'vadmode',
            key: 'vadmode',
            align: 'center'
          },
          {
            title: 'vendtimeout',
            key: 'vendtimeout',
            align: 'center'
          },
          {
            title: 'voicetrigger',
            key: 'voicetrigger',
            align: 'center'
          },
          {
            title: 'nonlp',
            key: 'nonlp',
            align: 'center'
          },
          {
            title: 'result',
            key: 'result',
            align: 'center'
          },
          {
            title: '创建时间',
            key: 'createTime',
            width: 150,
            align: 'center'
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            width: 100,
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
                    }
                  }
                }, '查看')
              ])
            }
          }
        ],
        recordloading: false,
        recordcaseModal: false,
        envlist: [
          {
            value: 'wss://apigwws-dev.open.rokid.com/api',
            label: 'dev'
          },
          {
            value: 'wss://apigwws.open.rokid.com/api',
            label: '线上'
          },
          {
            value: 'wss://apigwws-pre.open.rokid.com/api',
            label: 'pre'
          },
          {
            value: 'wss://apigwws-daily.open.rokid.com/api',
            label: 'daily'
          }
        ],
        upfileUrl: window.myurl + '/speech/case/upfile',
        caseModal: false,
        titleText: '添加任务',
        okText: '添加',
        editMaskClose: true,
        addMaskClose: true,
        editModal: false,
        formItem: {
          input: '',
          select: '',
          radio: 'male',
          checkbox: [],
          switch: true,
          textarea: ''
        },
        editLoading: false,
        addLoading: false,
        searchLoading: false,
        searchContent: '',
        addModal: false,
        caseParam: {
          id: null,
          taskName: '',
          environment: 'wss://apigwws-dev.open.rokid.com/api',
          createTime: null,
          status: '未执行',
          result: ''
        },
        pageSizeOptions: [10, 20, 30, 50, 100],
        recordpageSizeOptions: [10, 20, 30, 50, 100],
        pageHelp: {
          totalNum: 0,
          curPage: 1,
          pageSize: 10
        },
        recordpageHelp: {
          totalNum: 0,
          curPage: 1,
          pageSize: 10
        },
        recordcaseParam: {
          taskId: 0,
          id: null,
          name: '',
          desc: '',
          codec: 'pcm',
          lang: 'zh',
          vadmode: 'cloud',
          voicetrigger: '若琪',
          nonlp: 'true',
          result: '',
          expect: '',
          nointermediateasr: 'true',
          voiceextra: '',
          voicepower: '',
          createTime: null,
          environment: 'dev',
          fileurl: ''
        },
        loading: false,
        visible: false,
        showBorder: true,
        showStripe: true,
        showHeader: true,
        fixedHeader: true,
        caseTable: [
          {
            type: 'index',
            width: 50,
            align: 'center'
          },
          {
            title: '任务名称',
            key: 'name',
            align: 'center',
            ellipsis: true,
            render: (h, params) => {
              return h('Poptip', {
                props: {
                  trigger: 'hover',
                  title: '',
                  placement: 'bottom'
                }
              }, [
                h('div', params.row.taskName),
                h('div', {
                  slot: 'content'
                }, [
                  h('div', params.row.taskName)
                ])
              ])
            }
          },
          {
            title: '测试环境',
            key: 'environment',
            width: 260,
            align: 'center'
          },
          {
            title: 'status',
            width: 130,
            key: 'status',
            align: 'center',
            render: (h, params) => {
              const row = params.row
              var color = 'yellow'
              var text = '未执行'
              var type = 'primary'
              if (row.status === '1') {
                text = '执行中'
                color = 'blue'
                type = 'warning'
              }
              if (row.status === '2') {
                text = '已完成'
                color = 'green'
                type = 'success'
              }
              var cloading = false
              if (row.status === '1') {
                cloading = true
              }
              return h('Button', {
                props: {
                  type: type,
                  size: 'small',
                  color: color,
                  loading: cloading
                }
              }, text)
            }
          },
          {
            title: 'result',
            width: 100,
            key: 'result',
            align: 'center'
          },
          {
            title: '创建时间',
            key: 'createTime',
            width: 150,
            align: 'center'
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            width: 220,
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
                      this.caseModal = true
                      this.editModal = true
                      this.addModal = false
                      this.okText = '保存'
                      this.titleText = '编辑任务'
                      this.caseParam = Object.assign({}, this.caseTableData[params.index])
                    }
                  }
                }, '编辑'),
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
                      this.$Notice.success({
                        title: '任务开始执行。。。。',
                        desc: '任务执行一般需要几分钟时间，请耐心等待'
                      })
                      this.caseTableData[params.index].result = '0/0'
                      this.execute(params.index)
                    }
                  }
                }, '执行'),
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
                      this.recordcaseModal = true
                      this.taskId = this.caseTableData[params.index].id
                      this.$nextTick(() => {
                        this.getAllRecordCase(this.caseTableData[params.index].id)
                      })
                    }
                  }
                }, '详细'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.removeCase(params.index)
                    }
                  }
                }, '删除')
              ])
            }
          }
        ],
        caseTableData: []
      }
    },
    created () {
      this.getAllCaseList()
      this.intervalTmp = setInterval(() => {
        this.getAllCaseList()
      }, 5000)
    },
    methods: {
      selectChange (value) {
        // console.log(value)
        // console.log(this.caseParam.testEnv)
      },
      okbuttonClick () {
        if (this.addModal) {
          this.addCase()
        } else {
          this.editCase()
        }
      },
      execute (index) {
        this.caseTableData[index].status = '1'
        let url = window.myurl + '/speech/task/execute/' + this.caseTableData[index].id
        $.ajax({
          type: 'POST',
          async: true,
          url: url,
          contentType: 'application/json',
          dataType: 'json',
          success: (result) => {
            if (result.code === 200) {
              this.$Message.success('执行task成功')
              this.getAllCaseList()
            } else {
              this.$Message.error(result.message)
            }
            this.caseTableData[index].status = '2'
          },
          error: (errorMsg) => {
            this.caseTableData[index].status = '2'
            this.$Message.error(errorMsg.responseText)
            console.log(errorMsg)
          }
        })
      },
      removeCase (index) {
        let url = window.myurl + '/speech/task/delete/' + this.caseTableData[index].id
        $.ajax({
          type: 'DELETE',
          async: true,
          url: url,
          dataType: 'json',
          success: (result) => {
            this.loading = false
            if (result.code === 200) {
              this.$Message.success('删除成功')
              this.getAllCaseList()
            } else {
              this.$Message.error('删除失败')
            }
          },
          error: (errorMsg) => {
            this.$Message.success('删除失败')
            console.log(errorMsg)
          }
        })
      },
      resetParamForm () {
        this.caseParam = {
          id: null,
          taskName: '',
          environment: 'wss://apigwws-dev.open.rokid.com/api',
          createTime: null,
          status: '未执行',
          result: ''
        }
      },
      editCase () {
        let url = window.myurl + '/speech/task/edit/'
        $.ajax({
          type: 'PUT',
          async: true,
          url: url,
          contentType: 'application/json',
          data: JSON.stringify(this.caseParam),
          dataType: 'json',
          success: (result) => {
            if (result.code === 200) {
              this.$Message.success('更新成功')
              this.getAllCaseList()
            } else {
              this.$Message.error(result.message)
            }
          },
          error: (errorMsg) => {
            this.$Message.error(errorMsg)
            console.log(errorMsg)
          }
        })
      },
      addCase () {
        let url = window.myurl + '/speech/task/add'
        $.ajax({
          type: 'POST',
          async: true,
          url: url,
          contentType: 'application/json',
          data: JSON.stringify(this.caseParam),
          dataType: 'json',
          success: (result) => {
            if (result.code === 200) {
              this.$Message.success('添加成功')
              this.getAllCaseList()
            } else {
              this.$Message.error(result.message)
            }
          },
          error: (errorMsg) => {
            this.$Message.error(errorMsg)
            console.log(errorMsg)
          }
        })
      },
      addCaseClick () {
        this.caseModal = true
        this.editModal = false
        this.addModal = true
        this.okText = '添加'
        this.titleText = '添加任务'
        this.resetParamForm()
      },
      searchCase () {
        this.searchLoading = true
        let url = window.myurl + '/speech/task/get/all?pageSize=' + this.pageHelp.pageSize + '&pageNo=' + this.pageHelp.curPage + '&text=' + this.searchContent
        $.ajax({
          type: 'GET',
          async: true,
          url: url,
          dataType: 'json',
          success: (result) => {
            this.searchLoading = false
            if (result.code === 200) {
              this.pageHelp.totalNum = result.data.total
              this.caseTableData = result.data.list
            }
          },
          error: (errorMsg) => {
            this.searchLoading = false
            console.log(errorMsg)
          }
        })
      },
      getAllRecordCase (taskid) {
        this.recordloading = true
        let url = window.myurl + '/speech/get/' + taskid + '/recordcase/all?pageSize=' + this.recordpageHelp.pageSize + '&pageNo=' + this.recordpageHelp.curPage
        $.ajax({
          type: 'GET',
          async: true,
          url: url,
          dataType: 'json',
          success: (result) => {
            this.recordloading = false
            if (result.code === 200) {
              console.log(result)
              this.recordpageHelp.totalNum = result.data.total
              this.recordCaseTableData = result.data.list
            }
          },
          error: (errorMsg) => {
            this.recordloading = false
            console.log(errorMsg)
          }
        })
      },
      getAllCaseList () {
        this.loading = true
        let url = window.myurl + '/speech/task/get/all?pageSize=' + this.pageHelp.pageSize + '&pageNo=' + this.pageHelp.curPage
        $.ajax({
          type: 'GET',
          async: true,
          url: url,
          dataType: 'json',
          success: (result) => {
            this.loading = false
            if (result.code === 200) {
              this.pageHelp.totalNum = result.data.total
              this.caseTableData = result.data.list
            }
          },
          error: (errorMsg) => {
            this.loading = false
            console.log(errorMsg)
          }
        })
      },
      getPageIndex (pageIndex) {
        this.pageHelp.curPage = pageIndex
        this.getAllCaseList()
      },
      getPageSize (pageSize) {
        this.pageHelp.pageSize = pageSize
        this.getAllCaseList()
      },
      getRecordPageIndex (pageIndex) {
        this.recordpageHelp.curPage = pageIndex
        this.getAllRecordCase(this.taskId)
      },
      getRecordPageSize (pageSize) {
        this.recordpageHelp.pageSize = pageSize
        this.getAllRecordCase(this.taskId)
      }
    },
    mounted () {
      // this.intervalTmp = setInterval(() => {
      //   this.getAllCaseList()
      // }, 5000)
    },
    destroyed () {
      console.log('speech task destoryed.....')
      clearInterval(this.intervalTmp)
    }
  }
</script>

<style>
</style>
