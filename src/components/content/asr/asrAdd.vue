<style scoped>

</style>
<template>
  <Modal
    @on-ok="addAsr"
    @on-cancel="addAsrCancel"
    :mask-closable="false"
    :width="700"
    :title=title
    :okText=okText
    v-model="data.addmodal"
    :styles="{top: '20px'}">
    <row>
      <i-col span="3" offset="0">
        <div style="line-height: 32px;"><label>任务名称：</label></div>
      </i-col>
      <i-col span="3" offset="1">
        <div>
          <Input v-model="data.addData.taskname" placeholder="请输入..." style="width: 320px"></Input>
        </div>
      </i-col>
    </row>
    <br>
    <row>
      <i-col span="3" offset="0">
        <div style="line-height: 32px;"><label>domain：</label></div>
      </i-col>
      <i-col span="3" offset="1">
        <div>
          <Input v-model="data.addData.domain" placeholder="请输入..." style="width: 320px"></Input>
        </div>
      </i-col>
    </row>
    <br>
    <row>
      <i-col span="3" offset="0">
        <div style="line-height: 32px;"><label>people：</label></div>
      </i-col>
      <i-col span="3" offset="1">
        <div>
          <Select v-model="data.addData.people" style="width:160px" @on-change="selectPeopleModule">
            <Option v-for="(item, idx) in peopleModuleList" :value="item.id" :key="idx">{{item.value}}</Option>
          </Select>
        </div>
      </i-col>
    </row>
    <br/>
    <row>
      <i-col span="3" offset="0">
        <div style="line-height: 32px;"><label>日期时间：</label></div>
      </i-col>
      <i-col span="3" offset="1">
        <div>
          <DatePicker type="datetimerange" placeholder="请选择日期时间" style="width: 300px" @on-change="asrSelectDateChange"></DatePicker>
        </div>
      </i-col>
    </row>

    <div class="border-bt editor-wrap" v-show="false">
    </div>

  </Modal>

</template>
<script>
  import Breadcrumb from 'iview/src/components/breadcrumb/breadcrumb'

  export default {
    components: {Breadcrumb},
    props: {
      data: Object
    },
    data () {
      return {
        okText: '添加',
        title: '添加ASR测试任务',
        peopleModuleList: [
          {value: '未知', id: 0},
          {value: '成人男', id: 1},
          {value: '成人女', id: 2},
          {value: '男童', id: 3},
          {value: '女童', id: 4},
          {value: '所有', id: 5}
        ]
      }
    },
    mounted () {
    },
    created () {
      console.log('a=module: ' + this.data.addData.addmodal)
    },
    methods: {
      asrSelectDateChange (date) {
        this.data.addData.starttime = date[0]
        this.data.addData.endtime = date[1]
        console.log(date.toString())
      },
      selectPeopleModule () {
        console.log('peopleModule: ' + this.data.addData.people)
      },
      addAsr () {
        console.log('addAsr: ' + JSON.stringify(this.data.addData))
        this.$emit('update', JSON.stringify(this.data.addData))
      },
      addAsrCancel () {
        console.log('addAsrCancel')
      }
    }
  }
</script>
