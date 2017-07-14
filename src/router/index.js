import Vue from 'vue'
import Router from 'vue-router'
// import index from '@/components/index'
import api from '@/components/content/content.vue'
import test from '@/components/content/test.vue'

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
    }
  ]
})
