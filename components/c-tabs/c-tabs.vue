<template>
	<!-- tab切换 -->
	<view class="tab">
		<view class="ta-box" v-for="(v, i) in dataList" :key="i">
			<view class="ta-title" @click="changeTab(v, i)">
				<text class="ta-text" :class="{ active: tabIndex == i }">{{ field ? v[field] : v }}</text>
			</view>
			<view class="ta-line"></view>
		</view>
	</view>

</template>

<script>
export default {
	props: {
		tabIndex: {
			type: String | Number,
			default: 0
		},
		dataList: {
			type: Array,
			default: () => []
		},
		// 自定义展示字段
		field: {
			default: '',
			type: String
		},
	},
	data() {
		return {}
	},
	methods: {
		// 切换消息类型
		async changeTab(val, inx) {
			this.$emit('change', val, inx)
		}
	}
}
</script>

<style lang="scss" scoped>
.tab {
	display: flex;
	align-items: center;
	justify-content: space-around;
	text-align: center;
	padding: 24rpx 0;
	border-bottom: 8rpx solid #F5F5F7;
	background: #fff;
	position: sticky;
	top: 0;

	.ta-box {
		display: flex;
		align-items: center;
		flex: 1;

		&:nth-last-child(1) {
			.ta-line {
				width: 0;
			}
		}

		.ta-line {
			width: 1rpx;
			height: 24rpx;
			background: #C8CACC;
			border-radius: 0rpx;

		}

		.ta-title {
			flex: 1;
			font-size: 28rpx;
			font-weight: 400;
			color: #666666;

			.ta-text {
				padding: 22rpx 0;

				&.active {
					font-size: 30rpx;
					font-weight: bold;
					color: $c-bgColor;
					position: relative;

					&::after {
						width: 100%;
						position: absolute;
						display: inline-block;
						content: '';
						bottom: 0rpx;
						left: 50%;
						transform: translateX(-50%);
						height: 4rpx;
						background: $c-bgColor;
						border-radius: 20rpx;
						z-index: -1;
					}
				}
			}

		}
	}

}
</style>