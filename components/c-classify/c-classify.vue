<template>
	<view class="page-body" :style="'height:' + height + 'px'">
		<scroll-view class="nav-left" scroll-y :style="'height:' + height + 'px'" :scroll-top="scrollLeftTop"
			scroll-with-animation>
			<view class="nav-left-item" @click="categoryClickMain(item.id)" :key="item.id"
				:class="item.id === categoryActive ? 'active' : ''" v-for="item in classifyData">
				{{ item.categoryName || "" }}
			</view>
		</scroll-view>
		<view class="nav-right">
			<c-scroll-list :option="{ auto: false }" ref="list"
				:api-params="{ categoryId: categoryActive, goodsName:keywords }"
				@load="(result) => (list = result.list)" :api="api">
				<view class="box">
					<view class="nav-right-item" v-for="(goods, gIndex) in list" :key="gIndex"
						:id="gIndex == 0 ? 'first' : ''" @click="cart(goods)">
						<u-image :src="substrStr(goods.goodsImg)" width="140rpx" height="140rpx" radius="12px">
						</u-image>
						<view class="goods-info">
							<view class="go-name">{{ goods.goodsName }}</view>
							<view class="go-df">
								<view class="go-integral mr"><text>{{goods.integralNum}}</text> 积分</view>
								<!-- <view class="ma-integral-divide">/</view> -->
								<view class="go-integral">￥<text>{{goods.price/100}}</text></view>
								<!-- <view class="go-redeem">已兑：<text>{{goods.redeemNum}}</text></view> -->
							</view>
						</view>
					</view>
				</view>
			</c-scroll-list>
		</view>
	</view>
</template>

<script>
	export default {
		name: "c-classify",
		props: {
			api: {
				type: Function,
				required: true
			},
			apiParams: {
				type: Object,
				default: () => ({}),
			},
			keywords: {
				type: String,
				default: "",
			},
		},
		data() {
			return {
				height: 0,
				categoryActive: 0,
				scrollTop: 0,
				scrollLeftTop: 0,
				// scrollHeight: 0,
				classifyData: [],
				arr: [], //初始值，后边计算会根据手机适配覆盖
				leftItemHeight: uni.upx2px(120), //49行会计算出新值进行覆盖
				tabBarHeight: 0, //如果此页面为Tab页面，自己改变高度值,,一般tab高度为51
				list: [],
				base: this.$u.http.config.imgUrl
			};
		},
		created() {
			//如果你的分类数据为后台异步获取请	将下方代码放置你的数据回调中
			this.getGoodsTypes();
		},
		mounted() {
			this.height =
				uni.getSystemInfoSync().windowHeight - this.tabBarHeight - uni.upx2px(124);
		},
		onShow() {
			this.$refs.list.initList(true);
		},
		methods: {
			refresh() {
				this.$refs.list.refresh();
			},
			// 获取数据分类
			getGoodsTypes() {
				this.$u.api.getAllList().then((res) => {
					this.classifyData = res.data;
					this.categoryActive = res.data[0].id;
					this.refresh();
				});
			},
			categoryClickMain(id) {
				this.categoryActive = id;
				this.refresh();
			},
			cart(goods) {
				this.$emit("click", goods);
			},
			// 截取指定字符前
			substrStr(str) {
				let res = str
				if (str.indexOf(',') != -1) {
					let index = str.indexOf(",")
					res = str.substring(0, index)
				}
				if (str.indexOf("http") == -1) {
					res = this.$u.http.config.imgUrl + res
				}
				return res
			}
		},
	};
</script>

<style lang="scss" scoped>
	.page-body {
		display: flex;
		background: #fff;
		overflow: hidden;
	}

	.nav {
		display: flex;
		width: 100%;
	}

	.nav-left {
		width: 200rpx;
		background: #f5f5f5;
	}

	.nav-left-item {
		height: 120rpx;
		border-bottom: solid 1rpx #e6e6e6;

		font-size: 28rpx;
		color: #666666;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.nav-left-item:last-child {
		border-bottom: none;
	}

	.nav-right {
		width: 550rpx;
	}

	.box {
		display: block;
		overflow: hidden;
		/*若您的子分类过少想使得每个子分类占满屏请放开上边注视 */
	}

	.box:last-child {
		border: none;
	}

	.nav-right-item {
		height: 186rpx;
		border-bottom: 1rpx solid #e6e6e6;
		text-align: center;
		padding: 22rpx 0 20rpx;
		margin: 0 20rpx;
		font-size: 28rpx;
		background: #fff;
		box-sizing: border-box;
		display: flex;
		align-items: flex-start;
	}

	.goods-info {
		flex: 1;
		font-size: 32rpx;
		font-family: PingFang SC-Medium, PingFang SC;
		font-weight: 500;
		color: #1a1a1a;
		line-height: 38rpx;
		-webkit-background-clip: text;
		text-align: left;
		margin-left: 32rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 100%;

		.go-name {
			font-size: 32rpx;
			color: #1A1A1A;
			line-height: 38rpx;
		}

		.go-df {
			display: flex;
			align-items: center;

			.go-integral {
				font-size: 24rpx;
				font-weight: bold;
				color: #FC3E3E;
				line-height: 23rpx;

				&.mr {
					margin-right: 66rpx;
				}

				text {
					font-size: 32rpx;
					display: inline-block;
					margin-right: 8rpx;
				}
			}

			.ma-integral-divide {
				margin: 0 5px;
			}

			.go-redeem {
				font-size: 20rpx;
				font-weight: 400;
				color: #999999;
				line-height: 23rpx;
			}
		}

	}

	.nav-right-item image {
		width: 150rpx;
		height: 150rpx;
	}

	.active {
		background: #fff;
		border-right: 0;
		font-size: 30rpx;
		font-weight: bold;
		color: #1A1A1A;
		position: relative;

		&.after {
			content: '';
			display: inline-block;
			position: absolute;
			left: 0;
			top: 0;
			width: 12rpx;
			height: 128rpx;
			background: linear-gradient(270deg, #FD6A61 0%, #FC3E3E 90%);
			border-radius: 0rpx 6rpx 6rpx 0rpx;
		}
	}

	::-webkit-scrollbar {
		/*取消小程序的默认导航条样式*/
		width: 0;
		height: 0;
		color: transparent;
	}
</style>