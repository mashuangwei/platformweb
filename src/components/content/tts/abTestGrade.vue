<template>
  <div>
    <row style="margin-top: -5px">
      <Card>
        <p slot="title">
          <Icon type="ios-plus-outline"></Icon>
          评测试卷创建
        </p>
        <Form :model="formItem" :label-width="80">
          <FormItem label="姓名">
            <Input v-model="mosTaskParam.author" placeholder="输入评测人姓名" style="width: 200px"></Input>
          </FormItem>
          <FormItem label="性别">
            <RadioGroup v-model="mosTaskParam.gender">
              <Radio label="男">男</Radio>
              <Radio label="女">女</Radio>
            </RadioGroup>
          </FormItem>

          <FormItem label="试卷">
            <Select v-model="mosTaskParam.templateId" style="width: 200px" @on-change="templateIdChange">
              <Option v-for="item in templateList" :value="item.id" :key="item.name">{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="addMosTask" :loading="addMoskLoading">Submit</Button>
            <Button type="ghost" style="margin-left: 8px" @click="resetParams">Reset</Button>
          </FormItem>
        </Form>
      </Card>
    </row>
    <row style="margin-top: 5px">
      <Card>
        <p slot="title">
          <Icon type="ios-list"></Icon>
          评测试卷列表
        </p>
        <Table :loading="loading" :columns="mosTaskTable" :data="mosTaskData" :border="showBorder" no-data-text="没有数据"
               :stripe="showStripe" style="margin-top: -7px;margin-left: -7px" height="410"
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
      @on-ok="okScoreButton"
      @on-cancel="cancleScoreButton"
      :mask-closable="false"
      width="800"
      title="评分"
      okText="确定"
      v-model="scoreModal"
      :styles="{top: '20px'}">
      <Card v-if="scoreModal">
        <p slot="title">
          <Icon type="ios-keypad"></Icon>
          第{{this.caseIndex}}题 &nbsp;&nbsp;&nbsp;&nbsp;  语音文本：{{this.caseParamList[this.caseIndex - 1].text}}     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;答题状态：{{this.caseParamList[this.caseIndex - 1].status ===1? '已答': '未答'}}
        </p>

        <!--<div v-for="item in caselist" :key="item.index">-->
          <!--<ab-test-case :data="item" @update="updateSystemScore"></ab-test-case>-->
        <!--</div>-->
        <br>
        <row>
          <i-col span="3" offset="1">
            <div style="margin-top: 7px; text-align: right; "><label style="color: black">A系统：</label></div>
          </i-col>
          <i-col span="4" style="margin-left: 15px;width: 250px">
            <audio :src="'http://test-57:8000/audio/' + caselist[0].url" controls="controls" >
            </audio>
          </i-col>
        </row>
        <br>
        <row>
          <i-col span="3" offset="1">
            <div style="margin-top: 7px; text-align: right; "><label style="color: black">B系统：</label></div>
          </i-col>
          <i-col span="4" style="margin-left: 15px;width: 250px">
            <audio :src="'http://test-57:8000/audio/' + caselist[1].url" controls="controls" >
            </audio>
          </i-col>
        </row>
        <br>
        <row v-if="abDim.naturalness !== undefined">
          <i-col span="3" offset="1">
            <div style="margin-top: 7px; text-align: right;"><label style="color: black">自然度：</label></div>
          </i-col>
          <i-col span="11" style="margin-left: 15px">
            <div>
              <RadioGroup v-model="abNaturalnessScore" @on-change="changeNaturalness">
                <Radio label="A好">
                  <!--<Icon type="social-dropbox"></Icon>-->
                  <span>A好</span>
                </Radio>
                <Radio label="一样好">
                  <!--<Icon type="ios-body-outline"></Icon>-->
                  <span>一样好</span>
                </Radio>
                <Radio label="B好">
                  <!--<Icon type="social-dropbox-outline"></Icon>-->
                  <span>B好</span>
                </Radio>
              </RadioGroup>
            </div>
          </i-col>
        </row>
        <br>

        <row v-if="abDim.soundQuality !== undefined">
          <i-col span="3" offset="1">
            <div style="margin-top: 7px; text-align: right;"><label style="color: black">音质：</label></div>
          </i-col>
          <i-col span="11" style="margin-left: 15px">
            <div>
              <RadioGroup v-model="abSoundQualityScore" @on-change="changeSoundQuality">
                <Radio label="A好">
                  <!--<Icon type="social-dropbox"></Icon>-->
                  <span>A好</span>
                </Radio>
                <Radio label="一样好">
                  <!--<Icon type="ios-body-outline"></Icon>-->
                  <span>一样好</span>
                </Radio>
                <Radio label="B好">
                  <!--<Icon type="social-dropbox-outline"></Icon>-->
                  <span>B好</span>
                </Radio>
              </RadioGroup>
            </div>

          </i-col>
        </row>
        <br>

        <row v-if="abDim.wholeFeel !== undefined">
          <i-col span="3" offset="1">
            <div style="margin-top: 7px; text-align: right;"><label style="color: black">总体感觉：</label></div>
          </i-col>
          <i-col span="11" style="margin-left: 15px">
            <div>
              <RadioGroup v-model="abWholeFeelScore" @on-change="changeWholeFeel">
                <Radio label="A好">
                  <!--<Icon type="social-dropbox"></Icon>-->
                  <span>A好</span>
                </Radio>
                <Radio label="一样好">
                  <!--<Icon type="ios-body-outline"></Icon>-->
                  <span>一样好</span>
                </Radio>
                <Radio label="B好">
                  <!--<Icon type="social-dropbox-outline"></Icon>-->
                  <span>B好</span>
                </Radio>
              </RadioGroup>
            </div>
          </i-col>
        </row>
        <br>
        <div class="border-bt editor-wrap">
        </div>
        <br>

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
            <Button type="primary" style="margin-left: 8px" @click="submitCaseScore" :loading="submitScoreLoading">Submit</Button>
            <Button type="success" style="margin-left: 8px" @click="selectNextCase">下一题</Button>
          </div>
        </row>
        <!--<Select v-model="demo" style="width:200px">-->
          <!--<Option v-for="(item, key) in caseObj"  :key="key" :value="JSON.stringify(item)">{{ item }}</Option>-->
        <!--</Select>-->

      </Card>
    </Modal>

    <!-- 报告图表话框 -->
    <!--<Modal-->
      <!--:mask-closable="false"-->
      <!--width="700"-->
      <!--title="评测报告"-->
      <!--okText="确定"-->
      <!--v-model="reportModal"-->
      <!--:styles="{top: '20px'}">-->
      <!--<row>-->
        <!--<mosreport :data="reportData"></mosreport>-->
      <!--</row>-->
      <!--<br>-->
      <!--<br>-->
      <!--&lt;!&ndash;<div class="border-bt editor-wrap">&ndash;&gt;-->
      <!--&lt;!&ndash;</div>&ndash;&gt;-->
      <!--&lt;!&ndash;<row>&ndash;&gt;-->
        <!--&lt;!&ndash;<mos-total-report></mos-total-report>&ndash;&gt;-->
      <!--&lt;!&ndash;</row>&ndash;&gt;-->
    <!--</Modal>-->
  </div>
</template>

<script>
  import $ from 'jquery'
  import abTestCase from './abTestCase'
  import mosreport from './mosreport'
  import mosTotalReport from './mosTotalReport'
  import Row from 'iview/src/components/grid/row'

  export default {
    components: {
      Row,
      mosTotalReport,
      abTestCase,
      mosreport
    },
    data () {
      return {
        abDim: {
          naturalness: 0,
          soundQuality: 0,
          wholeFeel: 0
        },
        abNaturalnessScore: '一样好',
        abSoundQualityScore: '一样好',
        abWholeFeelScore: '一样好',
        reportData: null,
        submitScoreLoading: false,
        addMoskLoading: false,
        templateId: 0,
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
        caseParamList: [],
        systemParamList: [],
        note: '',
        demo: '',
        caseObj: {
          text: {name: 'hi boy'},
          name: {name: 'hi boy'},
          age: {name: 'hi boy'}
        },
        caselist: typeof this.caseParamList === 'undefined' ? [] : this.caseParamList[this.caseIndex - 1].param,
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
        taskIndex: 0,
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
            align: 'center',
            render: (h, params) => {
              const row = params.row
              const color = row.status === 0 ? 'blue' : 'green'
              const text = row.status === 0 ? '未完成' : '已完成'
              return h('Tag', {
                props: {
                  type: 'dot',
                  color: color
                }
              }, text)
            }
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
                // h('Button', {
                //   props: {
                //     type: 'primary',
                //     size: 'small'
                //   },
                //   style: {
                //     marginRight: '7px'
                //   },
                //   on: {
                //     click: () => {
                //       // this.mosTaskParam = Object.assign({}, this.editMosTaskParam, this.mosTaskData[params.index])
                //       // this.editModal = true
                //       this.reportModal = true
                //     }
                //   }
                // }, '报告'),
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
                      this.taskIndex = params.index
                      this.getAllCaseList(params.index)
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
                      this.removeTask(params.index)
                    }
                  }
                }, '删除')
              ])
            }
          }
        ],
        mosTaskData: [],
        mosTaskParam: {
          id: '',
          templateId: 0,
          sysType: 1,
          author: '',
          gender: '男',
          status: '',
          score: '',
          createTime: '',
          updateTime: ''
        },
        editMosTaskParam: {
          id: '',
          templateId: 0,
          sysType: 1,
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
        },
        templateList: []
      }
    },
    created () {
      this.getAllMosTask()
      this.getAllMosTemplate()
    },
    methods: {
      resetParams () {
        this.mosTaskParam.author = ''
      },
      changeWholeFeel () {
        switch (this.abWholeFeelScore) {
          case 'A好': {
            this.caselist[0].wholeFeel = 2
            this.caselist[1].wholeFeel = 0
            break
          }
          case '一样好': {
            this.caselist[0].wholeFeel = 1
            this.caselist[1].wholeFeel = 1
            break
          }
          case 'B好': {
            this.caselist[0].wholeFeel = 0
            this.caselist[1].wholeFeel = 2
            break
          }
        }
        this.caseParamList[this.caseIndex - 1].param = this.caselist
      },
      changeSoundQuality () {
        switch (this.abSoundQualityScore) {
          case 'A好': {
            this.caselist[0].soundQuality = 2
            this.caselist[1].soundQuality = 0
            break
          }
          case '一样好': {
            this.caselist[0].soundQuality = 1
            this.caselist[1].soundQuality = 1
            break
          }
          case 'B好': {
            this.caselist[0].soundQuality = 0
            this.caselist[1].soundQuality = 2
            break
          }
        }
        this.caseParamList[this.caseIndex - 1].param = this.caselist
      },
      changeNaturalness () {
        switch (this.abNaturalnessScore) {
          case 'A好': {
            this.caselist[0].naturalness = 2
            this.caselist[1].naturalness = 0
            break
          }
          case '一样好': {
            this.caselist[0].naturalness = 1
            this.caselist[1].naturalness = 1
            break
          }
          case 'B好': {
            this.caselist[0].naturalness = 0
            this.caselist[1].naturalness = 2
            break
          }
        }
        this.caseParamList[this.caseIndex - 1].param = this.caselist
      },
      submitCaseScore () {
        this.submitScoreLoading = true
        this.caseParamList[this.caseIndex - 1].status = 1
        let url = window.myurl + '/mos/updateMosCaseScore'
        $.ajax({
          type: 'PUT',
          async: true,
          url: url,
          contentType: 'application/json',
          data: JSON.stringify(this.caseParamList[this.caseIndex - 1]),
          dataType: 'json',
          success: (result) => {
            let notFinshedNum = 0
            for (let i = 0; i < this.caseParamList.length; i++) {
              if (this.caseParamList[i].status === 0) {
                notFinshedNum = notFinshedNum + 1
              }
            }
            if (notFinshedNum === 0) {
              this.submitTaskReport(this.caseParamList[this.caseIndex - 1].taskId)
            } else {
              if (result.code === 1015) {
                this.$Message.error(result.message)
              } else {
                this.$Message.success('提交成功')
              }
              this.submitScoreLoading = false
            }
          },
          error: (errorMsg) => {
            console.log(errorMsg)
            this.$Message.error(errorMsg.responseJSON.message)
            this.caseParamList[this.caseIndex - 1].status = 0
            this.submitScoreLoading = false
          }
        })
      },
      submitTaskReport (taskId) {
        let url = window.myurl + '/mos/updateTaskScore/' + taskId
        $.ajax({
          type: 'PUT',
          async: true,
          url: url,
          contentType: 'application/json',
          dataType: 'json',
          success: (result) => {
            if (result.code === 400) {
              this.$Message.info('该试卷已作答完毕，不能再次提交')
            } else {
              this.mosTaskData[this.taskIndex].status = 1
              this.$Message.success('所有的题都已提交成功')
            }
            this.submitScoreLoading = false
          },
          error: (errorMsg) => {
            this.$Message.error('提交失败')
            this.submitScoreLoading = false
            console.log(errorMsg)
          }
        })
      },
      getAllCaseList (index) {
        let url = window.myurl + '/mos/getAllCase/' + this.mosTaskData[index].id
        $.ajax({
          type: 'GET',
          async: true,
          url: url,
          dataType: 'json',
          success: (result) => {
            if (result.data.length > 0) {
              this.caseParamList = result.data
              this.$nextTick(() => {
                this.caselist = this.caseParamList[this.caseIndex - 1].param
                this.$set(this.caselist, this.caseParamList[this.caseIndex - 1].param)
                if (this.caselist[0].naturalness === 2) {
                  this.abNaturalnessScore = 'A好'
                } else if (this.caselist[0].naturalness === 0 && this.caselist[1].naturalness === 2) {
                  this.abNaturalnessScore = 'B好'
                } else if (this.caselist[0].naturalness === this.caselist[1].naturalness) {
                  this.abNaturalnessScore = '一样好'
                }
                if (this.caselist[0].soundQuality === 2) {
                  this.abSoundQualityScore = 'A好'
                } else if (this.caselist[0].soundQuality === 0 && this.caselist[1].soundQuality === 2) {
                  this.abSoundQualityScore = 'B好'
                } else if (this.caselist[0].soundQuality === this.caselist[1].soundQuality) {
                  this.abSoundQualityScore = '一样好'
                }
                if (this.caselist[0].wholeFeel === 2) {
                  this.abWholeFeelScore = 'A好'
                } else if (this.caselist[0].wholeFeel === 0 && this.caselist[1].wholeFeel === 2) {
                  this.abWholeFeelScore = 'B好'
                } else if (this.caselist[0].wholeFeel === this.caselist[1].wholeFeel) {
                  this.abWholeFeelScore = '一样好'
                }
                this.scoreModal = true
                // this.$Message.info('第' + this.caseIndex + '题')
              })
              return
            }
            this.$Message.info('当前考卷没有试题，请重新生成')
          },
          error: (errorMsg) => {
            console.log(errorMsg)
          }
        })
      },
      removeTask (index) {
        let url = window.myurl + '/mos/deleteTask/' + this.mosTaskData[index].id
        $.ajax({
          type: 'DELETE',
          async: true,
          url: url,
          dataType: 'json',
          success: (result) => {
            this.$Message.success('删除成功')
            this.getAllMosTask()
          },
          error: (errorMsg) => {
            this.$Message.error('删除失败')
            console.log(errorMsg)
          }
        })
      },
      addMosTask () {
        let url = window.myurl + '/mos/addMosTask'
        this.addMoskLoading = true
        $.ajax({
          type: 'POST',
          async: true,
          url: url,
          contentType: 'application/json',
          data: JSON.stringify(this.mosTaskParam),
          dataType: 'json',
          success: (result) => {
            if (result.code === 400) {
              this.addMoskLoading = false
              this.$Message.error(result.message)
              return
            }
            this.addMoskLoading = false
            this.$Message.success('添加成功')
            this.getAllMosTask()
          },
          error: (errorMsg) => {
            this.addMoskLoading = false
            this.$Message.error('添加失败')
            console.log(errorMsg)
          }
        })
      },
      templateIdChange (id) {
      },
      getAllMosTemplate () {
        let url = window.myurl + '/mos/getAllMosTemplate?pageSize=100'
        $.ajax({
          type: 'GET',
          async: true,
          url: url,
          dataType: 'json',
          success: (result) => {
            this.templateList = result.data.list
          },
          error: (errorMsg) => {
            console.log(errorMsg)
          }
        })
      },
      okScoreButton () {
        this.caseIndex = 1
      },
      cancleScoreButton () {
        this.caseIndex = 1
      },
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
        this.$nextTick(() => {
          this.caselist = this.caseParamList[this.caseIndex - 1].param
          this.$set(this.caselist, this.caseParamList[this.caseIndex - 1].param)
          this.$Message.info('第' + this.caseIndex + '题')

          if (this.caselist[0].naturalness === 2) {
            this.abNaturalnessScore = 'A好'
          } else if (this.caselist[0].naturalness === 0 && this.caselist[1].naturalness === 2) {
            this.abNaturalnessScore = 'B好'
          } else if (this.caselist[0].naturalness === this.caselist[1].naturalness) {
            this.abNaturalnessScore = '一样好'
          }
          if (this.caselist[0].soundQuality === 2) {
            this.abSoundQualityScore = 'A好'
          } else if (this.caselist[0].soundQuality === 0 && this.caselist[1].soundQuality === 2) {
            this.abSoundQualityScore = 'B好'
          } else if (this.caselist[0].soundQuality === this.caselist[1].soundQuality) {
            this.abSoundQualityScore = '一样好'
          }
          if (this.caselist[0].wholeFeel === 2) {
            this.abWholeFeelScore = 'A好'
          } else if (this.caselist[0].wholeFeel === 0 && this.caselist[1].wholeFeel === 2) {
            this.abWholeFeelScore = 'B好'
          } else if (this.caselist[0].wholeFeel === this.caselist[1].wholeFeel) {
            this.abWholeFeelScore = '一样好'
          }
        })
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
        this.$nextTick(() => {
          this.caselist = this.caseParamList[this.caseIndex - 1].param
          this.$set(this.caselist, this.caseParamList[this.caseIndex - 1].param)

          if (this.caselist[0].naturalness === 2) {
            this.abNaturalnessScore = 'A好'
          } else if (this.caselist[0].naturalness === 0 && this.caselist[1].naturalness === 2) {
            this.abNaturalnessScore = 'B好'
          } else if (this.caselist[0].naturalness === this.caselist[1].naturalness) {
            this.abNaturalnessScore = '一样好'
          }
          if (this.caselist[0].soundQuality === 2) {
            this.abSoundQualityScore = 'A好'
          } else if (this.caselist[0].soundQuality === 0 && this.caselist[1].soundQuality === 2) {
            this.abSoundQualityScore = 'B好'
          } else if (this.caselist[0].soundQuality === this.caselist[1].soundQuality) {
            this.abSoundQualityScore = '一样好'
          }
          if (this.caselist[0].wholeFeel === 2) {
            this.abWholeFeelScore = 'A好'
          } else if (this.caselist[0].wholeFeel === 0 && this.caselist[1].wholeFeel === 2) {
            this.abWholeFeelScore = 'B好'
          } else if (this.caselist[0].wholeFeel === this.caselist[1].wholeFeel) {
            this.abWholeFeelScore = '一样好'
          }
          this.$Message.info('第' + this.caseIndex + '题')
        })
        // this.$Message.info('第' + this.caseIndex + '题')
      },
      getPageIndex (pageIndex) {
        this.pageHelp.curPage = pageIndex
      },
      getPageSize (pageSize) {
        this.pageHelp.pageSize = pageSize
      },
      getAllMosTask () {
        let url = window.myurl + '/mos/getAllTask?sysType=1'
        $.ajax({
          type: 'GET',
          async: false,
          url: url,
          dataType: 'json',
          success: (result) => {
            this.mosTaskData = result.data.list
            this.pageHelp.totalNum = result.data.total
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
