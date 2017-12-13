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
        <Select v-model="SelectProjectModel" style="width:150px" @on-change="selectTaskModule">
          <Option v-for="item in projectList" :value="item.value" :key="item.value"></Option>
        </Select>
      </i-col>
      <i-col span="2" offset="1">
        <Button type="primary" @click="addTaskData" style="margin-bottom:15px;">新增</Button>
      </i-col>
      <i-col span="3" offset="10">
        <Input v-model="condition" icon="ios-search-strong" placeholder="请输入..."
               style="width: 200px"></Input>
      </i-col>
      <i-col span="1" offset="1">
        <Button type="primary" icon="ios-search" @click="searchTask">搜索</Button>
      </i-col>
    </Row>

    <row>
      <Table :loading="loading" :columns="tasktable" :data="taskTableData" :border="showBorder" :stripe="showStripe"
             :show-header="showHeader" height="670" :showIndex="true" ></Table>
    </row>
    <br>
    <!-- 分页 -->
    <row>
      <i-col span="14" offset="8">
        <Page :total="taskPageHelp.totalNum"  show-elevator show-sizer show-total placement="top" :current="taskPageHelp.curPage"
              :page-size="taskPageHelp.pageSize" @on-change="getTaskPageIndex" @on-page-size-change="getTaskPageSize" :page-size-opts="taskPageSizeOptions"></Page>
      </i-col>
    </row>

    <addAsr :data="asrdata" @update="getAsrChildParam"></addAsr>

    <!-- task新增页面 -->
    <Modal
      @on-ok="addOrSaveTask"
      @on-cancel="addTaskCancelEvent"
      :mask-closable="false"
      width="780"
      :title=taskmodeltitle
      :okText=okButtonText
      v-model="addtaskmodal"
      :styles="{top: '20px'}">
      <row>
        <i-col span="2" offset="0">
          <div style="line-height: 32px;"><label>task名称：</label></div>
        </i-col>
        <i-col span="3" offset="1">
          <div>
            <Input v-model="addTask.name" placeholder="请输入..." style="width: 420px"></Input>
          </div>
        </i-col>
      </row>
      <br>

      <row>
        <Tag  color="blue">测试模块选择</Tag>
      </row>
      <br>

      <Transfer
        :titles="transerTitles"
        :data="addTask.projectData"
        :target-keys="targetKeys3"
        :list-style="listStyle"
        :render-format="render3"
        :operations="['向左移动','向右移动']"
        filterable
        @on-change="keyChange">
        <div :style="{float: 'right', margin: '5px'}">
          <Button type="ghost" size="small" @click="reloadMockData">刷新</Button>
        </div>
      </Transfer>


    </Modal>
    <!--  task历史记录页面 -->
    <Modal
      :mask-closable="false"
      width="890"
      height="620"
      title="task执行历史记录"
      okText="关闭"
      v-model="taskHistoryModel"
      :styles="{top: '20px'}">

      <row>
        <Table :loading="taskHistroyLoading" :columns="taskHistoryTable" :data="taskHistoryTableData" width="870" height="520" :border="showBorder" :stripe="showStripe"
               :show-header="showHeader" :showIndex="true"></Table>
      </row>
      <br>
      <!-- 分页 -->
      <row>
        <i-col span="18" offset="6">
          <Page :total="taskHistoryPageHelp.totalNum"  show-elevator show-sizer show-total placement="top" :current="taskHistoryPageHelp.curPage"
                :page-size="taskHistoryPageHelp.pageSize" @on-change="getTaskHitoryPageIndex" @on-page-size-change="getTaskHistoryPageSize" :page-size-opts="taskHistroyPageSizeOptions"></Page>
        </i-col>
      </row>
    </Modal>

    <!--  job详细记录页面 -->
    <Modal
      :mask-closable="false"
      width="990"
      height="620"
      title="job执行错误Case信息"
      okText="关闭"
      v-model="taskHistoryDetailModel"
      :styles="{top: '20px'}">

      <row>
        <i-col span="4" offset="0">
          <div style="line-height: 32px;"><label>用例执行总数：{{nlpResultReport.totalNum}}</label></div>
        </i-col>
        <i-col span="5" offset="0">
          <div style="line-height: 32px;"><label>用例执行成功数：{{nlpResultReport.passNum}}</label></div>
        </i-col>
        <i-col span="5" offset="0">
          <div style="line-height: 32px;"><label>用例执行个数：{{nlpResultReport.runNum}}</label></div>
        </i-col>
        <i-col span="5" offset="0">
          <div style="line-height: 32px;"><label>用例执行失败数：{{nlpResultReport.failNum}}</label></div>
        </i-col>
        <i-col span="5" offset="0">
          <div style="line-height: 32px;"><label>用例执行忽略数：{{nlpResultReport.ignoreNum}}</label></div>
        </i-col>
      </row>
      <br>
      <row>
        <Table :loading="taskHistroyDetailLoading" :columns="taskHistoryDetailTable" :data="taskHistoryDetailTableData" width="976" height="520" :border="showBorder" :stripe="showStripe"
               :show-header="showHeader" :showIndex="true"></Table>
      </row>
      <br>
      <!-- 分页 -->
      <row>
        <i-col span="18" offset="6">
          <Page :total="taskHistoryDetailPageHelp.totalNum"  show-elevator show-sizer show-total placement="top" :current="taskHistoryDetailPageHelp.curPage"
                :page-size="taskHistoryDetailPageHelp.pageSize" @on-change="getTaskHitoryDetailPageIndex" @on-page-size-change="getTaskHistoryDetailPageSize" :page-size-opts="taskHistroyDetailPageSizeOptions"></Page>
        </i-col>
      </row>
    </Modal>
  </div>
</template>
<script>
  import $ from 'jquery'
  import { Col, Row } from 'iview'
  import addAsr from './asr/asrAdd'
//  import ICol from 'iview/src/components/grid/col.vue'
//  import Row from 'iview/src/components/grid/row.vue'

  export default {
    components: {
      addAsr,
      Row,
      'i-col': Col,
      'name': 'task'
    },
    data () {
      return {
        asrdata: {
          addData: {
            taskname: '',
            domain: '',
            people: 5,
            starttime: null,
            endtime: null
          },
          addmodal: false
        },
        asrTaskShowFlag: false,
        nlpTaskShowFlag: true,
        taskHistoryDetailTableData: [],
        taskHistoryDetailModel: false,
        taskHistroyDetailLoading: false,
        taskPageSizeOptions: [13, 26, 39, 52],
        taskHistroyDetailPageSizeOptions: [10, 20, 30, 50],
        taskHistroyPageSizeOptions: [10, 20, 30, 50],
        taskHistoryDetailPageHelp: {
          curPage: 1,
          endIndex: 10,
          pageSize: 10,
          startIndex: 0,
          totalNum: 0,
          totalPageNum: 0
        },
        taskPageHelp: {
          curPage: 1,
          endIndex: 13,
          pageSize: 13,
          startIndex: 0,
          totalNum: 0,
          totalPageNum: 0
        },
        intervalTmp: null,
        targetKeys3: this.getTargetKeys(),
        listStyle: {
          width: '250px',
          height: '300px'
        },
        transerTitles: ['模块', '测试模块'],
        projectList: [
          {
            value: 'nlp',
            label: 'nlp'
          },
          {
            value: 'speech',
            label: 'speech'
          },
          {
            value: 'asr',
            label: 'asr'
          },
          {
            value: 'tts',
            label: 'tts'
          },
          {
            value: 'api',
            label: 'api'
          },
          {
            value: 'ui',
            label: 'ui'
          }
        ],
        SelectProjectModel: 'nlp',
        fileName: '',
        voiceFlag: false,
        index: 0,
        loading: false,
        visible: false,
        showBorder: true,
        showStripe: true,
        showHeader: true,
        fixedHeader: true,
        addtaskmodal: false,
        taskHistoryModel: false,
        okButtonText: '添加',
        taskmodeltitle: '添加Task',
        addTaskButtunFlag: true,
        condition: '',
        addTask: {
          name: '',
          projectIds: [],
          projectId: '',
          type: '',
          author: '',
          module: null,
          createTime: null,
          updateTime: null,
          result: '',
          caseMount: '',
          projectData: [],
          cellClassName: {}
        },
        taskHistroyLoading: false,
        taskHistoryTableData: [],
        jobId: '',
        nlpResultReport: {
          failNum: 0,
          ignoreNum: 0,
          totalNum: 0,
          passNum: 0,
          runNum: 0
        },
        taskHistoryDetailTable: [
          {
            type: 'index',
            width: 70,
            align: 'center'
          },
          {
            title: '结果描述',
            width: 200,
            key: 'description',
            align: 'center'
          },
          {
            title: 'Moduleame',
            width: 200,
            key: 'module_name',
            align: 'center'
          },
          {
            title: '期望结果',
            width: 200,
            key: 'expect',
            align: 'center'
          },
          {
            title: 'name',
            width: 160,
            key: 'name',
            align: 'center'
          },
          {
            title: '更新时间',
            width: 160,
            key: 'updateTime',
            align: 'center'
          }
//          {
//            title: '测试详情',
//            width: 180,
//            key: 'testDetail',
//            align: 'center',
//            render: (h, params) => {
//              return h('div', [
//                h('Button', {
//                  props: {
//                    type: 'primary',
//                    icon: 'ios-cloud-download-outline',
//                    size: 'small'
//                  },
//                  style: {
//                    marginRight: '7px'
//                  },
//                  on: {
//                    click: () => {
//                      this.getJobDetail(params.index)
//                    }
//                  }
//                }, '查看')
//              ])
//            }
//          }

        ],

        taskHistoryTable: [
          {
            type: 'index',
            width: 70,
            align: 'center'
          },
          {
            title: '执行人员',
            width: 140,
            key: 'starter',
            align: 'center'
          },
          {
            title: '开始时间',
            width: 160,
            key: 'createTime',
            align: 'center'
          },
          {
            title: '结束时间',
            width: 160,
            key: 'endTime',
            align: 'center'
          },
          {
            title: '执行结果',
            width: 160,
            key: 'jobStatus',
            align: 'center'
          },
          {
            title: '测试详情',
            width: 180,
            key: 'testDetail',
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
                      this.taskHistoryDetailModel = true
                      this.getJobDetail(params.index)
                    }
                  }
                }, '查看')
              ])
            }
          }

        ],
        tasktable: [
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: 'task名称',
//            width: 410,
            key: 'name',
            align: 'center'
          },
          {
            title: '创建时间',
//            width: 160,
            key: 'createTime',
            align: 'center'
          },
          {
            title: '更新时间',
//            width: 160,
            key: 'updateTime',
            align: 'center'
          },
          {
            title: '执行进度',
//            width: 150,
            key: 'status',
            align: 'center'
//            render: (h, params) => {
//              const row = params.row
//              const text = (typeof row.result === 'undefined' || row.result === '') ? '未执行' : row.result === 'testing' ? '测试中 ' : row.result === 'success' ? '测试结束' : '测试结束'
//              const color = (typeof row.result === 'undefined' || row.result === '') ? 'yellow' : row.result === 'testing' ? 'blue' : row.result === 'success' ? 'green' : 'red'
//              return h('Tag', {
//                props: {
//                  type: 'dot',
//                  color: color
//                }
//              }, text)
//            }
          },
          {
            title: '测试详情',
            width: 185,
            key: 'fileurl',
            align: 'center',
            render: (h, params) => {
              return h('div', [
//                h('Button', {
//                  props: {
//                    type: 'primary',
//                    icon: 'ios-cloud-download-outline',
//                    size: 'small'
//                  },
//                  style: {
//                    marginRight: '7px'
//                  },
//                  on: {
//                    click: () => {
//                      this.getLastBulidTaskDetail(params.index)
//                    }
//                  }
//                }, '查看'),
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
                      this.queryTaskHistory(params.index)
                    }
                  }
                }, '历史记录')
              ])
            }
          },
          {
            title: '操作',
            key: 'action',
            width: 250,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                // this.SelectProjectModel === 'asr'?
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  // 原生属性，控制按钮是否灰显可用,true表示不可用，false表示可用
                  attrs: {
                    disabled: false
                  },
                  style: {
                    marginRight: '7px',
                    // 控制按钮是否显示
                    display: (this.SelectProjectModel === 'asr' ? 'none' : 'auto')
                  },
                  on: {
                    click: () => {
                      this.editTask(params.index)
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
                      this.removeTask(params.index)
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
                      this.executeTask(params.index)
                    }
                  }
                }, '执行')
              ])
            }
          }
        ],
        taskTableData: [],
        taskId: '',
        taskHistoryPageHelp: {
          curPage: 1,
          endIndex: 10,
          pageSize: 10,
          startIndex: 0,
          totalNum: 0,
          totalPageNum: 0
        }
      }
    },
    created () {
      this.getNlpTaskList()
    },
    methods: {
      getAsrChildParam (childData) {
        console.log('parent-get-data: ' + childData)
        this.addTask.type = 'ASR'
        this.addTask.name = childData.taskname
        this.addTask.projectId = JSON.stringify(childData)
        this.addTaskFunction()
      },
      selectTaskModule () {
        console.log('selectModule: ' + this.SelectProjectModel)
        switch (this.SelectProjectModel) {
          case 'nlp': {
            this.getNlpTaskList()
            clearInterval(this.intervalTmp)
            this.intervalTmp = setInterval(() => {
              this.getNlpTaskList()
            }, 6000)
            this.asrTaskShowFlag = false
            this.nlpTaskShowFlag = true
            break
          }
          case 'asr': {
            this.getAsrTaskList()
            clearInterval(this.intervalTmp)
            this.intervalTmp = setInterval(() => {
              this.getAsrTaskList()
            }, 6000)
            this.nlpTaskShowFlag = false
            this.asrTaskShowFlag = true
            break
          }
          default: {
            this.asrTaskShowFlag = false
            this.nlpTaskShowFlag = true
          }
        }
      },
      getAsrTaskList () {
        // console.log('size: ' + this.taskPageHelp.pageSize)
        fetch(window.serverurl + '/task/taskList', {
          method: 'POST',
          body: 'type=ASR&pageSize=' + this.taskPageHelp.pageSize + '&curPage=' + this.taskPageHelp.curPage,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then((res) => {
          res.json().then((json) => {
            if (typeof json.result.data.result === 'undefined') {
              return
            }
            this.taskTableData = json.result.data.result
            this.taskPageHelp.totalNum = json.result.data.page.totalNum
            this.taskPageHelp.totalPageNum = json.result.data.page.totalPageNum
            for (let i = 0; i < this.taskTableData.length; i++) {
              this.taskTableData[i].createTime = this.formatDate(new Date(this.taskTableData[i].createTime), 'yyyy-MM-dd hh:mm:ss')
              this.taskTableData[i].updateTime = this.formatDate(new Date(this.taskTableData[i].updateTime), 'yyyy-MM-dd hh:mm:ss')
            }
//            console.log('addtask:' + JSON.stringify(json))
          })
        }).catch((e) => {
          e.toString()
        })
      },
      handleSuccess (res, file, fileList) {
        this.uploadShowFlag = false
        console.log('res: ' + res)
        console.log('file: ' + file)
        console.log('filelist: ' + fileList)
      },
//      getLastBulidTaskDetail (index) {
//        this.taskHistoryDetailModel = true
//      },
      editTask (index) {
        this.index = index
        this.taskmodeltitle = '编辑Task'
        this.okButtonText = '保存'
        this.addtaskmodal = true
        this.addTaskButtunFlag = false
        this.addTask = Object.assign({}, this.addTask, this.taskTableData[index])
        this.getSelectModuled(index)
      },
      getSelectModuledByNlp (index) {
        this.targetKeys3 = this.taskTableData[index].projectIds
        fetch(window.serverurl + '/project/allList', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then((res) => {
          res.json().then((json) => {
            var mockdata = json.result.data
            for (let i = 0; i < mockdata.length; i++) {
              this.addTask.projectData.push({
                key: mockdata[i].id,
                label: mockdata[i].moduleName,
                description: mockdata[i].projectName,
                disabled: false
              })
            }
            for (let i = 0; i < mockdata.length; i++) {
              if (this.checkIdExist(index, mockdata[i].id)) {
                this.addTask.projectData.disabled = false
              }
            }
          })
        }).catch((e) => {
          console.log(e)
          e.toString()
        })
      },
      getSelectModuledByAsr (index) {
        this.targetKeys3 = this.taskTableData[index].projectIds
        console.log('newtarget: ' + this.targetKeys3)
        var mockdata = this.asrModuleData
        for (let i = 0; i < this.targetKeys3.length; i++) {
          for (let j = 0; j < mockdata.length; j++) {
            if (mockdata[j].key === this.targetKeys3[i].toString()) {
              mockdata.splice(j, 1)
              break
            }
          }
        }
        console.log('getSelectModuledByAsr：' + this.targetKeys3)
        for (let i = 0; i < mockdata.length; i++) {
          this.addTask.projectData.push({
            key: mockdata[i].key,
            label: mockdata[i].label,
            description: mockdata[i].description,
            disabled: false
          })
        }
        // for (let i = 0; i < mockdata.length; i++) {
        //   if (this.checkIdExist(index, mockdata[i].key)) {
        //     this.addTask.projectData.disabled = false
        //   }
        // }
        console.log('this.addTask.projectData: ' + this.addTask.projectData.toString())
        console.log('newtarget: ' + this.targetKeys3)
      },
      getSelectModuled (index) {
        if (typeof this.addTask.projectData !== 'undefined') {
          this.addTask.projectData.splice(0, this.addTask.projectData.length)
        }
        if (typeof this.targetKeys3 !== 'undefined') {
          this.targetKeys3.splice(0, this.targetKeys3.length)
        }
        switch (this.SelectProjectModel) {
          case 'nlp': {
            this.getSelectModuledByNlp(index)
            break
          }
          case 'asr': {
            this.getSelectModuledByAsr(index)
            break
          }
        }
      },
      checkIdExist (index, id) {
        var flag = false
        for (let j = 0; j < this.taskTableData[index].projectIds.length; j++) {
          if (this.taskTableData[index].projectIds[j] === id) {
            flag = true
          }
        }
        return flag
      },
      queryHitoryByNlp (index) {
        this.taskHistoryModel = true
        console.log(JSON.stringify(this.taskTableData[index]))
        this.taskId = this.taskTableData[index].id
        this.taskHistroyLoading = true
        fetch(window.serverurl + '/task/taskHistoryList?curPage=' + this.taskHistoryPageHelp.curPage + '&pageSize=' + this.taskHistoryPageHelp.pageSize + '&taskId=' + this.taskId, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then((res) => {
          res.json().then((json) => {
            this.taskHistoryTableData = json.result.data.result
            for (var i = 0; i < this.taskHistoryTableData.length; i++) {
              this.taskHistoryTableData[i].createTime = this.formatDate(new Date(this.taskHistoryTableData[i].createTime), 'yyyy-MM-dd hh:mm:ss')
              this.taskHistoryTableData[i].updateTime = this.formatDate(new Date(this.taskHistoryTableData[i].updateTime), 'yyyy-MM-dd hh:mm:ss')
              this.taskHistoryTableData[i].endTime = this.formatDate(new Date(this.taskHistoryTableData[i].endTime), 'yyyy-MM-dd hh:mm:ss')
            }
            this.taskHistoryPageHelp.totalNum = json.result.data.page.totalNum
            this.taskHistoryPageHelp.totalPageNum = json.result.data.page.totalPageNum
            this.taskHistroyLoading = false
          })
        }).catch((e) => {
          console.log(e)
          e.toString()
        })
      },
      queryHitoryByAsr (index) {
        // window.location.href = 'http://10.88.128.140:8080/views/performamce/index.html#/view'
        window.open('http://lightssaber.rokid-inc.com/views/performamce/index.html#/view')
      },
      queryTaskHistory (index) {
        switch (this.SelectProjectModel) {
          case 'nlp': {
            this.queryHitoryByNlp(index)
            break
          }
          case 'asr': {
            this.queryHitoryByAsr(index)
            break
          }
        }
      },
      addTaskData () {
        switch (this.SelectProjectModel) {
          case 'nlp': {
            this.taskmodeltitle = '添加Task'
            this.addtaskmodal = true
            this.addTaskButtunFlag = true
            this.okButtonText = '添加'
            if (typeof this.addTask.projectData !== 'undefined') {
              this.addTask.projectData.splice(0, this.addTask.projectData.length)
            }
            if (typeof this.targetKeys3 !== 'undefined') {
              this.targetKeys3.splice(0, this.targetKeys3.length)
            }
            this.getProjectIdListByNlp()
            break
          }
          case 'asr': {
            // this.getProjectIdListByAsr()
            this.asrdata.addmodal = true
            break
          }
        }
      },
      getProjectIdListByNlp () {
        fetch(window.serverurl + '/project/allList', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then((res) => {
          res.json().then((json) => {
            var mockdata = json.result.data
            for (let i = 0; i < mockdata.length; i++) {
              this.addTask.projectData.push({
                key: mockdata[i].id,
                label: mockdata[i].moduleName,
                description: mockdata[i].projectName
              })
            }
          })
        }).catch((e) => {
          console.log(e)
          e.toString()
        })
      },
      getProjectIdListByAsr () {
        this.addTask.projectData = this.asrModuleData
        // var mockdata = this.asrModuleData
        // for (let i = 0; i < mockdata.length; i++) {
        //   this.addTask.projectData.push({
        //     key: mockdata.key,
        //     label: mockdata[i].label,
        //     description: mockdata[i].description,
        //     disabled: true
        //   })
        // }
      },
      getTaskPageIndex (pageIndex) {
        this.taskPageHelp.curPage = pageIndex
        this.loading = true
        fetch(window.serverurl + '/task/taskList?type=NLP&curPage=' + pageIndex + '&pageSize=' + this.taskPageHelp.pageSize, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then((res) => {
          res.json().then((json) => {
            this.taskTableData = json.result.data.result
            for (var i = 0; i < this.taskTableData.length; i++) {
              this.taskTableData[i].createTime = this.formatDate(new Date(this.taskTableData[i].createTime), 'yyyy-MM-dd hh:mm:ss')
              this.taskTableData[i].updateTime = this.formatDate(new Date(this.taskTableData[i].updateTime), 'yyyy-MM-dd hh:mm:ss')
            }
            this.taskPageHelp.totalNum = json.result.data.page.totalNum
            this.taskPageHelp.totalPageNum = json.result.data.page.totalPageNum
            this.loading = false
          })
        }).catch((e) => {
          console.log(e)
          e.toString()
        })
      },
      getTaskPageSize (pageSize) {
        this.taskPageHelp.pageSize = pageSize
      },
      getTaskHitoryPageIndex (pageIndex) {
        this.taskHistoryModel = true
        this.taskHistroyLoading = true
        this.taskHistoryPageHelp.curPage = pageIndex
        fetch(window.serverurl + '/task/taskHistoryList?curPage=' + pageIndex + '&pageSize=' + this.taskHistoryPageHelp.pageSize + '&taskId=' + this.taskId, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then((res) => {
          res.json().then((json) => {
            this.taskHistoryTableData = json.result.data.result
            for (var i = 0; i < this.taskHistoryTableData.length; i++) {
              this.taskHistoryTableData[i].createTime = this.formatDate(new Date(this.taskHistoryTableData[i].createTime), 'yyyy-MM-dd hh:mm:ss')
              this.taskHistoryTableData[i].updateTime = this.formatDate(new Date(this.taskHistoryTableData[i].updateTime), 'yyyy-MM-dd hh:mm:ss')
              this.taskHistoryTableData[i].endTime = this.formatDate(new Date(this.taskHistoryTableData[i].endTime), 'yyyy-MM-dd hh:mm:ss')
            }
            this.taskHistoryPageHelp.totalNum = json.result.data.page.totalNum
            this.taskHistoryPageHelp.totalPageNum = json.result.data.page.totalPageNum
            this.taskHistroyLoading = false
          })
        }).catch((e) => {
          console.log(e)
          e.toString()
        })
      },
      getTaskHistoryPageSize (pageSize) {
        this.taskHistoryPageHelp.pageSize = pageSize
      },
      getTaskHitoryDetailPageIndex (pageIndex) {
        this.taskHistroyDetailLoading = true
        this.taskHistoryDetailPageHelp.curPage = pageIndex
        fetch(window.serverurl + '/task/taskExecuteDetail', {
          method: 'POST',
          body: 'taskId=' + this.taskId + '&jobId=' + this.jobId + '&pageSize=' + this.taskHistoryDetailPageHelp.pageSize + '&curPage=' + pageIndex,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then((res) => {
          res.json().then((json) => {
            this.taskHistroyDetailLoading = false
            this.taskHistoryDetailTableData = json.result.data.failCaseList.result
            this.taskHistoryDetailPageHelp.totalNum = json.result.data.failCaseList.page.totalNum
            this.taskHistoryDetailPageHelp.totalPageNum = json.result.data.failCaseList.page.totalPageNum
            for (let i = 0; i < this.taskHistoryDetailTableData.length; i++) {
              this.taskHistoryDetailTableData[i].updateTime = this.formatDate(new Date(this.taskHistoryDetailTableData[i].updateTime), 'yyyy-MM-dd hh:mm:ss')
            }
//            console.log('addtask:' + JSON.stringify(json))
          })
        }).catch((e) => {
          e.toString()
        })
      },
      getTaskHistoryDetailPageSize (pageSize) {
        this.taskHistoryDetailPageHelp.pageSize = pageSize
      },
      removeTaskByNlp (index) {
        fetch(window.serverurl + '/task/delete', {
          method: 'POST',
          body: JSON.stringify({id: this.taskTableData[index].id}),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }).then((res) => {
          res.json().then((json) => {
            console.log(json)
            this.getNlpTaskList()
          })
        }).catch((e) => {
          e.toString()
        })
      },
      removeTaskByAsr (index) {
        fetch(window.serverurl + '/task/delete', {
          method: 'POST',
          body: JSON.stringify({id: this.taskTableData[index].id}),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }).then((res) => {
          res.json().then((json) => {
            console.log(json)
            this.getAsrTaskList()
          })
        }).catch((e) => {
          e.toString()
        })
      },
      removeTask (index) {
        switch (this.SelectProjectModel) {
          case 'nlp': {
            this.removeTaskByNlp(index)
            break
          }
          case 'asr': {
            this.removeTaskByAsr(index)
            break
          }
        }
      },
      getAllTask () {
//        this.taskTableData.push(this.addTask)
//        fetch(window.serverurl + '/task/taskList', {
//          method: 'POST',
//          body: {type: 'NLP'},
//          headers: {
//            'Accept': 'application/json',
//            'Content-Type': 'application/json'
//          }
//        }).then((res) => {
//          res.json().then((json) => {
//            console.log('addtask:' + JSON.stringify(json))
//          })
//        }).catch((e) => {
//          e.toString()
//        })
      },
      addOrSaveTask () {
        this.addTask.projectIds = this.targetKeys3
        if (typeof this.addTask.projectIds === 'undefined') {
          this.addTask.projectIds = []
        }
        if (this.addTaskButtunFlag === false) {
          this.$set(this.taskTableData[this.index], this.addTask)
          this.taskTableData[this.index] = this.addTask
          delete this.taskTableData[this.index].updateTime
          delete this.taskTableData[this.index].createTime
          this.editTaskFunction(this.taskTableData[this.index])
        } else {
          switch (this.SelectProjectModel) {
            case 'nlp': {
              this.addTask.type = 'NLP'
              break
            }
            case 'asr': {
              this.addTask.type = 'ASR'
              this.addTask.projectId = this.asrdata
              break
            }
          }
          this.addTaskFunction()
        }
        this.addTask = {
          name: '',
          module: null,
          projectData: [],
          projectId: '',
          id: '',
          projectIds: [],
          author: '',
          createTime: null,
          updateTime: null,
          type: '',
          result: '',
          status: '',
          cellClassName: {}
        }
      },
      editTaskFunction (editTaskData) {
        fetch(window.serverurl + '/task/edit', {
          method: 'POST',
          body: JSON.stringify(editTaskData),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }).then((res) => {
          res.json().then((json) => {
            console.log('addtask:' + JSON.stringify(json))
            switch (this.SelectProjectModel) {
              case 'nlp': {
                this.getNlpTaskList()
                break
              }
              case 'asr': {
                this.getAsrTaskList()
                break
              }
            }
          })
        }).catch((e) => {
          console.log(e.toString())
          e.toString()
        })
      },
      addTaskFunction () {
        fetch(window.serverurl + '/task/create', {
          method: 'POST',
          body: JSON.stringify(this.addTask),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }).then((res) => {
          res.json().then((json) => {
//            console.log('addtask:' + JSON.stringify(json))
            switch (this.SelectProjectModel) {
              case 'nlp': {
                this.getNlpTaskList()
                break
              }
              case 'asr': {
                this.getAsrTaskList()
                break
              }
            }
          })
        }).catch((e) => {
          e.toString()
        })
      },
      getNlpTaskList () {
        // console.log('size: ' + this.taskPageHelp.pageSize)
        fetch(window.serverurl + '/task/taskList', {
          method: 'POST',
          body: 'type=NLP&pageSize=' + this.taskPageHelp.pageSize + '&curPage=' + this.taskPageHelp.curPage,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then((res) => {
          res.json().then((json) => {
            if (typeof json.result.data.result === 'undefined') {
              return
            }
            this.taskTableData = json.result.data.result
            this.taskPageHelp.totalNum = json.result.data.page.totalNum
            this.taskPageHelp.totalPageNum = json.result.data.page.totalPageNum
            for (let i = 0; i < this.taskTableData.length; i++) {
              this.taskTableData[i].createTime = this.formatDate(new Date(this.taskTableData[i].createTime), 'yyyy-MM-dd hh:mm:ss')
              this.taskTableData[i].updateTime = this.formatDate(new Date(this.taskTableData[i].updateTime), 'yyyy-MM-dd hh:mm:ss')
            }
//            console.log('addtask:' + JSON.stringify(json))
          })
        }).catch((e) => {
          e.toString()
        })
      },
      formatDate (date, fmt) {
        if (/(y+)/.test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
        }
        let o = {
          'M+': date.getMonth() + 1,
          'd+': date.getDate(),
          'h+': date.getHours(),
          'm+': date.getMinutes(),
          's+': date.getSeconds()
        }
        for (let k in o) {
          if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + ''
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : this.padLeftZero(str))
          }
        }
        return fmt
      },
      padLeftZero (str) {
        return ('00' + str).substr(str.length)
      },
      addTaskCancelEvent () {
        this.addTask = {
          name: '',
          projectIds: [],
          projectId: '',
          type: 'NLP',
          author: '',
          module: null,
          createTime: null,
          updateTime: null,
          result: '',
          caseMount: '',
          projectData: [],
          cellClassName: {}
        }
      },
      getDateTime () {
        let date = new Date()
        return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
      },
      searchTask () {
        fetch('http://localhost:8000/tts/search?' + 'condition=' + this.condition, {
          method: 'GET'
        }).then((res) => {
          res.json().then((json) => {
            this.taskTableData = json
            for (var i = 0; i < this.taskTableData.length; i++) {
              this.$set(this.taskTableData[i], 'result', '')
            }
          })
        }).catch((e) => {
          e.toString()
        })
      },
      executeTaskByNlp (index) {
        //        this.$set(this.taskTableData[index], 'result', 'testing')
        fetch(window.serverurl + '/task/batch?taskId=' + this.taskTableData[index].id, {
          method: 'POST',
//          body: JSON.stringify({taskId: this.taskTableData[index].id}),
          headers: {
            'Accept': 'application/json'
          }
        }).then((res) => {
          try {
            if (res.status === 400) {
              return
            }
            res.json().then((json) => {
              console.log(JSON.stringify(json))
//              this.$set(this.taskTableData[index], 'result', json.data.result)
            })
          } catch (e) {
            console.log(e.toString())
          }
        }).catch((e) => {
          e.toString()
        })
      },
      executeTaskByAsr (index) {
        fetch(window.serverurl + '/performance/asyncExecuteSSH?taskId=' + this.taskTableData[index].id + '&port=10000&server=ksyun-1&cmd=' + this.taskTableData[index].projectId, {
          method: 'GET',
//          body: JSON.stringify({taskId: this.taskTableData[index].id}),
          headers: {
            'Accept': 'application/json'
          }
        }).then((res) => {
          try {
            if (res.status === 400) {
              return
            }
            res.json().then((json) => {
              console.log(JSON.stringify(json))
              this.getAsrTaskList()
//              this.$set(this.taskTableData[index], 'result', json.data.result)
            })
          } catch (e) {
            console.log(e.toString())
          }
        }).catch((e) => {
          e.toString()
        })
      },
      executeTask (index) {
        switch (this.SelectProjectModel) {
          case 'nlp': {
            this.executeTaskByNlp(index)
            break
          }
          case 'asr': {
            this.executeTaskByAsr(index)
            break
          }
        }
      },
      getProjectIdList () {
        fetch(window.serverurl + '/project/allList', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then((res) => {
          res.json().then((json) => {
            var mockdata = json.result.data
            for (let i = 0; i < mockdata.length; i++) {
              this.addTask.projectData.push({
                key: mockdata[i].id,
                label: mockdata[i].moduleName,
                description: mockdata[i].projectName
              })
            }
          })
        }).catch((e) => {
          console.log(e)
          e.toString()
        })
      },
      getTargetKeys () {
        console.log('----->' + this.targetKeys3)
      },
      keyChange (newTargetKeys, direction, moveKeys) {
        console.log('this.targetKeys3: ' + this.targetKeys3 + ' direction: ' + direction + ' moveKeys: ' + moveKeys)
        this.targetKeys3 = newTargetKeys
        // var len = this.targetKeys3.length
        // for (let i = 0; i < len; i++) {
        //   console.log('key: ' + newTargetKeys[i])
        // }
      },
      render3 (item) {
        switch (this.SelectProjectModel) {
          case 'nlp': {
            return item.label + ' - ' + item.description
          }
          case 'asr': {
            return item.label
          }
        }
        return item.label + ' - ' + item.description
      },
      reloadMockData () {
        this.addTask.projectData.splice(0, this.addTask.projectData.length)
        this.targetKeys3.splice(0, this.targetKeys3.length)
        switch (this.SelectProjectModel) {
          case 'nlp': {
            this.getProjectIdListByNlp()
            break
          }
          case 'asr': {
            this.getProjectIdListByAsr()
            break
          }
        }
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
      },
      getJobDetailByNlp (index) {
        this.jobId = this.taskHistoryTableData[index].jobId
        this.taskHistroyDetailLoading = true
        fetch(window.serverurl + '/task/taskExecuteDetail', {
          method: 'POST',
          body: 'taskId=' + this.taskId + '&jobId=' + this.taskHistoryTableData[index].jobId + '&pageSize=' + this.taskHistoryDetailPageHelp.pageSize + '&curPage=' + this.taskHistoryDetailPageHelp.curPage,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then((res) => {
          res.json().then((json) => {
            this.nlpResultReport.totalNum = json.result.data.totalNum
            this.nlpResultReport.ignoreNum = json.result.data.ignoreNum
            this.nlpResultReport.passNum = json.result.data.passNum
            this.nlpResultReport.runNum = json.result.data.runNum
            this.nlpResultReport.failNum = json.result.data.failNum
            this.taskHistroyDetailLoading = false
            this.taskHistoryDetailTableData = json.result.data.failCaseList.result
            this.taskHistoryDetailPageHelp.totalNum = json.result.data.failCaseList.page.totalNum
            this.taskHistoryDetailPageHelp.totalPageNum = json.result.data.failCaseList.page.totalPageNum
            for (var i = 0; i < this.taskHistoryDetailTableData.length; i++) {
              this.taskHistoryDetailTableData[i].updateTime = this.formatDate(new Date(this.taskHistoryDetailTableData[i].updateTime), 'yyyy-MM-dd hh:mm:ss')
            }
//            console.log('addtask:' + JSON.stringify(json))
          })
        }).catch((e) => {
          e.toString()
        })
      },
      getJobDetailByAsr (index) {},
      getJobDetail (index) {
        switch (this.SelectProjectModel) {
          case 'nlp': {
            this.getJobDetailByNlp(index)
            break
          }
          case 'asr': {
            this.getJobDetailByAsr(index)
            break
          }
        }
      }
    },
    mounted () {
      this.intervalTmp = setInterval(() => {
        this.getNlpTaskList()
      }, 10000)
    },
    destroyed () {
      console.log('task destoryed.....')
      clearInterval(this.intervalTmp)
    }
  }
</script>
