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
        <Button type="primary" @click="addAsrCase" style="margin-bottom:15px;">新增</Button>
      </i-col>
      <i-col span="3" offset="12">
        <Input v-model="condition" icon="ios-search-strong" placeholder="请输入..."
               style="width: 200px"></Input>
      </i-col>
      <i-col span="1" offset="2">
        <Button type="primary" icon="ios-search" @click="searchCase">搜索</Button>
      </i-col>
    </Row>

    <row>
      <Table  :columns="casetable" :data="casedata" width="1370" height="690" :border="showBorder" :stripe="showStripe"
              :loading="loading" :show-header="showHeader" :showIndex="true"></Table>
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
      width="780"
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
          <div style="line-height: 32px;"><label>返回语句：</label></div>
        </i-col>
        <i-col span="3" offset="1">
          <div>
            <Input v-model="addcase.ttstext" placeholder="请输入..." style="width: 420px"></Input>
          </div>
        </i-col>
      </row>
      <br>

      <row>
        <i-col span="2" offset="0">
          <div style="line-height: 32px;"><label>Url：</label></div>
        </i-col>
        <i-col span="3" offset="1">
          <div>
            <Input v-model="addcase.serverUrl" placeholder="请输入..." style="width: 420px"></Input>
          </div>
        </i-col>
      </row>
      <br>

      <row>
        <i-col span="2" offset="0">
          <div style="line-height: 32px;"><label>key：</label></div>
        </i-col>
        <i-col span="3" offset="1">
          <div>
            <Input v-model="addcase.authkey" placeholder="请输入..." style="width: 420px"></Input>
          </div>
        </i-col>
      </row>
      <br>

      <row>
        <i-col span="2" offset="0">
          <div style="line-height: 32px;"><label>secret：</label></div>
        </i-col>
        <i-col span="3" offset="1">
          <div>
            <Input v-model="addcase.secret" placeholder="请输入..." style="width: 420px"></Input>
          </div>
        </i-col>
      </row>
      <br>

      <row>
        <i-col span="2" offset="0">
          <div style="line-height: 32px;"><label>deviceId：</label></div>
        </i-col>
        <i-col span="3" offset="1">
          <div>
            <Input v-model="addcase.deviceid" placeholder="请输入..." style="width: 420px"></Input>
          </div>
        </i-col>
      </row>
      <br>

      <row>
        <i-col span="2" offset="0">
          <div style="line-height: 32px;"><label>deviceTypeId：</label></div>
        </i-col>
        <i-col span="3" offset="1">
          <div>
            <Input v-model="addcase.devicetypeid" placeholder="请输入..." style="width: 420px"></Input>
          </div>
        </i-col>
      </row>
      <br>

      <row>
        <i-col span="2" offset="0">
          <div style="line-height: 32px;"><label>codec：</label></div>
        </i-col>
        <i-col span="3" offset="1">
          <div>
            <Input v-model="addcase.codec" placeholder="请输入..." style="width: 420px"></Input>
          </div>
        </i-col>
      </row>
      <br>

      <row>
        <i-col span="2" offset="0">
          <div style="line-height: 32px;"><label>语言：</label></div>
        </i-col>
        <i-col span="3" offset="1">
          <div>
            <Input v-model="addcase.declaimer" placeholder="请输入..." style="width: 420px"></Input>
          </div>
        </i-col>
      </row>
      <br>

      <row>
        <i-col span="2" offset="0">
          <div style="line-height: 32px;"><label>版本：</label></div>
        </i-col>
        <i-col span="3" offset="1">
          <div>
            <Input v-model="addcase.version" placeholder="请输入..." style="width: 420px"></Input>
          </div>
        </i-col>
      </row>
      <br>

      <row v-show="voiceFlag">
        <i-col span="2" offset="0">
          <div style="line-height: 32px;"><label>语音文件：</label></div>
        </i-col>
        <i-col span="7" offset="1">
          <div>
            <!--<Input v-model="addcase.ttstext" placeholder="请输入..." style="width: 420px"></Input>-->

          </div>
        </i-col>
      </row>
      <br>
    </Modal>
  </div>
</template>
<script>
  import $ from 'jquery'

  export default {
    components: {
      'name': 'asr'
    },
    data () {
      return {
        loading: false,
        fileName: '',
        voiceFlag: false,
        index: 0,
        visible: false,
        showBorder: true,
        showStripe: true,
        showHeader: true,
        fixedHeader: true,
        addcasemodal: false,
        okButtonText: '添加',
        casemodeltitle: '添加用例',
        addCaseButtunFlag: true,
        condition: '',
        addcase: {
          name: '',
          ttstext: '',
          deviceid: '',
          devicetypeid: '',
          authkey: '',
          version: '1.0',
          declaimer: 'zh',
          serverUrl: 'wss://apigwws-dev.open.rokid.com/api',
          codec: 'pcm',
          secret: '',
          createTime: '',
          updateTime: '',
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
            title: 'PCM文件',
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
//                      this.editCase(params.index)
                    }
                  }
                }, '下载'),
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
//                      this.executeCase(params.index)
                    }
                  }
                }, '删除')
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
        casedata: []
      }
    },
    created () {
      this.getAllCase()
    },
    methods: {
      handleSuccess (res, file, fileList) {
        this.uploadShowFlag = false
        console.log(res)
        console.log(file)
        console.log(fileList)
      },
      editCase (index) {
        this.index = index
        this.casemodeltitle = '编辑用例'
        this.okButtonText = '保存'
        this.addcasemodal = true
        this.addCaseButtunFlag = false
        this.addcase = Object.assign({}, this.addcase, this.casedata[index])
        this.addcase.createTime = null
        this.addcase.updateTime = null
      },
      addAsrCase () {
        this.casemodeltitle = '添加用例'
        this.addcasemodal = true
        this.addCaseButtunFlag = true
        this.okButtonText = '添加'
      },
      removeCase (index) {
        fetch('http://localhost:8000/speech/delete/' + this.casedata[index].id, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }).then((res) => {
          res.json().then((json) => {
            console.log(json)
            this.getAllCase()
          })
        }).catch((e) => {
          e.toString()
        })
      },
      addOrSaveCaseEvent () {
        if (this.addCaseButtunFlag === false) {
          fetch('http://localhost:8000/speech/update/' + this.casedata[this.index].id, {
            method: 'PUT',
            body: JSON.stringify(this.addcase),
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }).then((res) => {
            res.json().then((json) => {
              this.getAllCase()
            })
          }).catch((e) => {
            e.toString()
          })
        } else {
          fetch('http://localhost:8000/speech/add', {
            method: 'POST',
            body: JSON.stringify(this.addcase),
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }).then((res) => {
            res.json().then((json) => {
              console.log(json)
              this.getAllCase()
            })
          }).catch((e) => {
            e.toString()
          })
        }
        this.addcase = {
          name: '',
          ttstext: '',
          codec: 'pcm',
          secret: '',
          deviceid: '',
          devicetypeid: '',
          authkey: '',
          serverUrl: 'wss://apigwws-dev.open.rokid.com/api',
          version: '1.0',
          declaimer: 'zh',
          cellClassName: {}
        }
      },
      getAllCase () {
        this.loading = true
        fetch('http://localhost:8000/speech/getAllSpeech', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }).then((res) => {
          res.json().then((json) => {
            this.casedata = json
            for (var i = 0; i < this.casedata.length; i++) {
              this.$set(this.casedata[i], 'result', '')
              this.casedata[i].createTime = this.formatTime(this.casedata[i].createTime)
              this.casedata[i].updateTime = this.formatTime(this.casedata[i].updateTime)
            }
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
      addCaseCancelEvent () {
        this.addcase = {
          name: '',
          ttstext: '',
          codec: 'pcm',
          secret: '',
          deviceid: '',
          devicetypeid: '',
          authkey: '',
          serverUrl: 'wss://apigwws-dev.open.rokid.com/api',
          version: '1.0',
          declaimer: 'zh',
          cellClassName: {}
        }
      },
      getDateTime () {
        var date = new Date()
        return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
      },
      searchCase () {
        fetch('http://localhost:8000/speech/search?' + 'condition=' + this.condition, {
          method: 'GET'
        }).then((res) => {
          res.json().then((json) => {
            this.casedata = json
            for (var i = 0; i < this.casedata.length; i++) {
              this.$set(this.casedata[i], 'result', '')
            }
          })
        }).catch((e) => {
          e.toString()
        })
      },
      executeCase (index) {
        this.$set(this.casedata[index], 'result', 'testing')
        fetch('http://localhost:8000/speech/sendVoice/' + this.casedata[index].id, {
          method: 'POST',
          headers: {
            'Accept': 'application/json'
          }
        }).then((res) => {
          res.json().then((json) => {
            this.$set(this.casedata[index], 'result', json.data.result)
          })
        }).catch((e) => {
          e.toString()
        })
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
      this.$on('editor-update', this.onEditIntents)
    }
  }
</script>

