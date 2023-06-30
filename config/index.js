import Vue from 'vue';
import uView from "uview-ui";
import store from '@/store';
import lodash from "lodash";
import {
	POST,
	GET
} from '@/api/api.js'

// http拦截器，此为需要加入的内容，如果不是写在common目录，请自行修改引入路径
import httpInterceptor from '@/common/http.interceptor.js'

export default function createApp(App) {
	Vue.use(uView);

	Vue.mixin(require("@/store/$u.mixin.js"));
	
	customGlobFunc();
	
	Vue.config.productionTip = false
	App.mpType = 'app'
	
	const app = new Vue({
		store,
		...App
	})
	
	// 这里需要写在最后，是为了等Vue创建对象完成，引入"app"对象(也即页面的"this"实例)
	Vue.use(httpInterceptor, app)
	
	return app 
}



/*
 * 自定义全局方法并挂载this.$xxx下
 */
function customGlobFunc() {
	Vue.prototype.get = GET;
	Vue.prototype.post = POST; //挂载全局的post和get请求
	Vue.prototype.lo = lodash;
}