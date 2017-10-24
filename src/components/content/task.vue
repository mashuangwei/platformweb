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
        <Select v-model="SelectProjectModel" style="width:150px">
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
      <Table :loading="loading" :columns="tasktable" :data="taskTableData" width="1370" height="690" :border="showBorder" :stripe="showStripe"
             :show-header="showHeader" :showIndex="true"></Table>
    </row>
    <br>
    <!-- 分页 -->
    <row>
      <i-col span="14" offset="10">
        <Page :total="100" size="small" show-elevator show-sizer show-total placement="top"></Page>
      </i-col>
    </row>

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
        :data="projectData"
        :target-keys="targetKeys3"
        :list-style="listStyle"
        :render-format="render3"
        :operations="['向左移动','向右移动']"
        filterable
        @on-change="handleChange3">
        <div :style="{float: 'right', margin: '5px'}">
          <Button type="ghost" size="small" @click="reloadMockData">刷新</Button>
        </div>
      </Transfer>


    </Modal>
  </div>
</template>
<script>
  import $ from 'jquery'
  import ICol from '../../../node_modules/iview/src/components/grid/col.vue'
  import Row from '../../../node_modules/iview/src/components/grid/row.vue'

  export default {
    components: {
      Row,
      ICol,
      'name': 'asr'
    },
    data () {
      return {
        projectData: this.getMockData(),
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
        okButtonText: '添加',
        taskmodeltitle: '添加Task',
        addTaskButtunFlag: true,
        condition: '',
        addTask: {
          name: '',
          module: null,
          createTime: null,
          updateTime: null,
          cellClassName: {}
        },
        tasktable: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: 'task名称',
            width: 410,
            key: 'name',
            align: 'center'
          },
          {
            title: '创建时间',
            width: 160,
            key: 'createTime',
            align: 'center'
          },
          {
            title: '更新时间',
            width: 160,
            key: 'updateTime',
            align: 'center'
          },
          {
            title: '执行结果',
            width: 150,
            key: 'result',
            align: 'center',
            render: (h, params) => {
              const row = params.row
              const text = row.result === '' ? '未执行' : row.result === 'testing' ? '测试中 ' : row.result === 'success' ? '测试通过' : '测试失败'
              const color = row.result === '' ? 'yellow' : row.result === 'testing' ? 'blue' : row.result === 'success' ? 'green' : 'red'
              return h('Tag', {
                props: {
                  type: 'dot',
                  color: color
                }
              }, text)
            }
          },
          {
            title: '测试详情',
            width: 185,
            key: 'fileurl',
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
//                      this.editTask(params.index)
                    }
                  }
                }, '查看'),
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
//                      this.executeTask(params.index)
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
        taskTableData: []
      }
    },
    created () {
      this.getTaskList()
    },
    methods: {
      handleSuccess (res, file, fileList) {
        this.uploadShowFlag = false
        console.log(res)
        console.log(file)
        console.log(fileList)
      },
      editTask (index) {
        this.index = index
        this.taskmodeltitle = '编辑Task'
        this.okButtonText = '保存'
        this.addtaskmodal = true
        this.addTaskButtunFlag = false
        this.addTask = Object.assign({}, this.addTask, this.taskTableData[index])
        this.addTask.createTime = null
        this.addTask.updateTime = null
      },
      addTaskData () {
        this.taskmodeltitle = '添加Task'
        this.addtaskmodal = true
        this.addTaskButtunFlag = true
        this.okButtonText = '添加'
      },
      removeTask (index) {
        fetch('http://localhost:8000/tts/delete/' + this.taskTableData[index].id, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }).then((res) => {
          res.json().then((json) => {
            console.log(json)
            this.getAllTask()
          })
        }).catch((e) => {
          e.toString()
        })
      },
      getAllTask () {
        this.taskTableData.push(this.addTask)
        this.addTask = {
          name: '',
          module: null,
          createTime: null,
          updateTime: null,
          cellClassName: {}
        }
      },
      addOrSaveTask () {
        if (this.addTaskButtunFlag === false) {
          this.$set(this.taskTableData[this.index], this.addTask)
          this.taskTableData[this.index] = this.addTask
//          console.log(this.taskTableData[this.index])
//          fetch('http://localhost:8000/tts/update/' + this.taskTableData[this.index].id, {
//            method: 'PUT',
//            body: JSON.stringify(this.addTask),
//            headers: {
//              'Accept': 'application/json',
//              'Content-Type': 'application/json'
//            }
//          }).then((res) => {
//            res.json().then((json) => {
//              this.getAllTask()
//            })
//          }).catch((e) => {
//            e.toString()
//          })
        } else {
          this.taskTableData.push(this.addTask)
          this.addTask = {}
//          fetch('http://localhost:8000/tts/add', {
//            method: 'POST',
//            body: JSON.stringify(this.addTask),
//            headers: {
//              'Accept': 'application/json',
//              'Content-Type': 'application/json'
//            }
//          }).then((res) => {
//            res.json().then((json) => {
//              console.log(json)
//              this.getAllTask()
//            })
//          }).catch((e) => {
//            e.toString()
//          })
        }
        this.addTask = {
          name: '',
          module: null,
          createTime: null,
          updateTime: null,
          cellClassName: {}
        }
      },
      getTaskList () {
        fetch('http://localhost:8000/tts/getAllTts', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }).then((res) => {
          res.json().then((json) => {
            this.taskTableData = json
            for (var i = 0; i < this.taskTableData.length; i++) {
              this.$set(this.taskTableData[i], 'result', '')
              this.taskTableData[i].createTime = this.formatTime(this.taskTableData[i].createTime)
              this.taskTableData[i].updateTime = this.formatTime(this.taskTableData[i].updateTime)
            }
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
      addTaskCancelEvent () {
        this.addTask = {
          name: '',
          module: null,
          createTime: null,
          updateTime: null,
          cellClassName: {}
        }
      },
      getDateTime () {
        var date = new Date()
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
      executeTask (index) {
        this.$set(this.taskTableData[index], 'result', 'testing')
        fetch('http://localhost:8000/tts/send/' + this.taskTableData[index].id, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json'
          }
        }).then((res) => {
          res.json().then((json) => {
            this.$set(this.taskTableData[index], 'result', json.data.result)
          })
        }).catch((e) => {
          e.toString()
        })
      },
      getMockData () {
        let mockData = []
        for (let i = 1; i <= 20; i++) {
          mockData.push({
            key: i.toString(),
            label: '内容' + i,
            description: '内容' + i + '的描述信息'
//            disabled: Math.random() * 3 < 1
          })
        }
        return mockData
      },
      getTargetKeys () {
//        return this.getMockData()
//          .filter(() => Math.random() * 2 > 1)
//          .map(item => item.key)
      },
      handleChange3 (newTargetKeys) {
        this.targetKeys3 = newTargetKeys
        var len = this.targetKeys3.length
        for (let i = 0; i < len; i++) {
          console.log('key: ' + newTargetKeys[i])
        }
      },
      render3 (item) {
        return item.label + ' - ' + item.description
      },
      reloadMockData () {
        this.projectData = this.getMockData()
        this.targetKeys3 = this.getTargetKeys()
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
//      this.$on('editor-update', this.onEditIntents)
    }
  }
</script>

