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
      <Table :loading="loading" :columns="casetable" :data="casedata" width="1370" height="690" :border="showBorder"
             :stripe="showStripe"
             :show-header="showHeader" :showIndex="true"></Table>
    </row>
    <br>
    <!-- 分页 -->
    <row>
      <i-col span="14" offset="10">
        <Page :total="100" size="small" show-elevator show-sizer show-total placement="top"></Page>
      </i-col>
    </row>

    <!-- case新增页面 -->
    <Modal
      @on-ok="addOrSaveCaseEvent"
      @on-cancel="addCaseCancelEvent"
      :mask-closable="false"
      :width="caseModelWidth"
      :title=casemodeltitle
      :okText=okButtonText
      v-model="addcasemodal"
      :styles="{top: '20px'}">
      <row>
        <i-col span="2" offset="0">
          <div style="line-height: 32px;"><label>用例名称：</label></div>
        </i-col>
        <i-col span="3" offset="1">
          <div>
            <Input v-model="addcase.name" placeholder="请输入..." style="width: 420px"></Input>
          </div>
        </i-col>
      </row>
      <br>
      <row>
        <i-col span="2" offset="0">
          <div style="line-height: 32px;"><label>用例描述：</label></div>
        </i-col>
        <i-col span="3" offset="1">
          <div>
            <Input v-model="addcase.description" placeholder="请输入..." style="width: 420px"></Input>
          </div>
        </i-col>
      </row>
      <br>

      <row>
        <i-col span="2" offset="0">
          <div style="line-height: 32px;"><label>接口名称：</label></div>
        </i-col>
        <i-col span="3" offset="1">
          <div>
            <Input v-model="addcase.apiname" placeholder="请输入..." style="width: 420px"></Input>
          </div>
        </i-col>
      </row>
      <div class="border-bt editor-wrap" v-show="preCaseAddFlag">
      </div>
      <row v-show="preCaseAddFlag">
        <i-col span="3">
          <div
            style="margin-top: 10px; margin-bottom:10px; font-family:Helvetica Neue; font-size: 15px;font-weight: bold; color: rgb(70, 76, 91);">
            <label>步骤</label>
          </div>
        </i-col>
        <i-col span="2" offset="19">
          <div>
            <Button type="primary" @click="addSteps" style="margin-bottom:6px; margin-top: 10px">
              新增
            </Button>
          </div>
        </i-col>
      </row>
      <row v-show="preCaseAddFlag">
        <Table :columns="stepstable" :data="stepslist" width="980" height="400" :border="showBorder"
               :stripe="showStripe"
               :show-header="showHeader" :showIndex="true"></Table>
      </row>

    </Modal>

    <!-- 步骤列表页面表格 -->
    <Modal
      @on-ok="addStep"
      @on-cancel="addStepCancel"
      :mask-closable="false"
      width="800"
      :title=titlesteps
      :okText=stepokButtonText
      v-model="addStepModel"
      :styles="{top: '20px'}">
      <row>
        <i-col span="4" offset="1">
          <div style="line-height: 32px;"><label>步骤名称：</label></div>
        </i-col>
        <i-col span="3" offset="1">
          <div>
            <Input v-model="caseStep.name" placeholder="请输入..." style="width: 200px"></Input>
          </div>
        </i-col>
      </row>
      <br>
      <row>
        <i-col span="4" offset="1">
          <div style="line-height: 32px;"><label>http请求方式：</label></div>
        </i-col>
        <i-col span="3" offset="1">
          <Select v-model="caseStep.httpType" style="width:200px" @on-change="selectEvent">
            <Option v-for="item in httpTypeList" :value="item.value" :key="item"></Option>
          </Select>
        </i-col>
      </row>
      <br/>
      <row>
        <i-col span="4" offset="1">
          <div style="line-height: 32px;"><label>平台：</label></div>
        </i-col>
        <i-col span="3" offset="1">
          <Select v-model="caseStep.platform" style="width:200px" @on-change="selectPlatform">
            <Option v-for="item in platformlist" :value="item.value" :key="item"></Option>
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
            <Input v-model="caseStep.apiname" placeholder="请输入..." style="width: 200px"></Input>
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
        <i-col span="2" offset="19">
          <div>
            <Button type="primary" @click="addParamModel" style="margin-bottom:6px; margin-top: 10px">
              新增
            </Button>
          </div>
        </i-col>
      </row>
      <row>
        <Table border :columns="paramsUrl" :data="paramsUrllist"></Table>
      </row>

      <row>
        <i-col span="3">
          <div
            style="margin-top: 10px; margin-bottom:10px; font-family:Helvetica Neue; font-size: 15px;font-weight: bold; color: rgb(70, 76, 91);">
            <label>期望结果</label>
          </div>
        </i-col>
      </row>
      <br>
      <Monaco
        language="json"
        :code="codeContent"
        theme="vs"
        @mounted="onMounted"
        @codeChange="onCodeChange"
      >
      </Monaco>
    </Modal>

    <!-- 添加步骤url参数model页面 -->
    <Modal
      @on-ok="addParamValue"
      :mask-closable="false"
      width="400"
      :title=paramtitle
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
  import { Col, Row } from 'iview'
//  import ICol from 'iview/src/components/grid/col.vue'
//  import Row from 'iview/src/components/grid/row.vue'
  import editor from 'vue2-ace-editor-new'
  import 'brace/mode/javascript'
  import 'brace/theme/chrome'
  import Monaco from 'monaco-editor-forvue'
  import $ from 'jquery'

  export default {
    components: {
      Row,
      'i-col': Col,
      editor,
      Monaco,
      'name': 'content'
    },
    name: 'home',
    data () {
      return {
        loading: false,
        editJsonComponentShow: false,
        index: 0,
        editorInitJson: JSON.stringify({'a': 1, 'b': 2}, null, '\t'),
        editorJson: '',
        showBorder: true,
        showStripe: true,
        showHeader: true,
        fixedHeader: true,
        editAndAddFlag: true,
        addCaseButtunFlag: true,
        addStepsButtunFlag: true,
        okButtonText: '添加',
        casemodeltitle: '新增用例',
        titlesteps: '新增步骤',
        stepokButtonText: '添加',
        paramtitle: '新增参数',
        paramAddOrSaveButtonFlag: true,
        preCaseAddFlag: false,
        caseModelWidth: 800,
        stepslist: [],
        platformlist: [
          {
            value: 'skill'
          },
          {
            value: 'voice'
          },
          {
            value: 'account'
          }
        ],
        addcase: {
          name: '',
          description: '',
          platform: 'skill',
          apiname: '',
          createtime: null,
          updatetime: null,
          result: '',
          cellClassName: {}
        },
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
        caseStep: {
          name: '',
          platform: 'skill',
          httpType: 'get',
          result: '',
          response: '',
          cellClassName: {}
        },
        newParamsValue: {
          paramName: '',
          paramValue: ''
        },
        addStepModel: false,
        caseEditmodal: false,
        addcasemodal: false,
        parameditmodal: false,
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
        stepstable: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '步骤名称',
            width: 160,
            key: 'name'
          },
          {
            title: 'httpType',
            width: 100,
            key: 'httpType'
          },
          {
            title: '平台',
            key: 'platform',
            width: 100
          },
          {
            title: 'url参数',
            width: 140,
            key: 'param'
          },
          {
            title: 'response',
            width: 160,
            key: 'response'
          },
          {
            title: 'result',
            width: 80,
            key: 'result'
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
                      this.editSteps(params.index)
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
                      this.removeStep(params.index)
                    }
                  }
                }, '删除')
              ])
            }
          }
        ],
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
        paramsUrllist: [
          {
            'paramName': 'appid',
            'paramValue': '12345'
          },
          {
            'paramName': 'domainid',
            'paramValue': '333333'
          }
        ],
        codeContent: '{}'
      }
    },

    mounted () {
      this.$on('editor-update', this.onEditIntents)
    },
    created () {
      this.getCase()
    },
    methods: {

      onMounted (editor) {
        this.editor = editor
      },
      onCodeChange (editor) {
        this.codeContent = this.editor.getValue()
      },
      addSteps () {
        this.titlesteps = '新增步骤'
        this.stepokButtonText = '添加'
        this.addStepModel = true
        this.editor.layout({
          width: 770,
          height: 200
        })
      },
      selectEvent () {
        if (this.caseStep.httpType === 'get' || this.caseStep.httpType === 'delete') {
          this.editJsonComponentShow = false
        } else {
          this.editJsonComponentShow = true
        }
      },
      selectPlatform () {
        if (this.addcase.platform === 'skill') {
        } else {
        }
      },
      editSteps (index) {
        this.titlesteps = '编辑步骤'
        this.stepokButtonText = '保存'
        this.addStepModel = true
        this.caseStep.name = this.stepslist[index].name
        this.caseStep.httpType = this.stepslist[index].httpType
        this.caseStep.result = this.stepslist[index].result
        this.caseStep.platform = this.stepslist[index].platform
        this.caseStep.param = this.stepslist[index].param
      },

      editParams (index) {
        this.paramAddOrSaveButtonFlag = false
        this.paramtitle = '编辑参数'
        this.parameditmodal = true
        this.newParamsValue.paramName = this.paramsUrllist[index].paramName
        this.newParamsValue.paramValue = this.paramsUrllist[index].paramValue
      },
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
        this.login()
      },
      login () {
        $.ajax({
          type: 'POST',
          async: true,
          data: 'username=admin&password=admin',
          url: window.account + '/login',
//          dataType: 'json',
          success: (result) => {
            console.log('login success')
          },
          error: (errorMsg) => {
            console.log(errorMsg)
          }
        })
      },
      removeCase (index) {
        this.casedata.splice(index, 1)
      },
      removeStep (index) {
        this.stepslist.splice(index, 1)
      },
      removeParamValue (index) {
        this.paramsUrllist.splice(index, 1)
      },
      addStep () {
        if (this.addStepsButtunFlag) {
          this.stepslist.push(this.caseStep)
        } else {
          this.stepslist[this.index].name = this.caseStep.name
          this.stepslist[this.index].httpType = this.caseStep.httpType
          this.stepslist[this.index].apiname = this.caseStep.apiname
          this.stepslist[this.index].platform = this.caseStep.platform
        }
        this.caseStep = {name: '', httpType: 'get', apiname: '', platform: 'skill'}
      },
      getDateTime () {
        var date = new Date()
        return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
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
        this.preCaseAddFlag = false
      },
      addStepCancel () {
        this.editAndAddFlag = false
        this.caseStep = {name: '', httpType: 'get', result: '', cellClassName: {}, platform: 'skill', apiname: ''}
      },
      addCaseCancelEvent () {
        this.addcase = {name: '', description: '', result: '', apiName: '', cellClassName: {}}
        this.preCaseAddFlag = false
      },
      addParamModel () {
        this.paramAddOrSaveButtonFlag = true
        this.parameditmodal = true
        this.paramtitle = '添加参数'
      },
      addParamValue () {
        if (this.paramAddOrSaveButtonFlag) {
          this.paramsUrllist.push(this.newParamsValue)
        } else {
          this.paramsUrllist[this.index].paramName = this.newParamsValue.paramName
          this.paramsUrllist[this.index].paramValue = this.newParamsValue.paramValue
        }
        this.newParamsValue = {paramName: '', paramValue: ''}
      },
      getCase () {
//        this.loading = true
        fetch(window.serverurl + '/platform/caselist', {
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
            this.casedata = json
//            console.log(json[0])
//            console.log(this.searchStr)
          })
          this.loading = false
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

</style>
