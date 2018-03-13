<template>
  <div>
    <Tabs :value="commonTablsName">
      <TabPane label="普通标注" name="普通标注" icon="ios-paper-outline">
        <Card>
          <p slot="title">
            <Icon type="ios-search-strong"></Icon>
            搜索
          </p>
          <Form ref="searchCommonCaseStr" :model="searchCommonCaseStr" :label-width="80" style="margin-top: 13px">
            <FormItem label="" prop="name">
              <Input v-model="searchCommonCaseStr" style="width: 270px" placeholder="请输入搜索的文本内容"></Input>
              <Button type="primary" @click="searchCommonCase" style="margin-left: 10px" icon="android-search">搜索
              </Button>
            </FormItem>
          </Form>
        </Card>

        <Card>
          <p slot="title">
            <Icon type="ios-plus-empty" style="margin-left: 0px"></Icon>
            用例添加
          </p>
          <Form ref="searchCommonCaseStr" :model="searchCommonCaseStr" :label-width="80" style="margin-top: 13px">
            <FormItem label="">
              <row>
                <i-col span="2">
                  <Button type="primary" @click="addCommonCase" style="margin-left: 3px" icon="plus">单个添加</Button>
                </i-col>
                <i-col span="2" style="margin-left: 90px">
                  <Button type="primary" icon="ios-cloud-upload-outline" @click="upfile">批量添加</Button>
                </i-col>
              </row>

            </FormItem>
          </Form>
        </Card>

        <Card>
          <p slot="title">
            <Icon type="ios-keypad"></Icon>
            用例集
          </p>
          <Table :loading="loading" :columns="commonCaseTable" :data="commonCaseTableData" :border="showBorder"
                 no-data-text="没有数据" height="351"
                 :stripe="showStripe" style="margin-top: -7px;margin-left: -7px"
                 :show-header="showHeader" showIndex="true"></Table>
          <i-col span="14" offset="9" style="margin-top: 15px">
            <Page :total="pageHelp.totalNum" :current="pageHelp.curPage" :page-size="pageHelp.pageSize"
                  @on-change="getCommonCasePageIndex" @on-page-size-change="getCommonCasePageSize"
                  :page-size-opts="pageSizeOptions" size="small" show-elevator show-sizer show-total
                  placement="top"></Page>
          </i-col>
          <br>
          <br>
        </Card>
      </TabPane>
      <TabPane label="多音字标注" name="多音字标注" icon="ios-paper-outline">
        标签二的内容
      </TabPane>
      <TabPane label="Task" icon="ios-compose-outline">
        标签三的内容
      </TabPane>
    </Tabs>
    <Modal
      :mask-closable="false"
      width="560"
      title="批量生成语音标注数据"
      okText="确定"
      v-model="upfileModal"
      :styles="{top: '20px'}">
      <div>
        <row>
          <i-col span="3">
            <Select v-model="selectDim" style="width:170px">
              <Option v-for="item in selectDimList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </i-col>
          <i-col span="7" offset="7">
            <Upload action="//jsonplaceholder.typicode.com/posts/"
                    :format="['txt','TXT']"
                    :max-size="2048"
                    :on-format-error="handleFormatError"
            >
              <Button type="ghost" icon="ios-cloud-upload-outline">批量上传</Button>
            </Upload>
          </i-col>
        </row>


      </div>
    </Modal>
    <!-- 添加普通case对话框  -->
    <Modal
      :mask-closable="false"
      width="900"
      :title="commonCaseModalTitle"
      okText="确定"
      v-model="addCommonCaseModal"
      :styles="{top: '20px'}">

      <Card>
        <p slot="title">
          <Icon type="android-add"></Icon>
          普通语音文本用例添加
        </p>
        <Form ref="commonCase" :model="commonCase" :label-width="80">
          <FormItem label="文本" prop="name">
            <Input v-model="commonCase.text" style="width: 270px"></Input>
          </FormItem>
          <FormItem label="拼音" style="width: 350px">
            <Input v-model="commonCase.pinyin"></Input>
          </FormItem>
          <FormItem label="韵律" style="width: 350px">
            <Input v-model="commonCase.yunlv"></Input>
          </FormItem>

          <FormItem label="测试维度">
            <Transfer
              :data="dimList"
              :target-keys="targetKeys"
              :list-style="listStyle"
              :render-format="render"
              :operations="['向左','向右']"
              filterable
              :titles="commonCaseDinTitle"
              not-found-text="没有数据"
              @on-change="handleChange">
              <div :style="{float: 'right', margin: '5px'}">
                <Button type="ghost" size="small" @click="reloadMockData">刷新</Button>
              </div>
            </Transfer>
          </FormItem>

          <FormItem>
            <Button type="primary" @click="addCommonCase">添加</Button>
            <Button type="ghost" @click="resetCommonCase" style="margin-left: 10px">Reset</Button>
          </FormItem>
        </Form>
      </Card>
    </Modal>
  </div>
</template>

<script>
  import Row from 'iview/src/components/grid/row'
  import ICol from 'iview/src/components/grid/col'

  export default {
    components: {
      ICol,
      Row
    },
    name: 'autotest',
    data () {
      return {
        selectDim: '',
        selectDimList: [
          {
            value: '男',
            label: '男'
          },
          {
            value: '女',
            label: '女'
          },
          {
            value: '儿童',
            label: '儿童'
          }
        ],
        upfileModal: false,
        file: null,
        searchCommonCaseStr: '',
        pageSizeOptions: [10, 20, 30, 50, 100],
        pageHelp: {
          totalNum: 0,
          curPage: 1,
          pageSize: 10
        },
        loading: false,
        commonCaseTable: [
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '文本',
            key: 'text',
            align: 'center'
          },
          {
            title: '拼音',
            key: 'pinyin',
            align: 'center'
          },
          {
            title: '韵律',
            key: 'yunlv',
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
            width: 170,
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
                      // this.editTemplateParam = Object.assign({}, this.editTemplateParam, this.templateData[params.index])
                      // if (this.editTemplateParam.dim.length > 0) {
                      //   this.editdim = this.editTemplateParam.dim.split(',')
                      // }
                      // this.editTemplateModal = true
                    }
                  }
                }, '编辑'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      // this.removeMosTemplate(params.index)
                    }
                  }
                }, '删除')
              ])
            }
          }
        ],
        commonCaseTableData: [
          {
            text: '今天天气怎么样',
            pinyin: 'jintiantianqizmy',
            dim: 'kk',
            yunlv: '',
            result: ''
          },
          {
            text: '今天天气怎么样',
            pinyin: 'jintiantianqizmy',
            dim: 'dd',
            yunlv: '',
            result: ''
          },
          {
            text: '今天天气怎么样',
            pinyin: 'jintiantianqizmy',
            dim: 'tt',
            yunlv: '',
            result: ''
          },
          {
            text: '今天天气怎么样',
            pinyin: 'jintiantianqizmy',
            dim: 'dd',
            yunlv: '',
            result: ''
          },
          {
            text: '今天天气怎么样',
            pinyin: 'jintiantianqizmy',
            dim: 'tt',
            yunlv: '',
            result: ''
          },
          {
            text: '今天天气怎么样',
            pinyin: 'jintiantianqizmy',
            dim: 'dd',
            yunlv: '',
            result: ''
          },
          {
            text: '今天天气怎么样',
            pinyin: 'jintiantianqizmy',
            dim: 'tt',
            yunlv: 'jintiantianqizmy',
            result: ''
          },
          {
            text: '今天天气怎么样',
            pinyin: '',
            dim: 'hh',
            yunlv: '',
            result: ''
          }
        ],
        commonCaseModalTitle: '添加',
        addCommonCaseModal: false,
        commonTablsName: '普通标注',
        commonCaseDinTitle: ['源维度', '目标维度'],
        targetKeys: [],
        listStyle: {
          width: '270px',
          height: '200px'
        },
        dimList: [
          {
            key: 1,
            label: '儿童'
          },
          {
            key: 2,
            label: '女生'
          },
          {
            key: 3,
            label: '老人'
          }
        ],
        loadingStatus: false,
        commonCase: {
          text: '',
          pinyin: '',
          dim: [],
          yunlv: '',
          result: ''
        },
        visible: false,
        showBorder: true,
        showStripe: true,
        showHeader: true,
        fixedHeader: true
      }
    },
    methods: {
      upfile () {
        this.upfileModal = true
      },
      searchCommonCase () {},
      getCommonCasePageSize (size) {
        this.pageHelp.pageSize = size
      },
      getCommonCasePageIndex (index) {
        this.pageHelp.curPage = index
      },
      reloadMockData () {
        this.dimList.splice(0, this.dimList.length)
        this.targetKeys = []
        this.getMockData()
      },
      handleChange (newTargetKeys) {
        this.targetKeys = newTargetKeys
      },
      render (item) {
        return item.label
      },
      handleFormatError (file) {
        this.$Notice.warning({
          title: '上传的文件类型不对',
          desc: '上传的文件 ' + file.name + ' 类型不对, 请选择txt文件上传.'
        })
      },
      addCommonCase () {
        this.addCommonCaseModal = true
        // this.commonTablsName = '多音字标注'
        this.$set(this.commonTablsName, '多音字标注')
      },
      resetCommonCase () {}
    }

  }
</script>

<style scoped>

</style>
