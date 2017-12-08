// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'iview/dist/styles/iview.css'
import '@/assets/base.js'
import Vue from 'vue'
import App from './App'
import router from './router'
import iview from 'iview'
import VueResource from 'vue-resource'
import '@/assets/commom.js'

Vue.use(VueResource)
Vue.use(iview)
Vue.config.productionTip = false

// Vue.mixin({
//   methods: {
//     ajaxFail(res) {
//       if(res.status === 401) {
//         console.log()
//       }else {
//         console.log()
//       }
//     }
//   }
// })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
