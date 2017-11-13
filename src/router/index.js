import Vue from 'vue'
import Router from 'vue-router'
import api from '@/components/content/api.vue'
import test from '@/components/content/test.vue'
import report from '@/components/content/report.vue'
import environment from '@/components/content/environment.vue'
import nlp from '@/components/content/nlp.vue'
import highcharts from '@/components/content/highcharts.vue'
import asr from '@/components/content/asr.vue'
import tts from '@/components/content/tts.vue'
import skill from '@/components/content/skill.vue'
import speech from '@/components/content/speech.vue'
import task from '@/components/content/task.vue'
import chartdemo from '@/components/content/chartdemo.vue'
import monitor from '@/components/content/monitor.vue'

Vue.use(Router)

export default new Router({
  linkActiveClass: 'active',
  routes: [
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
    },
    {
      path: '/asr',
      name: 'asr',
      component: asr
    },
    {
      path: '/tts',
      name: 'tts',
      component: tts
    },
    {
      path: '/skill',
      name: 'skill',
      component: skill
    },
    {
      path: '/speech',
      name: 'speech',
      component: speech
    },
    {
      path: '/task',
      name: 'task',
      component: task
    },
    {
      path: '/chartdemo',
      name: 'chartdemo',
      component: chartdemo
    },
    {
      path: '/monitor',
      name: 'monitor',
      component: monitor
    }
  ]
})
