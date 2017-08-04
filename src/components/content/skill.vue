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
<template>
  <div>
    <Row>
      <i-col span="2">
        <Button type="primary" @click="addTemplate" style="margin-bottom:15px;">新增</Button>
      </i-col>
      <i-col span="3" offset="12">
        <Input v-model="condition" icon="ios-search-strong" placeholder="请输入..."
               style="width: 200px"></Input>
      </i-col>
      <i-col span="1" offset="2">
        <Button type="primary" icon="ios-search" @click="searchBy">搜索</Button>
      </i-col>
    </Row>

    <row>
      <Table :columns="skilltable" :data="skilldatalist" width="1270" height="690" :border="showBorder"
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

    <!-- skill新增页面 -->
    <Modal
      @on-ok="addOrSaveEvent"
      @on-cancel="addCancelEvent"
      :mask-closable="false"
      width="880"
      :title=skillmodeltitle
      :okText=okButtonText
      v-model="addTemplateModal"
      :styles="{top: '20px'}">

      <row>
        <i-col span="2" offset="0">
          <div style="line-height: 32px;"><label>用户名：</label></div>
        </i-col>
        <i-col span="3" offset="1">
          <div>
            <Input v-model="skilltemplate.username" placeholder="请输入..." style="width: 220px"></Input>
          </div>
        </i-col>

        <i-col span="2" offset="6">
          <div style="line-height: 32px;"><label>密 码：</label></div>
        </i-col>
        <i-col span="3" offset="1">
          <div>
            <Input v-model="skilltemplate.password" placeholder="请输入..." style="width: 220px"></Input>
          </div>
        </i-col>
      </row>
      <br>

      <row>
        <i-col span="2" offset="0">
          <div style="line-height: 32px;"><label>技能名称：</label></div>
        </i-col>
        <i-col span="3" offset="1">
          <div>
            <Input v-model="skilltemplate.skillname" placeholder="请输入..." style="width: 220px"></Input>
          </div>
        </i-col>

        <i-col span="2" offset="6">
          <div style="line-height: 32px;"><label>激活词：</label></div>
        </i-col>
        <i-col span="3" offset="1">
          <div>
            <Input v-model="skilltemplate.activeWords" placeholder="请输入..." style="width: 220px"></Input>
          </div>
        </i-col>
      </row>
      <br>

      <row>
        <i-col span="2" offset="0">
          <div style="line-height: 32px;"><label>技能属性：</label></div>
        </i-col>
        <i-col span="3" offset="1">
          <Select v-model="skilltemplate.appProperty" style="width:220px" @on-change="selectAppProerty">
            <Option v-for="item in appPropertyList" :value="item.value" :key="item"></Option>
          </Select>
        </i-col>

        <i-col span="2" offset="6">
          <div style="line-height: 32px;"><label>技能类型：</label></div>
        </i-col>
        <i-col span="3" offset="1">
          <Select v-model="skilltemplate.type" style="width:220px" @on-change="selectType">
            <Option v-for="item in typeList" :value="item.value" :key="item"></Option>
          </Select>
        </i-col>
      </row>
      <br>

      <row v-show="appScopeShow">
        <i-col span="2" offset="0">
          <div style="line-height: 32px;"><label>作用域：</label></div>
        </i-col>
        <i-col span="3" offset="1">
          <Select v-model="skilltemplate.appScope" style="width:220px" @on-change="selectAppScope">
            <Option v-for="item in appScopeList" :value="item.value" :key="item"></Option>
          </Select>
        </i-col>
      </row>
      <br>

      <row>
        <i-col span="2" offset="0">
          <div style="line-height: 32px;"><label>slot：</label></div>
        </i-col>
        <i-col span="3" offset="1">
          <Select v-model="skilltemplate.slot" style="width:220px" @on-change="selectAppSlot">
            <Option v-for="item in appSlotList" :value="item.name" :key="item"></Option>
          </Select>
        </i-col>
        <i-col span="2" offset="4">
          <Button type="primary" icon="plus-circled">添加</Button>
        </i-col>
        <i-col span="2" offset="1">
          <Button type="primary" icon="edit">编辑</Button>
        </i-col>
      </row>
      <br>

      <row>
        <i-col span="2" offset="0">
          <div style="line-height: 32px;"><label>后端服务：</label></div>
        </i-col>
        <i-col span="19" offset="1">
          <Radio-group v-model="serviceType" @on-change="selectService">
            <Radio label="JsEngine">
              <!--<Icon type="leaf"></Icon>-->
              <span>JsEngine</span>
            </Radio>
            <Radio label="Https">
              <!--<Icon type="earth"></Icon>-->
              <span>Https</span>
            </Radio>
          </Radio-group>
          <div v-show="jsOrHttps" style="padding-top:8px">
            <Input v-model="skilltemplate.backService" placeholder="请输入..." style="width: 420px"></Input>
          </div>

          <div v-show="!jsOrHttps" style="padding-top:8px">
            <editor id="j_basckserviceEditor" :content="editorInitJson" :height="'150px'" :width="'100%'"
                    :lang="'javascript'" :sync="true"></editor>
          </div>
        </i-col>
      </row>

      <br>
      <row>
        <i-col span="2" offset="0">
          <div style="line-height: 32px;"><label>intents：</label></div>
        </i-col>
        <i-col span="19" offset="1">
          <div v-show="true" style="padding-top:8px">
            <editor id="j_intentEditor" :content="skilltemplate.intents" :height="'150px'" :width="'100%'"
                    :lang="'javascript'" :sync="true"></editor>
          </div>
        </i-col>
      </row>
      <br>

    </Modal>
  </div>
</template>
<script>
  import $ from 'jquery'
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
      'name': 'skill'
    },
    data () {
      return {
        editorInitJson: [
          'exports.handler = function(event, context, callback) {',
          '    var rokid = Rokid.handler(event, context,callback);',
          '    rokid.registerHandlers(handlers);',
          '    rokid.execute();',
          '};',
          '    ',
          'var handlers = {',
          '    \'ROKID.INTENT.WELCOME\':function() {',
          '        try {',
          '            this.emit(\':tts\',{tts:\'可自配置欢迎词\'});',
          '            this.callback();',
          '        } catch (e) {',
          '            this.callback(e);',
          '        }',
          '    },',
          '    \'Hello_Developer\':function() {',
          '        try {',
          '            this.emit(\':tts\',{tts:\'欢迎成为Rokid开发者!\'});',
          '            this.callback();',
          '       } catch (e) {',
          '           this.callback(e);',
          '        }',
          '    }',
          '};'
        ].join('\n'),
        jsOrHttps: true,
        serviceType: 'Https',
        fileName: '',
        voiceFlag: false,
        index: 0,
        visible: false,
        showBorder: true,
        showStripe: true,
        showHeader: true,
        fixedHeader: true,
        addTemplateModal: false,
        appScopeShow: false,
        okButtonText: '添加',
        skillmodeltitle: '添加SKILL模板',
        addTemplateButtunFlag: true,
        condition: '',
        skilldatalist: [],
        appScopeList: [{value: '云端'}, {value: '本地'}],
        appPropertyList: [{value: '公有'}, {value: '私有'}],
        appSlotList: [{value: '歌曲', name: '音乐'}, {value: '电视节目', name: '电影'}],
        typeList: [{value: '自定义技能'}, {value: '预定义技能'}, {value: '核心技能'}],
        skilltemplate: {
          username: '',
          password: '',
          appId: '',
          activeWords: '',
          skillname: '',
          type: '自定义技能',
          appScope: '本地',
          appProperty: '公有',
          backServiceType: 'https',
          backService: 'wss://apigwws-dev.open.rokid.com/api',
          intents: '{\n' +
          '\t"intents": [\n' +
          '\t\t{\n' +
          '\t\t\t"intent": "Hello_Developer",\n' +
          '\t\t\t"user_says": [\n' +
          '\t\t\t\t"你好"\n' +
          '\t\t\t]\n' +
          '\t\t}\n' +
          '\t]\n' +
          '}',
          slot: '',
          domainId: '',
          createTime: '',
          updateTime: ''
        },
        skilltable: [
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '技能名称',
            width: 350,
            key: 'skillname',
            align: 'center'
          },
          {
            title: 'AppId',
            width: 290,
            key: 'appId',
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
                      this.editTemplate(params.index)
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
                      this.removeTemplate(params.index)
                    }
                  }
                }, '删除')
              ])
            }
          }
        ]
      }
    },
    created () {
      this.getAllSkillTemplate()
    },
    methods: {
      handleSuccess (res, file, fileList) {
        this.uploadShowFlag = false
      },
      selectAppScope () {},
      selectType () {},
      selectService () {
        if (this.serviceType === 'Https') {
          this.jsOrHttps = true
        } else {
          this.jsOrHttps = false
        }
        console.log(this.editorInitJson)
      },
      selectAppProerty () {
        if (this.skilltemplate.appProperty === '私有') {
          this.appScopeShow = true
        } else {
          this.appScopeShow = false
        }
      },
      selectAppSlot () {},
      editTemplate (index) {
        this.index = index
        this.skillmodeltitle = '编辑SKILL模板'
        this.okButtonText = '保存'
        this.addTemplateModal = true
        this.addTemplateButtunFlag = false
        this.skilltemplate = Object.assign({}, this.skilltemplate, this.skilldatalist[index])
        this.skilltemplate.createTime = null
        this.skilltemplate.updateTime = null
      },
      addTemplate () {
        this.skillmodeltitle = '添加SKILL模板'
        this.addTemplateModal = true
        this.addTemplateButtunFlag = true
        this.okButtonText = '添加'
      },
      removeTemplate (index) {
//        fetch('http://localhost:8000/tts/delete/' + this.casedata[index].id, {
//          method: 'DELETE',
//          headers: {
//            'Accept': 'application/json',
//            'Content-Type': 'application/json'
//          }
//        }).then((res) => {
//          res.json().then((json) => {
//            console.log(json)
//            this.getAllCase()
//          })
//        }).catch((e) => {
//          e.toString()
//        })
        this.skilldatalist.splice(index, 1)
      },
      addOrSaveEvent () {
        this.skilldatalist.push(this.skilltemplate)
//        if (this.addTemplateButtunFlag === false) {
//          fetch('http://localhost:8000/tts/update/' + this.skilldatalist[this.index].id, {
//            method: 'PUT',
//            body: JSON.stringify(this.skilltemplate),
//            headers: {
//              'Accept': 'application/json',
//              'Content-Type': 'application/json'
//            }
//          }).then((res) => {
//            res.json().then((json) => {
//              this.getAllCase()
//            })
//          }).catch((e) => {
//            e.toString()
//          })
//        } else {
//          fetch('http://localhost:8000/tts/add', {
//            method: 'POST',
//            body: JSON.stringify(this.skilltemplate),
//            headers: {
//              'Accept': 'application/json',
//              'Content-Type': 'application/json'
//            }
//          }).then((res) => {
//            res.json().then((json) => {
//              console.log(json)
//              this.getAllCase()
//            })
//          }).catch((e) => {
//            e.toString()
//          })
//        }
        this.skilltemplate = {
          appId: '',
          activeWords: '',
          skillname: '',
          backServiceType: 'https',
          type: '预定义',
          appScope: '本地',
          appProperty: '公有',
          backService: 'wss://apigwws-dev.open.rokid.com/api',
          intents: 'intent',
          slot: '',
          createTime: '',
          updateTime: ''
        }
      },
      getAllSkillTemplate () {
//        fetch('http://localhost:8000/tts/getAllTts', {
//          method: 'GET',
//          headers: {
//            'Accept': 'application/json',
//            'Content-Type': 'application/json'
//          }
//        }).then((res) => {
//          res.json().then((json) => {
//            this.casedata = json
//            for (var i = 0; i < this.casedata.length; i++) {
//              this.$set(this.casedata[i], 'result', '')
//              this.casedata[i].createTime = this.formatTime(this.casedata[i].createTime)
//              this.casedata[i].updateTime = this.formatTime(this.casedata[i].updateTime)
//            }
//          })
//        }).catch((e) => {
//          e.toString()
//        })
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
      addCancelEvent () {
        this.skilltemplate = {
          appId: '',
          activeWords: '',
          skillname: '',
          backServiceType: 'https',
          type: '预定义',
          appScope: '本地',
          appProperty: '公有',
          backService: 'wss://apigwws-dev.open.rokid.com/api',
          intents: 'intent',
          slot: '',
          createTime: '',
          updateTime: ''
        }
      },
      getDateTime () {
        var date = new Date()
        return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
      },
      searchBy () {
//        fetch('http://localhost:8000/tts/search?' + 'condition=' + this.condition, {
//          method: 'GET'
//        }).then((res) => {
//          res.json().then((json) => {
//            this.casedata = json
//            for (var i = 0; i < this.casedata.length; i++) {
//              this.$set(this.casedata[i], 'result', '')
//            }
//          })
//        }).catch((e) => {
//          e.toString()
//        })
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
