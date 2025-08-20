class WebSocketManager {
    constructor() {
        this.socketTask = null;
        this.reconnectTimer = null;
        this.heartbeatTimer = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 10;
        this.reconnectInterval = 3000;
        this.heartbeatInterval = 30000; // 30秒心跳
        this.isConnecting = false;
        this.isDestroyed = false;
        this.messageHandlers = [];
        this.globalPopupState = {
            showNewOrderPopup: false,
            newOrderInfo: null
        };
    }

    // 添加消息处理器
    addMessageHandler(handler) {
        console.log('添加消息处理器:', handler.name || 'anonymous');
        this.messageHandlers.push(handler);
        console.log('当前处理器总数:', this.messageHandlers.length);
    }

    // 移除消息处理器
    removeMessageHandler(handler) {
        const index = this.messageHandlers.indexOf(handler);
        if (index > -1) {
            this.messageHandlers.splice(index, 1);
        }
    }

    // 连接WebSocket
    connect() {
        console.log('尝试连接WebSocket...');

        if (this.isDestroyed) {
            console.log('WebSocketManager已销毁，无法连接');
            return;
        }

        if (this.socketTask || this.isConnecting) {
            console.log('WebSocket已连接或正在连接中, socketTask:', !!this.socketTask, 'isConnecting:', this.isConnecting);
            return;
        }

        let userInfo;
        try {
            userInfo = uni.getStorageSync('userInfo');
        } catch (error) {
            console.error('获取用户信息失败:', error);
            return;
        }

        if (!userInfo || (!userInfo.deviceId && !userInfo.id)) {
            console.warn('用户信息不完整，无法连接WebSocket', userInfo);
            return;
        }

        this.isConnecting = true;
        // 优先使用 userInfo.id，如果没有则使用 deviceId
        const userId = userInfo.id || userInfo.deviceId;
        const socketUrl = 'wss://chongqikeji.com/wss/' + userId;
        console.log('正在连接WebSocket:', socketUrl);

        this.socketTask = uni.connectSocket({
            url: socketUrl,
            success: () => {
                console.log('WebSocket连接请求发送成功');
            },
            fail: (error) => {
                console.error('WebSocket连接请求失败:', error);
                this.isConnecting = false;
                this.scheduleReconnect();
            }
        });

        this.socketTask.onOpen(() => {
            console.log('WebSocket连接已打开');
            this.isConnecting = false;
            this.reconnectAttempts = 0;

            // 发送认证消息
            try {
                const currentUserInfo = uni.getStorageSync('userInfo');
                const deviceId = currentUserInfo?.id || currentUserInfo?.deviceId || '';
                this.sendMessage({
                    type: 'auth',
                    driverId: uni.getStorageSync('driverId') || '',
                    deviceId: deviceId
                });
                console.log('已发送认证消息, deviceId:', deviceId);
            } catch (error) {
                console.error('发送认证消息失败:', error);
            }

            // 开始心跳
            this.startHeartbeat();
        });

        this.socketTask.onMessage((res) => {
            console.log('收到WebSocket消息:', res);
            console.log('消息内容:', res.data);
            console.log('当前消息处理器数量:', this.messageHandlers.length);
            uni.hideTabBar()
            try {
                // 尝试解析 JSON 格式的消息
                let messageData = null;
                let isNewOrder = false;
                
                try {
                    messageData = JSON.parse(res.data);
                    console.log('解析的消息数据:', messageData);
                    
                    // 检查是否包含新订单信息
                    if (messageData.orderId && messageData.orderType !== undefined && messageData.message) {
                        isNewOrder = true;
                        console.log('检测到新订单消息，准备显示弹窗');
                    }
                } catch (parseError) {
                    console.log('消息解析失败，可能是非JSON格式:', parseError);
                   
                }
                
                if (isNewOrder && messageData) {
                    console.log('准备构造新订单数据，原始数据:', messageData);
                    
                    // 构造新订单数据
                    const newOrderData = {
                        type: 'newOrder',
                        orderInfo: {
                            id: messageData.orderId,
                            orderType: messageData.orderType || 0, // 0=运送订单, 1=喂养订单
                            message: messageData.message || "您有一个新订单"
                        }
                    };
                    
                    console.log('构造的新订单数据:', newOrderData);
                    
                    // 设置全局弹窗状态
                    this.setGlobalPopupState(true, newOrderData.orderInfo);
                    
                    // 分发消息给所有处理器
                    this.messageHandlers.forEach((handler, index) => {
                        if (typeof handler === 'function') {
                            console.log(`调用处理器 ${index}:`, handler.name || 'anonymous');
                            try {
                              
                                handler(newOrderData);
                            } catch (handlerError) {
                                console.error(`处理器 ${index} 执行失败:`, handlerError);
                            }
                        }
                    });
                } else {
                    console.log('非新订单消息，忽略处理');
                }
            } catch (error) {
                console.error('处理WebSocket消息失败:', error);
            }
        });

        this.socketTask.onClose((res) => {
            console.log('WebSocket连接已关闭:', res);
            this.socketTask = null;
            this.isConnecting = false;
            this.stopHeartbeat();

            // 如果不是主动关闭且未销毁，则尝试重连
            if (res.code !== 1000 && !this.isDestroyed) {
                this.scheduleReconnect();
            }
        });

        this.socketTask.onError((error) => {
            console.error('WebSocket错误:', error);
            this.isConnecting = false;
            this.scheduleReconnect();
        });
    }

    // 断开连接
    disconnect() {
        this.isDestroyed = true;

        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }

        this.stopHeartbeat();

        if (this.socketTask) {
            this.socketTask.close({
                code: 1000,
                reason: '主动断开连接'
            });
            this.socketTask = null;
        }
    }

    // 重新连接调度
    scheduleReconnect() {
        if (this.isDestroyed) {
            return;
        }

        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('达到最大重连次数，停止重连');
            return;
        }

        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
        }

        this.reconnectAttempts++;
        const delay = Math.min(this.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1), 60000); // 最大60秒

        console.log(`${delay / 1000}秒后进行第${this.reconnectAttempts}次重连`);

        this.reconnectTimer = setTimeout(() => {
            if (!this.isDestroyed) {
                this.connect();
            }
        }, delay);
    }

    // 开始心跳
    startHeartbeat() {
        this.stopHeartbeat();

        this.heartbeatTimer = setInterval(() => {
            if (this.socketTask && !this.isDestroyed) {
                this.sendMessage({
                    type: 'ping',
                    timestamp: Date.now()
                });
            }
        }, this.heartbeatInterval);
    }

    // 停止心跳
    stopHeartbeat() {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null;
        }
    }

    // 发送消息
    sendMessage(message) {
        if (this.socketTask && !this.isDestroyed) {
            this.socketTask.send({
                data: JSON.stringify(message),
                success: () => {
                    console.log('消息发送成功:', message);
                },
                fail: (error) => {
                    console.error('消息发送失败:', error);
                }
            });
        } else {
            console.warn('WebSocket未连接或已销毁，无法发送消息:', message);
        }
    }

    // 获取连接状态
    getStatus() {
        return {
            isConnected: !!this.socketTask,
            isConnecting: this.isConnecting,
            reconnectAttempts: this.reconnectAttempts,
            isDestroyed: this.isDestroyed,
            messageHandlersCount: this.messageHandlers.length
        };
    }

    // 全局弹窗状态管理
    setGlobalPopupState(show, orderInfo = null) {
        console.log('设置全局弹窗状态:', show, orderInfo);
        this.globalPopupState.showNewOrderPopup = show;
        this.globalPopupState.newOrderInfo = orderInfo;
        
        // 通知所有处理器更新弹窗状态
        this.messageHandlers.forEach((handler, index) => {
            if (typeof handler === 'function' && handler.updatePopupState) {
                try {
                    handler.updatePopupState(show, orderInfo);
                } catch (error) {
                    console.error(`处理器 ${index} 更新弹窗状态失败:`, error);
                }
            }
        });
    }

    // 获取全局弹窗状态
    getGlobalPopupState() {
        return this.globalPopupState;
    }

    // 关闭全局弹窗
    closeGlobalPopup() {
        console.log('关闭全局弹窗');
        this.setGlobalPopupState(false, null);
        // 显示tabbar
        uni.showTabBar();
    }

    // 测试方法：模拟接收消息
    simulateMessage(data) {
        console.log('模拟接收WebSocket消息:', data);
        console.log('当前处理器数量:', this.messageHandlers.length);

        // 直接调用消息处理逻辑
        this.messageHandlers.forEach((handler, index) => {
            if (typeof handler === 'function') {
                console.log(`调用模拟处理器 ${index}:`, handler.name || 'anonymous');
                try {
                    handler(data);
                } catch (handlerError) {
                    console.error(`模拟处理器 ${index} 执行失败:`, handlerError);
                }
            }
        });
    }

    // 测试方法：发送测试新订单消息
    testNewOrder() {
        const testMessage = {
            type: 'newOrder',
            orderInfo: {
                id: 'test_order_' + Date.now(),
                orderType: 0,
                sendAddress: '北京市朝阳区测试地址123号',
                takeAddress: '北京市海淀区测试目的地456号',
                orderTime: new Date().toISOString(),
                sendPhone: '13812345678',
                takePhone: '13987654321'
            }
        };
        this.simulateMessage(testMessage);
    }

        // 测试方法：模拟接收新格式的新订单消息
    testRealNewOrderMessage(orderType = 0) {
        console.log('模拟接收新格式新订单消息, orderType:', orderType);
        
        // 模拟新格式的 WebSocket 消息
        const mockEvent = {
            data: JSON.stringify({
                orderId: Date.now(),
                orderType: orderType, // 0=运送订单, 1=喂养订单
                message: orderType === 0 ? "您有一个新的出行订单，请及时处理" : "您有一个新的喂养订单，请及时处理"
            })
        };
        
        console.log('模拟WebSocket消息:', mockEvent);
        
        // 直接调用 onMessage 处理逻辑
        this.socketTask = { readyState: 1 }; // 模拟连接状态
        this.socketTask.onMessage = this.socketTask.onMessage || ((res) => {
            // 直接调用真实的消息处理逻辑
            console.log('收到WebSocket消息:', res);
            console.log('消息内容:', res.data);
            console.log('当前消息处理器数量:', this.messageHandlers.length);

            try {
                // 尝试解析 JSON 格式的消息
                let messageData = null;
                let isNewOrder = false;
                
                try {
                    messageData = JSON.parse(res.data);
                    console.log('解析的消息数据:', messageData);
                    
                    // 检查是否包含新订单信息
                    if (messageData.orderId && messageData.orderType !== undefined && messageData.message) {
                        isNewOrder = true;
                        console.log('检测到新订单消息，准备显示弹窗');
                    }
                } catch (parseError) {
                    console.log('消息解析失败，可能是非JSON格式:', parseError);
                }
                
                if (isNewOrder && messageData) {
                    console.log('准备构造新订单数据，原始数据:', messageData);
                    
                    // 构造新订单数据
                    const newOrderData = {
                        type: 'newOrder',
                        orderInfo: {
                            id: messageData.orderId || ('order_' + Date.now()),
                            orderType: messageData.orderType || 0, // 0=运送订单, 1=喂养订单
                            pickup: messageData.orderType === 0 ? '运送订单地址' : '喂养服务地址',
                            dropoff: messageData.orderType === 0 ? '运送订单目的地址' : '',
                            orderTime: new Date().toISOString(),
                            sendPhone: '13800138000',
                            takePhone: '13900139000',
                            message: messageData.message || "您有一个新订单"
                        }
                    };
                    
                    console.log('构造的新订单数据:', newOrderData);
                    
                    // 分发消息给所有处理器
                    this.messageHandlers.forEach((handler, index) => {
                        if (typeof handler === 'function') {
                            console.log(`调用处理器 ${index}:`, handler.name || 'anonymous');
                            try {
                                handler(newOrderData);
                            } catch (handlerError) {
                                console.error(`处理器 ${index} 执行失败:`, handlerError);
                            }
                        }
                    });
                } else {
                    console.log('非新订单消息，忽略处理');
                }
            } catch (error) {
                console.error('处理WebSocket消息失败:', error);
            }
        });
        
        // 触发消息处理
        this.socketTask.onMessage(mockEvent);
    }
    
    // 测试方法：模拟运送订单
    testTravelOrder() {
        this.testRealNewOrderMessage(0);
    }
    
    // 测试方法：模拟喂养订单
    testFeedOrder() {
        this.testRealNewOrderMessage(1);
    }
}

// 创建全局单例
const wsManager = new WebSocketManager();

export default wsManager;
