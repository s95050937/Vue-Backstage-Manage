import axios from 'axios'
import Vue from 'vue'

// axios.default.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'


const instance = axios.create({
  baseURL: 'http://timemeetyou.com:8889/api/private/v1/',
  timeout: 3000,
  
});
instance.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.token
  return config
})
Vue.prototype.$http = instance


