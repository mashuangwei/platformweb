<template>
  <div>
    <row style="margin-top: -5px">
      <Card>
        <p slot="title">
          <Icon type="search"></Icon>
          搜索
        </p>
        <Form :model="formItem" :label-width="80">
          <FormItem label="文本" style="margin-left: -10px">
            <Input v-model="searchContent" placeholder="输入搜索内容" style="width: 200px; margin-left: 0px"></Input>
            <Button type="primary" @click="searchCase" :loading="searchLoading" style="margin-left: 10px">
              <Icon type="ios-search"></Icon>
              Search
            </Button>
            <Button type="primary" @click="addCaseClick" style="margin-left: 10px">
              <Icon type="ios-plus-empty"></Icon>
              新增
            </Button>
          </FormItem>
        </Form>
      </Card>
    </row>
    <row style="margin-top: 5px">
      <Card>
        <p slot="title">
          <Icon type="ios-list"></Icon>
          用例列表
        </p>
        <Table :loading="loading" :columns="caseTable" :data="caseTableData" :border="showBorder" no-data-text="没有数据"
               :stripe="showStripe" style="margin-top: -10px;margin-left: -10px" height="555"
               :show-header="showHeader" showIndex="true"></Table>
        <i-col span="14" offset="9" style="margin-top: 20px">
          <Page :total="pageHelp.totalNum" :current="pageHelp.curPage" :page-size="pageHelp.pageSize"
                @on-change="getPageIndex" @on-page-size-change="getPageSize"
                :page-size-opts="pageSizeOptions" size="small" show-elevator show-sizer show-total
                placement="top"></Page>
        </i-col>
        <br>
        <br>
        <br>
      </Card>
    </row>

    <!-- 添加case话框 -->
    <Modal
      :mask-closable="false"
      width="830"
      :title="titleText"
      :ok-text="okText"
      @on-ok="okbuttonClick"
      v-model="caseModal"
      :styles="{top: '20px'}">
      <Form :model="caseParam" :label-width="80">
        <FormItem label="用例名称">
          <Input v-model="caseParam.name" placeholder="请输入用例名称"></Input>
        </FormItem>
        <FormItem label="测试环境">
          <Select v-model="caseParam.environment" style="width:200px">
            <Option v-for="item in envlist" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <!--<FormItem label="用例描述">-->
        <!--<Input v-model="caseParam.desc" placeholder="请输入用例描述"></Input>-->
        <!--</FormItem>-->

        <!--<FormItem label="codec">-->
        <!--<RadioGroup v-model="caseParam.codec" style="margin-top: -5px">-->
        <!--<Radio label="pcm">pcm</Radio>-->
        <!--<Radio label="wav">wav</Radio>-->
        <!--</RadioGroup>-->
        <!--</FormItem>-->
        <row>
          <i-col span="8">
            <FormItem label="云端模式">
              <RadioGroup v-model="caseParam.vadmode" style="margin-top: -5px">
                <Radio label="cloud">云端</Radio>
                <Radio label="local">本地</Radio>
              </RadioGroup>
            </FormItem>
          </i-col>
          <i-col span="8">
            <FormItem label="NLP返回">
              <RadioGroup v-model="caseParam.nonlp" style="margin-top: -5px">
                <Radio label="true">返回</Radio>
                <Radio label="false">为空</Radio>
              </RadioGroup>
            </FormItem>
          </i-col>
          <i-col span="8">
            <FormItem label="ASR返回">
              <RadioGroup v-model="caseParam.nointermediateasr" style="margin-top: -5px">
                <Radio label="true">实时</Radio>
                <Radio label="false">全部</Radio>
              </RadioGroup>
            </FormItem>
          </i-col>
        </row>

        <!--<FormItem label="语言">-->
        <!--<RadioGroup v-model="caseParam.lang" style="margin-top: -5px">-->
        <!--<Radio label="zh">zh</Radio>-->
        <!--<Radio label="en">en</Radio>-->
        <!--<Radio label="xmly">xmly</Radio>-->
        <!--<Radio label="e2e">e2e</Radio>-->
        <!--<Radio label="c1">c1</Radio>-->
        <!--</RadioGroup>-->
        <!--</FormItem>-->
        <row>
          <i-col span="8">
            <FormItem label="激活词">
              <Input v-model="caseParam.voicetrigger" placeholder="请输入激活词"></Input>
            </FormItem>
          </i-col>
          <i-col span="8">
            <FormItem label="vadtimeout">
              <Input v-model="caseParam.vendtimeout" placeholder="请输入vad超时时间"></Input>
            </FormItem>
          </i-col>
          <i-col span="8">
            <FormItem label="power">
              <Input v-model="caseParam.voicepower" placeholder="请输入音量值"></Input>
            </FormItem>
          </i-col>
        </row>

        <FormItem label="voiceextra">
          <Input v-model="caseParam.voiceextra" placeholder="请输入voiceextra...."></Input>
        </FormItem>
        <FormItem label="期望结果">
          <Monaco
            theme="vs"
            language="json"
            :code="code"
            :editorOptions="options"
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
            @mounted="onMounted"
            @codeChange="onCodeChange"
          >
          </Monaco>
        </FormItem>
        <FormItem label="语音文件">
          <Upload :action="upfileUrl" :on-error="fileUpError"
                  :on-success="fileUpSuccess">
            <Button type="ghost" icon="ios-cloud-upload-outline">Upload files</Button>
          </Upload>
        </FormItem>

      </Form>
      <!--<div slot="footer">-->
      <!--<Button @click="addCase" :loading="addLoading"></Button>-->
      <!--</div>-->
    </Modal>

  </div>
</template>

<script>
  import $ from 'jquery'
  import Row from 'iview/src/components/grid/row'
  import expandRow from './table-expand-data.vue'
  import Monaco from 'monaco-editor-forvue'

  export default {
    components: {
      Row,
      expandRow,
      Monaco
    },
    data () {
      return {
        upfileUrl: window.myurl + '/speech/case/upfile',
        caseModal: false,
        titleText: '添加用例',
        okText: '添加',
        options: {
          selectOnLineNumbers: false
        },
        code: '',
        editMaskClose: true,
        addMaskClose: true,
        editModal: false,
        formItem: {
          input: '',
          select: '',
          radio: 'male',
          checkbox: [],
          switch: true,
          textarea: ''
        },
        editLoading: false,
        addLoading: false,
        searchLoading: false,
        searchContent: '',
        addModal: false,
        caseParam: {
          id: null,
          name: '',
          desc: '',
          codec: 'pcm',
          lang: 'zh',
          vadmode: 'cloud',
          voicetrigger: '若琪',
          vendtimeout: 500,
          nonlp: 'true',
          result: '',
          expect: '{\n' +
          '  "extra":"accept",\n' +
          '  "type":"INTERMEDIATE,finish,ASR_FINISH",\n' +
          '  "asr":""\n' +
          '}',
          nointermediateasr: 'true',
          voiceextra: '',
          voicepower: '',
          createTime: null,
          environment: 'wss://apigwws-dev.open.rokid.com/api',
          fileurl: ''
        },
        envlist: [
          {
            value: 'wss://apigwws-dev.open.rokid.com/api',
            label: 'dev'
          },
          {
            value: 'wss://apigwws.open.rokid.com/api',
            label: '线上'
          },
          {
            value: 'wss://apigwws-pre.open.rokid.com/api',
            label: 'pre'
          },
          {
            value: 'wss://apigwws-daily.open.rokid.com/api',
            label: 'daily'
          }
        ],
        pageSizeOptions: [10, 20, 30, 50, 100],
        pageHelp: {
          totalNum: 0,
          curPage: 1,
          pageSize: 10
        },
        loading: false,
        visible: false,
        showBorder: true,
        showStripe: true,
        showHeader: true,
        fixedHeader: true,
        caseTable: [
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
          // {
          //   type: 'index',
          //   width: 50,
          //   align: 'center'
          // },
          {
            title: '用例名称',
            key: 'name',
            align: 'center',
            width: 300,
            ellipsis: true,
            render: (h, params) => {
              return h('Poptip', {
                props: {
                  trigger: 'hover',
                  title: '',
                  placement: 'bottom'
                }
              }, [
                h('div', params.row.name),
                h('div', {
                  slot: 'content'
                }, [
                  h('div', params.row.name)
                ])
              ])
            }
          },
          {
            title: 'vadmode',
            key: 'vadmode',
            align: 'center'
          },
          {
            title: 'vendtimeout',
            key: 'vendtimeout',
            align: 'center'
          },
          {
            title: 'voicetrigger',
            key: 'voicetrigger',
            align: 'center'
          },
          {
            title: 'nonlp',
            key: 'nonlp',
            align: 'center'
          },
          {
            title: 'result',
            key: 'result',
            align: 'center',
            render: (h, params) => {
              const row = params.row
              var color = 'yellow'
              var text = '未执行'
              var type = 'primary'
              if (row.result === '1') {
                text = '执行中'
                color = 'blue'
                type = 'warning'
              }
              if (row.result === '0') {
                text = '成功'
                color = 'green'
                type = 'success'
              }
              if (row.result === '2') {
                text = '失败'
                color = 'red'
                type = 'error'
              }
              var cloading = false
              if (row.result === '1') {
                cloading = true
              }
              return h('Button', {
                props: {
                  type: type,
                  size: 'small',
                  color: color,
                  loading: cloading
                }
              }, text)
            }
          },
          // {
          //   title: '创建时间',
          //   key: 'createTime',
          //   width: 150,
          //   align: 'center'
          // },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            width: 220,
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
                      this.caseModal = true
                      this.editModal = true
                      this.addModal = false
                      this.okText = '保存'
                      this.titleText = '编辑用例'
                      this.editor.setValue(this.caseTableData[params.index].expect)
                      this.caseParam = Object.assign({}, this.caseTableData[params.index])
                      this.editor.layout({
                        width: 690,
                        height: 200
                      })
                    }
                  }
                }, '编辑'),
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
                      this.$Notice.success({
                        title: '用例开始执行。。。。',
                        desc: '用例执行一般需要几秒时间，请耐心等待'
                      })
                      this.caseTableData[params.index].result = '1'
                      this.execute(params.index)
                    }
                  }
                }, '执行'),
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
                }, '删除')
              ])
            }
          }
        ],
        caseTableData: []
      }
    },
    created () {
      this.getAllCaseList()
    },
    methods: {
      okbuttonClick () {
        if (this.addModal) {
          this.addCase()
        } else {
          this.editCase()
        }
      },
      fileUpError (error, file, fileList) {
        this.$Message.error(file.name + '  上传失败，错误信息: ' + error)
      },
      fileUpSuccess (response, file, fileList) {
        this.caseParam.fileurl = response.data.toString()
        this.$Message.success(file.name + '  上传成功')
      },
      execute (index) {
        let url = window.myurl + '/speech/case/execute/' + this.caseTableData[index].id
        $.ajax({
          type: 'POST',
          async: true,
          url: url,
          contentType: 'application/json',
          dataType: 'json',
          success: (result) => {
            if (result.code === 200) {
              this.$Message.success('执行用例成功')
              this.getAllCaseList()
            } else {
              this.caseTableData[index].result = '2'
              this.$Message.error(result.message)
            }
          },
          error: (errorMsg) => {
            this.caseTableData[index].result = '2'
            this.$Message.error(errorMsg.responseText)
            console.log(errorMsg)
          }
        })
      },
      removeCase (index) {
        let url = window.myurl + '/speech/case/delete/' + this.caseTableData[index].id
        $.ajax({
          type: 'DELETE',
          async: true,
          url: url,
          dataType: 'json',
          success: (result) => {
            this.loading = false
            if (result.code === 200) {
              this.$Message.success('删除成功')
              this.getAllCaseList()
            } else {
              this.$Message.error('删除失败')
            }
          },
          error: (errorMsg) => {
            this.$Message.success('删除失败')
            console.log(errorMsg)
          }
        })
      },
      resetParamForm () {
        this.caseParam = {
          id: null,
          name: '',
          desc: '',
          codec: 'pcm',
          lang: 'zh',
          vadmode: 'cloud',
          voicetrigger: '若琪',
          nonlp: 'true',
          result: '',
          expect: '{\n' +
          '  "extra":"accept",\n' +
          '  "type":"INTERMEDIATE,finish,ASR_FINISH",\n' +
          '  "asr":""\n' +
          '}',
          nointermediateasr: 'true',
          voiceextra: '',
          voicepower: '0',
          vendtimeout: 500,
          environment: 'wss://apigwws-dev.open.rokid.com/api',
          createTime: null,
          fileurl: ''
        }
      },
      editCase () {
        this.editLoading = true
        // this.editModal = false
        this.caseParam.expect = this.editor.getValue()
        let url = window.myurl + '/speech/case/edit/'
        $.ajax({
          type: 'PUT',
          async: true,
          url: url,
          contentType: 'application/json',
          data: JSON.stringify(this.caseParam),
          dataType: 'json',
          success: (result) => {
            if (result.code === 200) {
              this.$Message.success('更新成功')
              this.editLoading = false
              this.getAllCaseList()
            } else {
              this.$Message.error(result.message)
            }
          },
          error: (errorMsg) => {
            this.editLoading = false
            this.$Message.error(errorMsg)
            console.log(errorMsg)
          }
        })
      },
      addCase () {
        this.caseParam.expect = this.editor.getValue()
        let url = window.myurl + '/speech/case/add'
        $.ajax({
          type: 'POST',
          async: true,
          url: url,
          contentType: 'application/json',
          data: JSON.stringify(this.caseParam),
          dataType: 'json',
          success: (result) => {
            this.addLoading = false
            if (result.code === 200) {
              this.$Message.success('添加成功')
              // this.resetParamForm()
              this.getAllCaseList()
            } else {
              this.$Message.error(result.message)
            }
          },
          error: (errorMsg) => {
            this.$Message.error(errorMsg)
            console.log(errorMsg)
          }
        })
      },
      addCaseClick () {
        this.caseModal = true
        this.editModal = false
        this.addModal = true
        this.okText = '添加'
        this.titleText = '添加用例'
        this.editor.setValue('{\n' +
          '  "extra":"accept",\n' +
          '  "type":"INTERMEDIATE,finish,ASR_FINISH",\n' +
          '  "asr":""\n' +
          '}')
        this.resetParamForm()
        this.editor.layout({
          width: 690,
          height: 200
        })
      },
      searchCase () {
        this.searchLoading = true
        let url = window.myurl + '/speech/get/allcase?pageSize=' + this.pageHelp.pageSize + '&pageNo=' + this.pageHelp.curPage + '&text=' + this.searchContent
        $.ajax({
          type: 'GET',
          async: true,
          url: url,
          dataType: 'json',
          success: (result) => {
            this.searchLoading = false
            if (result.code === 200) {
              this.pageHelp.totalNum = result.data.total
              this.caseTableData = result.data.list
            }
          },
          error: (errorMsg) => {
            this.searchLoading = false
            console.log(errorMsg)
          }
        })
      },
      getAllCaseList () {
        this.loading = true
        let url = window.myurl + '/speech/get/allcase?pageSize=' + this.pageHelp.pageSize + '&pageNo=' + this.pageHelp.curPage
        $.ajax({
          type: 'GET',
          async: true,
          url: url,
          dataType: 'json',
          success: (result) => {
            this.loading = false
            if (result.code === 200) {
              this.pageHelp.totalNum = result.data.total
              this.caseTableData = result.data.list
            }
          },
          error: (errorMsg) => {
            this.loading = false
            console.log(errorMsg)
          }
        })
      },
      getPageIndex (pageIndex) {
        this.pageHelp.curPage = pageIndex
        this.getAllCaseList()
      },
      getPageSize (pageSize) {
        this.pageHelp.pageSize = pageSize
        this.getAllCaseList()
      },
      onMounted (editor) {
        this.editor = editor
      },
      onCodeChange (editor) {
        this.caseParam.expect = this.editor.getValue()
      }
    }
  }
</script>

<style>
</style>
