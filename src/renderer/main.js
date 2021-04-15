import Vue from 'vue'
import axios from 'axios'
import App from './App'
import router from './router'

import store from './store'
import TextareaAutosize from 'vue-textarea-autosize'

Vue.use(TextareaAutosize)

const Store = require('electron-store')

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.prototype.$userStore = new Store()

new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
