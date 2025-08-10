<template>
	<!-- 确定取消框组件 -->
	<!--
	 * @property {Boolean} show 控制弹窗显示（默认标题）
	 * @property {String} title 标题文字（默认标题）
	 * @property {String} titleColor 标题文字颜色（默认'#1A1A1A'）
	 * @property {String, Number} titleSize 标题字体大小（默认38，单位rpx）
	 * @property {String} text 内容文字（默认38，单位rpx）
	 * @property {String} btnColor 按钮文字颜色（默认'#FFFFFF'）
	 * @property {String} btnBack 按钮背景颜色（默认使用主题色）
	 * @Function {confirm} 点击确定按钮之后回调
	 * @property {String} btnBack 按钮背景颜色（默认使用主题色）
	 * @property {String} btnBack 按钮背景颜色（默认使用主题色）
	-->
	<view>
		<u-popup :show="show" mode="center" round="30" :mask-close-able="false" :safeAreaInsetBottom="false">
			<view class="confirm-box">
				<view class="ti-box">
					<view :style="[titleCss]" class="co-title">
						<view class="z5">{{title}}</view>
						<!-- <view :style="[bomCss]" class="after"></view> -->
					</view>
				</view>
				<view :style="[textCss]" class="co-font">{{text}}</view>
				<view class="btn-box">
					<button @click="closeBtn" class="co-btn">取消</button>
					<button :style="[btnCss]" @click="confirmBtn" class="co-btn ca">确定</button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		name: "confirmPop",
		props:{
			show:{
				type: Boolean,
				default: false
			},
			title:{
				type: String,
				default: ''
			},
			titleColor:{
				type: String,
				default: '#1A1A1A'
			},
			titleSize:{
				type: String || Number,
				default: '38'
			},
			text:{
				type: String,
				default: ''
			},
			textColor:{
				type: String,
				default: '#666'
			},
			textSize:{
				type: String,
				default: '28'
			},
			btnColor:{
				type: String,
				default: '#FFFFFF'
			},
			btnBack:{
				type: String,
				default: ''
			},
		},
		computed:{
			titleCss(){
				return {
					'color': this.titleColor,
					'fontSize': this.titleSize + 'rpx',
				}
			},
			bomCss(){
				return {
					'background': this.bomColor
				}
			},
			textCss(){
				return {
					'color': this.textColor,
					'fontSize': this.textSize + 'rpx',
				}
			},
			btnCss(){
				return {
					'color': this.btnColor,
					'background': this.btnBack,
				}
			},
		},
		created() {
			console.log('this.show',this.show);
		},
		data() {
			return {
				
			}
		},
		methods:{
			// 确定按钮回调
			confirmBtn(){
				this.$emit('confirm')
			},
			// 取消按钮回调
			closeBtn(){
				this.$emit('close')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.confirm-box{
		width: 600rpx;
		background: #FFFFFF;
		border-radius: 30rpx;
		padding: 40rpx 40rpx 40rpx;
		.btn-box{
			display: flex;
			align-items: center;
			justify-content: space-between;
			
			.co-btn{
				width: 240rpx;
				height: 88rpx;
				border-radius: 20rpx;
				border: 1rpx solid #888990;
				color: #333333;
				&.ca{
					background: $c-bgColor;
					font-size: 36rpx;
					font-weight: bold;
					// color: #FFFFFF;
					border: 0;
				}
			}
		}
		.ti-box{
			display: flex;
			align-items: center;
			justify-content: center;
			.co-title{
				text-align: center;
				font-size: 36rpx;
				font-weight: bold;
				color: #1A1A1A;
				line-height: 42rpx;
				position: relative;
				display: inline-block;
			}
			.z5{
				position: relative;
				z-index: 5;
			}
			// .after{
			// 	content: '';
			// 	display: inline-block;
			// 	position: absolute;
			// 	bottom: -10rpx;
			// 	left: 50%;
			// 	transform: translateX(-50%);
			// 	width: 100%;
			// 	height: 20rpx;
			// 	background: $c-bgColor;
			// 	border-radius: 48rpx 48rpx 48rpx 48rpx;
			// 	z-index: 1;
			// }
		}
		
		.co-font{
			font-size: 28rpx;
			color: #333333;
			line-height: 56rpx;
			margin: 40rpx 0 86rpx;
			text-align: center;
		}
	}
</style>