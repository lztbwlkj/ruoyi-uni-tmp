<template>
	<view class="detail">
		<tui-loading v-if="loading"></tui-loading>
		<template v-else>
			<view class="detail-title">
				{{info.noticeTitle}}
			</view>
			<view class="detail-desc">
				<view>
					创建者：{{info.createBy}}
				</view>
				<view>
					{{info.createTime}}
				</view>
			</view>
			<view class="detail-content">
				<u-parse :html="info.noticeContent"></u-parse>
			</view>
		</template>
	</view>
</template>

<script>
	import {getNotice} from '@/api/notice.js';
	export default {
		data() {
			return {
				id: '',
				loading: false,
				info: {}
			};
		},
		onLoad(e) {
			this.id = e.id
			this.getDetail()
		},
		methods: {
			getDetail() {
				this.loading = true;
				
				getNotice(this.id).then(res => {
					this.loading = false;
					this.info = res.data;
				}).catch(e => {
					this.loading = false;
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.detail {
		padding: 10rpx 20rpx;

		&-title {
			font-size: 30rpx;
			font-weight: bold;
			text-align: center;
		}

		&-desc {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-top: 20rpx;
			font-size: 24rpx;
			color: #888;
			border-bottom: 1rpx solid #e6e6e6;
			padding: 10rpx 0rpx 25rpx 0rpx;
		}

		&-content {
			font-size: 26rpx;
			margin: 20rpx 10rpx 20rpx 10rpx;
			line-height: 44rpx;
			color: #777;
		}
	}
</style>
