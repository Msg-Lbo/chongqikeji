import Vue from 'vue'
import App from './App'
// 按需引入 uView 核心
import uView from "uview-ui";
import store from "@/store"
import myFunction from '@/common/js/index.js'
import api from '@/api/http.api.js'
import './uni.promisify.adaptor'
let mpShare = require('uview-ui/libs/mixin/mpShare.js')
let vuexStore = require("@/store/$u.mixin.js")

Vue.config.productionTip = false
App.mpType = 'app'

Vue.prototype.$fn = myFunction

// 使用 uView
Vue.use(uView);

Vue.mixin(mpShare)
Vue.mixin(vuexStore);

Vue.prototype.$api = api

const app = new Vue({
  ...App,
  store,
})

// http接口API抽离，免于写url或者一些固定的参数
require('@/api/http.interceptor.js')(app)

app.$mount()