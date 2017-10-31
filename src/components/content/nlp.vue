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
      <Table :loading="loading" :columns="casetable" :data="casedata" width="1370" height="664" :border="showBorder"
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
            <Input v-model="addcase.name" placeholder="请输入..." style="width: 400px"></Input>
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
            <Input v-model="addcase.description" placeholder="请输入..." style="width: 400px"></Input>
          </div>
        </i-col>
      </row>
      <br>

      <row>
        <i-col span="2" offset="0">
          <div style="line-height: 32px;"><label>是否执行：</label></div>
        </i-col>
        <i-col span="3" offset="1">
          <div>
            <i-Switch size="large" v-model="addcase.switchType" @on-change="switchSelect">
              <span slot="open">开启</span>
              <span slot="close">关闭</span>
            </i-Switch>
          </div>
        </i-col>

      </row>
      <br/>

      <row>
        <i-col span="2" offset="0">
          <div style="line-height: 32px;"><label>Domain：</label></div>
        </i-col>
        <i-col span="3" offset="1">
          <div>
            <Select v-model="addcase.moduleName" style="width:350px" @on-change="selectDomain">
              <Option v-for="(item, idx) in moduleList" :value="item" :key="idx"></Option>
            </Select>
          </div>
        </i-col>
      </row>
      <br/>

      <row>
        <i-col span="2" offset="0">
          <div style="line-height: 32px;"><label>Intent：</label></div>
        </i-col>
        <i-col span="3" offset="1">
          <div>
            <Select v-model="addcase.projectId" style="width:200px" @on-change="selectProject" :label-in-value="true">
              <Option v-for="(item, index) in projectList" :value="item.id" :key="index">{{item.projectName}}</Option>
            </Select>
          </div>
        </i-col>
      </row>
      <br/>

      <row>
        <i-col span="2" offset="0">
          <div style="line-height: 32px;"><label>Author：</label></div>
        </i-col>
        <i-col span="3" offset="1">
          <div>
            <Input v-model="addcase.author" placeholder="请输入..." style="width: 200px"></Input>
          </div>
        </i-col>
      </row>
      <br>

      <div class="border-bt editor-wrap" v-show="preCaseAddFlag">
      </div>
      <row v-show="preCaseAddFlag">
        <i-col span="3">
          <div
            style="margin-top: 10px; margin-bottom:10px; font-family:Helvetica Neue; font-size: 15px;font-weight: bold; color: rgb(70, 76, 91);">
            <label>步骤</label>
          </div>
        </i-col>
        <i-col span="2" offset="17">
          <div>
            <Button type="primary" @click="addSteps" style="margin-bottom:6px; margin-top: 10px">
              新增
            </Button>
          </div>
        </i-col>
        <i-col span="2" offset="0">
          <div>
            <Button type="primary" @click="executeStepsTest" style="margin-bottom:6px; margin-top: 10px">
              执行
            </Button>
          </div>
        </i-col>
      </row>
      <row v-show="preCaseAddFlag">
        <Table :loading="stepsTableDataLoading" :columns="stepstable" :data="stepslist" width="980" height="300"
               :border="showBorder"
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
        <i-col span="3" offset="1">
          <div style="line-height: 32px;"><label>步骤名称：</label></div>
        </i-col>
        <i-col span="2" offset="0">
          <div>
            <Input v-model="caseStep.name" placeholder="请输入..." style="width: 300px"></Input>
          </div>
        </i-col>
      </row>
      <br>

      <row>
        <i-col span="3" offset="1">
          <div style="line-height: 32px;"><label>执行方法：</label></div>
        </i-col>
        <i-col span="2" offset="0">
          <Select v-model="caseStep.action" style="width:200px" @on-change="selectExecuteMethod">
            <Option v-for="(item, index) in methodlist" :value="item.value" :key="index"></Option>
          </Select>
        </i-col>
      </row>
      <br/>

      <row>
        <i-col span="3" offset="1">
          <div style="line-height: 32px;"><label>返回类型：</label></div>
        </i-col>
        <i-col span="2" offset="0">
          <div>
            <Select v-model="caseStep.responseType" style="width:200px">
              <Option v-for="(item, index) in returnTypeList" :value="item.value" :key="index"></Option>
            </Select>
          </div>
        </i-col>
      </row>
      <br/>

      <row>
        <i-col span="2" offset="1">
          <div style="line-height: 32px;"><label>期望结果：</label></div>
        </i-col>
        <i-col span="2" offset="0" style="margin-top: 7px">
          <div>
            <Monaco
              language="json"
              :code="caseStep.expect"
              theme="vs"
              @mounted="onMounted"
              @codeChange="onCodeChange"
            ></Monaco>
          </div>
        </i-col>
      </row>

      <div class="border-bt editor-wrap" v-show="paramShow">
      </div>

      <row v-show="paramShow">
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
      <row v-show="paramShow">
        <Table :loading="paramTableDataLoading" height="200" border :columns="paramsData" :data="paramslist"></Table>
      </row>

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
            <Input v-model="newParamsValue.parameter" placeholder="请输入..." style="width: 200px"></Input>
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
            <Input v-model="newParamsValue.value" placeholder="请输入..." style="width: 200px"></Input>
          </div>
        </i-col>
      </row>
    </Modal>
  </div>


</template>

<script>
  //  /* eslint-disable no-unused-vars */
  //  import $ from 'jquery'
  import { Col, Row } from 'iview'
  //  import ICol from 'iview/src/components/grid/col.vue'
  //  import Row from 'iview/src/components/grid/row.vue'
  import Monaco from 'monaco-editor-forvue'
  import expandRow from './table-expand.vue'

  export default {
    components: {
      Row,
      'i-col': Col,
      Monaco,
      expandRow,
      'name': 'content'
    },
    name: 'home',
    data () {
      return {
        pageHelp: {
          curPage: 1,
          endIndex: 10,
          pageSize: 13,
          startIndex: 0,
          totalNum: 0,
          totalPageNum: 0
        },
        scheduleidList: [],
        pageSizeOptions: [13, 26, 39, 52],
        paramShow: false,
        stepsTableDataLoading: false,
        paramTableDataLoading: false,
        returnTypeList: [{value: 'xml'}, {value: 'txt'}],
        intentSelectValue: '2',
        projectList: [],
        domainValue: 'shanghai',
        loading: false,
        methodlist: [
          {
            value: 'serviceCall'
          },
          {
            value: 'parse'
          },
          {
            value: 'serviceTest'
          },
          {
            value: 'nlpTest'
          }
        ],
        moduleList: [],
        switchFlag: true,
        index: 0,
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
        caseModelWidth: 700,
        nodataContent: '暂无数据',
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
          switchType: true,
          createime: null,
          id: '',
          moduleName: '',
          projectName: '',
          projectId: '',
          author: '',
          result: '',
          cellClassName: {}
        },
        caseStep: {
          name: '',
          id: '',
          stepId: '',
          action: 'serviceCall',
          caseId: '',
          result: '',
          expect: '',
          switchType: true,
          responseType: 'xml',
          requestMethod: 'NLP',
          requestType: 'grpc',
          cellClassName: {}
        },
        newParamsValue: {
          paramName: '',
          paramValue: '',
          id: '',
          stepId: ''
        },
        addStepModel: false,
        caseEditmodal: false,
        addcasemodal: false,
        parameditmodal: false,
        searchStr: '',
        paramsData: [
          {
            type: 'index',
            width: 60
          },
          {
            title: '参数名称',
            key: 'parameter'
          },
          {
            title: '参数值',
            key: 'value'
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
            type: 'index',
//            fixed: 'left',
            width: 60,
            align: 'center'
          },
          {
            title: '步骤名称',
            width: 160,
            key: 'name'
          },
          {
            title: '执行方法',
            width: 100,
            key: 'action'
          },
          {
            title: '返回类型',
            key: 'responseType',
            width: 100
          },
          {
            title: '是否执行',
            width: 100,
            key: 'switchType'
          },
          {
            title: 'CaseId',
            width: 100,
            key: 'caseId'
          },
          {
            title: '期望结果',
            width: 160,
            key: 'expect'
          },
//          {
//            title: 'result',
//            width: 80,
//            key: 'result'
//          },
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
                      this.editor.layout({
                        width: 600,
                        height: 200
                      })
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
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '用例名称',
            width: 270,
            key: 'name',
            align: 'center'
          },
//          {
//            title: '用例描述',
//            width: 200,
//            key: 'description',
//            align: 'center'
//          },
          {
            title: '是否执行',
            width: 120,
            key: 'switchType',
            align: 'center'
          },
          {
            title: 'Intent',
            width: 190,
            key: 'projectName',
            align: 'center'
          },
          {
            title: 'Domain',
            width: 190,
            key: 'moduleName',
            align: 'center'
          },
          {
            title: 'Author',
            width: 130,
            key: 'author',
            align: 'center'
          },
//          {
//            title: '创建时间',
//            width: 155,
//            key: 'createtime',
//            align: 'center'
//          },
          {
            title: '执行结果',
            width: 130,
            key: 'result',
            align: 'center'
          },
          {
            title: '操作',
            key: 'action',
            width: 230,
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
        paramslist: []
      }
    },
    mounted () {
//      this.intervalNlpTmp = setInterval(() => {
//        this.getCaseStatus()
//      }, 5000)
    },
    destroyed () {
      console.log('nlp destoryed.....')
//      clearInterval(this.intervalNlpTmp)
    },
    created () {
      this.getCase()
    },
    methods: {
      onMounted (editor) {
        this.editor = editor
      },
      onCodeChange (editor) {
        this.caseStep.expect = this.editor.getValue()
      },
      executeStepsTest () {
        // 执行步骤测试
      },
      selectProject (status) {
        this.addcase.projectId = status.value
      },
      executeCase (index) {
        this.$set(this.casedata[index], 'result', 'testing')
        fetch(window.serverurl + '/task/one', {
          method: 'POST',
          body: 'taskId=' + this.casedata[index].id + '&projectId=' + this.casedata[index].projectId,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then((res) => {
          res.json().then((json) => {
            this.$set(this.casedata[index], 'result', json.result.msg)
//            this.intervalTmp = setInterval(() => {
//              this.getOneCaseExcuteResult(json.result.data, this.casedata[index])
//            }, 3000)
//            this.scheduleidList.push(this.intervalTmp)
          })
        }).catch((e) => {
          e.toString()
        })
      },
//      getOneCaseExcuteResult (jobId, casedata) {
//        fetch(window.serverurl + '/task/checkCaseStatus', {
//          method: 'POST',
//          body: 'jobId=' + jobId + '&caseId=' + casedata.id,
//          headers: {
//            'Accept': 'application/json',
//            'Content-Type': 'application/x-www-form-urlencoded'
//          }
//        }).then((res) => {
//          res.json().then((json) => {
//            this.$set(this.casedata, 'result', json.result.msg)
//            this.intervalTmp = ''
//          })
//        }).catch((e) => {
//          e.toString()
//        })
//      },
      getPageIndex (pageIndex) {
        this.pageHelp.curPage = pageIndex
        this.loading = true
        fetch(window.serverurl + '/case/list?curPage=' + pageIndex + '&pageSize=' + this.pageHelp.pageSize, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }).then((res) => {
          res.json().then((json) => {
            this.casedata = json.result.data.result
            for (let i = 0; i < this.casedata.length; i++) {
              this.casedata[i].createTime = this.formatTime(this.casedata[i].createTime)
            }
            this.pageHelp.totalNum = json.result.data.page.totalNum
            this.loading = false
          })
        }).catch((e) => {
          console.log(e)
          e.toString()
        })
      },
      getPageSize (pageSize) {
        console.log('pageSize: ' + pageSize)
        this.pageHelp.pageSize = pageSize
      },
      addSteps () {
        this.editor.setValue('')
        this.addStepsButtunFlag = true
        this.titlesteps = '新增步骤'
        this.stepokButtonText = '添加'
        this.addStepModel = true
        this.paramShow = false
        this.editor.layout({
          width: 600,
          height: 200
        })
      },
      selectEvent () {
//        if (this.caseStep.httpType === 'get' || this.caseStep.httpType === 'delete') {
//          this.editJsonComponentShow = false
//        } else {
//          this.editJsonComponentShow = true
//        }
      },
      switchSelect (status) {
//        if (status) {
//          this.addcase.switchType = 'yes'
//        } else {
//          this.addcase.switchType = 'no'
//        }
      },
      selectDomain () {
//        console.log(this.addcase.moduleName)
        this.getProjectList(this.addcase.moduleName)
      },
      getProjectList (domainName) {
        fetch(window.serverurl + '/project/projectList?moduleName=' + domainName, {
          method: 'GET',
//          body: JSON.stringify({
//            name: this.searchStr
//          }),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }).then((res) => {
          res.json().then((json) => {
            this.projectList = json.result.data
          })
        }).catch((e) => {
          e.toString()
        })
      },
      selectExecuteMethod () {
//        if (this.addcase.platform === 'skill') {
//        } else {
//        }
      },
      editSteps (index) {
        this.addStepsButtunFlag = false
        this.paramShow = true
        this.titlesteps = '编辑步骤'
        this.stepokButtonText = '保存'
        this.addStepModel = true
        this.caseStep.name = this.stepslist[index].name
        this.caseStep.caseId = this.stepslist[index].caseId
//        this.caseStep.result = this.stepslist[index].result
        this.caseStep.expect = this.stepslist[index].expect
        this.caseStep.responseType = this.stepslist[index].responseType
        this.caseStep.action = this.stepslist[index].action
        this.caseStep.switchType = this.stepslist[index].switchType
        this.caseStep.action = this.stepslist[index].action
        this.caseStep.requestMethod = this.stepslist[index].requestMethod
        this.caseStep.requestType = this.stepslist[index].requestType
        this.caseStep.stepId = this.stepslist[index].stepId
        this.caseStep.id = this.stepslist[index].id
        this.editor.setValue(this.caseStep.expect)
        this.getParamTableData()
      },
      getParamTableData () {
        this.paramTableDataLoading = true
        fetch(window.serverurl + '/dataParams/dataParamsList?stepId=' + this.caseStep.id, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }).then((res) => {
          res.json().then((json) => {
            this.paramslist = json.result.data
            this.paramTableDataLoading = false
          })
        }).catch((e) => {
          this.paramTableDataLoading = false
          e.toString()
        })
      },
      editParams (index) {
        this.paramAddOrSaveButtonFlag = false
        this.paramtitle = '编辑参数'
        this.parameditmodal = true
        this.newParamsValue.parameter = this.paramslist[index].parameter
        this.newParamsValue.value = this.paramslist[index].value
        this.newParamsValue.id = this.paramslist[index].id
        this.newParamsValue.stepId = this.paramslist[index].stepId
      },
      editCase (index) {
        this.index = index
        this.casemodeltitle = '编辑用例'
        this.okButtonText = '保存'
        this.addcasemodal = true
        this.addCaseButtunFlag = false
        this.addcase.name = this.casedata[index].name
        this.addcase.description = this.casedata[index].description
        this.addcase.projectName = this.casedata[index].projectName
        this.addcase.model = this.casedata[index].model
        this.addcase.moduleName = this.casedata[index].moduleName
        this.addcase.author = this.casedata[index].author
        this.addcase.switchType = this.casedata[index].switchType
        this.addcase.id = this.casedata[index].id
        this.addcase.projectId = this.casedata[index].projectId
        this.getStepsList()
        this.getModuleList()
      },
      addPlatformCase () {
        this.switchFlag = true
        this.caseModelWidth = 770
        this.casemodeltitle = '添加用例'
        this.addcasemodal = true
        this.addCaseButtunFlag = true
        this.okButtonText = '添加'
        this.getModuleList()
      },
      getModuleList () {
        fetch(window.serverurl + '/project/moduleList', {
          method: 'GET',
//          body: JSON.stringify({
//            name: this.searchStr
//          }),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }).then((res) => {
          res.json().then((json) => {
            this.moduleList = json.result.data
//            this.$set(this.moduleList, json.result.data)
          })
        }).catch((e) => {
          e.toString()
        })
      },
      removeCase (index) {
//        this.casedata.splice(index, 1)
        fetch(window.serverurl + '/case/delete', {
          method: 'POST',
          body: 'id=' + this.casedata[index].id,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then((res) => {
          res.json().then((json) => {
//            console.log('deleteCase: ' + JSON.stringify(json))
            this.getCase()
          })
        }).catch((e) => {
          e.toString()
        })
      },
      removeStep (index) {
//        this.stepslist.splice(index, 1)
        this.deleteStepFunction(this.stepslist[index].id)
      },
      removeParamValue (index) {
        fetch(window.serverurl + '/dataParams/deleteRow', {
          method: 'POST',
          body: 'dataParamId=' + this.paramslist[index].id,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then((res) => {
          res.json().then((json) => {
            this.paramslist.splice(index, 1)
            this.getParamTableData()
          })
        }).catch((e) => {
          e.toString()
        })
      },
      addStep () {
        if (this.addStepsButtunFlag) {
          this.caseStep.caseId = this.addcase.id
//          this.stepslist.push(this.caseStep)
          this.addStepFunction()
        } else {
          this.stepslist[this.index].name = this.caseStep.name
          this.stepslist[this.index].caseId = this.caseStep.caseId
          this.stepslist[this.index].expect = this.caseStep.expect
          this.stepslist[this.index].responseType = this.caseStep.responseType
          this.stepslist[this.index].action = this.caseStep.action
          this.stepslist[this.index].switchType = this.caseStep.switchType
          this.editStepFunction(this.stepslist[this.index])
        }
        this.caseStep = {
          id: '',
          name: '',
          caseId: '',
          expect: '',
          responseType: 'xml',
          action: '',
          switchType: true,
          requestType: 'grpc',
          requestMethod: 'NLP',
          stepId: ''
        }
      },
      deleteStepFunction (index) {
//        console.log('index: ' + index)
        fetch(window.serverurl + '/step/delete', {
          method: 'POST',
          body: 'id=' + index,
          headers: {
//            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then((res) => {
          res.json().then((json) => {
//            console.log(json)
            this.getStepsList()
          })
        }).catch((e) => {
          e.toString()
        })
      },
      editStepFunction (editparams) {
        fetch(window.serverurl + '/step/save', {
          method: 'POST',
          body: JSON.stringify(editparams),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }).then((res) => {
          res.json().then((json) => {
            this.getStepsList()
          })
        }).catch((e) => {
          e.toString()
        })
      },
      addStepFunction () {
        fetch(window.serverurl + '/step/create', {
          method: 'POST',
          body: JSON.stringify(this.caseStep),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }).then((res) => {
          res.json().then((json) => {
            this.getStepsList()
          })
        }).catch((e) => {
          e.toString()
        })
      },
      getDateTime () {
        var date = new Date()
        return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
      },
      addOrSaveCaseEvent () {
        if (this.addCaseButtunFlag) {
//          this.addcase.cellClassName = {result: 'table-info-cell-result-success'}
//          this.casedata.push(this.addcase)
          this.addCaseFunction()
        } else {
//          this.casedata[this.index].name = this.addcase.name
//          this.casedata[this.index].description = this.addcase.description
//          this.casedata[this.index].projectName = this.addcase.projectName
//          this.casedata[this.index].moduleName = this.addcase.moduleName
//          this.casedata[this.index].switchType = this.addcase.switchType
//          this.casedata[this.index].model = this.addcase.model
//          this.casedata[this.index].author = this.addcase.author
          this.editCaseFunction()
        }
        this.addcase = {
          id: '',
          name: '',
          description: '',
          result: '',
          projectName: '',
          moduleName: '',
          switchType: true,
          author: '',
          cellClassName: {},
          projectId: ''
        }
        this.preCaseAddFlag = false
      },
      getStepsList () {
        this.stepsTableDataLoading = true
        fetch(window.serverurl + '/step/stepList?caseId=' + this.addcase.id, {
          method: 'POST',
          body: JSON.stringify(this.addcase),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }).then((res) => {
          res.json().then((json) => {
            this.stepslist = json.result.data
            this.stepsTableDataLoading = false
          })
        }).catch((e) => {
          this.stepsTableDataLoading = false
          e.toString()
        })
      },
      addCaseFunction () {
        fetch(window.serverurl + '/case/create', {
          method: 'POST',
          body: 'name=' + this.addcase.name + '&description=' + this.addcase.description + '&author=' + this.addcase.author + '&domainName=' + this.addcase.moduleName + '&projectId=' + this.addcase.projectId,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then((res) => {
          res.json().then((json) => {
//            console.log('addcase: ' + JSON.stringify(json))
            this.getCase()
          })
        }).catch((e) => {
          e.toString()
        })
      },
      editCaseFunction () {
        fetch(window.serverurl + '/case/save', {
          method: 'POST',
          body: 'name=' + this.addcase.name + '&description=' + this.addcase.description + '&author=' + this.addcase.author + '&domainName=' + this.addcase.moduleName + '&projectId=' + this.addcase.projectId + '&switchType=' + this.addcase.switchType + '&id=' + this.addcase.caseId,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then((res) => {
          res.json().then((json) => {
//            console.log('editcase: ' + JSON.stringify(json))
            this.getCase()
          })
        }).catch((e) => {
          e.toString()
        })
      },
      addStepCancel () {
        this.editAndAddFlag = false
        this.caseStep = {
          id: '',
          name: '',
          caseId: '',
          expect: '',
          responseType: 'xml',
          action: '',
          switchType: true,
          requestType: 'grpc',
          requestMethod: 'NLP',
          stepId: ''
        }
      },
      addCaseCancelEvent () {
        this.addcase = {
          name: '',
          description: '',
          result: '',
          projectName: '',
          moduleName: '',
          switchType: true,
          author: '',
          cellClassName: {},
          projectId: ''
        }
        this.preCaseAddFlag = false
      },
      addParamModel () {
        this.paramAddOrSaveButtonFlag = true
        this.parameditmodal = true
        this.paramtitle = '添加参数'
      },
      addParamValue () {
        if (this.paramAddOrSaveButtonFlag) {
          this.newParamsValue.stepId = this.paramslist[this.index].stepId
          this.paramslist.push(this.newParamsValue)
          this.addParameter(this.newParamsValue)
        } else {
          this.paramslist[this.index].parameter = this.newParamsValue.parameter
          this.paramslist[this.index].value = this.newParamsValue.value
          this.paramslist[this.index].stepId = this.newParamsValue.stepId
          this.editParameter(this.paramslist[this.index])
        }
        this.newParamsValue = {parameter: '', value: '', id: '', stepId: ''}
      },
      editParameter (paramData) {
//        console.log(JSON.stringify(paramData))
//        console.log(paramData)
        fetch(window.serverurl + '/dataParams/edit', {
          method: 'POST',
          body: 'stepId=' + paramData.stepId + '&parameter=' + paramData.parameter + '&value=' + paramData.value + '&id=' + paramData.id,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then((res) => {
          res.json().then((json) => {
            this.getParamTableData()
          })
        }).catch((e) => {
          e.toString()
        })
      },
      addParameter (paramData) {
//        console.log(JSON.stringify(paramData))
//        console.log(paramData)
        fetch(window.serverurl + '/dataParams/create', {
          method: 'POST',
          body: 'stepId=' + paramData.stepId + '&parameter=' + paramData.parameter + '&value=' + paramData.value,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then((res) => {
          res.json().then((json) => {
//            console.log(json)
            this.getParamTableData()
          })
        }).catch((e) => {
          e.toString()
        })
      },
      getCaseStatus () {
        fetch(window.serverurl + '/case/list?curPage=' + this.pageHelp.curPage + '&pageSize=' + this.pageHelp.pageSize, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }).then((res) => {
          res.json().then((json) => {
            this.casedata = json.result.data.result
            this.pageHelp.totalNum = json.result.data.page.totalNum
            this.pageHelp.totalPageNum = json.result.data.page.totalPageNum
            this.loading = false
          })
        }).catch((e) => {
          e.toString()
        })
      },
      formatTime (datetime) {
        var time = new Date(datetime)
        var month = time.getMonth() + 1
        var day = time.getDay()
        var hour = time.getHours()
        var minute = time.getMinutes()
        var sconds = time.getSeconds()
        if (month < 10) {
          month = '0' + month
        }
        if (day < 10) {
          day = '0' + day
        }
        if (hour < 10) {
          hour = '0' + hour
        }
        if (minute < 10) {
          minute = '0' + minute
        }
        if (sconds < 10) {
          sconds = '0' + sconds
        }
        return time.getFullYear() + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + sconds
      },
      getCase () {
        this.loading = true
//        setTimeout(() => {
//          this.loading = false
//        }, 3000)
        console.log(9999999)
        fetch(window.serverurl + '/case/list?curPage=' + this.pageHelp.curPage + '&pageSize=' + this.pageHelp.pageSize, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }).then((res) => {
          res.json().then((json) => {
            this.casedata = json.result.data.result
            for (let i = 0; i < this.casedata.length; i++) {
              this.casedata[i].createTime = this.formatTime(this.casedata[i].createTime)
            }
            this.pageHelp.totalNum = json.result.data.page.totalNum
            this.pageHelp.totalPageNum = json.result.data.page.totalPageNum
            this.loading = false
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

</style>
