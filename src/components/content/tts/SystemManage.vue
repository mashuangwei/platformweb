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
    <br>
    <Form ref="systemParam" :model="systemParam" :rules="ruleCustom" :label-width="80">
      <FormItem label="系统名称" prop="name">
        <Input  v-model="systemParam.name" style="width: 20%"></Input>
      </FormItem>
      <FormItem label="系统描述" prop="desc" style="width: 25%">
        <Input  v-model="systemParam.desc"></Input>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit('systemParam')">添加</Button>
        <Button type="ghost" @click="handleReset('systemParam')" style="margin-left: 10px">Reset</Button>
      </FormItem>
    </Form>
    <div class="border-bt editor-wrap">
    </div>
    <br>
    <row>
      <Table :loading="loading" :columns="systemTable" :data="systemData" height="600" :border="showBorder" :stripe="showStripe"
             :show-header="showHeader" showIndex="true"></Table>
    </row>
    <br>
    <!-- 分页 -->
    <row>
      <i-col span="14" offset="10">
        <Page :total="100" size="small" show-elevator show-sizer show-total placement="top"></Page>
      </i-col>
    </row>

    <Modal
      @on-ok="addOrSaveEvent"
      @on-cancel="addCancelEvent"
      :mask-closable="false"
      width="780"
      :title=modelTitle
      :okText=okButtonText
      v-model="addModal"
      :styles="{top: '20px'}">
      <row>
        <i-col span="2" offset="0">
          <div style="line-height: 32px;"><label>系统名称：</label></div>
        </i-col>
        <i-col span="3" offset="1">
          <div>
            <Input v-model="systemParam.name" placeholder="请输入..." style="width: 420px"></Input>
          </div>
        </i-col>
      </row>
      <br>

      <row>
        <i-col span="2" offset="0">
          <div style="line-height: 32px;"><label>系统描述：</label></div>
        </i-col>
        <i-col span="3" offset="1">
          <div>
            <Input v-model="systemParam.desc" placeholder="请输入..." style="width: 420px"></Input>
          </div>
        </i-col>
      </row>
      <br>

      <row>
        <i-col span="2" offset="0">
          <div style="line-height: 32px;"><label>Url：</label></div>
        </i-col>
        <i-col span="3" offset="1">
          <div>
            <Input v-model="systemParam.serverUrl" placeholder="请输入..." style="width: 420px"></Input>
          </div>
        </i-col>
      </row>
      <br>

      <br>
    </Modal>
  </div>
</template>
<script>
  import $ from 'jquery'

  export default {
    components: {
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
        ruleCustom: {
          name: [
            { validator: validateName, trigger: 'blur' }
          ],
          desc: [
            { validator: validateDesc, trigger: 'blur' }
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
        addModal: false,
        okButtonText: '添加',
        modelTitle: '添加',
        addButtunFlag: true,
        uploadShowFlag: false,
        systemParam: {
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
                      // this.editCase(params.index)
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
                      // this.editCase(params.index)
                    }
                  }
                }, '上传'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      // this.removeCase(params.index)
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
        this.$refs[name].resetFields()
      },
      handleSuccess (res, file, fileList) {
        this.uploadShowFlag = false
      },
      editCase (index) {
        this.index = index
        this.modelTitle = '编辑'
        this.okButtonText = '保存'
        this.addModal = true
        this.addButtunFlag = false
        this.systemParam = Object.assign({}, this.systemParam, this.systemData[index])
      },
      addSystem () {
        this.modelTitle = '添加'
        this.addModal = true
        this.addButtunFlag = true
        this.okButtonText = '添加'
      },
      removeCase (index) {
        fetch('http://localhost:8000/tts/delete/' + this.systemData[index].id, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }).then((res) => {
          res.json().then((json) => {
            console.log(json)
            this.getAllCase()
          })
        }).catch((e) => {
          e.toString()
        })
      },
      addOrSaveEvent () {
        if (this.addButtunFlag === false) {
          fetch('http://localhost:8000/tts/update/' + this.systemData[this.index].id, {
            method: 'PUT',
            body: JSON.stringify(this.systemParam),
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }).then((res) => {
            res.json().then((json) => {
              this.getAllCase()
            })
          }).catch((e) => {
            e.toString()
          })
        } else {
          fetch('http://localhost:8000/tts/add', {
            method: 'POST',
            body: JSON.stringify(this.systemParam),
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }).then((res) => {
            res.json().then((json) => {
              console.log(json)
              this.getAllCase()
            })
          }).catch((e) => {
            e.toString()
          })
        }
        this.systemParam = {
          name: '',
          desc: '',
          createTime: ''
        }
      },
      getAllSystem () {
        let url = window.myurl + '/mos/getAllSystem'
        this.loading = true
        $.ajax({
          type: 'GET',
          async: true,
          url: url,
          dataType: 'json',
          success: (result) => {
            this.systemData = result.data.list
            this.loading = false
          },
          error: (errorMsg) => {
            this.loading = false
            console.log(errorMsg)
          }
        })
      },
      addCancelEvent () {
        this.systemParam = {
          name: '',
          desc: '',
          createTime: ''
        }
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
      },
      drawGraph () {
      }
    },
    mounted () {
    }
  }
</script>

