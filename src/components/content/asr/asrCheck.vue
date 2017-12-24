<template>
  <div style="font-size: 12px; color: #495060;">
    <Form ref="asrParam" :model="asrParam" :rules="ruleValidate" :label-width="80">
      <row>
        <i-col span="3" offset="1">
          <FormItem label="server" prop="test_server">
            <Select v-model="asrParam.test_server" placeholder="Select your server" style="width: 200px"
                    @on-change="selectServer">
              <Option v-for="(item, idx) in server" :value="item" :key="idx"></Option>
            </Select>
          </FormItem>
        </i-col>
        <i-col span="3" offset="3">
          <FormItem label="lang" prop="lang">
            <Select v-model="asrParam.lang" placeholder="Select your lang" style="width: 200px" @on-change="selectLang">
              <Option v-for="(item, idx) in lang" :value="item" :key="idx"></Option>
            </Select>
          </FormItem>
        </i-col>
        <i-col span="3" offset="3">
          <FormItem label="codec" prop="codec">
            <Select v-model="asrParam.codec" placeholder="Select your codec" style="width: 200px"
                    @on-change="selectCodec">
              <Option v-for="(item, idx) in codec" :value="item" :key="idx"></Option>
            </Select>
          </FormItem>
        </i-col>
      </row>

      <!--<FormItem label="lang" prop="lang">-->
      <!--<Select v-model="asrParam.lang" placeholder="Select your lang" style="width: 200px" @on-change="selectLang">-->
      <!--<Option v-for="(item, idx) in lang" :value="item" :key="idx"></Option>-->
      <!--</Select>-->
      <!--</FormItem>-->

      <!--<FormItem label="codec" prop="codec">-->
      <!--<Select v-model="asrParam.codec" placeholder="Select your codec" style="width: 200px" @on-change="selectCodec">-->
      <!--<Option v-for="(item, idx) in codec" :value="item" :key="idx"></Option>-->
      <!--</Select>-->
      <!--</FormItem>-->
      <row style="font-size: 12px; color: #495060;">
        <i-col span="4" offset="1">
          <FormItem label="id" prop="id">
            <Input v-model="asrParam.id" placeholder="Enter your id" style="width: 200px"></Input>
          </FormItem>
        </i-col>
        <i-col span="4" offset="2">
          <FormItem label="vt" prop="vt">
            <Input v-model="asrParam.vt" placeholder="Enter your vt" style="width: 200px"></Input>
          </FormItem>
        </i-col>
        <i-col span="4" offset="2">
          <FormItem label="sid" prop="sid">
            <Input v-model="asrParam.sid" placeholder="Enter your sid" style="width: 200px"></Input>
          </FormItem>
        </i-col>
      </row>


      <FormItem label="confirm" prop="confirm" style="margin-left: 55px">
        <Input v-model="asrParam.confirm" placeholder="Enter your confirm" style="width: 500px"></Input>
      </FormItem>


      <!--<FormItem label="vt" prop="vt">-->
      <!--<Input v-model="asrParam.vt" placeholder="Enter your vt" style="width: 200px"></Input>-->
      <!--</FormItem>-->

      <!--<FormItem label="confirm" prop="confirm">-->
      <!--<Input v-model="asrParam.confirm" placeholder="Enter your confirm" style="width: 200px"></Input>-->
      <!--</FormItem>-->

      <FormItem label="domains" prop="domains" style="margin-left: 55px">
        <Input v-model="domains" style="width: 500px" type="textarea" :autosize="{minRows: 2,maxRows: 4}"
               placeholder="Enter domains..."></Input>
      </FormItem>

      <FormItem label="StackDomain" prop="stack_domains" style="margin-left: 55px">
        <Input v-model="stack_domains" style="width: 500px;margin-left: 1px" type="textarea"
               :autosize="{minRows: 2,maxRows: 4}"
               placeholder="Enter stack_domains..."></Input>
      </FormItem>

      <row style="margin-left: 40px">
        <i-col span="2" offset="1">
          <div><label style="margin-left: -25px">hotwords</label></div>
        </i-col>
        <i-col span="2" offset="0" style="margin-left: -65px">
          <Monaco
            height="200"
            width="600"
            language="json"
            :code="code"
            :editorOptions="options"
            @mounted="onMounted"
            @codeChange="onCodeChange"
          >
          </Monaco>
        </i-col>
      </row>
      <br>
      <FormItem style="margin-left: 100px">
        <Button type="primary" @click="handleSubmit('asrParam')">Submit</Button>
        <Button type="ghost" @click="handleReset('asrParam')" style="margin-left: 8px">Reset</Button>
      </FormItem>
    </Form>

    <!--<row>-->
    <!--<i-col span="2" offset="1">-->
    <!--<div style="line-height: 32px;"><label>期望结果：</label></div>-->
    <!--</i-col>-->
    <!--<i-col span="2" offset="0" style="margin-top: 7px">-->
    <!--<div>-->
    <!--<Monaco-->
    <!--width="600"-->
    <!--height="600"-->
    <!--language="json"-->
    <!--:code="asrParam.hotwords"-->
    <!--theme="vs"-->
    <!--@mounted="onMounted"-->
    <!--@codeChange="onCodeChange"-->
    <!--&gt;</Monaco>-->
    <!--</div>-->
    <!--</i-col>-->
    <!--</row>-->

  </div>

</template>
<script>
  import Monaco from 'monaco-editor-forvue'
  // import MonacoEditor from 'vue-monaco-editor'
  import { Col, Row } from 'iview'

  export default {
    components: {
      Row,
      'i-col': Col,
      Monaco
    },
    data () {
      return {
        options: {
          selectOnLineNumbers: false
        },
        code: '[\n' +
        '    {\n' +
        '    "domain" :"com.rokid.system.executer.release",\n' +
        '    "slot" :"trigger",\n' +
        '    "words": ["我回来了"]\n' +
        '    }\n' +
        ']',
        lang: ['zh', 'en'],
        codec: ['pcm', 'opu2'],
        domains: '',
        stack_domains: '',
        asrParam: {
          test_server: 'asr-zh-tv',
          id: null,
          lang: 'zh',
          codec: 'pcm',
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
        server: ['asr-zh-tv', 'asr-zh-pre', 'asr-zh', 'asr-zh-dev'],
        hotwordsObj: {
          domain: '',
          slot: '',
          words: []
        },
        ruleValidate: {
          test_server: [
            {required: true, message: 'The name cannot be server', trigger: 'blur'}
          ],
          confirm: [
            {required: true, message: '请输入', trigger: 'blur'}
          ],
          id: [
            {required: true, message: 'Please select the id', trigger: 'change'}
          ],
          vt: [
            {required: true, message: 'Please select vt', trigger: 'change'}
          ],
          codec: [
            {required: true, message: 'Please select the codec', trigger: 'change'}
          ],
          lang: [
            {required: true, message: 'Please select lang', trigger: 'change'}
          ],
          domains: [
            {required: true, message: 'Please select domain', trigger: 'change'}
          ],
          sid: [
            {required: true, message: 'Please enter a personal sid', trigger: 'blur'},
            {type: 'string', min: 20, message: 'sid no less than 20 words', trigger: 'blur'}
          ]
        }
      }
    },
    mounted () {
      // this.editor.setValue('test')
      // this.editor.layout({
      //   width: 600,
      //   height: 200
      // })
    },
    methods: {
      onMounted (editor) {
        this.editor = editor
        // this.editor.setValue('test')
      },
      onCodeChange (editor) {
        this.asrParam.hotwords = this.editor.getValue()
        console.log('editor: ' + JSON.parse(this.editor.getValue()).name)
      },
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
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$Message.success('Success!')
          } else {
            this.$Message.error('Fail!')
          }
        })
      },
      handleReset (name) {
        console.log(name)
        this.$refs[name].resetFields()
      }
    }
  }
</script>
