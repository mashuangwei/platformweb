<template>
  <div>
    <row style="margin-top: -5px">
      <Card>
        <p slot="title">
          <Icon type="ios-plus-outline"></Icon>
          创建
        </p>
        <Form :model="formItem" :label-width="80">
          <FormItem label="">
            <Input v-model="searchContent" placeholder="输入搜索内容" style="width: 200px; margin-left: -30px"></Input>
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
          Case列表
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

    <!-- 评分对话框 -->
    <Modal
      :mask-closable="false"
      width="800"
      title="评分"
      okText="确定"
      v-model="addModal"
      :styles="{top: '20px'}">
    </Modal>
  </div>
</template>

<script>
  import $ from 'jquery'
  import Row from 'iview/src/components/grid/row'

  export default {
    components: {
      Row
    },
    data () {
      return {
        formItem: {
          input: '',
          select: '',
          radio: 'male',
          checkbox: [],
          switch: true,
          textarea: ''
        },
        searchLoading: false,
        searchContent: '',
        addModal: false,
        caseParam: {
          id: 0,
          task_id: 0,
          status: 0,
          index: 1,
          text: '',
          note: '',
          param: ''
        },
        pageSizeOptions: [10, 20, 30, 50, 100],
        pageHelp: {
          totalNum: 0,
          curPage: 1,
          pageSize: 10
        },
        loading: false,
        visible: false,
        showBorder: true,
        showStripe: true,
        showHeader: true,
        fixedHeader: true,
        editModal: false,
        caseTable: [
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '名称',
            key: 'name',
            align: 'center'
          },
          {
            title: '描述',
            key: 'desc',
            align: 'center'
          },
          {
            title: '请求类型',
            key: 'type',
            align: 'center',
            render: (h, params) => {
              const row = params.row
              const color = row.status === 0 ? 'blue' : 'green'
              const text = row.status === 0 ? '未完成' : '已完成'
              return h('Tag', {
                props: {
                  type: 'dot',
                  color: color
                }
              }, text)
            }
          },
          {
            title: '创建时间',
            key: 'createTime',
            align: 'center'
          },
          {
            title: '更新时间',
            key: 'updateTime',
            align: 'center'
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            width: 230,
            render: (h, params) => {
              return h('div', [
                // h('Button', {
                //   props: {
                //     type: 'primary',
                //     size: 'small'
                //   },
                //   style: {
                //     marginRight: '7px'
                //   },
                //   on: {
                //     click: () => {
                //       // this.mosTaskParam = Object.assign({}, this.editMosTaskParam, this.mosTaskData[params.index])
                //       // this.editModal = true
                //       this.reportModal = true
                //     }
                //   }
                // }, '报告'),
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
                      this.addModal = true
                      // this.getAllCaseList(params.index)
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
                      this.addModal = true
                      // this.getAllCaseList(params.index)
                    }
                  }
                }, '查看'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      // this.removeTask(params.index)
                    }
                  }
                }, '删除')
              ])
            }
          }
        ],
        caseTableData: [
          {
            name: 'httpgw1',
            desc: '服务器A',
            type: 'prptobuf',
            createTime: '2018-01-19 14:56:23',
            updateTime: '2018-01-20 19:01-36'
          }
        ]
      }
    },
    created () {
      // this.getAllCaseList()
    },
    methods: {
      addCaseClick () {
        this.addModal = true
      },
      searchCase () {},
      getAllCaseList (index) {
        let url = window.myurl + '/mos/getAllCase/'
        $.ajax({
          type: 'GET',
          async: true,
          url: url,
          dataType: 'json',
          success: (result) => {
            if (result.data.length > 0) {
              return
            }
            this.$Message.info('')
          },
          error: (errorMsg) => {
            console.log(errorMsg)
          }
        })
      },
      getPageIndex (pageIndex) {
        this.pageHelp.curPage = pageIndex
      },
      getPageSize (pageSize) {
        this.pageHelp.pageSize = pageSize
      }
    }
  }
</script>

<style>
</style>
