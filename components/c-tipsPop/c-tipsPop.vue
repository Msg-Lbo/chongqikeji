<template>
	<!-- 确认框组件 -->
	<!--
	 * @property {Boolean} show 控制弹窗显示（默认标题）
	 * @property {String} title 标题文字（默认标题）
	 * @property {String} text 内容文字（默认38，单位rpx）
	 * @property {String} color 按钮背景颜色（默认使用主题色）
	 * @Function {confirm} 点击确定按钮之后回调
	-->
	<view>
		<u-popup :show="show" mode="center" round="30" :mask-close-able="false" :safeAreaInsetBottom="false">
			<view class="tips-box">
				<view class="df aic jcc">
					<view class="co-title">{{title}}</view>
				</view>
				<view class="co-font">
					<view>{{text}}</view>
					<view v-if="text2">{{text2}}</view>
				</view>
				<view class="df aic jcsb">
					<button @click="tipsBtn" class="co-btn">确定</button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		name: "d-tipsPop",
		props: {
			show: {
				type: Boolean,
				default: false
			},
			title: {
				type: String,
				default: ''
			},
			text: {
				type: String,
				default: false
			},
			text2: {
				type: String,
				default: false
			},
		},
		created() {
			console.log('this.show', this.show);
		},
		data() {
			return {
				// 确定按钮回调
				tipsBtn() {
					this.$emit('confirm')
				},
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tips-box {
		width: 600rpx;
		background: #FFFFFF;
		border-radius: 30rpx;
		padding: 40rpx 40rpx 40rpx;

		.co-btn {
			width: 480rpx;
			height: 88rpx;
			border-radius: 20rpx;
			color: #999;
			background: $c-bgColor;
			font-size: 36rpx;
			font-weight: bold;
			color: #FFFFFF;
			border: 0;
		}

		.co-title {
			text-align: center;
			font-size: 36rpx;
			font-weight: bold;
			color: #1A1A1A;
			line-height: 42rpx;
			position: relative;
			display: inline-block;
			z-index: 2;

			&:after {
				content: '';
				display: inline-block;
				position: absolute;
				bottom: -10rpx;
				left: 50%;
				transform: translateX(-50%);
				width: 100%;
				height: 20rpx;
				background: $c-bgColor;
				border-radius: 48rpx;
				z-index: -1;
			}
		}

		.co-font {
			font-size: 28rpx;
			color: #333333;
			line-height: 56rpx;
			margin: 40rpx 0 86rpx;
			text-align: center;
		}
	}
</style>