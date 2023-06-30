import App from './App'
import Vue from 'vue'
// 引入全局uView
import uView from 'uview-ui'
import store from './store';
import lodash from "lodash";

import DictData from '@/common/dict/init'
import DictTag from '@/common/dict/DictTag'
import { toast, showConfirm } from "@/common/common.js"

import {
	hasRole,
	hasPerimission
} from '@/common/auth.js'

Vue.use(uView)
Vue.component('DictTag', DictTag)
//添加store的mixin
Vue.mixin(require("@/store/$u.mixin.js"));
Vue.prototype.hasRole = hasRole
Vue.prototype.hasPerimission = hasPerimission

Vue.prototype.toast = toast
Vue.prototype.showConfirm = showConfirm

Vue.prototype.util = lodash;
Vue.prototype.$store = store

DictData.install()

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	store,
	...App
})

// 引入请求封装，将app参数传递到配置中
require('@/common/request.js')(app)

app.$mount()