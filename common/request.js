// 此vm参数为页面的实例，可以通过它引用vuex中的变量
import store from "@/store";
import {
	toast,
	showConfirm
} from "@/common/common";
import config from '@/config'
const errorCode = {
	401: "认证失败，无法访问系统资源",
	403: "当前操作没有权限",
	404: "访问资源不存在",
	default: "系统未知错误，请反馈给管理员",
};


let isShow = false;
module.exports = (vm) => {
	// 初始化请求配置
	const baseUrl = config.baseUrl
	uni.$u.http.setConfig((config) => {
		/* config 为默认全局配置*/
		config.baseURL = baseUrl; /* 根域名 */
		config.header = {
			isToken: true //默认需要Token
		};
		config.timeout = 1500;
		return config;
	});

	// 请求拦截
	uni.$u.http.interceptors.request.use(
		(config) => {
			// 可使用async await 做异步操作
			// 初始化请求拦截器时，会执行此方法，此时data为undefined，赋予默认{}
			config.data = config.data || {};
			// 可以在此通过vm引用vuex中的变量，具体值在vm.$store.state中
			if (config.header.isToken) {
				config.header["Authorization"] = "Bearer " + vm.$store.state.vuex_token;
			}

			return config;
		},
		(config) => {

			return Promise.reject(config);
		}
	);

	// 响应拦截
	uni.$u.http.interceptors.response.use(
		(res) => {
			/* 对响应成功做点什么 可使用async await 做异步操作*/
			const {
				data,
				statusCode,
				errMsg,
				header,
				config
			} = res;

			const {
				code
			} = data;
			if (code === 200) {
				uni.stopPullDownRefresh()
				uni.hideLoading()
				return data || {};
			}
			return responseDataDeal(data, config);
		},
		(response) => {
			// 对响应错误做点什么 （statusCode !== 200）
			console.log(response);
			const {
				errMsg,
				config
			} = response;

			var message = ''
			if (errMsg === 'Network Error') {
				message = '后端接口连接异常'
			}

			if (errMsg.includes('timeout')) {
				message = '系统接口请求超时'
			} else if (errMsg.includes('Request failed with status code')) {
				message = '系统接口' + errMsg.substr(errMsg.length - 3) + '异常'
			}

			if (config.custom.toast !== false) {
				uni.$u.toast(message);
			}
			return Promise.reject(response);
		}
	);
};

const responseDataDeal = (data, config) => {
	uni.stopPullDownRefresh()
	uni.hideLoading()

	const {
		code
	} = data;
	const msg = errorCode[code] || data.msg || errorCode["default"];
	const custom = config?.custom

	if (code === 401) {
		if (!isShow) {
			isShow = true
			showConfirm("登录状态已过期，您可以继续留在该页面，或者重新登录?")
				.then((res) => {
					if (res.confirm) {
						store.dispatch("LogOut").then((res) => {
							uni.reLaunch({
								url: "/pages/login/login"
							});
						});
					}
				})
				.catch(() => {
					isShow = false;
				});
		}

		return new Promise(() => {})
	} else {
		// 如果没有显式定义custom的toast参数为false的话，默认对报错进行toast弹出提示
		if (custom.toast !== false) {
			uni.$u.toast(msg);
		}
		return Promise.reject(data);
	}


};