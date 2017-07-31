<style scoped>
  .content {
    /*自行添加样式即可*/
  }

  #main {
    height: 400px;
  }
</style>
<template>
  <div>
    <Row>
      <i-col span="2">
        <Button type="primary" @click="addPlatformCase" style="margin-bottom:15px;">新增</Button>
      </i-col>
      <i-col span="3" offset="15">
        <Input v-model="searchStr" icon="ios-search-strong" placeholder="请输入..."
               style="width: 200px"></Input>
      </i-col>
      <i-col span="1" offset="2">
        <Button type="primary" icon="ios-search" @click="getCase">搜索</Button>
      </i-col>
    </Row>

    <row>
      <Table :columns="casetable" :data="casedata" width="1370" height="590" :border="showBorder" :stripe="showStripe"
             :show-header="showHeader" :showIndex="true"></Table>
    </row>
    <br>
    <!-- 分页 -->
    <row>
      <i-col span="14" offset="10">
        <Page :total="100" size="small" show-elevator show-sizer show-total placement="top"></Page>
      </i-col>
    </row>
  </div>
</template>
<script>
  import $ from 'jquery'

  export default {
    data () {
      return {
        showBorder: true,
        showStripe: true,
        showHeader: true,
        fixedHeader: true,
        searchStr: '',
        addcase: {
          name: '',
          ttstext: '',
          deviceId: '',
          deviceTypeId: '',
          authkey: null,
          version: '1.0',
          asrlanguage: 'zh',
          url: '',
          codec: '',
          secret: '',
          createtime: '1.0',
          result: '',
          cellClassName: {}
        },
        casetable: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '用例名称',
            width: 310,
            key: 'name',
            align: 'center'
          },
          {
            title: '用例描述',
            width: 230,
            key: 'description',
            align: 'center'
          },
          {
            title: '接口名称',
            width: 150,
            key: 'apiname',
            align: 'center'
          },
          {
            title: '创建时间',
            width: 155,
            key: 'createtime',
            align: 'center'
          },
          {
            title: '更新时间',
            width: 155,
            key: 'updatetime',
            align: 'center'
          },
          {
            title: '执行结果',
            width: 120,
            key: 'result',
            align: 'center'
          },
          {
            title: '操作',
            key: 'action',
            width: 220,
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
                      this.preCaseAddFlag = true
                      this.caseModelWidth = 1000
                      this.editCase(params.index)
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
                      this.removeCase(params.index)
                    }
                  }
                }, '删除'),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginLeft: '7px'
                  },
                  on: {
                    click: () => {
                      this.executeCase(params.index)
                    }
                  }
                }, '执行')
              ])
            }
          }
        ],
        casedata: [],


      }
    },
    methods: {
      editCase (index) {
        this.index = index
        this.casemodeltitle = '编辑用例'
        this.okButtonText = '保存'
        this.addcasemodal = true
        this.addCaseButtunFlag = false
        this.addcase.name = this.casedata[index].name
        this.addcase.description = this.casedata[index].description
        this.addcase.apiname = this.casedata[index].apiname
        this.addcase.platform = this.casedata[index].platform
      },
      addPlatformCase () {
        this.caseModelWidth = 800
        this.casemodeltitle = '添加用例'
        this.addcasemodal = true
        this.addCaseButtunFlag = true
        this.okButtonText = '添加'
      },
      removeCase (index) {
        this.casedata.splice(index, 1)
      },
      addOrSaveCaseEvent () {
        if (this.addCaseButtunFlag) {
          this.addcase.createtime = this.getDateTime()
          this.addcase.updatetime = this.getDateTime()
          this.addcase.cellClassName = {result: 'table-info-cell-result-success'}
          this.casedata.push(this.addcase)
        } else {
          this.casedata[this.index].name = this.addcase.name
          this.casedata[this.index].description = this.addcase.description
          this.casedata[this.index].apiname = this.addcase.apiname
          this.casedata[this.index].updatetime = this.getDateTime()
        }
        this.addcase = {name: '', description: '', result: '', apiName: '', cellClassName: {}}
      },
      addCaseCancelEvent () {
        this.addcase = {name: '', description: '', result: '', apiName: '', cellClassName: {}}
      },
      drawGraph () {
        $.ajax({
          type: 'GET',
          async: true,
          url: 'xxx',
          dataType: 'json',
          success: function (result) {
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

