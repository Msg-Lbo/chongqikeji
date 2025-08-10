<template>
	<!-- 证件照组件 -->
	<view @click="chooseImg" class="img-box">
		<image class="img" v-show="!show" :src="images.upImg"></image>
		<image class="img" v-show="show" @load="complete" :src="img" mode="aspectFill"></image>
	</view>
</template>

<script>
	import images from "./images.js";
	export default {
		watch: {},
		props: {
			value: {
				type: String,
				default: ''
			},
		},
		created() {
			console.log('images', this.images);
		},
		data() {
			return {
				img: '',
				images,
				show: false
			}
		},
		methods: {
			complete() {
				console.log('加载完成');
				this.show = true
				uni.hideLoading()
			},
			chooseImg() {
				let that = this
				uni.chooseImage({
					count: 1,
					success: (res) => {
						uni.uploadFile({
							url: this.vuex_baseUrl + '/common/upload',
							name: 'file',
							filePath: res.tempFiles[0].path,
							success: (res2) => {
								uni.showLoading({
									mask: true
								})
								let respons = JSON.parse(res2.data)
								console.log('respons',respons);
								if (respons.code == 200) {
									that.img = this.vuex_imgUrl + respons.fileName
									that.$emit('input', that.img)
								}
							},
							fail(err) {
								console.log('err',err);
							}
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.img-box {
		width: 100%;
		height: 100%;

		.img {
			width: 100%;
			height: 100%;
		}
	}

	.text_box {
		margin: 30rpx auto 40rpx;
		text-align: center;
		font-size: 24rpx;
		line-height: 24rpx;
		font-weight: 500;
		color: #333333;
	}
</style>