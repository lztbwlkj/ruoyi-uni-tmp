<template>
	<view class="container">
		
		<view>
			获取到的TOKEN === {{vuex_token}}
		</view>
		<h3>------------- 权限测试 ------------- </h3>
		<view v-if="hasRole(['common'])">角色权限测试</view>
		<view v-if="hasPerimission(['system:user:list'])">按钮权限测试</view>

		<h3>------------- 字典测试 -------------</h3>
		<view>
			<dict-tag :options="dict.type.ays_exp_result" :value="1" />
			<view v-for="dict in dict.type.ays_exp_result" :key="dict.value"> {{dict.label}}</view>
		</view>

		<view>
			<dict-tag :options="dict.type.sys_notice_type" :value="2" />
			<view v-for="dict in dict.type.sys_notice_type" :key="dict.value"> {{dict.value}}</view>
		</view>
		<h3>------------本地数据持久缓存和修改--------------———————</h3>
		<view class="">
			{{vuex_permi}}
		</view>
		<view>
			版本号为：{{vuex_version}}——————
		</view>
		<view>

			【琵琶行】的作者为{{vuex_user.name}}
		</view>
		<u-button @click="modifyVuex">修改变量</u-button>
		<u-button @click="clearnLocalData">一键删除本地数据</u-button>
		<u-button @click="openNotice">打开通知公告</u-button>
	</view>
</template>
<script>
	export default {

		dicts: ['ays_exp_result', 'sys_notice_type'],

		data() {
			return {}
		},
		onLoad() {},
		onShow() {
			console.log(uni.getStorageSync("zqtoken"));
		},
		methods: {
			toJSON() {},
			sumbit(res) {},
			modifyVuex() {
				this.$u.vuex('vuex_version', '1.0.1');
				// 修改对象的形式，中间用"."分隔
				this.$u.vuex('vuex_user.name', '诗圣');
			},
			clearnLocalData() {
				uni.clearStorageSync()
				uni.$u.toast('删除成功，刷新页面试试！')
			},
			openNotice(){
				uni.$u.route('/pagesMenus/notices/notices')
			}
		}
	}
</script>
<style lang="scss" scoped>
</style>