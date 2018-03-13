<template>
  <div style="font-size: 12px; color: #495060;height:800px;overflow:auto">
    <Form ref="asrParam" :model="asrParam" :rules="ruleValidate" :label-width="80" style="margin-left: 40px">
      <FormItem label="server" prop="test_server">
        <Select v-model="asrParam.test_server" placeholder="Select your server"
                style="width: 200px;margin-left: 40px"
                @on-change="selectServer">
          <Option v-for="(item, idx) in server" :value="item" :key="idx"></Option>
        </Select>
      </FormItem>
      <FormItem label="lang" prop="lang">
        <Select v-model="asrParam.lang" placeholder="Select your lang" style="width: 200px;margin-left: 40px"
                @on-change="selectLang">
          <Option v-for="(item, idx) in lang" :value="item" :key="idx"></Option>
        </Select>
      </FormItem>

      <FormItem label="codec" prop="codec">
        <Select v-model="asrParam.codec" placeholder="Select your codec" style="width: 200px;margin-left: 40px"
                @on-change="selectCodec">
          <Option v-for="(item, idx) in codec" :value="item" :key="idx"></Option>
        </Select>
      </FormItem>

      <FormItem label="回放" prop="isPlayback">
        <RadioGroup v-model="asrParam.isPlayback" style="margin-left: 40px">
          <Radio label="true">true</Radio>
          <Radio label="false">false</Radio>
        </RadioGroup>
      </FormItem>

      <FormItem label="isLogOutput" prop="isLogOutput">
        <RadioGroup v-model="asrParam.isLogOutput" style="margin-left: 40px">
          <Radio label="true">true</Radio>
          <Radio label="false">false</Radio>
        </RadioGroup>
      </FormItem>

      <FormItem label="toPcm" prop="toPcm">
        <RadioGroup v-model="asrParam.toPcm" style="margin-left: 40px">
          <Radio label="true">true</Radio>
          <Radio label="false">false</Radio>
        </RadioGroup>
      </FormItem>

      <FormItem label="vt" prop="vt">
        <Input v-model="asrParam.vt" placeholder="输入激活词" style="width: 200px;margin-left: 40px"></Input>
      </FormItem>
      <FormItem label="confirm" prop="confirm">
        <Input v-model="asrParam.confirm" placeholder="输入confirm" style="width: 480px;margin-left: 40px"></Input>
      </FormItem>

      <FormItem label="domains" prop="domains">
        <Input v-model="domains" style="width: 480px;margin-left: 40px" type="textarea"
               :autosize="{minRows: 2,maxRows: 4}"
               placeholder="请输入domains..."></Input>
      </FormItem>

      <FormItem label="StackDomain" prop="stack_domains">
        <Input v-model="stack_domains" style="width: 480px;margin-left: 40px" type="textarea"
               :autosize="{minRows: 2,maxRows: 4}"
               placeholder="请输入stack_domains..."></Input>
      </FormItem>

      <FormItem label="extenOption" prop="extension_options">
        <Input v-model="asrParam.extension_options" style="width: 480px;margin-left: 40px" type="textarea"
               :autosize="{minRows: 2,maxRows: 4}"
               placeholder="Enter extension_options..."></Input>
      </FormItem>

      <FormItem label="文件列表">
        <Input v-model="filenames" style="width: 480px;margin-left: 40px" type="textarea"
               :autosize="{minRows: 2,maxRows: 4}"
               placeholder="请输入文件名称..."></Input>
      </FormItem>

      <row>
        <i-col span="2" offset="0">
          <div><label style="margin-bottom: 20px">语音文件</label></div>
        </i-col>
        <i-col span="2" style="margin-left: 30px;margin-bottom: 15px">
          <Upload action="//jsonplaceholder.typicode.com/posts/" :before-upload="handleUpload" multiple>
            <Button type="ghost" icon="ios-cloud-upload-outline">Upload files</Button>
          </Upload>
        </i-col>
        <i-col span="6" offset="5" style="margin-top: 5px ;color: red; margin-left: 68px">
          <div v-for="item in file" :key="item.index">
            <div v-if="item !== null" style="width: 400px">{{ item.name }}</div>
          </div>
        </i-col>
      </row>

      <row>
        <i-col span="2" offset="0">
          <div><label style="">hotwords</label></div>
        </i-col>
        <i-col span="2" offset="0" style="margin-left: 30px">
          <Monaco
            height="200"
            width="490"
            theme="vs"
            language="json"
            style="border:1px;border-top-color: rgb(238, 238, 238);
                      border-top-style: solid;
                      border-top-width: 1px;
                      border-right-color: rgb(238, 238, 238);
                      border-right-style: solid;
                      border-right-width: 1px;
                      border-bottom-color: rgb(238, 238, 238);
                      border-bottom-style: solid;
                      border-bottom-width: 1px;
                      border-left-color: rgb(238, 238, 238);
                      border-left-style: solid;
                      border-left-width: 1px;
                      border-image-source: initial;
                      border-image-slice: initial;
                      border-image-width: initial;
                      border-image-outset: initial;
                      border-image-repeat: initial;"
            :code="code"
            :editorOptions="options"
            @mounted="onMounted"
            @codeChange="onCodeChange"
          >
          </Monaco>
        </i-col>
      </row>
      <br><br>
      <FormItem style="margin-left: 100px">
        <Button type="primary" @click="handleSubmit('asrParam')" :loading="loading">Submit</Button>
        <Button type="ghost" @click="handleReset('asrParam')" style="margin-left: 20px">Reset</Button>
      </FormItem>
      <br>
      <Card>
        <p slot="title">
          <Icon type="ios-keypad"></Icon>
          ASR执行结果
        </p>
        <Input v-model="retResult" type="textarea"
               :autosize="{minRows: 25,maxRows: 40}"
               placeholder="执行结果"></Input>
      </Card>

    </Form>

  </div>

</template>
<script>
  import Monaco from 'monaco-editor-forvue'
  import { Col, Row } from 'iview'
  import $ from 'jquery'

  export default {
    components: {
      Row,
      'i-col': Col,
      Monaco
    },
    data () {
      return {
        loading: false,
        url: window.nl + '/asrtest',
        retResult: '',
        extension_options: '',
        options: {
          selectOnLineNumbers: false
        },
        code: '',
        lang: ['zh', 'en'],
        codec: ['pcm', 'opu2'],
        domains: '',
        stack_domains: '',
        filenames: '',
        asrParam: {
          test_server: 'asr-zh-tv',
          lang: 'zh',
          codec: 'pcm',
          vt: '',
          domains: [],
          stack_domains: [],
          extension_options: '',
          hotwords: [],
          filenames: [],
          isPlayback: 'true',
          isLogOutput: 'true',
          toPcm: 'true',
          confirm: ''
        },
        file: [],
        loadingStatus: false,
        server: [],
        hotwordsObj: {
          domain: '',
          slot: '',
          words: []
        },
        ruleValidate: {}
      }
    },
    created () {
      this.getServer()
    },
    mounted () {
    },
    methods: {
      getServer () {
        let serverUrl = window.nl + '/gethosturl'
        $.ajax({
          url: serverUrl,
          type: 'GET',
          cache: false,
          processData: false,
          contentType: false,
          success: (result) => {
            this.server = result
          },
          error: (errorMsg) => {
            console.log(errorMsg)
          }
        })
      },
      uploading (event) {
        this.file = event.target.files[0]
      },
      handleUpload (file) {
        console.log('fies:', file)
        let counts = 0
        for (let i = 0; i < this.file.length; i++) {
          if (this.file[i].name === file.name) {
            counts = 1
          }
        }
        if (counts === 0) {
          this.file.push(file)
        }
        // this.file = null
        // this.file = file
        return false
      },
      onMounted (editor) {
        this.editor = editor
      },
      onCodeChange (editor) {
        this.asrParam.hotwords = this.editor.getValue()
      },
      selectCodec (codec) {
        this.asrParam.codec = codec
      },
      selectLang (lang) {
        this.asrParam.lang = lang
      },
      selectServer (server) {
        this.asrParam.test_server = server
      },
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (!valid) {
            this.$Message.error('必填参数请全部输入!')
            return
          }
        })
        this.domains = this.domains.replace(' ', '')
        this.domains = this.domains.replace('\n', '')
        this.stack_domains = this.stack_domains.replace(' ', '')
        this.stack_domains = this.stack_domains.replace('\n', '')
        this.filenames = this.filenames.replace(' ', '').replace(/"/g, '')
        this.filenames = this.filenames.replace('\n', '')
        if (this.domains.length > 0) {
          this.asrParam.domains = this.domains.split(',')
        }
        if (this.stack_domains.length > 0) {
          this.asrParam.stack_domains = this.stack_domains.split(',')
        }
        if (this.filenames.length > 0) {
          this.asrParam.filenames = this.filenames.split(',')
        }
        event.preventDefault()
        let formData = new FormData()
        // formData.append('file', this.file)
        for (let i = 0; i < this.file.length; i++) {
          formData.append('file', this.file[i])
        }
        formData.append('asrPara', JSON.stringify(this.asrParam))
        this.$Message.info('开始执行，请等待')
        this.loading = true
        console.log('fileslist:', this.file)
        $.ajax({
          url: this.url,
          type: 'POST',
          cache: false,
          data: formData,
          processData: false,
          contentType: false,
          success: (result) => {
            this.loading = false
            this.retResult = result.toString().replace(/,/g, '\n')
            this.$Message.success('Success')
            this.file.splice(0, this.file.length)
          },
          error: (errorMsg) => {
            this.$Message.error('failed')
            this.loading = false
            console.log(errorMsg)
          }

        })
      },
      handleReset (name) {
        this.$refs[name].resetFields()
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
</style>
