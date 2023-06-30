<template>
	<view class="select-dept">
		<view class="select-dept-tree">
			<DaTreeVue2 :data="tree" :field="{ label: 'label', key: 'id' }" defaultExpandAll
				@change="handleTreeChange" @expand="handleExpandChange" />
		</view>
		<view class="select-dept-footer">
			<u-button type="primary" style="flex:1" @click="confirm">确认并返回</u-button>
		</view>
	</view>
</template>

<script>
	var _self = this;

	import DaTreeVue2 from '@/components/da-tree-vue2/index.vue'
	export default {
		components: {
			DaTreeVue2
		},
		data() {
			return {
				title: '', // 标题名称
				tree: null,

			}
		},

		onLoad(option) {
			console.log('option', option);
			_self = this;
			this.options = option;
			this.getTree(); // 获取树的数据
			this.getParams(option);
		},
		methods: {
			// =================================== 初始化 ========================================================================
			/** 获取初始化值
			 * @param {Object} options 参数
			 */
			getParams: function(option) {
				console.log('option', option.type);

				// 获取导航栏标题
				this.title = Boolean(option.title) ? option.title : '';
				uni.setNavigationBarTitle({
					title: this.title
				});
			},

			handleTreeChange(allSelectedKeys, currentItem) {
				console.log('handleTreeChange ==>', allSelectedKeys, currentItem)
				this.checkList = [currentItem];
			},
			handleExpandChange(expand, currentItem) {
				console.log('handleExpandChange ==>', expand, currentItem)
			},
			/** 获取树形图的数据
			 * 模拟实际获取数据，设定时间为3s
			 */
			getTree: function() {

				uni.showLoading({
					title: '数据获取中……'
				});

				_self.$u
					.depts()
					.treeList()
					.then((res) => {
						// _self.tree = res.data;
						let rows = res.data

						_self.tree = res.data;
						console.log('rows', _self.tree)
						uni.hideLoading();
					}).catch(e => {
						uni.hideLoading();
						_self.$u.toast(e.msg)
					});
					
					
			},
		
			/** 点击确认按钮
			 * @param {Object} val
			 */
			confirm(val) {
				uni.$emit('selectDept', this.checkList)
				uni.navigateBack();
			},
			
		}
	}
</script>

<style lang="scss">
	.select-dept {
		&-tree {
			overflow-y: auto;
			padding-top: 10rpx;
			padding-left: 10rpx;
			height: calc(100vh - 150rpx);
		}

		&-footer {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 20rpx 20rpx 40rpx 20rpx;
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			background-color: #fff;
			border-top: 1rpx solid #e8e8e8;
			z-index: 10;
		}
	}
</style>