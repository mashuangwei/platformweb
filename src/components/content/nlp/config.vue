<template>
  <div>
    <Row style="font-size: 12px; color: #495060;">
      <i-col span="2">
        <Button type="primary" @click="addNlpConfig" style="margin-bottom:15px;">新增</Button>
      </i-col>
      <i-col span="2" offset="3">
        <div style="margin-top: 7px">
          <label style="color: black; text-align: right;">DomainName</label>
        </div>
      </i-col>

      <i-col span="4" offset="1">
        <div>
          <Select v-model="domainName" @on-change="selectDomainName">
            <Option v-for="(item, idx) in domainNameList" :value="item" :key="idx">{{item}}</Option>
          </Select>
        </div>
      </i-col>

      <i-col span="2" offset="0">
        <div style="margin-top: 7px; text-align: right;"><label style="color: black">ProjectId</label></div>
      </i-col>
      <i-col span="4" offset="1">
        <div>
          <Select v-model="projectIdSelected" @on-change="selectProjectId">
            <Option v-for="(item, idx) in projectIdList" :value="item.id" :key="idx">{{item.projectName}}</Option>
          </Select>
        </div>
      </i-col>
      <!--<i-col span="3" offset="10">-->
      <!--<Input v-model="searchStr" icon="ios-search-strong" placeholder="请输入..."-->
      <!--style="width: 200px"></Input>-->
      <!--</i-col>-->
      <i-col span="2" offset="1">
        <Button type="primary" icon="ios-search" @click="searchCase">搜索</Button>
      </i-col>
    </Row>

    <row>
      <Table :loading="loading" :columns="casetable" :data="casedata"  :border="showBorder"
             :stripe="showStripe"
             :show-header="showHeader" :showIndex="true"></Table>
    </row>
    <br>
    <!-- 分页 -->
    <!--<row>-->
      <!--<i-col span="14" offset="9" style="margin-top: 20px">-->
        <!--<Page :total="pageHelp.totalNum" :current="pageHelp.curPage" :page-size="pageHelp.pageSize"-->
              <!--@on-change="getPageIndex" @on-page-size-change="getPageSize"-->
              <!--:page-size-opts="pageSizeOptions" size="small" show-elevator show-sizer show-total-->
              <!--placement="top"></Page>-->
      <!--</i-col>-->
    <!--</row>-->

    <!-- 添加case话框 -->
    <Modal
      :mask-closable="false"
      width="600"
      title="添加"
      ok-text="添加"
      @on-ok="addCase"
      v-model="addModal"
      :styles="{top: '20px'}">
      <Form :model="addCasePara" :label-width="80">
        <FormItem label="key">
          <Input v-model="addCasePara.name" type="text"
                 placeholder="请输入key" style="width: 300px;margin-left: 20px"></Input>
        </FormItem>

        <FormItem label="value">
          <Input v-model="addCasePara.value" type="text"
                 placeholder="请输入value" style="width: 300px;margin-left: 20px"></Input>
        </FormItem>

        <FormItem label="描述">
          <Input v-model="addCasePara.description" type="text"
                 placeholder="请输入描述" style="width: 300px;;margin-left: 20px"></Input>
        </FormItem>

        <FormItem label="domainName">
          <div>
            <Select v-model="domainName" @on-change="selectDomainName" style="width: 300px;margin-left: 20px">
              <Option v-for="(item, idx) in domainNameList" :value="item" :key="idx">{{item}}</Option>
            </Select>
          </div>
        </FormItem>

        <FormItem label="projectId">
          <div>
            <Select v-model="projectIdSelected" @on-change="selectProjectId" style="width: 300px;margin-left: 20px">
              <Option v-for="(item, idx) in projectIdList" :value="item.id" :key="idx">{{item.projectName}}</Option>
            </Select>
          </div>
        </FormItem>


      </Form>
    </Modal>

    <!-- 编辑case话框 -->
    <Modal
      :mask-closable="false"
      width="600"
      title="编辑"
      ok-text="保存"
      @on-ok="editCase"
      v-model="editModal"
      :styles="{top: '20px'}">
      <Form :model="editCasePara" :label-width="80">
        <FormItem label="key">
          <Input v-model="editCasePara.name" type="text"
                 placeholder="请输入key" style="width: 300px;margin-left: 20px"></Input>
        </FormItem>

        <FormItem label="value">
          <Input v-model="editCasePara.value" type="text"
                 placeholder="请输入value" style="width: 300px;margin-left: 20px"></Input>
        </FormItem>

        <FormItem label="描述">
          <Input v-model="editCasePara.description" type="text"
                 placeholder="请输入描述" style="width: 300px;margin-left: 20px"></Input>
        </FormItem>
        <FormItem label="domainName">
          <div>
            <Select v-model="domainName" @on-change="selectDomainName" style="width: 300px;margin-left: 20px">
              <Option v-for="(item, idx) in domainNameList" :value="item" :key="idx">{{item}}</Option>
            </Select>
          </div>
        </FormItem>

        <FormItem label="projectId">
          <div>
            <Select v-model="projectIdSelected" @on-change="selectProjectId" style="width: 300px;margin-left: 20px">
              <Option v-for="(item, idx) in projectIdList" :value="item.id" :key="idx">{{item.projectName}}</Option>
            </Select>
          </div>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
  import { Col, Row } from 'iview'
  import $ from 'jquery'

  export default {
    components: {
      Row,
      'i-col': Col
    },
    data () {
      return {
        projectIdList: [],
        projectIdSelected: '',
        domainName: '',
        domainNameList: [],
        addModal: false,
        editModal: false,
        pageSizeOptions: [10, 20, 30, 50, 100],
        pageHelp: {
          totalNum: 0,
          curPage: 1,
          pageSize: 10
        },
        loading: false,
        showHeader: true,
        showBorder: true,
        searchStr: {
          moduleName: '',
          projectId: 0
        },
        showStripe: true,
        addCasePara: {
          moduleName: '',
          projectId: 0,
          name: '',
          value: '',
          description: '',
          author: '',
          type: 0
        },
        editCasePara: {
          id: 0,
          moduleName: '',
          projectId: 0,
          name: '',
          value: '',
          description: '',
          author: '',
          type: 0
        },
        casetable: [
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: 'name',
            key: 'name',
            align: 'center'
          },
          {
            title: 'value',
            key: 'value',
            align: 'center'
          },
          {
            title: '描述',
            key: 'description',
            align: 'center'
          },
          {
            title: '操作',
            key: 'action',
            width: 220,
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
                      this.editModal = true
                      this.editCasePara = this.casedata[params.index]
                      this.domainName = this.editCasePara.moduleName
                      this.projectIdSelected = this.editCasePara.projectId
                      // this.editCase(params.index)
                      // this.$set(this.editCasePara, this.casedata[params.index])
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
                      this.removeCase(params.index)
                    }
                  }
                }, '删除')
              ])
            }
          }
        ],
        casedata: []
      }
    },
    mounted () {
      this.getDomainNameList()
    },
    methods: {
      selectDomainName (domain) {
        this.domainName = domain
        fetch(window.serverurl + '/project/projectList?moduleName=' + domain, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }).then((res) => {
          res.json().then((json) => {
            this.projectIdList = []
            this.projectIdSelected = ''
            this.$nextTick(() => {
              this.projectIdList = json.result.data
            })
          })
        }).catch((e) => {
          e.toString()
        })
      },
      searchCase () {
        this.loading = true
        let url = window.serverurl + '/config/showConfigs'
        this.searchStr.moduleName = this.domainName
        this.searchStr.projectId = this.projectIdSelected
        $.ajax({
          type: 'POST',
          async: true,
          url: url,
          contentType: 'application/json',
          data: JSON.stringify(this.searchStr),
          dataType: 'json',
          success: (result) => {
            this.loading = false
            this.casedata = result.result.data
          },
          error: (errorMsg) => {
            this.loading = false
            this.$Message.error(errorMsg)
            console.log(errorMsg)
          }
        })
      },
      selectProjectId (projectId) {
        this.projectIdSelected = projectId
      },
      getDomainNameList () {
        fetch(window.serverurl + '/project/moduleList', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }).then((res) => {
          res.json().then((json) => {
            this.domainNameList = json.result.data
          })
        }).catch((e) => {
          e.toString()
        })
      },
      addNlpConfig () {
        this.addModal = true
      },
      addCase () {
        this.addCasePara.moduleName = this.domainName
        this.addCasePara.projectId = this.projectIdSelected
        let url = window.serverurl + '/config/addConfig'
        $.ajax({
          type: 'POST',
          async: true,
          url: url,
          contentType: 'application/json',
          data: JSON.stringify(this.addCasePara),
          dataType: 'json',
          success: (result) => {
            this.$Message.success('添加成功')
            this.addCasePara = {
              moduleName: '',
              projectId: 0,
              name: '',
              value: '',
              description: '',
              author: '',
              type: 0
            }
            this.searchCase()
          },
          error: (errorMsg) => {
            this.$Message.error('添加失败')
            console.log(errorMsg)
          }
        })
      },
      editCase () {
        let url = window.serverurl + '/config/updateConfig'
        this.editCasePara.projectId = this.projectIdSelected
        this.editCasePara.moduleName = this.domainName
        $.ajax({
          type: 'POST',
          async: true,
          url: url,
          contentType: 'application/json',
          data: JSON.stringify(this.editCasePara),
          dataType: 'json',
          success: (result) => {
            this.$Message.success('修改成功')
            this.editCasePara = {
              id: 0,
              moduleName: '',
              projectId: 0,
              name: '',
              value: '',
              description: '',
              author: '',
              type: 0
            }
            this.searchCase()
          },
          error: (errorMsg) => {
            this.$Message.error(errorMsg)
            console.log(errorMsg)
          }
        })
      },
      removeCase (index) {
        let url = window.serverurl + '/config/delConfig'
        let delPara = {
          id: this.casedata[index].id
        }
        $.ajax({
          type: 'POST',
          async: true,
          url: url,
          contentType: 'application/json',
          data: JSON.stringify(delPara),
          dataType: 'json',
          success: (result) => {
            this.$Message.success('删除成功')
            this.casedata.splice(index, 1)
            // this.searchCase()
          },
          error: (errorMsg) => {
            this.$Message.error(errorMsg)
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
    },
    name: 'config'
  }
</script>

<style scoped>

</style>
