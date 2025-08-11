import Vue from 'vue'
import App from './App'
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
Vue.use(uView);
Vue.mixin(mpShare)
Vue.mixin(vuexStore);
Vue.prototype.$api = api
const app = new Vue({
  ...App,
  store,
})
require('@/api/http.interceptor.js')(app)
app.$mount()