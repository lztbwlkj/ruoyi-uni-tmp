<!--  -->
<template>
	<view>
		<view style="padding: 30rpx;font-weight: 600;font-size: 32rpx;border-bottom: 1rpx solid #e6e6e6;">
			审核详情
		</view>
		<tui-loading v-if="loading"></tui-loading>
		<view style="margin-top: 14vh;" v-if="$lds.isEmpty(flowRows) && !isFirst">
			<tui-no-data :fixed="false" :imgWidth="400" :imgHeight="400" imgUrl="/static/empty/数据为空.png">
				<text style="font-size: 28rpx;color: #a8a8a8;">暂无审核详情~</text>
			</tui-no-data>
		</view>
		<view style="padding: 20rpx 20rpx 20rpx 60rpx;" v-else>
			<tui-time-axis>
				<tui-timeaxis-item backgroundColor="#fff" v-for="(item, index) in flowRows" :key="index">
					<template v-slot:node>
						<view class="dot" :style="{backgroundColor: item.color}">
							<u-icon :name="item.icon" color="#fff"></u-icon>
						</view>
					</template>

					<template v-slot:content>
						<template v-if="index === 0">
							<view style="font-size: 30rpx;font-weight: bold;"> {{ item.runtimeNode.label }}(已发起)</view>
							<view>【{{ item.owner.label }}】已发起</view>
						</template>
						<template v-else>
							<view style="font-size: 30rpx;font-weight: bold;">
								{{ item.runtimeNode.label }}({{ item.taskState.label }})
							</view>
							<view>
								【{{ item.owner.label }}】审核状态： {{ item.taskState.label }}
							</view>
							<view v-if="item.taskComment">说明：{{ item.taskComment }}</view>
						</template>
					</template>
				</tui-timeaxis-item>
			</tui-time-axis>
		</view>
		<!-- <view class="footer">
			<u-button>关闭</u-button>
		</view> -->
	</view>
</template>

<script>
	import dayjs from "dayjs";
	export default {
		props: {
			instanceId: {
				type: [String, Number],
				default: '',
			},
			type: {
				type: String,
				required: true,
			}
		},
		data() {
			return {
				flowRows: [],
				loading: false,
				isFirst: true,
				icons: {
					0: "more-dot-fill",
					2: "checkmark",
					3: "",
					4: "",
					5: "close",
					6: "minus"
				},
				colors: {
					0: "#E6A23C",
					2: "#67C23A",
					5: "#F56C6C",
					6: "#F56C6C"
				},
			};
		},
		mounted() {
			this.getFlowInfo();
		},
		methods: {
			getFlowInfo() {
				this.loading = true;
				this.$u.flow().flowInfo(this.type, this.instanceId).then((res) => {
					this.loading = false;
					this.isFirst = false;
					const q = {}
					this.flowRows = res.rows.filter(x => {
						if (q[x.taskId]) {
							return false
						}
						q[x.taskId] = 1;
						return true;
					}).map((it) => {
						const {
							value
						} = it.taskState;
						const time = it.endTime || it.createTime
						const auditTime = dayjs(time).format("YYYY-MM-DD HH:mm");
						// 待审核 #E6A23C 已通过 #67C23A 未通过#F56C6C
						const color = this.colors[value];
						const icon = this.icons[value];
						return {
							...it,
							color,
							icon,
							auditTime,
						};
					});
				}).catch(e => {
					this.loading = false;
					this.isFirst = false;
					this.$u.toast(e.msg);
				});
			},
		},
	};
</script>
<style lang="css" scoped>
	.dot {
		width: 20px;
		height: 20px;
		background-color: #bbb;
		color: #fff;
		font-weight: bold;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-left: -5px;
	}

	.footer {
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
</style>
