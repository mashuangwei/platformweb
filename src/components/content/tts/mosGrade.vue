<template>
  <div>
    <row style="margin-top: -5px">
      <Card>
        <p slot="title">
          <Icon type="ios-plus-outline"></Icon>
          评测任务创建
        </p>
        <Form :model="formItem" :label-width="80">
          <FormItem label="姓名">
            <Input v-model="formItem.input" placeholder="输入评测人姓名" style="width: 200px"></Input>
          </FormItem>
          <FormItem label="性别">
            <RadioGroup v-model="formItem.radio">
              <Radio label="male">男</Radio>
              <Radio label="female">女</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="测试维度">
            <CheckboxGroup v-model="formItem.checkbox">
              <Checkbox label="音质"></Checkbox>
              <Checkbox label="自然度"></Checkbox>
              <Checkbox label="总体感觉"></Checkbox>
            </CheckboxGroup>
          </FormItem>
          <FormItem label="测试系统">
            <Transfer
              :data="systemDataList"
              :target-keys="targetKeys"
              :list-style="listStyle"
              :render-format="render3"
              :operations="['向左','向右']"
              filterable
              :titles="testSystemTitles"
              not-found-text="没有数据"
              @on-change="handleChange3">
              <div :style="{float: 'right', margin: '5px'}">
                <Button type="ghost" size="small" @click="reloadMockData">刷新</Button>
              </div>
            </Transfer>
          </FormItem>
          <FormItem>
            <Button type="primary">Submit</Button>
            <Button type="ghost" style="margin-left: 8px">Cancel</Button>
          </FormItem>
        </Form>
      </Card>
    </row>
    <row style="margin-top: 5px">
      <Card>
        <p slot="title">
          <Icon type="ios-list"></Icon>
          已创建任务列表
        </p>
        <Table :loading="loading" :columns="mosTaskTable" :data="mosTaskData" :border="showBorder" no-data-text="没有数据"
               :stripe="showStripe" style="margin-top: -7px;margin-left: -7px" height="180"
               :show-header="showHeader" showIndex="true"></Table>
        <i-col span="14" offset="9" style="margin-top: 15px">
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

    <!-- 评分对话框 -->
    <Modal
      :mask-closable="false"
      width="800"
      title="评分"
      okText="确定"
      v-model="scoreModal"
      :styles="{top: '20px'}">
      <Card>
        <p slot="title">
          <Icon type="ios-keypad"></Icon>
          第{{this.caseIndex}}题 &nbsp;&nbsp;&nbsp;&nbsp;  语音文本：{{this.caseParamList[this.caseIndex - 1].text}}     &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;答题状态：已答
        </p>
        <!--<div v-for="item in caselist" :key="item.index">-->
          <!--<score-case :data="item"></score-case>-->
        <!--</div>-->
        <div v-for="item in caseParamList[this.caseIndex - 1].param" :key="item.index">
          <score-case :data="item" @update="updateSystemScore"></score-case>
        </div>
        <br>
        <row>
          <i-col span="3" offset="1">
            <div style="margin-top: 7px; text-align: right;"><label style="color: black">备注：</label></div>
          </i-col>
          <i-col span="4" style="margin-left: 15px">
            <div>
              <Input v-model="note" type="textarea" :autosize="{minRows: 2,maxRows: 4}" placeholder="请输入..." style="width: 360px"></Input>
            </div>
          </i-col>
        </row>
        <br>
        <div class="border-bt editor-wrap">
        </div>
        <br>
        <row>
          <div style="margin-left: 220px">
            <Button type="success" style="" @click="selectPreCase">上一题</Button>
            <Button type="primary" style="margin-left: 8px">Submit</Button>
            <Button type="success" style="margin-left: 8px" @click="selectNextCase">下一题</Button>
          </div>
        </row>
        <!--<Select v-model="demo" style="width:200px">-->
          <!--<Option v-for="(item, key) in caseObj"  :key="key" :value="JSON.stringify(item)">{{ item }}</Option>-->
        <!--</Select>-->

      </Card>
    </Modal>

    <!-- 报告图表话框 -->
    <Modal
      :mask-closable="false"
      width="700"
      title="评测报告"
      okText="确定"
      v-model="reportModal"
      :styles="{top: '20px'}">
      <row>
        <mosreport></mosreport>
      </row>
      <br>
      <br>
      <!--<div class="border-bt editor-wrap">-->
      <!--</div>-->
      <row>
        <mos-total-report></mos-total-report>
      </row>
    </Modal>
  </div>
</template>

<script>
  import $ from 'jquery'
  import scoreCase from './scoreCase'
  import mosreport from './mosreport'
  import mosTotalReport from './mosTotalReport'
  import Row from 'iview/src/components/grid/row'

  export default {
    components: {
      Row,
      mosTotalReport,
      scoreCase,
      mosreport
    },
    data () {
      return {
        reportModal: false,
        caseParam: {
          id: 0,
          task_id: 0,
          status: 0,
          index: 1,
          text: '',
          note: '',
          param: ''
        },
        caseIndex: 1,
        caseParamList: [
          {
            id: 3,
            task_id: 1,
            status: 0,
            index: 1,
            text: '今天有什么好看的电影',
            note: '',
            param: [
              {
                id: 1,
                naturalness: 4.5,
                soundQuality: 2,
                wholeFeel: 1,
                url: 'http://rokidweb.oss-cn-hangzhou.aliyuncs.com/skills/%E5%90%AC%E6%AD%8C%E7%8C%9C%E7%94%B5%E5%BD%B1/80%E5%B9%B4%E4%BB%A3/%E8%B0%AD%E5%92%8F%E9%BA%9F%20-%20%E7%A5%9E%E7%9A%84%E4%BC%A0%E8%AF%B4.mp3'
              },
              {
                id: 2,
                naturalness: 2,
                soundQuality: 3,
                wholeFeel: 4,
                url: window.myurl + '/mos/play' + '/A系统/1.mp3'
              }
            ]
          },
          {
            id: 4,
            task_id: 2,
            status: 0,
            index: 2,
            text: '打开影视剧竞猜',
            note: '',
            param: [
              {
                id: 1,
                naturalness: 3,
                soundQuality: 5,
                wholeFeel: 2,
                url: 'http://rokidweb.oss-cn-hangzhou.aliyuncs.com/skills/%E5%90%AC%E6%AD%8C%E7%8C%9C%E7%94%B5%E5%BD%B1/80%E5%B9%B4%E4%BB%A3/%E8%B0%AD%E5%92%8F%E9%BA%9F%20-%20%E7%A5%9E%E7%9A%84%E4%BC%A0%E8%AF%B4.mp3'
              },
              {
                id: 2,
                naturalness: 5,
                soundQuality: 3,
                wholeFeel: 4,
                url: 'http://rokidweb.oss-cn-hangzhou.aliyuncs.com/skills/%E5%90%AC%E6%AD%8C%E7%8C%9C%E7%94%B5%E5%BD%B1/80%E5%B9%B4%E4%BB%A3/%E8%B0%AD%E5%92%8F%E9%BA%9F%20-%20%E7%A5%9E%E7%9A%84%E4%BC%A0%E8%AF%B4.mp3'
              }
            ]
          }
        ],
        systemParamList: [],
        note: '',
        demo: '',
        caseObj: {
          text: {name: 'hi boy'},
          name: {name: 'hi boy'},
          age: {name: 'hi boy'}
        },
        caselist: [
          {
            url: 'http://rokidweb.oss-cn-hangzhou.aliyuncs.com/skills/%E5%90%AC%E6%AD%8C%E7%8C%9C%E7%94%B5%E5%BD%B1/80%E5%B9%B4%E4%BB%A3/%E5%B0%8F%E8%B5%8F%E5%93%A5%20-%20%E9%9C%8D%E5%85%83%E7%94%B2%2B%E9%99%88%E7%9C%9F%2B%E5%86%8D%E5%90%91%E8%99%8E%E5%B1%B1%E8%A1%8C.mp3',
            text: '第一题',
            index: 1,
            naturalness: 1,
            soundQuality: 1,
            wholeFeel: 1
          },
          {
            url: 'http://rokidweb.oss-cn-hangzhou.aliyuncs.com/skills/%E5%90%AC%E6%AD%8C%E7%8C%9C%E7%94%B5%E5%BD%B1/80%E5%B9%B4%E4%BB%A3/%E5%B0%8F%E8%B5%8F%E5%93%A5%20-%20%E9%9C%8D%E5%85%83%E7%94%B2%2B%E9%99%88%E7%9C%9F%2B%E5%86%8D%E5%90%91%E8%99%8E%E5%B1%B1%E8%A1%8C.mp3',
            text: '第2题',
            index: 2,
            naturalness: 1,
            soundQuality: 1,
            wholeFeel: 1
          }
        ],
        data: {
          url: 'http://rokidweb.oss-cn-hangzhou.aliyuncs.com/skills/%E5%90%AC%E6%AD%8C%E7%8C%9C%E7%94%B5%E5%BD%B1/80%E5%B9%B4%E4%BB%A3/%E5%B0%8F%E8%B5%8F%E5%93%A5%20-%20%E9%9C%8D%E5%85%83%E7%94%B2%2B%E9%99%88%E7%9C%9F%2B%E5%86%8D%E5%90%91%E8%99%8E%E5%B1%B1%E8%A1%8C.mp3',
          text: '第一题',
          index: 1,
          naturalness: 1,
          soundQuality: 1,
          wholeFeel: 1
        },
        scoreModal: false,
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
        editModal: false,
        mosTaskTable: [
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: 'author',
            key: 'author',
            align: 'center'
          },
          {
            title: '性别',
            key: 'gender',
            align: 'center'
          },
          {
            title: '状态',
            key: 'status',
            align: 'center'
          },
          {
            title: '创建时间',
            key: 'createTime',
            align: 'center'
          },
          {
            title: '更新时间',
            key: 'updateTime',
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
                      // this.mosTaskParam = Object.assign({}, this.editMosTaskParam, this.mosTaskData[params.index])
                      // this.editModal = true
                      this.reportModal = true
                    }
                  }
                }, '报告'),
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
                      this.scoreModal = true
                      // console.log('**** ', JSON.parse(JSON.stringify(this.caselist)))
                      // console.log(this.formItem.checkbox)
                      // this.editCase(params.index)
                    }
                  }
                }, '评测'),
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
        mosTaskData: [{
          id: '1',
          author: 'msw',
          gender: '男',
          status: '未完成',
          score: '12',
          createTime: '2017-12-30 10:22:33',
          updateTime: '2017-12-30 20:14:03'
        }],
        mosTaskParam: {
          id: '',
          author: '',
          gender: '',
          status: '',
          score: '',
          createTime: '',
          updateTime: ''
        },
        editMosTaskParam: {
          id: '',
          author: '',
          gender: '',
          status: '',
          score: '',
          createTime: '',
          updateTime: ''
        },
        testSystemTitles: ['源系统', '目标测试系统'],
        formItem: {
          input: '',
          select: '',
          radio: 'male',
          checkbox: [],
          switch: true,
          textarea: ''
        },
        selectModuleList: [],
        systemDataList: [],
        targetKeys: [],
        listStyle: {
          width: '250px',
          height: '200px'
        }
      }
    },
    created () {
      this.getAllSystem()
    },
    methods: {
      updateSystemScore (childdata) {
        console.log('childdata: ', childdata)
        for (let i = 0; i < this.caseParamList[this.caseIndex - 1].param.length; i++) {
          if (this.caseParamList[this.caseIndex - 1].param[i].id === childdata.id) {
            this.caseParamList[this.caseIndex - 1].param[i] = childdata
            console.log('进来啦: ')
          }
        }
      },
      selectNextCase () {
        if (this.caseParamList.length === 0) {
          this.$Message.info('当前评测任务没有考题')
          return
        }
        if ((this.caseIndex + 1) > this.caseParamList.length) {
          this.$Message.info('已经是最后一题了')
          return
        }
        this.caseIndex = this.caseIndex + 1
        this.$Message.info('第' + this.caseIndex + '题')
      },
      selectPreCase () {
        if (this.caseParamList.length === 0) {
          this.$Message.info('当前评测任务没有考题')
          return
        }
        if ((this.caseIndex - 1) <= 0) {
          this.$Message.info('已经是第一道题了')
          return
        }
        this.caseIndex = this.caseIndex - 1
        this.$Message.info('第' + this.caseIndex + '题')
      },
      getPageIndex (pageIndex) {
        this.pageHelp.curPage = pageIndex
        // this.getAllSystem()
      },
      getPageSize (pageSize) {
        this.pageHelp.pageSize = pageSize
      },
      getAllSystem () {
        let url = window.myurl + '/mos/getAllSystem'
        $.ajax({
          type: 'GET',
          async: false,
          url: url,
          dataType: 'json',
          success: (result) => {
            this.selectModuleList = result.data.list
            this.pageHelp.totalNum = result.data.total
            for (let i = 0; i < this.selectModuleList.length; i++) {
              this.systemDataList.push({
                key: this.selectModuleList[i].id,
                label: this.selectModuleList[i].name
              })
            }
          },
          error: (errorMsg) => {
            console.log(errorMsg)
          }
        })
      },
      getMockData () {
        for (let i = 0; i < this.selectModuleList.length; i++) {
          this.systemDataList.push({
            key: this.selectModuleList[i].id,
            label: this.selectModuleList[i].name
          })
        }
      },
      handleChange3 (newTargetKeys) {
        this.targetKeys = newTargetKeys
      },
      render3 (item) {
        return item.label
      },
      reloadMockData () {
        this.systemDataList.splice(0, this.systemDataList.length)
        this.targetKeys = []
        this.getMockData()
      }
    }
  }
</script>

<style>
</style>
