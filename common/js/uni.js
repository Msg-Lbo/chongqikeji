// uni方法二次封装
import permision from "../../utils/permission.js"
/**
 * @description uni.showToast  Promise化，用.then()代替success里面的setTimeout
 */
export function showToast(title = '请传入{title}', icon = 'none', duration = 1500, mask = true) {
	uni.showToast({
		duration: duration,
		title: title,
		icon: icon,
		mask: mask,
	})
}

/**
 * @description uni.navigateTo  
 * @param String  url 跳转的页面路径
 * @param Boolean isLogin 是否需要登录
 * @param Boolean isDev 是否开发中
 */
export function jumpPage(url, isLogin = false, isDev = false) {
	let token = uni.getStorageSync('token')
	if (isDev) {
		uni.showToast({
			icon: "none",
			title: '功能开发中，敬请期待'
		})
		return
	}
	if (url) {
		if (isLogin && !token) {
			uni.showModal({
				content: "该模块需要登录,请前往登录后使用完整功能",
				confirmText: "确认",
				success: (res) => {
					if (res.confirm) {
						uni.reLaunch({
							url: '/pages/tabbar/login'
						})
					}
				}
			})
			return
		} else {
			uni.navigateTo({
				url,
				success(res) {
					// console.log('跳转res', res);
				},
				fail(err) {
					console.log("页面跳转失败:", err);

					// uni.reLaunch({ url: '/pages/tabbar/home' })
				}
			})
		}

	} else {
		uni.showToast({
			icon: "none",
			title: '功能未开放'
		})
	}
}

/**
 * @description uni.navigateBack  
 */
export function jumpBack() {
	uni.navigateBack({
		fail(err) {
			console.log("页面跳转失败:", err);
			uni.reLaunch({ url: '/pages/tabbar/home' })
		}
	})
}

/**
 * @description 获取当前定位
 * @returns {Promise<Object>} 定位信息
 */
export function getLocation() {
	return new Promise((resolve, reject) => {
		// #ifdef APP-PLUS
		permision.premissionCheck("LOCATION").then(result => {
			if (result == 1) {
				uni.getLocation({
					type: 'wgs84',
					geocode: true,
					success(res) {
						console.log("app定位信息：", res);
						resolve(res);
					},
					fail(err) {
						console.error("app定位信息出错：", err);
						reject(err);
					}
				});
			} else {
				reject(new Error('没有定位权限'));
			}
		}).catch(err => {
			reject(err);
		});
		// #endif

		// #ifndef APP-PLUS
		uni.getLocation({
			type: 'wgs84',
			success(res) {
				console.log("getLocation", res);
				resolve(res);
			},
			fail(err) {
				console.error("getLocation出错：", err);
				reject(err);
			}
		});
		// #endif
	});
}


/**
 * @description 打开地图选点
 * @returns {Object} 地址信息
 */
/**
 * @description 打开地图选点，用户可在地图上选择一个位置
 * @returns {Promise<Object>} 选中的地址信息
 */
export function chooseLocation() {
	return new Promise((resolve, reject) => {
		uni.chooseLocation({
			type: "gcj02",
			success: (res) => {
				// 返回选中的位置信息，包括名称、地址、经纬度等
				resolve(res)
			},
			fail: (err) => {
				console.log("地图选点失败:", err)
				reject(err)
			}
		})
	})
}

/**
 * @description 检查是否有定位权限，如果没有则提醒用户开启
 * @returns {Promise<boolean>} 是否有定位权限
 */
export function checkLocationPermission() {
	return new Promise((resolve, reject) => {
		uni.authorize({
			scope: 'scope.userLocation',
			success() {
				// 用户已授权
				resolve(true)
			},
			fail() {
				// 用户未授权或拒绝授权
				uni.showModal({
					title: '提示',
					content: '需要获取您的位置信息，请允许授权',
					confirmText: '前往设置',
					cancelText: '取消',
					success: (res) => {
						if (res.confirm) {
							uni.openSetting({
								success: (settingRes) => {
									if (settingRes.authSetting['scope.userLocation']) {
										uni.showToast({
											title: '授权成功',
											icon: 'success'
										})
										resolve(true)
									} else {
										uni.showToast({
											title: '授权失败',
											icon: 'none'
										})
										resolve(false)
									}
								},
								fail: () => {
									resolve(false)
								}
							})
						} else {
							uni.showToast({
								title: '您拒绝了授权',
								icon: 'none'
							})
							resolve(false)
						}
					}
				})
			}
		})
	})
}


/**
 * @description 拨打电话
 * @param {String} phone 电话号码
 * @returns {Promise<void>}
 */
export function callPhone(phone) {
	// #ifdef APP-PLUS
	// 检查拨打电话权限
	permision.premissionCheck("CALL_PHONE").then(result => {
		if (result == 1) {
			showCallDialog(phone);
		} else {
			uni.showToast({
				title: '没有电话权限',
				icon: 'none'
			});
		}
	}).catch(err => {
		console.error('权限检查失败:', err);
		showCallDialog(phone); // 权限检查失败时仍尝试拨打
	});
	// #endif
	
	// #ifndef APP-PLUS
	showCallDialog(phone);
	// #endif
}

/**
 * @description 显示拨打电话确认对话框
 * @param {String} phone 电话号码
 */
function showCallDialog(phone) {
	uni.showModal({
		title: '提示',
		content: '是否拨打' + phone + '?',
		confirmText: '拨打',
		cancelText: '取消',
		showCancel: true,
		success: (res) => {
			if (res.confirm) {
				uni.makePhoneCall({
					phoneNumber: phone,
					success: () => {
						return true
					},
					fail: (err) => {
						console.error('拨打电话失败:', err);
						uni.showModal({
							title: '拨打失败',
							content: '无法拨打电话，请检查网络或手动拨打',
							confirmText: '我知道了',
							showCancel: false,
						})
						return false
					}
				})
			}
		},
		fail: (err) => {
			console.error('显示对话框失败:', err);
			uni.showModal({
				title: '提示',
				content: '操作失败，请重试',
				confirmText: '我知道了',
				showCancel: false,
			})
			return false
		}
	})
}

/**
 * @description 图片选择并上传
 * @param {Number} num 上传数量
 * @returns {Promise<String>} 图片地址
 */
export function uploadImage(num) {
	return new Promise((resolve, reject) => {
		uni.chooseImage({
			count: num,
			sizeType: ['original', 'compressed'],
			sourceType: ['album', 'camera'],
			success: (res) => {
				uni.uploadFile({
					url: this.vuex_baseUrl + '/common/upload',
					filePath: res.tempFilePaths[0],
					name: 'file',
					success: (res) => {
						resolve(res.data)
					},
					fail: (err) => {
						reject(err)
					}
				})
			},
			fail: (err) => {
				reject(err)
			}
		})
	})
}