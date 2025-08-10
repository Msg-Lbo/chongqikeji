<template>
	<!-- 选择框组件 -->
	<!--
	 * @property {Boolean} show 控制弹窗显示（默认false）
	 * @property {Array} dataList 渲染数组
	 * @property {String|Number} index 默认选中
	 * @property {Array} indexList 默认选择列表(仅多选)
	 * @property {String} title 选择框标题（这是选择框标题）
	 * @property {String} closeable 是否显示x关闭按钮（默认true）
	 * @property {String} field 自定义展示字段（默认label）
	 * @property {String} matchField id
	 * @property {String} more 是否开启多选（默认false）
	 * @Function {determine}  点击确定触发 返回参数(选中的当前项)
	 * @Function {close} 点击返回触发
	-->
	<u-popup :show="show" mode="bottom" round="30" :closeable="closeable" @close="closePop"
		:safeAreaInsetBottom="false">
		<view class="pop-box">
			<view class="pop-title">{{title}}</view>
			<!-- 单选列表 -->
			<scroll-view v-if="!more" scroll-y="true" class="pop-main">
				<view class="for-box" v-for="(v,i) in dataList" :key="v[matchField]" @click="tabCheck(v,i)">
					<view>{{v[field]||v}}</view>
					<view class="mr">
						<view class="check" v-show="checkIndex==v[matchField]">
							<image :src="imgData.checkImg" mode=""></image>
						</view>
						<view v-show="checkIndex!=v[matchField]" class="hollow-circle"></view>
					</view>
				</view>
			</scroll-view>
			<!-- 多选列表 -->
			<scroll-view v-else scroll-y="true" class="pop-main">
				<view class="for-box" v-for="(v,i) in dataList" :key="v[matchField]" @click="tabCheck2(v,i)">
					<view>{{v[field]}}</view>
					<view class="mr">
						<view class="check" v-show="checkList.includes(v[matchField])">
							<image :src="imgData.checkImg" mode=""></image>
						</view>
						<view v-show="!checkList.includes(v[matchField])" class="hollow-circle"></view>
					</view>
				</view>
			</scroll-view>
			<button class="determine" @click="determineFn()">确定</button>
		</view>
	</u-popup>
</template>

<script>
	import imgData from "./image.js"
	export default {
		props: {
			// 是否打开选择框
			show: {
				default: false,
				type: Boolean
			},
			// 数据列表
			dataList: {
				default: () => [],
				type: Array
			},
			// 默认选择
			index: {
				default: '0',
				type: String | Number
			},
			// 默认选择列表(仅多选)
			indexList: {
				default: () => [],
				type: Array
			},
			// 选择框标题
			title: {
				default: '',
				type: String
			},
			// 是否显示x关闭按钮
			closeable: {
				default: true,
				type: Boolean
			},
			// 自定义展示字段
			field: {
				default: 'label',
				type: String
			},
			// 是否开启多选
			more: {
				default: false,
				type: Boolean
			},
			// 匹配id字段
			matchField: {
				default: 'id',
				type: String
			}
		},
		data() {
			return {
				imgData,
				checkIndex: 0,
				checkList: [],
				intx: "",
			}
		},
		created() {
			this.checkIndex = this.index
			this.checkList = this.indexList
		},
		watch: {
			index: {
				handler(newValue) {
					this.checkIndex = newValue
				}
			}
		},
		methods: {
			// 切换选择项
			tabCheck(val, inx) {
				// console.log(val, inx);
				this.checkIndex = val[this.matchField]
				this.intx = inx
			},
			// 多选选择项
			tabCheck2(val, inx) {
				// console.log(val, inx);
				let isAdd = true
				this.checkList.forEach((v, i) => {
					if (v == val[this.matchField]) {
						isAdd = false
						this.checkList.splice(i, 1);
					}
				})
				if (isAdd) {
					this.checkList.push(val[this.matchField])
				}
			},
			// 确定选择
			determineFn() {
				// console.log('this.inx',this.inx);
				if (this.more) {
					let value = this.dataList.filter((v, i) => {
						return this.checkList.includes(v[this.matchField])
					})
					console.log('value1', value);
					this.$emit('determine', value)
				} else {
					// let value = this.dataList[this.inx]
					let value = this.dataList.filter(v=>{
						return this.checkIndex == v[this.matchField]
					})
					console.log('value2', value);
					this.$emit('determine', value[0])
				}

			},
			// 关闭弹窗
			closePop() {
				this.$emit('close')
			},

		}
	}
</script>

<style lang="scss" scoped>
	.pop-box {
		min-height: 500rpx;
		padding: 40rpx 30rpx 48rpx;

		.pop-title {
			font-size: 36rpx;
			font-weight: bold;
			color: #1A1A1A;
			text-align: center;
			margin-bottom: 40rpx;

		}

		.pop-main {
			// overflow-y: scroll;
			max-height: 600rpx;
			padding-right: 40rpx;

			.for-box {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 32rpx 0;
				border-bottom: 1rpx solid rgba(240, 242, 245, 1);

				.mr {
					margin-right: 40rpx;
				}

				.check {
					width: 32rpx;
					height: 32rpx;
					position: relative;
					background: $c-bgColor;
					border-radius: 50%;

					image {
						position: absolute;
						top: 0;
						left: 0;
						width: 100%;
						height: 100%;
						z-index: 2;
					}
				}

				.hollow-circle {
					border: 2rpx solid rgba(27, 27, 27, 1);
					border-radius: 50%;
					width: 26rpx;
					height: 26rpx;
				}

				.course {
					font-size: 32rpx;
					font-weight: bold;
					color: rgba(26, 26, 26, 1);

					.symbol {
						font-size: 24rpx;
						color: rgba(255, 41, 41, 1);
					}

					.price {
						color: rgba(255, 41, 41, 1);
					}
				}

			}


		}

		.determine {
			margin-top: 40rpx;
			width: 690rpx;
			height: 88rpx;
			background: linear-gradient( 130deg, #68D533 0%, #4CB314 100%);
			font-size: 36rpx;
			font-weight: bold;
			color: #FFFFFF;
		}

	}
</style>