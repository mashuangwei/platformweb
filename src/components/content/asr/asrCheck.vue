<template>
  <div style="font-size: 12px; color: #495060;">
    <Form ref="asrParam" :model="asrParam" :rules="ruleValidate" :label-width="80">
      <row>
        <i-col span="10" offset="0">
          <row>
            <i-col span="2">
              <FormItem label="server" prop="test_server">
                <Select v-model="asrParam.test_server" placeholder="Select your server" style="width: 200px"
                        @on-change="selectServer">
                  <Option v-for="(item, idx) in server" :value="item" :key="idx"></Option>
                </Select>
              </FormItem>
            </i-col>
            <i-col span="3" style="margin-left: 230px">
              <FormItem label="lang" prop="lang">
                <Select v-model="asrParam.lang" placeholder="Select your lang" style="width: 200px"
                        @on-change="selectLang">
                  <Option v-for="(item, idx) in lang" :value="item" :key="idx"></Option>
                </Select>
              </FormItem>
            </i-col>
          </row>

          <row>
            <i-col span="2">
              <FormItem label="codec" prop="codec">
                <Select v-model="asrParam.codec" placeholder="Select your codec" style="width: 200px"
                        @on-change="selectCodec">
                  <Option v-for="(item, idx) in codec" :value="item" :key="idx"></Option>
                </Select>
              </FormItem>
            </i-col>
            <i-col span="3" style="margin-left: 230px">
              <FormItem label="id" prop="id">
                <Input v-model="asrParam.id" placeholder="输入整数值" style="width: 200px"></Input>
              </FormItem>
            </i-col>
          </row>

          <row>
            <i-col span="2">
              <FormItem label="vt" prop="vt">
                <Input v-model="asrParam.vt" placeholder="输入激活词" style="width: 200px"></Input>
              </FormItem>
            </i-col>

            <i-col span="3" style="margin-left: 230px">
              <FormItem label="sid" prop="sid">
                <Input v-model="asrParam.sid" placeholder="输入整数值" style="width: 200px"></Input>
              </FormItem>
            </i-col>
          </row>

          <FormItem label="confirm" prop="confirm">
            <Input v-model="asrParam.confirm" placeholder="输入confirm" style="width: 480px"></Input>
          </FormItem>

          <FormItem label="domains" prop="domains">
            <Input v-model="domains" style="width: 480px" type="textarea" :autosize="{minRows: 2,maxRows: 4}"
                   placeholder="请输入domains..."></Input>
          </FormItem>

          <FormItem label="StackDomain" prop="stack_domains">
            <Input v-model="stack_domains" style="width: 480px;margin-left: 1px" type="textarea"
                   :autosize="{minRows: 2,maxRows: 4}"
                   placeholder="请输入stack_domains..."></Input>
          </FormItem>

          <FormItem label="extenOption" prop="extension_options">
            <Input v-model="asrParam.extension_options" style="width: 480px" type="textarea"
                   :autosize="{minRows: 2,maxRows: 4}"
                   placeholder="Enter extension_options..."></Input>
          </FormItem>

          <row>
            <i-col span="2" offset="0">
              <div><label style="margin-bottom: 20px">Asr文件</label></div>
            </i-col>
            <i-col span="2" style="margin-left: 30px;margin-bottom: 15px">
              <Upload action="//jsonplaceholder.typicode.com/posts/" :before-upload="handleUpload">
                <Button type="ghost" icon="ios-cloud-upload-outline">Upload files</Button>
              </Upload>
            </i-col>
            <i-col span="6" offset="5" style="margin-top: 5px ;color: red; margin-left: 68px">
              <div v-if="file !== null" style="width: 400px">{{ file.name }}</div>
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
            <Button type="ghost" @click="handleReset('asrParam')" style="margin-left: 8px">Reset</Button>
          </FormItem>

        </i-col>
        <i-col span="10" offset="3">
          <row>
            <Card>
              <p slot="title">
                <Icon type="ios-keypad"></Icon>
                ASR执行结果
              </p>
              <Input v-model="retResult" type="textarea"
                     :autosize="{minRows: 25,maxRows: 40}"
                     placeholder="执行结果"></Input>
            </Card>
          </row>
        </i-col>
      </row>

    </Form>

  </div>

</template>
<script>
  import Monaco from 'monaco-editor-forvue'
  // import MonacoEditor from 'vue-monaco-editor'
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
        asrParam: {
          test_server: 'asr-zh-tv',
          id: this.generateNum(),
          lang: 'zh',
          codec: 'pcm',
          vt: '',
          sid: this.generateNum(),
          domains: [],
          stack_domains: [],
          extension_options: '',
          hotwords: [],
          confirm: ''
        },
        file: null,
        loadingStatus: false,
        server: ['asr-zh-tv', 'asr-zh-pre', 'asr-zh', 'asr-zh-dev'],
        hotwordsObj: {
          domain: '',
          slot: '',
          words: []
        },
        ruleValidate: {
          test_server: [
            {required: true, message: '请选择server', trigger: 'blur'}
          ],
          // id: [
          //   {required: true, message: '请输入id', trigger: 'change'}
          // ],
          codec: [
            {required: true, message: '请选择codec', trigger: 'change'}
          ],
          lang: [
            {required: true, message: '请输入语言', trigger: 'change'}
          ]
        }
      }
    },
    mounted () {
    },
    methods: {
      generateNum () {
        var num = ''
        for (let i = 0; i < 7; i++) {
          num = num + Math.floor(Math.random() * 10)
        }
        return num
      },
      uploading (event) {
        this.file = event.target.files[0]
      },
      handleUpload (file) {
        this.file = null
        this.file = file
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
        if (this.domains.length > 0) {
          this.asrParam.domains = this.domains.split(',')
        }
        if (this.stack_domains.length > 0) {
          this.asrParam.stack_domains = this.stack_domains.split(',')
        }
        event.preventDefault()
        let formData = new FormData()
        formData.append('file', this.file)
        formData.append('asrPara', JSON.stringify(this.asrParam))
        this.$Message.info('开始执行，请等待')
        this.loading = true
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
