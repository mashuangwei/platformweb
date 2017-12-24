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


  .demo-upload-list{
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
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 4px;
  }
  .demo-upload-list img{
    width: 100%;
    height: 100%;
  }
  .demo-upload-list-cover{
    display: block;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: #5cadff;
  }
  .demo-upload-list:hover .demo-upload-list-cover{
    display: block;
  }
  .demo-upload-list-cover i{
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }

</style>
<template>
  <div style="font-size: 12px; color: #495060;">
    <br>
    <row>
      <i-col span="1" offset="1">
        <div style="line-height: 32px;"><label>Server：</label></div>
      </i-col>
      <i-col span="1" offset="0" style="margin-left: 15px">
        <div>
          <Select v-model="asrParam.test_server" style="width:160px" @on-change="selectServer">
            <Option v-for="(item, idx) in serverOptions" :value="item" :key="idx"></Option>
          </Select>
        </div>
      </i-col>
    </row>
    <br>

    <row>
      <i-col span="1" offset="1">
        <div style="line-height: 32px;"><label>语言：</label></div>
      </i-col>
      <i-col span="1" offset="0" style="margin-left: 15px">
        <div>
          <Select v-model="asrParam.lang" style="width:160px" @on-change="selectLang">
            <Option v-for="(item, idx) in lang" :value="item" :key="idx"></Option>
          </Select>
        </div>
      </i-col>
    </row>
    <br>

    <row>
      <i-col span="1" offset="1">
        <div style="line-height: 32px;"><label>codec：</label></div>
      </i-col>
      <i-col span="1" offset="0" style="margin-left: 15px">
        <div>
          <Select v-model="asrParam.codec" style="width:160px" @on-change="selectCodec">
            <Option v-for="(item, idx) in codec" :value="item" :key="idx"></Option>
          </Select>
        </div>
      </i-col>
    </row>
    <br>

    <row>
      <i-col span="1" offset="1">
        <div style="line-height: 32px;"><label>Id：</label></div>
      </i-col>
      <i-col span="2" offset="0" style="margin-left: 15px">
        <div>
          <Input v-model="asrParam.id" placeholder="请输入..." style="width: 160px"></Input>
        </div>
      </i-col>
    </row>
    <br>
    <row>
      <i-col span="1" offset="1">
        <div style="line-height: 32px;"><label>vt：</label></div>
      </i-col>
      <i-col span="2" offset="0" style="margin-left: 15px">
        <div>
          <Input v-model="asrParam.vt" placeholder="请输入自定义激活词..." style="width: 220px"></Input>
        </div>
      </i-col>
    </row>
    <br>

    <row>
      <i-col span="1" offset="1">
        <div style="line-height: 32px;"><label>sid：</label></div>
      </i-col>
      <i-col span="2" offset="0" style="margin-left: 15px">
        <div>
          <Input v-model="asrParam.sid" placeholder="请输入..." style="width: 220px"></Input>
        </div>
      </i-col>
    </row>
    <br>

    <row>
      <i-col span="1" offset="1">
        <div style="line-height: 32px;"><label>confirm：</label></div>
      </i-col>
      <i-col span="2" offset="0" style="margin-left: 15px">
        <div>
          <Input v-model="asrParam.confirm" placeholder="请输入..." style="width: 320px"></Input>
        </div>
      </i-col>
    </row>
    <br>

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
          <div style="line-height: 32px;"><label>Asr文件：</label></div>
        </i-col>
        <i-col span="7" offset="1">
          <div>
            <!--<Input v-model="addcase.ttstext" placeholder="请输入..." style="width: 420px"></Input>-->
            <!--<Upload-->
            <!--multiple-->
            <!--type="drag"-->
            <!--:on-success="handleSuccess"-->
            <!--action="http://localhost:8000/upload/fileUpload">-->
            <!--<div style="padding: 20px 0">-->
            <!--<Icon type="ios-cloud-upload" size="42" style="color: #3399ff"></Icon>-->
            <!--<p>点击或将文件拖拽到这里上传</p>-->
            <!--</div>-->
            <!--</Upload>-->
            <div class="demo-upload-list" v-for="item in uploadList">
              <template v-if="item.status === 'finished'">
                <div class="demo-upload-list-cover">
                  <Icon type="ios-cloud-download" @click.native="handleView(item.name)"></Icon>
                  <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                </div>
              </template>
              <template v-else>
                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
              </template>
            </div>
            <template v-if="uploadList.length > 0">
              {{uploadList[0].name}}
            </template>
            <Upload
              ref="upload"
              :show-upload-list="false"
              v-show="uploadShowFlag"
              :default-file-list="defaultList"
              :on-success="handleSuccess"
              :format="['pcm','pdf','jpg', 'jpeg', 'png']"
              :max-size="20480"
              :on-format-error="handleFormatError"
              :on-exceeded-size="handleMaxSize"
              :before-upload="handleBeforeUpload"
              multiple
              type="drag"
              action="http://localhost:8000/upload/fileUpload"
              style="display: inline-block;width:58px;">
              <div style="width: 58px;height:58px;line-height: 58px;">
                <Icon type="ios-cloud-upload" size="20"></Icon>
              </div>
            </Upload>
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
        lang: ['zh', 'en'],
        codec: ['pcm', 'opu2'],
        asrParam: {
          test_server: 'asr-zh-dev',
          id: 0,
          lang: 'zh',
          codec: '',
          vt: '',
          sid: '',
          domains: [],
          stack_domains: [],
          extension_options: {
            result_type: 1,
            tmp_result: 0,
            vad_end_ms: 500,
            auto_restart: 0,
            voice_delay: 150
          },
          hotwords: [],
          confirm: ''
        },
        serverOptions: ['asr-zh-tv', 'asr-zh-pre', 'asr-zh', 'asr-zh-dev'],
        hotwordsObj: {
          domain: '',
          slot: '',
          words: []
        },
        uploadShowFlag: true,
        fileName: '',
        visible: false,
        uploadList: [],
        defaultList: [],
        showBorder: true,
        showStripe: true,
        showHeader: true,
        fixedHeader: true,
        addcasemodal: false,
        okButtonText: '添加',
        casemodeltitle: '添加用例',
        searchStr: '',
        addcase: {
          name: '',
          ttstext: '',
          deviceId: '',
          deviceTypeId: '',
          authkey: null,
          version: '1.0',
          asrlanguage: 'zh',
          url: 'wss://apigwws-dev.open.rokid.com/api',
          codec: 'pcm',
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
            width: 410,
            key: 'name',
            align: 'center'
          },
          {
            title: '创建时间',
            width: 160,
            key: 'createtime',
            align: 'center'
          },
          {
            title: '更新时间',
            width: 160,
            key: 'updatetime',
            align: 'center'
          },
          {
            title: '执行结果',
            width: 130,
            key: 'result',
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
    methods: {
      selectCodec (codec) {
        this.asrParam.codec = codec
      },
      selectLang (lang) {
        this.asrParam.lang = lang
      },
      selectServer (server) {
        console.log('server: ' + server)
        this.asrParam.test_server = server
      },
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
        this.addcase.name = this.casedata[index].name
        this.addcase.ttstext = this.casedata[index].ttstext
        this.addcase.deviceId = this.casedata[index].deviceId
        this.addcase.deviceTypeId = this.casedata[index].deviceTypeId
        this.addcase.authkey = this.casedata[index].authkey
        this.addcase.version = this.casedata[index].version
        this.addcase.asrlanguage = this.casedata[index].asrlanguage
        this.addcase.url = this.casedata[index].url
        this.addcase.codec = this.casedata[index].codec
        this.addcase.secret = this.casedata[index].secret
      },
      addAsrCase () {
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
          this.addcase.cellClassName = {result: 'table-info-cell-result-success'}
          this.casedata.push(this.addcase)
        } else {
          this.casedata[this.index].name = this.addcase.name
          this.casedata[this.index].ttstext = this.addcase.ttstext
          this.casedata[this.index].deviceId = this.addcase.deviceId
          this.casedata[this.index].deviceTypeId = this.addcase.deviceTypeId
          this.casedata[this.index].authkey = this.addcase.authkey
          this.casedata[this.index].version = this.addcase.version
          this.casedata[this.index].asrlanguage = this.addcase.asrlanguage
          this.casedata[this.index].url = this.addcase.url
          this.casedata[this.index].codec = this.addcase.codec
          this.casedata[this.index].secret = this.addcase.secret
        }
        this.addcase = {name: '', ttstext: '', codec: '', secret: '', deviceId: '', deviceTypeId: '', authkey: '', url: '', version: '', asrlanguage: '', cellClassName: {}}
      },
      addCaseCancelEvent () {
        this.addcase = {name: '', ttstext: '', codec: '', secret: '', deviceId: '', deviceTypeId: '', authkey: '', url: '', version: '', asrlanguage: '', cellClassName: {}}
      },
      getDateTime () {
        var date = new Date()
        return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
      },
      getCase () {
        fetch('http://localhost:80/platform/caselist', {
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
      },
      handleView (name) {
        this.fileName = name
        this.visible = true
      },
      handleRemove (file) {
        // 从 upload 实例删除数据
        this.uploadShowFlag = true
        const fileList = this.$refs.upload.fileList
        this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
      },
//      handleSuccess (res, file) {
//        // 因为上传过程为实例，这里模拟添加 url
//        file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar'
//        file.name = '7eb99afb9d5f317c912f08b5212fd69a'
//      },
      handleFormatError (file) {
        this.$Notice.warning({
          title: '文件格式不正确',
          desc: '文件 ' + file.name + ' 格式不正确，请上传后缀为pcm文件'
        })
      },
      handleMaxSize (file) {
        this.$Notice.warning({
          title: '超出文件大小限制',
          desc: '文件 ' + file.name + ' 太大，不能超过 20M。'
        })
      },
      handleBeforeUpload () {
        const check = this.uploadList.length < 1
        if (!check) {
          this.$Notice.warning({
            title: '最多只能上传 1 个pcm文件。'
          })
        }
        return check
      }
    },
    mounted () {
      this.$on('editor-update', this.onEditIntents)
      this.uploadList = this.$refs.upload.fileList
    }
  }
</script>
