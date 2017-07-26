import Vue from 'vue'
import Router from 'vue-router'
// import index from '@/components/index'
import api from '@/components/content/content.vue'
import test from '@/components/content/test.vue'
import asr from '@/components/content/asr.vue'
import report from '@/components/content/report.vue'
import environment from '@/components/content/environment.vue'
import nlp from '@/components/content/nlp.vue'
import highcharts from '@/components/content/highcharts.vue'

Vue.use(Router)

export default new Router({
  linkActiveClass: 'active',
  routes: [
    // {
    //   path: '/',
    //   name: 'index',
    //   component: index
    // },
    {
      path: '/api',
      name: 'api',
      alias: '/',
      component: api
    },
    {
      path: '/test',
      name: 'test',
      component: test
    },
    {
      path: '/asr',
      name: 'asr',
      component: asr
    },
    {
      path: '/report',
      name: 'report',
      component: report
    },
    {
      path: '/environment',
      name: 'environment',
      component: environment
    },
    {
      path: '/nlp',
      name: 'nlp',
      component: nlp
    },
    {
      path: '/highcharts',
      name: 'highcharts',
      component: highcharts
    }
  ]
})
