<style lang="less" rel="stylesheet/less">
  a {
    color: #515767;
  }
  .active {
    color: #2d8cf0;
  }
  .ivu-menu-vertical .ivu-menu-item {
    padding: 0;
  }
  .ivu-menu li.ivu-menu-item a {
    display: block;
    padding: 14px 24px;
  }
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
    height: 710px;
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
</style>
<template>
  <div class="layout">
    <Menu mode="horizontal" theme="primary" active-name="1">
      <div class="layout-nav">
        <Menu-item name="11">
          <Icon type="ios-navigate"></Icon>
          首页
        </Menu-item>
        <Menu-item name="12">
          <Icon type="ios-keypad"></Icon>
          Rokid
        </Menu-item>
        <Menu-item name="13">
          <Icon type="ios-analytics"></Icon>
          系统
        </Menu-item>
        <Menu-item name="14">
          <Icon type="ios-paper"></Icon>
          维护
        </Menu-item>
      </div>
    </Menu>

    <div class="layout-content" height="760px">
      <Row>
        <i-col span="4">
          <Menu :active-name="activeMenu[$route.path]" theme="light" width="auto">
            <Menu-item name="1">
              <router-link to="/api">
                <Icon type="chatbubbles"></Icon>
                接口测试
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
                性能测试
              </router-link>
            </Menu-item>
            <Menu-item name="4">
              <router-link to="/report">
              <Icon type="chatbubbles"></Icon>
              测试报告
              </router-link>
            </Menu-item>
            <Menu-item name="5">
              <router-link to="/environment">
              <Icon type="stats-bars"></Icon>
              环境配置
            </router-link>
            </Menu-item>
            <Menu-item name="6">
              <router-link to="/nlp">
                <Icon type="star"></Icon>
                NLP
              </router-link>
            </Menu-item>

            <Menu-item name="7">
              <router-link to="/highcharts">
                <Icon type="gear-b"></Icon>
                Highcharts
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
  import ICol from 'iview/src/components/grid/col'
  import Row from 'iview/src/components/grid/row'
  import editor from 'vue2-ace-editor-new'
  //  import content from './content/content.vue'
  export default {
    components: {
      Row,
      ICol,
      editor
//      ,
//      'v-content': content
    },
    name: 'index',
    data () {
      return {
        activeMenu: {
          '/api': '1',
          '/test': '2',
          '/asr': '3',
          '/report': '4',
          '/environment': '5',
          '/nlp': '6',
          '/highcharts': '7'
        }
      }
    }
  }
</script>

