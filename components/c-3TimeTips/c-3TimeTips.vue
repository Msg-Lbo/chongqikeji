<template>
	<!-- 提示弹出框 -->
	<!--
	 * @property {Boolean} show 控制弹窗显示（默认标题）
	 * @property {String} title 标题文字（默认标题）
	 * @property {String} text 内容文字（默认38，单位rpx）
	 * @property {String} color 按钮背景颜色（默认使用主题色）
	 * @Function {confirm} 点击确定按钮之后回调
	-->
	<view>
		<u-popup :show="show" mode="center" round="30" :mask-close-able="false" :safeAreaInsetBottom="false">
			<view class="sign-box">
				<view><image :src="img" mode=""></image></view>
				<view class="tips">{{text}}</view>
				<view class="time">{{countdown}}s后自动返回</view>
				<button class="determine" :style="'background:'+color" @click="determineFn">返回</button>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		name: "tipsPop",
		props:{
			show:{
				type: Boolean,
				default: false
			},
			img:{
				type: String,
				default: ''
			},
			text:{
				type: String,
				default: ''
			},
			color:{
				type: String,
				default: ''
			},
		},
		watch:{
			show:{
				handler(newName, oldName) {
					console.log('newName',newName);
					if(newName){
						this.countdown = 3
						this.timer = setInterval(() => {
							this.countdown--
							if (this.countdown <= 0) {
								clearInterval(this.timer)
								this.determineFn()								
							}
						}, 1000)
					}else{
						clearInterval(this.timer)
					}
				}
			}
		},
		data() {
			return {
				countdown: 3,
				timer:null
			};
		},
		methods:{
			// 确定按钮
			determineFn(){
				this.$emit('close')
			},
		}
	}
</script>

<style lang="scss">
	.sign-box{
		padding: 40rpx 30rpx 24rpx;
		text-align: center;
		width: 560rpx;
		image{
			width: 200rpx;
			height: 200rpx;
			margin-bottom: 32rpx;
		}
		.tips{
			font-size: 36rpx;
			font-weight: bold;
			color: #1A1A1A;
		}
		.time{
			color: #5C5E66;
			font-size: 24rpx;
			margin-top: 120rpx;
		}
		.determine{
			height: 88rpx;
			background: $c-bgColor;
			border-radius: 20rpx;
			opacity: 1;
			margin: 24rpx 10rpx 40rpx;
			font-size: 36rpx;
			font-weight: bold;
			color: #FFFFFF;
		}
	}
</style>
