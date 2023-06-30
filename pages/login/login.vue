<template>
	<view class="login">
		<view class="login-top"></view>
		<view class="login-logo">
			<image :src="config.logo">
			</image>
		</view>
		<view class="login-title">
			{{config.name}}
		</view>
		<view class="login-body">
			<view class="login-body-bg">
				<u-icon name='account-fill' size='34' color="#4f77ed"></u-icon>
				<view style="width: 2rpx;background-color:#ccc;margin:0rpx 20rpx;height: 48rpx;"></view>
				<view style="flex: 1;">
					<u-input v-model="form.username" class='input' clearable placeholder="请输入账号" :custom-style="{
						fontSize:'28rpx'
					}" :maxlength='20'>
					</u-input>
				</view>
			</view>
			<view class="login-body-bg" style="margin-top: 20rpx;">
				<u-icon name='lock-fill' size='34' color="#4f77ed"></u-icon>
				<view style="width: 2rpx;background-color:#ccc;margin:0rpx 20rpx;height: 48rpx;"></view>
				<view style="flex: 1;">
					<u-input v-model="form.password" type="password" class='input' placeholder="请输入密码" :custom-style="{
						fontSize:'28rpx'
					}"></u-input>
				</view>
			</view>
			<view class="login-body-option">
				<u-button type="primary" :loading="loading" loadingText='正在登录...' :disabled="loading" @click="loginClick">
					{{loading ? '登录中...':'立即登录'}}
				</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	
	export default {
		data() {
			return {
				loading: false,
				form: {
					// username: 'suyw',
					// password: 'suyw@zky.cn'
					username: 'admin',
					password: 'admin123'
					// username: 'admin',
					// password: 'Sa@20230208'
				}
			};
		},
		methods: {
			loginClick() {
				if (this.util.isEmpty(this.form.username)) {
					return this.$u.toast('请输入账号')
				}
				if (this.util.isEmpty(this.form.password)) {
					return this.$u.toast('请输入密码')
				}
				this.loading = true;
				uni.showLoading({
					title: '请稍后...',
					mask: false
				});
				this.$store
					.dispatch('Login', this.form)
					.then(() => {
						this.$store.dispatch('GetInfo').then(res => {
							this.loading = false;
							uni.reLaunch({
								url: '/pages/index/index'
							});
						});
					})
			},

			openForget() {
				this.$u.route('/pagesUser/forget/forget')
			}
		}
	}
</script>


<style>
	page {
		background-color: #f3f4f8;
	}
</style>

<style lang="scss" scoped>
	.login {
		padding: -1rpx 40rpx 0 40rpx;
		font-family: "PingFang SC";

		&-top {
			height: 18vh;
			background-color: $uni-color-primary;
		}

		&-title {
			text-align: center;
			font-size: 36rpx;
			margin-top: 30rpx;
			font-weight: 700;
		}

		&-logo {
			display: flex;
			align-items: center;
			justify-content: center;
			margin-top: -100rpx;

			image {
				width: 200rpx;
				height: 200rpx;
				background-color: #fff;
				border-radius: 50%;
				overflow: hidden;
				border: 6rpx solid #fff;
				box-shadow: 0rpx 0rpx 10rpx 6rpx #eee;
			}
		}

		&-body {

			margin: 40rpx 80rpx;
			background-color: #fff;
			padding: 40rpx 30rpx;
			box-shadow: 0 0 10rpx 4rpx #eee;
			border-radius: 20rpx;
			overflow: hidden;

			&-bg {
				background-color: #f3f4f8;
				padding: 15rpx 25rpx;
				border-radius: 12rpx;
				display: flex;
				align-items: center;

				&-title {
					font-size: 24rpx;
					color: #333;
					font-weight: 600;
					padding-bottom: 20rpx;
					border-bottom: 5rpx solid #eee;
				}
			}

			&-option {
				margin-top: 70rpx;
			}

			&-forget {
				text-align: center;
				color: $uni-color-primary;
				margin-top: 40rpx;
				font-size: 26rpx;
				font-weight: 600;
			}
		}
	}
</style>