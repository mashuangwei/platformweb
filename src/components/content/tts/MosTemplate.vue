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
    <!--<Row>-->
    <!--&lt;!&ndash;<i-col span="2">&ndash;&gt;-->
    <!--&lt;!&ndash;<Button type="primary" @click="addSystem" style="margin-bottom:15px;">新增</Button>&ndash;&gt;-->
    <!--&lt;!&ndash;</i-col>&ndash;&gt;-->
    <!--<i-col span="3" offset="12">-->
    <!--<Input v-model="searchQuery" icon="ios-search-strong" placeholder="请输入..."-->
    <!--style="width: 200px"></Input>-->
    <!--</i-col>-->
    <!--<i-col span="1" offset="2">-->
    <!--<Button type="primary" icon="ios-search" @click="searchSystem">搜索</Button>-->
    <!--</i-col>-->
    <!--</Row>-->
    <!--<br>-->
    <row style="margin-top: -5px">
      <Card>
        <p slot="title">
          <Icon type="ios-plus-outline"></Icon>
          MOS评测任务添加
        </p>
        <Form ref="templateParam" :model="templateParam" :rules="ruleCustom" :label-width="80">
          <FormItem label="任务名称" prop="name">
            <Input v-model="templateParam.name" style="width: 20%"></Input>
          </FormItem>
          <FormItem label="任务描述" prop="desc" style="width: 25%">
            <Input v-model="templateParam.desc"></Input>
          </FormItem>
          <FormItem label="测试维度">
            <CheckboxGroup v-model="dim">
              <Checkbox label="音质"></Checkbox>
              <Checkbox label="自然度"></Checkbox>
              <Checkbox label="总体感觉"></Checkbox>
            </CheckboxGroup>
          </FormItem>

          <FormItem>
            <Button type="primary" @click="handleSubmitTemplate('templateParam')">添加</Button>
            <Button type="ghost" @click="handleResetTemplate('templateParam')" style="margin-left: 10px">Reset</Button>
          </FormItem>
        </Form>

      </Card>
    </row>

    <!--<div class="border-bt editor-wrap">-->
    <!--</div>-->
    <!--<br>-->
    <row style="margin-top: 5px">
      <Card>
        <p slot="title">
          <Icon type="ios-keypad"></Icon>
          MOS任务列表
        </p>
        <Table :loading="loading" :columns="templateTable" :data="templateData" :border="showBorder" no-data-text="没有数据"
               :stripe="showStripe" style="margin-top: -7px;margin-left: -7px" height="400"
               :show-header="showHeader" showIndex="true"></Table>
        <i-col span="14" offset="9" style="margin-top: 15px">
          <Page :total="pageHelp.totalNum" :current="pageHelp.curPage" :page-size="pageHelp.pageSize"
                @on-change="getTemplatePageIndex" @on-page-size-change="getTemplatePageSize"
                :page-size-opts="pageSizeOptions" size="small" show-elevator show-sizer show-total
                placement="top"></Page>
        </i-col>
        <br>
        <br>
      </Card>
    </row>
    <br>
    <br>
    <!-- 报告图表话框 -->
    <Modal
      @on-ok="okReportButton"
      @on-cancel="cancleReportButton"
      :mask-closable="false"
      width="700"
      title="评测报告"
      okText="确定"
      v-model="reportModal"
      :styles="{top: '20px'}">
      <row v-if="reportModal">
        <mosreport :data="reportData" @update="closeReportModal"></mosreport>
      </row>
      <br>
      <br>
      <!--<div class="border-bt editor-wrap">-->
      <!--</div>-->
      <!--<row>-->
      <!--<mos-total-report></mos-total-report>-->
      <!--</row>-->
    </Modal>

    <Modal
      @on-ok="saveTemplateParam"
      @on-cancel="cancelButton"
      :mask-closable="false"
      width="500"
      title="编辑"
      okText="保存"
      v-model="editTemplateModal"
      :styles="{top: '20px'}">
      <row>
        <i-col span="4" offset="0">
          <div style="line-height: 32px;"><label>任务名称：</label></div>
        </i-col>
        <i-col span="3" offset="1">
          <div>
            <Input v-model="editTemplateParam.name" placeholder="请输入..." style="width: 250px"></Input>
          </div>
        </i-col>
      </row>
      <br>

      <row>
        <i-col span="4" offset="0">
          <div style="line-height: 32px;"><label>任务描述：</label></div>
        </i-col>
        <i-col span="3" offset="1">
          <div>
            <Input v-model="editTemplateParam.desc" placeholder="请输入..." style="width: 250px"></Input>
          </div>
        </i-col>
      </row>
      <br>
      <row>
        <i-col span="4" offset="0">
          <div style="line-height: 32px;"><label>测试维度：</label></div>
        </i-col>
        <i-col span="13" offset="1">
          <div>
          <CheckboxGroup v-model="editdim">
            <Checkbox label="音质"></Checkbox>
            <Checkbox label="自然度"></Checkbox>
            <Checkbox label="总体感觉"></Checkbox>
          </CheckboxGroup>
          </div>
        </i-col>
      </row>
      <br>
    </Modal>

    <!-- 添加测试系统对话框 -->
    <Modal
      :mask-closable="false"
      width="1200"
      title="配置MOS任务"
      okText="确定"
      v-model="sysModal"
      :styles="{top: '20px'}">
      <div>
        <row style="margin-top: -5px">
          <Card>
            <p slot="title">
              <Icon type="ios-plus-outline"></Icon>
              测试系统添加
            </p>
            <Form ref="systemParam" :model="systemParam" :rules="ruleCustom" :label-width="80">
              <FormItem label="系统名称" prop="name">
                <Input v-model="systemParam.name" style="width: 20%"></Input>
              </FormItem>
              <FormItem label="系统描述" prop="desc" style="width: 25%">
                <Input v-model="systemParam.desc"></Input>
              </FormItem>
              <FormItem>
                <Button type="primary" @click="handleSubmitSystem('systemParam')">添加</Button>
                <Button type="ghost" @click="handleResetSys('systemParam')" style="margin-left: 10px">Reset</Button>
              </FormItem>
            </Form>
          </Card>
        </row>

        <!--<div class="border-bt editor-wrap">-->
        <!--</div>-->
        <!--<br>-->
        <row style="margin-top: 5px">
          <Card>
            <p slot="title">
              <Icon type="ios-keypad"></Icon>
              已添加测试系统列表
            </p>
            <Table :loading="sysTableLoading" :columns="systemTable" :data="systemData" :border="showBorder" no-data-text="没有数据"
                   :stripe="showStripe" style="margin-top: -7px;margin-left: -7px" height="450"
                   :show-header="showHeader" showIndex="true"></Table>
            <i-col span="14" offset="9" style="margin-top: 15px">
              <Page :total="sysPageHelp.totalNum" :current="sysPageHelp.curPage" :page-size="sysPageHelp.pageSize"
                    @on-change="getSysPageIndex" @on-page-size-change="getSysPageSize"
                    :page-size-opts="pageSizeOptions" size="small" show-elevator show-sizer show-total
                    placement="top"></Page>
            </i-col>
            <br>
            <br>
          </Card>
        </row>

      </div>

    </Modal>

    <Modal
      @on-ok="saveSystemParam"
      @on-cancel="cancelEditSysButton"
      :mask-closable="false"
      width="400"
      title="编辑"
      okText="保存"
      v-model="editModal"
      :styles="{top: '20px'}">
      <row>
        <i-col span="4" offset="0">
          <div style="line-height: 32px;"><label>系统名称：</label></div>
        </i-col>
        <i-col span="3" offset="1">
          <div>
            <Input v-model="editSystemParam.name" placeholder="请输入..." style="width: 250px"></Input>
          </div>
        </i-col>
      </row>
      <br>

      <row>
        <i-col span="4" offset="0">
          <div style="line-height: 32px;"><label>系统描述：</label></div>
        </i-col>
        <i-col span="3" offset="1">
          <div>
            <Input v-model="editSystemParam.desc" placeholder="请输入..." style="width: 270px"></Input>
          </div>
        </i-col>
      </row>
      <br>
      <br>
    </Modal>
    <!-- 上传语音文件和文本 -->
    <Modal
      @on-ok="okButton"
      @on-cancel="cancelFileUpButton"
      :mask-closable="false"
      width="400"
      title="上传语音文件&文本"
      okText="确定"
      v-model="upfileModal"
      :styles="{top: '20px'}">
      <Upload
        multiple
        :show-upload-list="showUploadListFlag"
        :on-error="fileUpError"
        :on-success="fileUpSuccess"
        :default-file-list="filelist"
        :format="fileFormat"
        :max-size="10240"
        :on-format-error="handleFormatError"
        name="files"
        style="margin-top: 5px"
        :action= "upfileurl">
        <Button type="ghost" icon="ios-cloud-upload-outline">选择文件</Button>
      </Upload>
    </Modal>

  </div>
</template>
<script>
  import $ from 'jquery'
  import Card from 'iview/src/components/card/card'
  import mosreport from './mosreport'

  export default {
    components: {
      mosreport,
      Card,
      'name': 'mosTemplate'
    },
    data () {
      const validateName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('Please enter your name'))
        } else {
          callback()
        }
      }
      const validateDesc = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('Please enter your description'))
        }
        callback()
      }
      return {
        reportModal: false,
        reportData: {categories: [], series: []},
        editdim: [],
        dim: [],
        fileFormat: ['pcm', 'wav', 'mp3'],
        sysTableLoading: false,
        templateId: 1,
        editSystemModal: false,
        templateIdObj: {id: 0},
        loadingStatus: false,
        pageSizeOptions: [10, 20, 30, 50, 100],
        pageHelp: {
          totalNum: 0,
          curPage: 1,
          pageSize: 10
        },
        sysPageHelp: {
          totalNum: 0,
          curPage: 1,
          pageSize: 10
        },
        ruleCustom: {
          name: [
            {validator: validateName, trigger: 'blur'}
          ],
          desc: [
            {validator: validateDesc, trigger: 'blur'}
          ]
        },
        searchQuery: '',
        loading: false,
        index: 0,
        visible: false,
        showBorder: true,
        showStripe: true,
        showHeader: true,
        fixedHeader: true,
        editTemplateModal: false,
        templateParam: {
          id: '',
          name: '',
          desc: '',
          dim: '',
          createTime: ''
        },
        editTemplateParam: {
          id: '',
          name: '',
          dim: '',
          desc: '',
          createTime: ''
        },
        templateTable: [
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '任务名称',
            key: 'name',
            align: 'center'
          },
          {
            title: '任务描述',
            key: 'desc',
            align: 'center'
          },
          {
            title: '测试维度',
            key: 'dim',
            align: 'center'
          },
          {
            title: '创建时间',
            key: 'createTime',
            align: 'center'
          },
          {
            title: '操作',
            key: 'action',
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
                      this.editTemplateParam = Object.assign({}, this.editTemplateParam, this.templateData[params.index])
                      if (this.editTemplateParam.dim.length > 0) {
                        this.editdim = this.editTemplateParam.dim.split(',')
                      }
                      this.editTemplateModal = true
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
                      this.templateId = this.templateData[params.index].id
                      this.getAllSystem()
                      this.sysModal = true
                    }
                  }
                }, '配置'),
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
                      this.templateId = this.templateData[params.index].id
                      this.getTemplateRoport(this.templateData[params.index].id)
                    }
                  }
                }, '报告'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.removeMosTemplate(params.index)
                    }
                  }
                }, '删除')
              ])
            }
          }
        ],
        sysModal: false,
        templateData: [],
        showUploadListFlag: true,
        maxSize: 102400,
        upfileurl: '',
        filelist: [],
        file: null,
        fileName: '',
        upfileModal: false,
        editModal: false,
        uploadShowFlag: false,
        systemParam: {
          id: '',
          templateId: 0,
          name: '',
          desc: '',
          createTime: ''
        },
        editSystemParam: {
          id: '',
          templateId: 0,
          name: '',
          desc: '',
          createTime: ''
        },
        systemTable: [
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '系统名称',
            key: 'name',
            align: 'center'
          },
          {
            title: '描述',
            key: 'desc',
            align: 'center'
          },
          {
            title: '创建时间',
            key: 'createTime',
            align: 'center'
          },
          {
            title: '操作',
            key: 'action',
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
                      this.editSystemParam = Object.assign({}, this.editSystemParam, this.systemData[params.index])
                      this.editModal = true
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
                      this.upfileModal = true
                      this.filelist = []
                      this.fileFormat = ['pcm', 'wav', 'mp3']
                      this.upfileurl = window.myurl + '/mos/upAudio/' + this.systemData[params.index].id
                      // this.editCase(params.index)
                    }
                  }
                }, '上传语音'),
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
                      this.upfileModal = true
                      this.fileFormat = ['txt']
                      this.filelist = []
                      this.upfileurl = window.myurl + '/mos/upText/' + this.systemData[params.index].id
                      // this.editCase(params.index)
                    }
                  }
                }, '上传文本'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.removeMosSystem(params.index)
                    }
                  }
                }, '删除')
              ])
            }
          }
        ],
        systemData: []
      }
    },
    created () {
      this.getAllTemplate()
    },
    destroyed () {
      console.log('task destoryed.....')
    },
    methods: {
      closeReportModal () {
        this.$emit('update')
      },
      cancleReportButton () {
        this.$emit('update')
      },
      okReportButton () {
        this.reportModal = false
      },
      getTemplateRoport (templateId) {
        let url = window.myurl + '/mos/getTaskReport/' + templateId
        $.ajax({
          type: 'GET',
          async: true,
          url: url,
          dataType: 'json',
          success: (result) => {
            if (result.code === 400) {
              this.$Message.error(result.message)
              return
            }
            this.$set(this.reportData, 'categories', result.data.categories)
            this.$set(this.reportData, 'series', result.data.series)
            // this.reportData = result.data
            console.log(this.reportData)
            this.reportModal = true
          },
          error: (errorMsg) => {
            this.$Message.error('查看报告失败')
            console.log(errorMsg)
          }
        })
      },
      upfileError (error, file, fileList) {
        this.$Message.error('上传失败')
        console.log(error)
      },
      handleFormatError (file) {
        this.$Notice.warning({
          title: '上传文件失败',
          desc: '格式不对'
        })
      },
      handleSubmitTemplate (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (this.dim.length > 0) {
              this.templateParam.dim = this.dim.toString()
            }
            let url = window.myurl + '/mos/addMosTemplate'
            $.ajax({
              type: 'POST',
              async: false,
              contentType: 'application/json',
              url: url,
              data: JSON.stringify(this.templateParam),
              dataType: 'json',
              success: (result) => {
                this.$Message.success('Success!')
                this.getAllTemplate()
              },
              error: (errorMsg) => {
                this.$Message.error('添加失败!')
                console.log('error: ' + errorMsg)
              }
            })
          } else {
            this.$Message.error('任务名称和任务描述不能为空!')
          }
        })
      },
      handleSubmitSystem (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            let url = window.myurl + '/mos/addSystem'
            this.systemParam.templateId = this.templateId
            $.ajax({
              type: 'POST',
              async: false,
              contentType: 'application/json',
              url: url,
              data: JSON.stringify(this.systemParam),
              dataType: 'json',
              success: (result) => {
                this.$Message.success('Success!')
                this.getAllSystem()
              },
              error: (errorMsg) => {
                this.$Message.error('添加失败!')
                console.log('error: ' + errorMsg)
              }
            })
          } else {
            this.$Message.error('系统名称和系统描述不能为空!')
          }
        })
      },
      handleResetTemplate (name) {
        this.$refs[name].resetFields()
      },
      handleResetSys (name) {
        this.$refs[name].resetFields()
      },
      removeMosTemplate (index) {
        let url = window.myurl + '/mos/deleteMosTemplate/' + this.templateData[index].id
        $.ajax({
          type: 'DELETE',
          async: true,
          url: url,
          dataType: 'json',
          success: (result) => {
            this.$Message.success('删除成功')
            this.getAllTemplate()
          },
          error: (errorMsg) => {
            console.log(errorMsg)
            this.$Message.error('删除失败')
          }
        })
      },
      saveTemplateParam () {
        let url = window.myurl + '/mos/updateMosTemplate'
        if (this.editdim.length > 0) {
          this.$set(this.editTemplateParam, 'dim', this.editdim.toString())
        }
        // this.editdim = this.editTemplateParam.split(',')

        $.ajax({
          type: 'PUT',
          async: true,
          url: url,
          dataType: 'json',
          data: JSON.stringify(this.editTemplateParam),
          contentType: 'application/json',
          success: (result) => {
            if (result.code === 200) {
              this.$Message.success('保存成功')
              this.getAllTemplate()
            } else {
              this.$Message.error(result.message)
            }
          },
          error: (errorMsg) => {
            this.loading = false
            this.$Message.error('保存失败')
            console.log(errorMsg)
          }
        })
        this.editTemplateParam = {
          id: '',
          name: '',
          dim: [],
          desc: '',
          createTime: ''
        }
      },
      getAllTemplate () {
        let url = window.myurl + '/mos/getAllMosTemplate?pageSize=' + this.pageHelp.pageSize + '&pageNo=' + this.pageHelp.curPage
        this.loading = true
        $.ajax({
          type: 'GET',
          async: true,
          url: url,
          dataType: 'json',
          success: (result) => {
            this.templateData = result.data.list
            this.pageHelp.totalNum = result.data.total
            this.pageHelp.totalPageNum = result.data.pages
            this.loading = false
          },
          error: (errorMsg) => {
            this.loading = false
            console.log(errorMsg)
          }
        })
      },
      cancelButton () {
        this.templateParam = {
          name: '',
          desc: '',
          createTime: ''
        }
      },
      cancelEditSysButton () {
      },
      getTemplatePageIndex (pageIndex) {
        this.pageHelp.curPage = pageIndex
        this.getAllTemplate()
      },
      getTemplatePageSize (pageSize) {
        this.pageHelp.pageSize = pageSize
      },
      getSysPageIndex (pageIndex) {
        this.sysPageHelp.curPage = pageIndex
        this.getAllSystem()
      },
      getSysPageSize (pageSize) {
        this.sysPageHelp.pageSize = pageSize
      },
      searchSystem () {
        fetch('http://localhost:8000/tts/search?' + 'condition=', {
          method: 'GET'
        }).then((res) => {
          res.json().then((json) => {
            this.templateData = json
            for (var i = 0; i < this.templateData.length; i++) {
              this.$set(this.templateData[i], 'result', '')
            }
          })
        }).catch((e) => {
          e.toString()
        })
      },
      fileUpError (error, file, fileList) {
        this.$Notice.warning({
          title: '上传文件失败！',
          desc: '语音文件已上传！' + error
        })
      },
      fileUpSuccess (response, file, fileList) {
        this.$Message.success(file.name + '  上传成功')
      },
      cancelFileUpButton () {
        this.upfileModal = false
      },
      okButton () {
        this.upfileModal = false
      },
      handleSuccess (res, file, fileList) {
        this.uploadShowFlag = false
      },
      removeMosSystem (index) {
        let url = window.myurl + '/mos/deleteSystem/' + this.systemData[index].id
        $.ajax({
          type: 'DELETE',
          async: true,
          url: url,
          dataType: 'json',
          success: (result) => {
            this.$Message.success('删除成功')
            this.getAllSystem()
          },
          error: (errorMsg) => {
            console.log(errorMsg)
            this.$Message.error('删除失败')
          }
        })
      },
      saveSystemParam () {
        let url = window.myurl + '/mos/updateSystem'
        this.editSystemParam.templateId = this.templateId
        $.ajax({
          type: 'PUT',
          async: true,
          url: url,
          dataType: 'json',
          data: JSON.stringify(this.editSystemParam),
          contentType: 'application/json',
          success: (result) => {
            if (result.code === 200) {
              this.$Message.success('保存成功')
              this.getAllSystem()
            } else {
              this.$Message.error(result.message)
            }
          },
          error: (errorMsg) => {
            this.loading = false
            this.$Message.error('保存失败')
            console.log(errorMsg)
          }
        })
        this.editSystemParam = {
          id: '',
          templateId: '',
          name: '',
          desc: '',
          createTime: ''
        }
      },
      getAllSystem () {
        let url = window.myurl + '/mos/getAllSystem/' + this.templateId + '?pageSize=' + this.sysPageHelp.pageSize + '&pageNo=' + this.sysPageHelp.curPage
        this.sysTableLoading = true
        $.ajax({
          type: 'GET',
          async: true,
          url: url,
          dataType: 'json',
          success: (result) => {
            this.systemData = result.data.list
            this.sysPageHelp.totalNum = result.data.total
            this.sysPageHelp.totalPageNum = result.data.pages
            this.sysTableLoading = false
          },
          error: (errorMsg) => {
            this.sysTableLoading = false
            console.log(errorMsg)
          }
        })
      }
    },
    mounted () {
    }
  }
</script>

