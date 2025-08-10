<template>
	<view>
		<u-picker :show="show" ref="uPicker" :columns="areaList" keyName="name" @confirm="$emit('confirm',$event)"
			@change="changeHandler" @cancel="$emit('cancel')"></u-picker>
	</view>
</template>

<script>
	/**
	 * c-selectDistrict 地区弹窗
	 * @description 选择地区弹窗
	 * @property {String} show 开启关闭弹窗
	 * @property {String} type 类型 1-省  2-省市 3-省市区 (默认 省市区 )
	 * @change {Function} change 切换事件
	 * @event {Function} confirm 点击确定按钮事件
	 * @event {Function} cancel 点击取消按钮事件
	 * 
	 */
	export default {
		name: 'selectDistrict',
		props: {
			show: {
				default: false,
				type: Boolean
			},
			type: {
				default: 3,
				type: Number | String
			}
		},
		data() {
			return {
				areaList: []
			}
		},
		created() {
			this.getAreaFn()
		},
		methods: {
			// 获取初始省
			getAreaFn() {
				//地区
				this.$api.getArea({
					pid: 0
				}).then(res => {
					this.areaList.push(res.data)
					let obj = {
						value: [{
							id: 1
						}]
					}
					if (this.type > 1) {
						this.changeHandler(obj, true)
					}
				})
			},
			// 获取市
			changeHandler(e, mode = false) {
				if (this.type == 1) {return}
				// console.log('e', e);
				this.$api.getArea({
					pid: e.value[0].id
				}).then(res => {
					const {
						columnIndex,
						value,
						values, // values为当前变化列的数组内容
						index,
						// 微信小程序无法将picker实例传出来，只能通过ref操作
						picker = this.$refs.uPicker
					} = e
					// 当第一列值发生变化时，变化第二列(后一列)对应的选项
					if (columnIndex === 0 || mode) {
						picker.setColumnValues(1, res.data)
						let obj = {
							value: [{
								id: res.data[0].id
							}]
						}
						if (this.type == 3) {
							this.changeHandler2(obj, true)
						}
					} else if (columnIndex === 1 || mode) {
						let obj = {
							value: [{
								id: e.value[1].id
							}]
						}
						if (this.type == 3) {
							this.changeHandler2(obj, true)
						}
					}
				})

			},
			// 获取区
			changeHandler2(e, mode = false) {
				this.$api.getArea({
					pid: e.value[0].id
				}).then(res => {
					const {
						// 微信小程序无法将picker实例传出来，只能通过ref操作
						picker = this.$refs.uPicker
					} = e
					picker.setColumnValues(2, res.data)
				})

			},
		}
	}
</script>

<style lang="scss" scoped>
</style>