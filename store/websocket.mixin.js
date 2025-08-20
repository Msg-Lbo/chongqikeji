import wsManager from './websocket.manager.js';

export default {
    data() {
        return {
            showNewOrderPopup: false,
            newOrderInfo: {
                id: '',
                orderType: 0,
                pickup: '',
                dropoff: '',
                orderTime: '',
                sendPhone: '',
                takePhone: '',
            },
            _boundWebSocketHandler: null,
        };
    },

    onShow() {
        console.log('页面onShow - 当前页面:', this.$options.name || 'unknown');

        // 如果是登录页面，不连接WebSocket
        if (this.isLoginPage()) {
            console.log('登录页面，跳过WebSocket连接');
            return;
        }

        console.log('准备初始化WebSocket...');

        // 只有在没有绑定处理器时才绑定，避免重复绑定
        if (!this._boundWebSocketHandler) {
            // 绑定消息处理器的this上下文
            const boundHandler = this.handleWebSocketMessage.bind(this);
            // 绑定弹窗状态更新方法
            boundHandler.updatePopupState = this.updatePopupState.bind(this);
            this._boundWebSocketHandler = boundHandler;

            // 添加消息处理器
            wsManager.addMessageHandler(boundHandler);
            console.log('已添加WebSocket消息处理器');
        } else {
            console.log('WebSocket消息处理器已存在，跳过添加');
        }

        // 连接WebSocket
        wsManager.connect();

        console.log('WebSocket初始化完成');
    },

    onHide() {
        // 页面隐藏时保持连接，但可以移除消息处理器以减少不必要的处理
        // wsManager.removeMessageHandler(this.handleWebSocketMessage);
    },

    onUnload() {
        // 如果是登录页面，不需要处理WebSocket
        if (this.isLoginPage()) {
            return;
        }

        // 移除消息处理器
        if (this._boundWebSocketHandler) {
            wsManager.removeMessageHandler(this._boundWebSocketHandler);
            this._boundWebSocketHandler = null;
        }
    },

    onLoad() {
        // 页面加载时同步全局弹窗状态
        try {
            const globalState = wsManager.getGlobalPopupState();
            if (globalState.showNewOrderPopup && globalState.newOrderInfo) {
                this.showNewOrderPopup = true;
                this.newOrderInfo = {
                    id: globalState.newOrderInfo.id || '',
                    orderType: globalState.newOrderInfo.orderType || 0,
                    pickup: globalState.newOrderInfo.sendAddress || globalState.newOrderInfo.pickup || '',
                    dropoff: globalState.newOrderInfo.takeAddress || globalState.newOrderInfo.dropoff || '',
                    orderTime: globalState.newOrderInfo.orderTime || '',
                    sendPhone: globalState.newOrderInfo.sendPhone || '',
                    takePhone: globalState.newOrderInfo.takePhone || '',
                };
                uni.hideTabBar();
            }
        } catch (error) {
            console.error('同步全局弹窗状态失败:', error);
        }
    },

    methods: {
        isLoginPage() {
            try {
                // 获取当前页面路径
                const pages = getCurrentPages();
                if (!pages || pages.length === 0) {
                    return false;
                }
                const currentPage = pages[pages.length - 1];
                return currentPage && currentPage.route === 'pages/tabbar/login';
            } catch (error) {
                console.warn('获取当前页面失败:', error);
                return false;
            }
        },

        sendMessage(message) {
            wsManager.sendMessage(message);
        },

        getWebSocketStatus() {
            return wsManager.getStatus();
        },

        // 测试方法：手动触发新订单弹窗
        testNewOrderPopup() {
            console.log('测试新订单弹窗');
            const testOrderInfo = {
                id: 'test_' + Date.now(),
                orderType: 0,
                sendAddress: '测试取货地址123号',
                takeAddress: '测试送达地址456号',
                orderTime: new Date().toISOString(),
                sendPhone: '13812345678',
                takePhone: '13987654321'
            };
            this.showNewOrder(testOrderInfo);
        },

        // 测试方法：模拟WebSocket消息
        testWebSocketMessage(messageType = 'newOrder') {
            console.log('测试WebSocket消息:', messageType);
            const testData = {
                type: messageType,
                orderInfo: {
                    id: 'test_' + Date.now(),
                    orderType: Math.random() > 0.5 ? 0 : 1,
                    sendAddress: '测试地址' + Math.floor(Math.random() * 100),
                    takeAddress: '测试目的地' + Math.floor(Math.random() * 100),
                    orderTime: new Date().toISOString(),
                    sendPhone: '138' + Math.floor(Math.random() * 100000000),
                    takePhone: '139' + Math.floor(Math.random() * 100000000)
                }
            };
            this.handleWebSocketMessage(testData);
        },

        handleWebSocketMessage(data) {
            console.log('处理WebSocket消息 - 页面:', this.$options.name || 'unknown', '数据:', data);

            try {
                if (!data || !data.type) {
                    console.warn('收到无效的WebSocket消息:', data);
                    return;
                }

                // 确保在Vue实例上下文中执行
                if (!this || typeof this.$set !== 'function') {
                    console.warn('WebSocket消息处理器上下文不正确');
                    return;
                }

                console.log('处理消息类型:', data.type);

                switch (data.type) {
                    case 'newOrder':
                        console.log('处理新订单消息:', data.orderInfo);
                        this.showNewOrder(data.orderInfo);
                        break;
                    case 'orderUpdate':
                        console.log('处理订单更新消息:', data.orderInfo);
                        this.handleOrderUpdate(data.orderInfo);
                        break;
                    case 'pong':
                        console.log('收到心跳响应');
                        break;
                    default:
                        console.log('未知消息类型:', data.type);
                }
            } catch (error) {
                console.error('处理WebSocket消息失败:', error);
            }
        },

        // 全局弹窗状态更新处理器
        updatePopupState(show, orderInfo) {
            console.log('更新弹窗状态 - 页面:', this.$options.name || 'unknown', 'show:', show, 'orderInfo:', orderInfo);
            this.showNewOrderPopup = show;
            if (orderInfo) {
                this.newOrderInfo = {
                    id: orderInfo.id || '',
                    orderType: orderInfo.orderType || 0,
                    pickup: orderInfo.sendAddress || orderInfo.pickup || '',
                    dropoff: orderInfo.takeAddress || orderInfo.dropoff || '',
                    orderTime: orderInfo.orderTime || '',
                    sendPhone: orderInfo.sendPhone || '',
                    takePhone: orderInfo.takePhone || '',
                };
            }
        },

        showNewOrder(orderInfo) {
            console.log('showNewOrder 被调用 - 页面:', this.$options.name || 'unknown');
            console.log('订单信息:', orderInfo);

            try {
                if (!orderInfo) {
                    console.warn('订单信息为空');
                    return;
                }

                this.newOrderInfo = {
                    id: orderInfo.id || '',
                    orderType: orderInfo.orderType || 0,
                    pickup: orderInfo.sendAddress || orderInfo.pickup || '',
                    dropoff: orderInfo.takeAddress || orderInfo.dropoff || '',
                    orderTime: orderInfo.orderTime || '',
                    sendPhone: orderInfo.sendPhone || '',
                    takePhone: orderInfo.takePhone || '',
                };

                console.log('设置弹窗显示状态为 true');
                this.showNewOrderPopup = true;

                console.log('当前弹窗状态:', this.showNewOrderPopup);

                // 播放提示音和震动
                try {
                    uni.vibrateShort();
                    console.log('震动提醒执行成功');
                } catch (e) {
                    console.warn('震动功能不可用:', e);
                }


            } catch (error) {
                console.error('显示新订单失败:', error);
            }
        },

        handleOrderUpdate(orderInfo) {
            // 处理订单更新
            console.log('订单更新 - 页面:', this.$options.name || 'unknown');
            console.log('订单更新信息:', orderInfo);

            // 如果当前页面有刷新订单列表的方法，则调用
            if (this.refreshOrderList && typeof this.refreshOrderList === 'function') {
                console.log('调用页面刷新方法');
                this.refreshOrderList();
            } else {
                console.log('当前页面没有refreshOrderList方法');

                // 尝试其他刷新方法
                if (this.$refs && this.$refs.travelList && this.$refs.travelList.refresh) {
                    console.log('使用travelList组件刷新');
                    this.$refs.travelList.refresh();
                }
            }
        },

        closeNewOrderPopup() {
            console.log('关闭新订单弹窗 - 页面:', this.$options.name || 'unknown');
            // 调用全局关闭方法
            wsManager.closeGlobalPopup();
        },

        goToNewOrderDetail(orderInfo) {
            console.log('goToNewOrderDetail 被调用 - 页面:', this.$options.name || 'unknown');
            console.log('传入的订单信息:', orderInfo);

            try {
                // 调用全局关闭方法
                wsManager.closeGlobalPopup();
                console.log('已关闭弹窗');

                const orderToUse = orderInfo || this.newOrderInfo;
                console.log('使用的订单信息:', orderToUse);

                if (!orderToUse || !orderToUse.id) {
                    console.warn('订单信息不完整，无法跳转');
                    uni.showToast({
                        title: '订单信息不完整',
                        icon: 'none'
                    });
                    return;
                }

                const orderType = orderToUse.orderType === 0 ? 'travel' : 'feed';
                console.log('订单类型:', orderType, '(0=运送, 1=喂养)');

                // 获取位置信息，优先使用存储的位置
                let driverLat = 0;
                let driverLng = 0;

                try {
                    const storedLocation = uni.getStorageSync('driverLocation');
                    if (storedLocation && storedLocation.latitude && storedLocation.longitude) {
                        driverLat = storedLocation.latitude;
                        driverLng = storedLocation.longitude;
                        console.log('使用存储的位置信息:', driverLat, driverLng);
                    } else if (this.driverLat && this.driverLng) {
                        driverLat = this.driverLat;
                        driverLng = this.driverLng;
                        console.log('使用页面的位置信息:', driverLat, driverLng);
                    } else {
                        console.warn('未找到位置信息，使用默认值0');
                    }
                } catch (locationError) {
                    console.error('获取位置信息失败:', locationError);
                }

                const q = `orderId=${orderToUse.id}&driverLat=${driverLat}&driverLng=${driverLng}&type=${orderType}`;
                console.log('跳转参数:', q);

                uni.navigateTo({
                    url: `/pages/order/detail?${q}`,
                    success: () => {
                        console.log('页面跳转成功');
                    },
                    fail: (error) => {
                        console.error('页面跳转失败:', error);
                        uni.showToast({
                            title: '页面跳转失败',
                            icon: 'none'
                        });
                    }
                });

                // 刷新订单列表
                if (this.refreshOrderList && typeof this.refreshOrderList === 'function') {
                    console.log('调用refreshOrderList方法');
                    this.refreshOrderList();
                } else {
                    console.log('当前页面没有refreshOrderList方法，尝试其他刷新方式');

                    // 尝试其他刷新方法
                    if (this.$refs && this.$refs.travelList && this.$refs.travelList.refresh) {
                        console.log('使用travelList组件刷新');
                        this.$refs.travelList.refresh();
                    }
                }
            } catch (error) {
                console.error('跳转订单详情失败:', error);
            }
        },
    }
};
