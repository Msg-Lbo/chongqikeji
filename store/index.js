import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
let lifeData = {};
try {
	lifeData = uni.getStorageSync('lifeData');
} catch (e) {
}
let saveStateKeys = ['vuex_token'];
const saveLifeData = function (key, value) {
	if (saveStateKeys.indexOf(key) != -1) {
		let tmp = uni.getStorageSync('lifeData');
		tmp = tmp ? tmp : {};
		tmp[key] = value;
		uni.setStorageSync('lifeData', tmp);
	}
}
const store = new Vuex.Store({
	state: {
		vuex_encipher: true,
		vuex_token: lifeData.vuex_token || '',
		vuex_baseUrl: "https://chongqikeji.com/prod-api",
		// vuex_baseUrl: "https://chongqikeji.com/test-api",
		vuex_imgUrl: 'https://common-mfwl.obs.cn-southwest-2.myhuaweicloud.com',
	},
	getters: {
	},
	mutations: {
		$uStore(state, payload) {
			let nameArr = payload.name.split('.');
			let saveKey = '';
			let len = nameArr.length;
			if (len >= 2) {
				let obj = state[nameArr[0]];
				for (let i = 1; i < len - 1; i++) {
					obj = obj[nameArr[i]];
				}
				obj[nameArr[len - 1]] = payload.value;
				saveKey = nameArr[0];
			} else {
				state[payload.name] = payload.value;
				saveKey = payload.name;
			}
			saveLifeData(saveKey, state[saveKey])
		}
	}
})

export default store