import Vue from 'vue'
import App from './App.vue'
import router from './router/index'

// 引入插件
import './plugins/element.js'
import './plugins/vue_quill_editor'

// 引入css
import './assets/css/normalize.css'
import './assets/css/global.css'

import './network/index'


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
