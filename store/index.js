import Vue from 'vue'
import Vuex from 'vuex'
import {
	login,
	logout,
	getInfo
} from "@/api/login.js"
import config from '@/config'

Vue.use(Vuex)

let lifeData = {};

try {
	// 尝试获取本地是否存在lifeData变量，第一次启动APP时是不存在的
	lifeData = uni.getStorageSync('lifeData');
} catch (e) {

}

// 需要永久存储，且下次APP启动需要取出的，在state中的变量名
let saveStateKeys = ['vuex_token','vuex_permi','vuex_roles'];

// 保存变量到本地存储中
const saveLifeData = function(key, value) {
	// 判断变量名是否在需要存储的数组中
	if (saveStateKeys.indexOf(key) != -1) {
		// 获取本地存储的lifeData对象，将变量添加到对象中
		let tmp = uni.getStorageSync('lifeData');
		// 第一次打开APP，不存在lifeData变量，故放一个{}空对象
		tmp = tmp ? tmp : {};
		tmp[key] = value;
		// 执行这一步后，所有需要存储的变量，都挂载在本地的lifeData对象中
		uni.setStorageSync('lifeData', tmp);
	}
}
const store = new Vuex.Store({
	// 下面这些值仅为示例，使用过程中请删除
	state: {
		// 如果上面从本地获取的lifeData对象下有对应的属性，就赋值给state中对应的变量
		// 加上vuex_前缀，是防止变量名冲突，也让人一目了然
		vuex_user: lifeData.vuex_user ? lifeData.vuex_user : {},

		vuex_token: lifeData.vuex_token ? lifeData.vuex_token : '',
		vuex_permi: lifeData.vuex_permi ? lifeData.vuex_permi : [],
		vuex_roles: lifeData.vuex_roles ? lifeData.vuex_roles : [],
		vuex_filepre: 'https://anq.impcas.ac.cn/dfs',
		vuex_version: '1.0.0',
		config: config,
	},
	mutations: {
		$uStore(state, payload) {
			// 判断是否多层级调用，state中为对象存在的情况，诸如user.info.score = 1
			let nameArr = payload.name.split('.');
			let saveKey = '';
			let len = nameArr.length;
			if (nameArr.length >= 2) {
				let obj = state[nameArr[0]];
				for (let i = 1; i < len - 1; i++) {
					obj = obj[nameArr[i]];
				}
				obj[nameArr[len - 1]] = payload.value;
				saveKey = nameArr[0];
			} else {
				// 单层级变量，在state就是一个普通变量的情况
				state[payload.name] = payload.value;
				saveKey = payload.name;
			}
			// 保存变量到本地，见顶部函数定义
			saveLifeData(saveKey, state[saveKey])
		},
	
	},
	actions: {
		// 登录
		Login({
			commit
		}, userInfo) {
			userInfo.username = userInfo.username.trim()
			return new Promise((resolve, reject) => {
				login(userInfo)
					.then(res => {
						commit('$uStore', {
							name: 'vuex_token',
							value: res.token
						})
						resolve()
					})
					.catch(error => {
						reject(error)
					})
			})
		},

		// 获取用户信息
		GetInfo({
			commit,
			state
		}) {
			return new Promise((resolve, reject) => {
				getInfo()
					.then(res => {
						const user = res.user
						user.avatar = user.avatar == '' ? require('@/static/imgs/profile.jpg') :
							config.baseUrl + user.avatar
						if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
							commit('$uStore', {
								name: 'vuex_roles',
								value: res.roles
							})

							commit('$uStore', {
								name: 'vuex_permi',
								value: res.permissions
							})

						} else {
							commit('$uStore', {
								name: 'vuex_roles',
								value: 'ROLE_DEFAULT'
							})
						}
						commit('$uStore', {
							name: 'vuex_user',
							value: user
						})
						resolve(res)
					})
					.catch(error => {
						reject(error)
					})
			})
		},
		// 退出系统
		LogOut({
			commit,
			state
		}) {
			return new Promise((resolve, reject) => {
				logout(state.token)
					.then(() => {
						uni.clearStorageSync()
						resolve()
					})
					.catch(error => {
						reject(error)
					})
			})
		},
	}
})

export default store