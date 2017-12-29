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
            <Button type="primary" @click="handleSubmit('systemParam')">添加</Button>
            <Button type="ghost" @click="handleReset('systemParam')" style="margin-left: 10px">Reset</Button>
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
        <Table :loading="loading" :columns="systemTable" :data="systemData" :border="showBorder" no-data-text="没有数据"
               :stripe="showStripe" style="margin-top: -7px;margin-left: -7px" height="450"
               :show-header="showHeader" showIndex="true"></Table>
        <i-col span="14" offset="9" style="margin-top: 15px">
          <Page :total="pageHelp.totalNum" :current="pageHelp.curPage" :page-size="pageHelp.pageSize"
                @on-change="getPageIndex" @on-page-size-change="getPageSize"
                :page-size-opts="pageSizeOptions" size="small" show-elevator show-sizer show-total
                placement="top"></Page>
        </i-col>
        <br>
        <br>
      </Card>
    </row>
    <br>
    <br>

    <Modal
      @on-ok="saveSystemParam"
      @on-cancel="cancelButton"
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
            <Input v-model="editSystemParam.desc" placeholder="请输入..." style="width: 250px"></Input>
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
      height="1200"
      v-model="upfileModal"
      :styles="{top: '20px'}">
      <Upload
        multiple
        show-upload-list="true"
        max-size="102400"
        :default-file-list="filelist"
        name="files"
        :action= "upfileurl">
        <Button type="ghost" icon="ios-cloud-upload-outline">选择文件</Button>
      </Upload>
      <br>

    </Modal>
  </div>
</template>
<script>
  import $ from 'jquery'
  import Card from 'iview/src/components/card/card'

  export default {
    components: {
      Card,
      'name': 'ttsSystemManage'
    },
    data () {
      const validateName = (rule, value, callback) => {
        if (value === '') {
          console.log('validateName: ' + value)
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
        upfileurl: '',
        filelist: [],
        file: null,
        loadingStatus: false,
        upfileModal: false,
        pageSizeOptions: [10, 20, 30, 50, 100],
        pageHelp: {
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
        fileName: '',
        index: 0,
        visible: false,
        showBorder: true,
        showStripe: true,
        showHeader: true,
        fixedHeader: true,
        editModal: false,
        uploadShowFlag: false,
        systemParam: {
          id: '',
          name: '',
          desc: '',
          createTime: ''
        },
        editSystemParam: {
          id: '',
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
                      this.upfileurl = window.myurl + '/mos/upfile/' + this.systemData[params.index].name
                      // this.editCase(params.index)
                    }
                  }
                }, '上传语音&文本'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.remove(params.index)
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
      this.getAllSystem()
    },
    methods: {
      // handleUpload (file) {
      //   this.file = file
      //   return false
      // },
      // upfileAction () {
      //   this.loadingStatus = true
      //   setTimeout(() => {
      //     this.file = null
      //     this.loadingStatus = false
      //     this.$Message.success('Success')
      //   }, 1500)
      // },
      cancelFileUpButton () {
        this.upfileModal = false
      },
      okButton () {
        this.upfileModal = false
      },
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            let url = window.myurl + '/mos/add'
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
      handleReset (name) {
        this.$refs[name].resetFields()
      },
      handleSuccess (res, file, fileList) {
        this.uploadShowFlag = false
      },
      remove (index) {
        let url = window.myurl + '/mos/delete/' + this.systemData[index].id
        this.loading = true
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
        let url = window.myurl + '/mos/update'
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
          name: '',
          desc: '',
          createTime: ''
        }
      },
      getAllSystem () {
        let url = window.myurl + '/mos/getAllSystem?pageSize=' + this.pageHelp.pageSize + '&pageNo=' + this.pageHelp.curPage
        this.loading = true
        $.ajax({
          type: 'GET',
          async: true,
          url: url,
          dataType: 'json',
          success: (result) => {
            this.systemData = result.data.list
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
        this.systemParam = {
          name: '',
          desc: '',
          createTime: ''
        }
      },
      getPageIndex (pageIndex) {
        this.pageHelp.curPage = pageIndex
        this.getAllSystem()
      },
      getPageSize (pageSize) {
        this.pageHelp.pageSize = pageSize
      },
      searchSystem () {
        fetch('http://localhost:8000/tts/search?' + 'condition=', {
          method: 'GET'
        }).then((res) => {
          res.json().then((json) => {
            this.systemData = json
            for (var i = 0; i < this.systemData.length; i++) {
              this.$set(this.systemData[i], 'result', '')
            }
          })
        }).catch((e) => {
          e.toString()
        })
      }
    },
    mounted () {
    }
  }
</script>

