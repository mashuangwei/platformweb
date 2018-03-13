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
      ok-text="关闭"
      v-model="addModal"
      :styles="{top: '20px'}">
      <Form :model="caseParam" :label-width="80">
        <FormItem label="text">
          <Input v-model="caseParam.text" type="textarea" :autosize="{minRows: 1,maxRows: 4}"
                 placeholder="请输入tts文本"></Input>
        </FormItem>
        <FormItem label="请求类型">
          <RadioGroup v-model="caseParam.service" style="margin-top: -5px">
            <Radio label="SpeechGW">SpeechGW</Radio>
            <Radio label="直连">直连</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="语言">
          <RadioGroup v-model="caseParam.lang" style="margin-top: -5px">
            <Radio label="zh">zh</Radio>
            <Radio label="en">en</Radio>
            <Radio label="xmly">xmly</Radio>
            <Radio label="e2e">e2e</Radio>
            <Radio label="c1">c1</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="采样率">
          <RadioGroup v-model="caseParam.sampleRate" style="margin-top: -5px">
            <Radio label="24000">24000</Radio>
            <Radio label="16000">16000</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="编码格式">
          <RadioGroup v-model="caseParam.codec" style="margin-top: -5px">
            <Radio label="opu2">opu2</Radio>
            <Radio label="opu">opu</Radio>
            <Radio label="pcm">pcm</Radio>
            <Radio label="mp3">mp3</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="测试环境">
          <RadioGroup v-model="caseParam.environment" style="margin-top: -5px">
            <Radio label="线上">线上</Radio>
            <Radio label="dev">dev</Radio>
            <Radio label="daily">daily</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="addCase" :loading="addLoading">添加</Button>
          <Button type="primary" style="margin-left: 8px" @click="resetParamForm">重置</Button>
        </FormItem>
      </Form>
      <!--<div slot="footer">-->
      <!--<Button @click="addCase" :loading="addLoading"></Button>-->
      <!--</div>-->
    </Modal>

    <!-- 保存case话框 -->
    <Modal
      :mask-closable="false"
      width="800"
      title="编辑"
      okText="关闭"
      v-model="editModal"
      :styles="{top: '20px'}">
      <Form :model="caseParam" :label-width="80">
        <FormItem label="text">
          <Input v-model="caseParam.text" type="textarea" :autosize="{minRows: 1,maxRows: 4}"
                 placeholder="请输入tts文本"></Input>
        </FormItem>
        <FormItem label="请求类型">
          <RadioGroup v-model="caseParam.service" style="margin-top: -5px">
            <Radio label="SpeechGW">SpeechGW</Radio>
            <Radio label="直连">直连</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="语言">
          <RadioGroup v-model="caseParam.lang" style="margin-top: -5px">
            <Radio label="zh">zh</Radio>
            <Radio label="en">en</Radio>
            <Radio label="xmly">xmly</Radio>
            <Radio label="e2e">e2e</Radio>
            <Radio label="c1">c1</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="采样率">
          <RadioGroup v-model="caseParam.sampleRate" style="margin-top: -5px">
            <Radio label="24000">24000</Radio>
            <Radio label="16000">16000</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="编码格式">
          <RadioGroup v-model="caseParam.codec" style="margin-top: -5px">
            <Radio label="opu2">opu2</Radio>
            <Radio label="opu">opu</Radio>
            <Radio label="pcm">pcm</Radio>
            <Radio label="mp3">mp3</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="测试环境">
          <RadioGroup v-model="caseParam.environment" style="margin-top: -5px">
            <Radio label="线上">线上</Radio>
            <Radio label="dev">dev</Radio>
            <Radio label="daily">daily</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="editCase" :loading="editLoading">保存</Button>
          <Button type="primary" style="margin-left: 8px" @click="resetParamForm">重置</Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
  import $ from 'jquery'
  import Row from 'iview/src/components/grid/row'
  import audio from './audio.vue'
  import expandRow from './table-expand-data.vue'

  import axios from 'axios'
  import JSZip from 'jszip'
  import FileSaver from 'file-saver'

  const getFile = url => {
    return new Promise((resolve, reject) => {
      axios({
        method: 'get',
        url,
        responseType: 'arraybuffer'
      }).then(data => {
        resolve(data.data)
      }).catch(error => {
        reject(error.toString())
      })
    })
  }
  export default {
    components: {
      Row,
      expandRow
    },
    data () {
      return {
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
          text: '',
          environment: '线上',
          codec: 'mp3',
          lang: 'zh',
          sampleRate: '24000',
          service: '直连',
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
            title: '文本',
            key: 'text',
            align: 'center',
            ellipsis: true,
            render: (h, params) => {
              return h('Poptip', {
                props: {
                  trigger: 'hover',
                  title: '',
                  placement: 'bottom'
                }
              }, [
                h('div', params.row.text),
                h('div', {
                  slot: 'content'
                }, [
                  h('div', params.row.text)
                ])
              ])
            }
          },
          // {
          //   title: 'lang',
          //   key: 'lang',
          //   align: 'center'
          // },
          {
            title: 'codec',
            key: 'codec',
            width: 75,
            align: 'center'
          },
          // {
          //   title: '采样率',
          //   key: 'sampleRate',
          //   align: 'center'
          // },
          // {
          //   title: '环境',
          //   key: 'environment',
          //   align: 'center'
          // },
          // {
          //   title: '创建时间',
          //   key: 'createTime',
          //   width: 150,
          //   align: 'center'
          // },
          {
            title: '语音',
            key: 'url',
            width: 250,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h(audio, {
                  props: {
                    src: 'http://test-57:8000/audio/' + this.caseTableData[params.index].url,
                    name: 'wav文件'
                  }
                })
              ])
            }
          },
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
                      this.editModal = true
                      this.$set(this.caseParam, 'id', this.caseTableData[params.index].id)
                      this.$set(this.caseParam, 'text', this.caseTableData[params.index].text)
                      this.$set(this.caseParam, 'url', this.caseTableData[params.index].url)
                      this.$set(this.caseParam, 'lang', this.caseTableData[params.index].lang)
                      this.$set(this.caseParam, 'sampleRate', this.caseTableData[params.index].sampleRate)
                      this.$set(this.caseParam, 'environment', this.caseTableData[params.index].environment)
                      this.$set(this.caseParam, 'codec', this.caseTableData[params.index].codec)
                      this.$set(this.caseParam, 'service', this.caseTableData[params.index].service)
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
        caseTableData: []
      }
    },
    created () {
      // this.caseParam.sampleRate = '24000'
      this.getAllCaseList()
    },
    methods: {
      handleBatchDownload () {
        const data = ['各类地址1', '各类地址2'] // 需要下载打包的路径, 可以是本地相对路径, 也可以是跨域的全路径
        const zip = new JSZip()
        const cache = {}
        const promises = []
        data.forEach(item => {
          const promise = getFile(item).then(data => { // 下载文件, 并存成ArrayBuffer对象
            const arrName = item.split('/')
            const fileName = arrName[arrName.length - 1] // 获取文件名
            zip.file(fileName, data, { binary: true }) // 逐个添加文件
            cache[fileName] = data
          })
          promises.push(promise)
        })

        Promise.all(promises).then(() => {
          zip.generateAsync({type: 'blob'}).then(content => { // 生成二进制流
            FileSaver.saveAs(content, '打包下载.zip') // 利用file-saver保存文件
          })
        })
      },
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
          environment: '线上',
          codec: 'mp3',
          lang: 'zh',
          sampleRate: '24000',
          url: '',
          service: '直连'
        }
      },
      editCase () {
        this.editLoading = true
        // this.editModal = false
        let url = window.myurl + '/tts/updateAudioCase/'
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
        // this.addModal = false
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
              // this.resetParamForm()
              this.getAllCaseList()
            } else {
              this.$Message.error(result.message)
            }
          },
          error: (errorMsg) => {
            // this.onOkloading = false
            this.addLoading = false
            this.$Message.error(errorMsg)
            console.log(errorMsg)
          }
        })
      },
      addCaseClick () {
        this.resetParamForm()
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
        this.getAllCaseList()
      },
      getPageSize (pageSize) {
        this.pageHelp.pageSize = pageSize
        this.getAllCaseList()
      }
    }
  }
</script>

<style>
</style>
