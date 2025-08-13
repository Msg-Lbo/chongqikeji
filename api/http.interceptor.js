// 引入加密js
import { sm4 } from "sm-crypto";

// 响应参数解密的key值，应与后端加密key保持完全一致
const key = "e49a515a1cec7a1cf2340f3abe8f7001";

const toByteArr = (str) => {
    const byteArray = new Uint8Array(str.length / 2);
    for (let i = 0; i < byteArray.length; i++) {
        const index = i * 2;
        const byteString = str.substring(index, index + 2);
        byteArray[i] = parseInt(byteString, 16);
    }
    return byteArray;
};

// 此vm参数为页面的实例，可以通过它引用vuex中的变量
module.exports = (vm) => {
    // 初始化请求配置

    uni.$u.http.setConfig((config) => {
        /* config 为默认全局配置*/
        config.baseURL = vm.vuex_baseUrl;
        config.timeout = 50000;
        return config;
    });

    // 请求拦截
    uni.$u.http.interceptors.request.use(
        (config) => {
            // 可使用async await 做异步操作
            // 初始化请求拦截器时，会执行此方法，此时data为undefined，赋予默认{}
            // uni.showLoading({
            //     title: '加载中...',
            // });
            // console.log('拦截器',config);
            config.data = config.data || {};
            // 根据custom参数中配置的是否需要token，添加对应的请求头
            // if(config?.custom?.auth) {
            // 可以在此通过vm引用vuex中的变量，具体值在vm.$store.state中
            config.header = {
                Authorization: "Bearer " + vm.$store.state.vuex_token,
                "login-platform": "DRIVER_APP",
            };
            // console.log('拦截器', config);
            if (vm.vuex_encipher) {
                if (config.method.toLowerCase() === "post" || config.method.toLowerCase() === "put") {
                    try {
                        //加密前请求参数
                        console.log("加密前请求参数", config.data);
                        // 请求参数加密
                        const encryptData = sm4.encrypt(JSON.stringify(config.data), toByteArr(key));
                        config.data = {
                            text: encryptData,
                        };
                    } catch (e) {
                        //
                    }
                    const requestObj = {
                        url: config.url,
                        data: typeof config.data === "object" ? JSON.stringify(config.data) : config.data,
                        time: new Date().getTime(),
                    };
                }
            }

            // }
            return config;
        },
        (config) => {
            // 可使用async await 做异步操作
            return Promise.reject(config);
        },
    );
    // 响应拦截
    uni.$u.http.interceptors.response.use(
        (response) => {
            /* 对响应成功做点什么 可使用async await 做异步操作*/
            const data = response.data;
            // uni.hideLoading();
            // 自定义参数
            const custom = response.config?.custom;
            if (!data.code) {
                return data;
            }
            if (data.code == 401) {
                // uni.clearStorageSync()
                uni.$u.throttle(() => {
                    uni.showModal({
                        title: "提示",
                        content: "该模块需要登录,请前往登录后使用完整功能",
                        showCancel: true, // 是否显示取消按钮
                        success: (res) => {
                            if (res.confirm) {
                                setTimeout(function () {
                                    uni.navigateTo({
                                        url: "/pages/tabbar/login",
                                        fail(error) {
                                            console.log(error);
                                        },
                                    });
                                }, 1000);
                            } else if (res.cancel) {
                                // 用户点击了取消  以下 做取消操作
                            }
                        },
                        fail: (err) => {
                            console.log("弹窗失败:", err);
                        },
                    });
                }, 2000);
            } else if (data.code !== 200) {
                console.log(data);
                // 如果没有显式定义custom的toast参数为false的话，默认对报错进行toast弹出提示
                if (custom.toast !== false) {
                    uni.$u.toast(data.msg);
                }

                // 如果需要catch返回，则进行reject
                if (custom?.catch) {
                    return Promise.reject(data);
                } else {
                    // 否则返回一个pending中的promise，请求不会进入catch中
                    return new Promise(() => { });
                }
            }
            if (vm.vuex_encipher) {
                try {
                    if (typeof data.data === "string") {
                        let decryptedData = sm4.decrypt(toByteArr(data.data), toByteArr(key));
                        if (decryptedData.charAt(0) === "[" || decryptedData.charAt(0) === "{") {
                            decryptedData = JSON.parse(decryptedData);
                        }
                        //解密响应参数
                        console.log("解密响应参数", decryptedData);
                        return {
                            ...data,
                            data: decryptedData,
                        };
                    }
                } catch (e) {
                    return data;
                }
            }
            return data;
            // return data.data === undefined ? {} : data.data
        },
        (response) => {
            // console.log(response,'response++++')
            // 对响应错误做点什么 （statusCode !== 200）
            return response;
            // return Promise.reject(response)
        },
    );
};

