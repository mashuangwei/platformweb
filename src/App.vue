<style lang="less" rel="stylesheet/less">
  a {
    color: #515767;
  }
  .active {
    color: #2d8cf0;
  }
  .pr {
    position: relative !important;
  }
  .ivu-menu-vertical .ivu-menu-item {
    padding: 0;
  }
  .ivu-menu li.ivu-menu-item a {
    display: block;
    padding: 14px 24px;
  }
  .ivu-menu li.ivu-menu-item a.db {
    padding: 0;
    display: inline-block;
    color: #fff;
  }
  .vertical-center-modal {
    display: flex;
    align-items: center;
    justify-content: center;
    .ivu-modal {
      top: 0;
    }
  }

  .ivu-form-inline .ivu-form-item {
    display: block;
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

  .layout {
    border: 1px solid #d7dde4;
    background: #f5f7f9;
  }

  .layout-logo {
    width: 100px;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
  }

  .layout-nav {
    width: 420px;
    margin: 0 auto;
  }

  .layout-assistant {
    width: 300px;
    margin: 0 auto;
    height: inherit;
  }

  .layout-breadcrumb {
    padding: 10px 15px 0;
  }

  .layout-content {
    height: 850px;
    min-height: 710px;
    padding: 1px;
    overflow: hidden;
    background: #fff;
    border-radius: 4px;
  }

  .layout-content-main {
    padding: 10px;
    font-family: "Helvetica Neue";
    font-size: 16px;
    color: #3399ff;
  }

  .layout-copy {
    text-align: center;
    padding: 10px 0 20px;
    color: #9ea7b4;
    text-align: left;
  }

  .username {
    position: absolute;
    right: 20px;
    line-height: 60px;
    color: #fff;
  }

  .layout {

    .layout-nav {
      margin: 0;
    }

    .ivu-row {
      height: 100%;
    }

    .ivu-col-span-4 {
      height: 100%;
    }

    .layout-content .ivu-menu {
      height: 100%;
    }

  }
  .ivu-col-span-20 {
    height: 100%;
  }
</style>
<template>
  <div class="layout">

    <Menu mode="horizontal" theme="primary" active-name="1">
      <div class="layout-nav">

        <Menu-item name="11">
          <Icon type="home"></Icon>
          首页
        </Menu-item>
        <Menu-item name="12">
          <Icon type="ios-keypad"></Icon>
          <a href="https://ngrinder.rokid-inc.com/login" class="db" target="_Blank">Ngrinder</a>
        </Menu-item>
        <Menu-item name="13">
          <Icon type="ios-analytics"></Icon>
          <a href="http://test-35:11000/jenkins/login?" class="db" target="_Blank">Jekins</a>
        </Menu-item>
        <Menu-item name="14">
          <Icon type="ios-paper"></Icon>
          <a href="https://sonar.rokid-inc.com" class="db" target="_Blank">Sonar</a>
        </Menu-item>

        <div v-if="isLogined" class="username">ab.xyz</div>
        <div v-else class="username">
          <Button type="primary" @click.stop.prevent="login">登录</Button>
        </div>

      </div>
    </Menu>


    <div class="layout-content" height="760px">
      <Row>
        <i-col span="4">
          <Menu :active-name="activeMenu[$route.path]" theme="light" width="auto">
            <Menu-item name="1">
              <router-link to="/api">
                <Icon type="chatbubbles"></Icon>
                Rest Api
              </router-link>
            </Menu-item>
            <Menu-item name="2">
              <router-link to="/test">
                <Icon type="heart"></Icon>
                用例管理
              </router-link>
            </Menu-item>
            <Menu-item name="3">
              <router-link to="/asr">
                <Icon type="android-globe"></Icon>
                Asr
              </router-link>
            </Menu-item>
            <Menu-item name="4">
              <router-link to="/speech">
              <Icon type="chatbubbles"></Icon>
              Speech
              </router-link>
            </Menu-item>
            <Menu-item name="5">
              <router-link to="/nlp">
              <Icon type="stats-bars"></Icon>
              NLP
            </router-link>
            </Menu-item>

            <Menu-item name="6">
              <router-link to="/tts">
                <Icon type="fireball"></Icon>
                TTS
              </router-link>
            </Menu-item>

            <Menu-item name="7">
              <router-link to="/skill">
                <Icon type="paper-airplane"></Icon>
                Skill模板
              </router-link>
            </Menu-item>

            <Menu-item name="8">
              <router-link to="/task">
                <Icon type="cube"></Icon>
                task
              </router-link>
            </Menu-item>

            <Menu-item name="9">
              <router-link to="/monitor">
                <Icon type="star"></Icon>
                监控
              </router-link>
            </Menu-item>

            <Menu-item name="10">
              <router-link to="/job">
                <Icon type="gear-b"></Icon>
                Job Manage
              </router-link>
            </Menu-item>

            <Menu-item name="11">
              <router-link to="/pressureTest/pressure">
                <Icon type="flag"></Icon>
                性能测试
              </router-link>
            </Menu-item>

            <Menu-item name="12">
              <router-link to="/chartdemo">
                <Icon type="scissors"></Icon>
                动态图表
              </router-link>
            </Menu-item>

            <Menu-item name="13">
              <router-link to="/highcharts">
                <Icon type="gear-b"></Icon>
                Highcharts
              </router-link>
            </Menu-item>

            <Menu-item name="14">
              <router-link to="/opboss">
                <Icon type="planet"></Icon>
                Opboss
              </router-link>
            </Menu-item>

          </Menu>
        </i-col>
        <i-col span="20">
          <div class="layout-content-main">
            <router-view></router-view>
          </div>
        </i-col>
      </Row>
    </div>

    <div class="layout-copy">
      <row>
        <i-col span="4" offset="10">
          2011-2017 &copy; Rokid
        </i-col>
      </row>
    </div>
  </div>
</template>
<script>
  import { Col, Row } from 'iview'
  import editor from 'vue2-ace-editor-new'

  export default {
    components: {
      Row,
      'i-col': Col,
      editor
    },
    name: 'index',
    data () {
      return {
        isLogined: false,
        activeMenu: {
          '/api': '1',
          '/test': '2',
          '/asr': '3',
          '/speech': '4',
          '/nlp': '5',
          '/tts': '6',
          '/skill': '7',
          '/task': '8',
          '/monitor': '9',
          '/job': '10',
          '/pressureTest/pressure': '11',
          '/chartdemo': '12',
          '/highcharts': '13',
          '/opboss': '14'
        }
      }
    },
    methods: {
      login () {
        this.$router.push('/login')
      }

    }
  }
</script>

