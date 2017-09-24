import Vue from 'vue'
import App from './App'
// import router from './router'

import '../node_modules/bootstrap/dist/css/bootstrap.css'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  // router,
  render: h => h(App)
})
