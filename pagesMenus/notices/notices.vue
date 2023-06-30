<template>
	<view>
		<tui-loading v-if="loading"></tui-loading>
		<view style="padding: 10rpx 0;">
			<tui-searchbar backgroundColor='#fff' inputBgColor='#ededed' radius="8rpx" placeholder="请输入公告标题"
				@search="search" @cancel="search">
			</tui-searchbar>
		</view>
		<view style="margin-top: 16vh;" v-if="util.isEmpty(rows) && !isFirst">
			<tui-no-data :fixed="false" :imgWidth="400" :imgHeight="400" imgUrl="/static/empty/数据为空.png">
				<text style="font-size: 28rpx;color: #a8a8a8;">暂无数据~</text>
			</tui-no-data>
		</view>

		<template v-else>
			<tui-list-view backgroundColor="#fff">
				<tui-list-cell v-for="item in rows" :key="item.id" @click="openDetail(item)">
					<view class="u-line-2" style="color: #333;font-size: 28rpx;">
						{{item.noticeTitle}}
					</view>
					<view
						style="display: flex;justify-content: space-between;align-items: center;margin-top: 14rpx;font-size: 24rpx;color: #999;">
						<view>
							<dictTag :options="dict.type.sys_notice_type" size="mini" :value="item.noticeType">
							</dictTag>
						</view>
						<view>
							{{item.createTime}}
						</view>
					</view>
				</tui-list-cell>
			</tui-list-view>
			<tui-loadmore v-if="loading && !util.isEmpty(rows)" :index="1" text="加载中..."></tui-loadmore>
			<view @click="loadMore" v-if="!loading && !util.isEmpty(rows)">
				<tui-nomore :text="hasNext ? '~我是有底线的~':'点击加载更多'">
				</tui-nomore>
			</view>
		</template>
	</view>
</template>

<script>
	import {listNotice} from '@/api/notice.js';
	export default {
		dicts: ["sys_notice_type"],
		data() {
			return {
				pageNum: 1,
				loading: false,
				total: 0,
				isFirst: true,
				searchKey: '',
				rows: [],
			};
		},
		computed: {
			hasNext() {
				return this.total === this.rows.length
			}
		},
		onLoad(e) {

			uni.setNavigationBarTitle({
				title: e.title || "通知公告"
			})
			this.getNoticeList()
		},
		onPullDownRefresh() {
			this.pageNum = 1;
			this.getNoticeList()
		},
		methods: {
			loadMore() {
				if (this.hasNext) return;

				this.pageNum++;
				this.getNoticeList()
			},
			search(e) {

				this.pageNum = 1;
				this.searchKey = e.value || '';
				this.getNoticeList()
			},
			openDetail(item) {
				this.$u.route("/pagesMenus/notices/detail", {
					id: item.noticeId
				})
			},
			getNoticeList() {
				this.loading = true;
				const _this = this;
				listNotice({
					pageNum: 1,
					pageSize: 10,
					noticeTitle: this.searchKey
				}).then(res => {
					const {
						rows
					} = res;
					_this.isFirst = false
					_this.loading = false;
					_this.total = res.total;
					if (this.pageNum === 1) {
						_this.rows = res.rows;
					} else {
						_this.rows = _this.rows.concat(res.rows);
					}


				}).catch(e => {
					_this.loading = false;
					_this.isFirst = false;
					_this.$u.toast(e.msg)
					
				})
			}
		}
	}
</script>

<style lang="scss">

</style>
