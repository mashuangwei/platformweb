<template>
  <div>
    <Row>
      <i-col span="2">
        <Button type="primary" @click="editmodal = true" style="margin-bottom:15px;">新增</Button>
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
      <Table :columns="columns7" :data="apiCaselist" height="580" :border="showBorder" :stripe="showStripe"
             :show-header="showHeader" :showIndex="true"></Table>
    </row>
    <br>
    <row>
      <i-col span="19" offset="4">
          <Page :total="100" size="small" show-elevator show-sizer show-total placement="top"></Page>
      </i-col>
    </row>
    <!-- case列表页面表格 -->
    <Modal
      @on-ok="addOrSaveApiCase"
      @on-cancel="addApiCancel"
      :mask-closable="false"
      width="800"
      title="新增用例"
      :okText=okButtonText
      v-model="editmodal"
      :styles="{top: '20px'}">
      <row>
        <i-col span="4" offset="1">
          <div style="line-height: 32px;"><label>用例名称：</label></div>
        </i-col>
        <i-col span="3" offset="1">
          <div>
            <Input v-model="newCase.name" placeholder="请输入..." style="width: 200px"></Input>
          </div>
        </i-col>
      </row>
      <br>
      <row>
        <i-col span="4" offset="1">
          <div style="line-height: 32px;"><label>http请求方式：</label></div>
        </i-col>
        <i-col span="3" offset="1">
          <Select v-model="newCase.httpType" style="width:200px" @on-change="selectEvent">
            <Option v-for="item in httpTypeList" :value="item.value" :key="item"></Option>
          </Select>
        </i-col>
      </row>
      <br/>
      <row>
        <i-col span="4" offset="1">
          <div style="line-height: 32px;"><label>接口名称：</label></div>
        </i-col>
        <i-col span="3" offset="1">
          <div>
            <Input v-model="newCase.apiName" placeholder="请输入..." style="width: 200px"></Input>
          </div>
        </i-col>
      </row>

      <div class="border-bt editor-wrap">
      </div>

      <row>
        <i-col span="3">
          <div
            style="margin-top: 10px; margin-bottom:10px; font-family:Helvetica Neue; font-size: 15px;font-weight: bold; color: rgb(70, 76, 91);">
            <label>Param参数</label>
          </div>
        </i-col>
        <i-col span="2" offset="17">
          <div>
            <Button type="primary" @click="parameditmodal = true" style="margin-bottom:6px; margin-top: 10px">
              新增
            </Button>
          </div>
        </i-col>
      </row>
      <row>
        <Table border :columns="paramsUrl" :data="paramsUrllist"></Table>
      </row>

      <div class="border-bt editor-wrap" v-show="editJsonComponentShow">
      </div>


      <div v-show="editJsonComponentShow"
           style="margin-top: 10px; margin-bottom:10px; font-family:Helvetica Neue; font-size: 15px;font-weight: bold; color: rgb(70, 76, 91);">
        <label>Json参数</label>
      </div>
      <div v-show="editJsonComponentShow">
        <editor id="j_intentEditor" :content="editorInitJson" :height="'150px'" :width="'100%'"
                :lang="'javascript'" :sync="true"></editor>
      </div>
    </Modal>
    <!-- 添加用例model页面 -->
    <Modal
      @on-ok="addParamValue"
      :mask-closable="false"
      width="400"
      title="新增参数"
      v-model="parameditmodal"
      :styles="{top: '20px'}">
      <row>
        <i-col span="4" offset="1">
          <div style="line-height: 32px;"><label>参数名称：</label></div>
        </i-col>
        <i-col span="3" offset="1">
          <div>
            <Input v-model="newParamsValue.paramName" placeholder="请输入..." style="width: 200px"></Input>
          </div>
        </i-col>
      </row>
      <br>
      <row>
        <i-col span="4" offset="1">
          <div style="line-height: 32px;"><label>参数值：</label></div>
        </i-col>
        <i-col span="3" offset="1">
          <div>
            <Input v-model="newParamsValue.paramValue" placeholder="请输入..." style="width: 200px"></Input>
          </div>
        </i-col>
      </row>
    </Modal>
  </div>


</template>

<script>
  import ICol from '../../../node_modules/iview/src/components/grid/col'
  import Row from '../../../node_modules/iview/src/components/grid/row.vue'
  import editor from 'vue2-ace-editor-new'
  import 'brace/mode/javascript'
  import 'brace/theme/chrome'

  export default {
    components: {
      Row,
      ICol,
      editor,
      'name': 'content'
    },
    name: 'home',
    data () {
      return {
        editJsonComponentShow: false,
        editorInitJson: JSON.stringify({'a': 1, 'b': 2}, null, '\t'),
        editorJson: '',
        showBorder: true,
        showStripe: true,
        showHeader: true,
        fixedHeader: true,
        editAndAddFlag: true,
        okButtonText: '添加',
        httpTypeList: [
          {
            value: 'get'
          },
          {
            value: 'post'
          },
          {
            value: 'put'
          },
          {
            value: 'delete'
          }
        ],
        newCase: {
          name: '',
          apiName: '',
          httpType: 'get',
          result: '',
          cellClassName: {}
        },
        newParamsValue: {
          paramName: '',
          paramValue: ''
        },
        editmodal: false,
        parameditmodal: false,
        value4: '',
        searchStr: '',
        paramsUrl: [
          {
            type: 'index',
            width: 60
          },
          {
            title: '参数名称',
            key: 'paramName'
          },
          {
            title: '参数值',
            key: 'paramValue'
          },
          {
            title: '操作',
            key: 'action',
            width: 190,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.editParams(params.index)
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
                      this.removeParamValue(params.index)
                    }
                  }
                }, '删除')
              ])
            }
          }
        ],
        columns7: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '用例名称',
            key: 'name'
          },
          {
            title: '接口',
            key: 'apiName'
          },
          {
            title: 'http请求方式',
            key: 'httpType',
            width: 120
          },
          {
            title: '执行结果',
            width: 120,
            key: 'result'
          },
          {
            title: '作者',
            width: 120,
            key: 'author',
            render: (h, params) => {
              return h('div', [
                h('Icon', {
                  props: {
                    type: 'person'
                  }
                }),
                h('strong', params.row.name)
              ])
            }
          },
          {
            title: '操作',
            key: 'action',
            width: 270,
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
                      this.editCaseModel(params.index)
//                      this.show(params.index)
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
                      this.remove(params.index)
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
                      this.remove(params.index)
                    }
                  }
                }, '执行')
              ])
            }
          }
        ],
        apiCaselist: [],
        paramsUrllist: [
          {
            'paramName': 'appid',
            'paramValue': '12345'
          },
          {
            'paramName': 'domainid',
            'paramValue': '333333'
          }
        ]
      }
    },
    mounted () {
//      var vm = this
//      vm.$parent.$emit('editor-update', editor.getValue(), vm)
      this.$on('editor-update', this.onEditIntents)
    },
    created () {
      this.getCase()
    },
    methods: {
      onEditIntents (content, vm) {
        // intent 编辑器
        if (vm.$el.id === 'j_intentEditor') {
          this.editorJson = content
        }
      },
      selectEvent () {
        if (this.newCase.httpType === 'get' || this.newCase.httpType === 'delete') {
          this.editJsonComponentShow = false
        } else {
          this.editJsonComponentShow = true
        }
      },
      editCaseModel (index) {
        this.editmodal = true
        this.editAndAddFlag = false
        this.okButtonText = '保存'
        this.newCase.name = this.apiCaselist[index].name
        this.newCase.httpType = this.apiCaselist[index].httpType
        this.newCase.apiName = this.apiCaselist[index].apiName
      },
      editParams (index) {
        this.$Modal.info({
          title: '用户信息',
          content: `参数名称：${this.paramsUrllist[index].paramName}<br>参数值：${this.paramsUrllist[index].paramValue}<br>`
        })
      },
      show (index) {
        this.$Modal.info({
          title: '用户信息',
          content: `用例名称：${this.apiCaselist[index].name}<br>http请求方式：${this.apiCaselist[index].httpType}<br>执行结果：${this.apiCaselist[index].result}`
        })
      },
      remove (index) {
        this.apiCaselist.splice(index, 1)
      },
      removeParamValue (index) {
        this.paramsUrllist.splice(index, 1)
      },
      addOrSaveApiCase () {
        if (this.editAndAddFlag) {
          this.newCase.cellClassName = {result: 'table-info-cell-result-success'}
          this.newCase.result = 'success'
          this.apiCaselist.push(this.newCase)
        } else {
          console.log(1)
        }
        this.editAndAddFlag = true
        this.okButtonText = '添加'
        this.newCase = {name: '', httpType: 'get', result: '', apiName: '', cellClassName: {}}
      },
      addApiCancel () {
        this.editAndAddFlag = false
        this.okButtonText = '添加'
        this.newCase = {name: '', httpType: 'get', result: '', apiName: '', cellClassName: {}}
      },
      addParamValue () {
        this.paramsUrllist.push(this.newParamsValue)
        this.newParamsValue = {paramName: '', paramValue: ''}
      },
      getCase () {
        fetch('http://localhost:10000/info', {
          method: 'POST',
          body: JSON.stringify({
            name: this.searchStr
          }),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }).then((res) => {
          res.json().then((json) => {
            this.apiCaselist = json
//            console.log(json[0])
//            console.log(this.searchStr)
          })
        }).catch((e) => {
          e.toString()
        })
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

  .layout {
    border: 1px solid #d7dde4;
    background: #f5f7f9;
  }

  .layout-logo {
    width: 100px;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
  }

  .layout-nav {
    width: 420px;
    margin: 0 auto;
  }

  .layout-assistant {
    width: 300px;
    margin: 0 auto;
    height: inherit;
  }

  .layout-breadcrumb {
    padding: 10px 15px 0;
  }

  .layout-content {
    height: 710px;
    min-height: 710px;
    padding: 1px;
    overflow: hidden;
    background: #fff;
    border-radius: 4px;
  }

  .layout-content-main {
    padding: 10px;
    font-family: "Helvetica Neue";
    font-size: 16px;
    color: #3399ff;
  }

  .layout-copy {
    text-align: center;
    padding: 10px 0 20px;
    color: #9ea7b4;
    text-align: left;
  }

  .layout {

    .layout-nav {
      margin: 0;
    }

    .ivu-row {
      height: 100%;
    }

    .ivu-col-span-4 {
      height: 100%;
    }

    .layout-content .ivu-menu {
      height: 100%;
    }

  }
</style>
