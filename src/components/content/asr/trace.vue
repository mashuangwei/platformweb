<template>
  <div>
    <Card>
      <p slot="title">
        <Icon type="ios-keypad"></Icon>
        Trace查询
      </p>
      <Form>
        <FormItem label="文件列表">
          <Input v-model="queryfilenames" style="width: 800px;margin-left: 40px" type="textarea"
                 :autosize="{minRows: 2,maxRows: 4}"
                 placeholder="请输入文件名称..."></Input>
        </FormItem>
        <br>
        <FormItem style="margin-left: 100px">
          <Button type="primary" @click="queryTrace" :loading="loading" style="width: 120px">查询</Button>
        </FormItem>
      </Form>
      <Monaco
        height="600"
        width="900"
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
        :code="queryResult"
        :editorOptions="options"
        @mounted="onMounted"
        @codeChange="onCodeChange"
      >
      </Monaco>
    </Card>
  </div>
</template>

<script>
  import { Col, Row } from 'iview'
  import $ from 'jquery'
  import Monaco from 'monaco-editor-forvue'

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
        queryfilenames: '',
        loading: false,
        queryResult: ''
      }
    },
    methods: {
      onMounted (editor) {
        this.editor = editor
      },
      onCodeChange (editor) {
        // this.queryResult = this.editor.getValue()
      },
      queryTrace () {
        this.loading = true
        this.$Message.info('开始查询')
        let url = window.nl + '/gettrace?filename=' + this.queryfilenames
        $.ajax({
          type: 'GET',
          async: true,
          url: url,
          // contentType: 'application/json',
          dataType: 'json',
          success: (result) => {
            this.loading = false
            this.$Message.success('查询成功')
            console.log(JSON.stringify(result))
            // this.queryResult = JSON.stringify(result).replace(/,/g, '\n')
            this.editor.setValue(JSON.stringify(result))
          },
          error: (errorMsg) => {
            this.loading = false
            this.$Message.error(errorMsg)
          }
        })
      }
    },
    created () {}
  }
</script>

<style>
</style>
