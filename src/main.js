import Vue from 'vue'
import App from './App'
import router from './router'

// 导入element-ui的组件
import ElementUI from 'element-ui'
import axios from 'axios'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
Vue.use(ElementUI)
Vue.config.productionTip = false

// 为axios 挂载token 请求头，需要使用 request 拦截器实现
axios.interceptors.request.use(function(config) {
  // 手动为 axios 的请求，追加 Authorization 请求头
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 全局挂载请求的 baseurl
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 挂载 axios
Vue.prototype.$http = axios
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
