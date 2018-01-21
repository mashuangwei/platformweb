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
          语音列表
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
      width="800"
      title="添加"
      okText="确定"
      v-model="addModal"
      :styles="{top: '20px'}">
      <Form :model="caseParam" :label-width="80">
        <FormItem label="text">
          <Input v-model="caseParam.text" type="textarea" :autosize="{minRows: 1,maxRows: 4}" placeholder="请输入tts文本"></Input>
        </FormItem>
        <FormItem label="采样率">
          <RadioGroup v-model="caseParam.sampleRate">
            <Radio label="24000">24000</Radio>
            <Radio label="16000">16000</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="语言">
          <RadioGroup v-model="caseParam.lang">
            <Radio label="zh">zh</Radio>
            <Radio label="en">en</Radio>
            <Radio label="xmly">xmly</Radio>
            <Radio label="e2e">e2e</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="测试环境">
          <RadioGroup v-model="caseParam.environment">
            <Radio label="线上">线上</Radio>
            <Radio label="dev">dev</Radio>
            <Radio label="daily">daily</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="addCase" :loading="addLoading">Submit</Button>
          <Button type="ghost" style="margin-left: 8px" @click="resetParamForm">Reset</Button>
        </FormItem>
      </Form>
    </Modal>

    <!-- 保存case话框 -->
    <Modal
      :mask-closable="false"
      width="800"
      title="编辑"
      okText="确定"
      v-model="editModal"
      :styles="{top: '20px'}">
      <Form :model="caseParam" :label-width="80">
        <FormItem label="text">
          <Input v-model="caseParam.text" type="textarea" :autosize="{minRows: 1,maxRows: 4}" placeholder="请输入tts文本"></Input>
        </FormItem>
        <FormItem label="采样率">
          <RadioGroup v-model="caseParam.sampleRate">
            <Radio label="24000">24000</Radio>
            <Radio label="16000">16000</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="语言">
          <RadioGroup v-model="caseParam.lang">
            <Radio label="zh">zh</Radio>
            <Radio label="en">en</Radio>
            <Radio label="xmly">xmly</Radio>
            <Radio label="e2e">e2e</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="测试环境">
          <RadioGroup v-model="caseParam.environment">
            <Radio label="线上">线上</Radio>
            <Radio label="dev">dev</Radio>
            <Radio label="daily">daily</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="editCase" :loading="editLoading">Submit</Button>
          <Button type="ghost" style="margin-left: 8px" @click="resetParamForm">Reset</Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
  import $ from 'jquery'
  import Row from 'iview/src/components/grid/row'
  import audio from './audio.vue'

  export default {
    components: {
      Row
    },
    data () {
      return {
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
          text: '',
          environment: 'dev',
          codec: 'mp3',
          lang: 'zh',
          sampleRate: 24000,
          url: ''
        },
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
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '文本',
            key: 'text',
            width: 220,
            align: 'center'
          },
          {
            title: 'lang',
            key: 'lang',
            align: 'center'
          },
          // {
          //   title: 'codec',
          //   key: 'codec',
          //   align: 'center'
          // },
          {
            title: '采样率',
            key: 'sampleRate',
            align: 'center'
          },
          {
            title: '环境',
            key: 'environment',
            align: 'center'
          },
          {
            title: '创建时间',
            key: 'createTime',
            width: 150,
            align: 'center'
          },
          {
            title: '语音',
            key: 'wavfile',
            width: 250,
            align: 'center',
            render (h, data) {
              return h(audio, {
                props: {
                  src: 'http://rokidweb.oss-cn-hangzhou.aliyuncs.com/skills/%E5%90%AC%E6%AD%8C%E7%8C%9C%E7%94%B5%E5%BD%B1/80%E5%B9%B4%E4%BB%A3/%E6%99%93%E8%8A%B1%20-%20%E7%88%B1%E6%B1%9F%E5%B1%B1%E6%9B%B4%E7%88%B1%E7%BE%8E%E4%BA%BA.mp3',
                  name: 'wav文件'
                }
              })
            }
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            width: 200,
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
                      this.editModal = true
                      // this.caseParam = this.caseTableData[params.index]
                      this.$set(this.caseParam, 'id', this.caseTableData[params.index].id)
                      this.$set(this.caseParam, 'text', this.caseTableData[params.index].text)
                      this.$set(this.caseParam, 'url', this.caseTableData[params.index].url)
                      this.$set(this.caseParam, 'lang', this.caseTableData[params.index].lang)
                      this.$set(this.caseParam, 'sampleRate', this.caseTableData[params.index].sampleRate)
                      this.$set(this.caseParam, 'environment', this.caseTableData[params.index].environment)
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
                        title: 'TTS语音重新生成ing',
                        desc: 'TTS语音生成一般需要几秒钟的时间，请耐心等待'
                      })
                      this.repeatGenerateAudio(params.index)
                    }
                  }
                }, '重新生成'),
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
        caseTableData: [
        ]
      }
    },
    created () {
      this.getAllCaseList()
    },
    methods: {
      repeatGenerateAudio (index) {
        this.addLoading = true
        let url = window.myurl + '/tts/repeatGenerate'
        $.ajax({
          type: 'PUT',
          async: true,
          url: url,
          contentType: 'application/json',
          data: JSON.stringify(this.caseTableData[index]),
          dataType: 'json',
          success: (result) => {
            this.addLoading = false
            if (result.code === 200) {
              this.$Message.success('重新生成TTS语音成功')
              this.getAllCaseList()
            } else {
              this.$Message.error(result.message)
            }
          },
          error: (errorMsg) => {
            this.addLoading = false
            this.$Message.error(errorMsg)
            console.log(errorMsg)
          }
        })
      },
      removeCase (index) {
        let url = window.myurl + '/tts/deleteAudiCase/' + this.caseTableData[index].id
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
          text: '',
          environment: 'dev',
          codec: 'mp3',
          lang: 'zh',
          sampleRate: 24000,
          url: ''
        }
      },
      editCase () {
        this.editLoading = true
        let url = window.myurl + '/tts/updateAudioCase/'
        $.ajax({
          type: 'PUT',
          async: true,
          url: url,
          contentType: 'application/json',
          data: JSON.stringify(this.caseParam),
          dataType: 'json',
          success: (result) => {
            this.editLoading = false
            if (result.code === 200) {
              this.$Message.success('更新成功')
              this.resetParamForm()
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
        this.addLoading = true
        let url = window.myurl + '/tts/addAudioCase/'
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
              this.resetParamForm()
              this.getAllCaseList()
            } else {
              this.$Message.error(result.message)
            }
          },
          error: (errorMsg) => {
            this.addLoading = false
            this.$Message.error(errorMsg)
            console.log(errorMsg)
          }
        })
      },
      addCaseClick () {
        this.addModal = true
      },
      searchCase () {
        this.searchLoading = true
        let url = window.myurl + '/tts/searchByText?pageSize=' + this.pageHelp.pageSize + '&pageNo=' + this.pageHelp.curPage + '&text=' + this.searchContent
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
        let url = window.myurl + '/tts/getAllCase?pageSize=' + this.pageHelp.pageSize + '&pageNo=' + this.pageHelp.curPage
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
      },
      getPageSize (pageSize) {
        this.pageHelp.pageSize = pageSize
      }
    }
  }
</script>

<style>
</style>
