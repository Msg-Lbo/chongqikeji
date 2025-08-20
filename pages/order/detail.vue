<template>
    <view class="view">
        <section class="nav-bar">
            <c-navBar title="订单详情" isSeat isPerch :isBack="true"></c-navBar>
        </section>
        <section class="content">
            <view class="status flex flex-center flex-col">
                <view v-if="info.orderStatus === 3">
                    <u-image src="/static/common/order.png" width="90rpx" height="90rpx" mode="aspectFill"></u-image>
                    <text class="status-text mf-font-32 mf-weight-bold" style="color: #fff; margin-top: 26rpx">已派单</text>
                </view>
                <view v-if="info.orderStatus === 4">
                    <u-image src="/static/common/succ.png" width="90rpx" height="90rpx" mode="aspectFill"></u-image>
                    <text class="status-text mf-font-32 mf-weight-bold" style="color: #fff; margin-top: 26rpx">
                        {{ type == 'travel' ? '运送中' : '服务中' }}
                    </text>
                </view>
                <view v-if="info.orderStatus === 5">
                    <u-image src="/static/common/order2.png" width="90rpx" height="90rpx" mode="aspectFill"></u-image>
                    <text class="status-text mf-font-32 mf-weight-bold" style="color: #fff; margin-top: 26rpx">
                        {{ type == 'travel' ? '已送达' : '已完成' }}
                    </text>
                </view>
                <view v-if="info.orderStatus === 6">
                    <u-image src="/static/common/order3.png" width="90rpx" height="90rpx" mode="aspectFill"></u-image>
                    <text class="status-text mf-font-32 mf-weight-bold" style="color: #fff; margin-top: 26rpx">已取消</text>
                </view>
                <view class="box">
                    <view class="row time-row mf-font-28">
                        <text style="color: #625d5d">派单时间：</text>
                        <text style="color: #000000">{{ $u.timeFormat(info.driverTime, "yyyy-mm-dd hh:MM:ss") }}</text>
                    </view>
                    <view v-if="type === 'travel'" class="addr flex flex-col gap-20" style="margin-top: 20rpx">
                        <view class="addr-row flex align-center" @click="openNavigation(info.sendAddress, info.sendLat, info.sendLng)">
                            <view class="point" style="background: #0f6eff; margin-right: 20rpx"></view>
                            <view class="addr-text flex align-center gap-10">
                                <view class="tag flex flex-center mf-font-28" style="color: #0f6eff; background: #eef6ff">取</view>
                                <view class="address u-line-2">{{ info.sendAddress }}</view>
                            </view>
                        </view>
                        <view class="km flex align-center">
                            <u-icon name="map-fill" color="#0f6eff" size="32rpx"></u-icon>
                            <text class="km-text">{{ pickupKm }}km</text>
                        </view>
                        <!-- <image class="line" src="/static/common/line.png" /> -->
                        <view class="addr-row flex align-center" @click="openNavigation(info.takeAddress, info.takeLat, info.takeLng)">
                            <view class="point" style="background: #ff80b5; margin-right: 20rpx"></view>
                            <view class="addr-text flex align-center gap-10">
                                <view class="tag flex flex-center mf-font-28" style="color: #ff80b5; background: #ffecf4">送</view>
                                <view class="address u-line-2">{{ info.takeAddress }}</view>
                            </view>
                        </view>
                        <view class="km flex align-center">
                            <u-icon name="map-fill" color="#0f6eff" size="32rpx"></u-icon>
                            <text class="km-text">{{ dropKm }}km</text>
                        </view>
                    </view>
                    <view v-else>
                        <view class="addr-row" @click="openNavigation(info.takeAddress, info.takeLat, info.takeLng)">
                            <view class="addr mf-font-28" style="color: #333333">
                                <text class="address u-line-2">{{ info.takeAddress }}</text>
                                <view class="flex align-center gap-10" style="margin-top: 18rpx">
                                    <u-icon name="map-fill" color="#0f6eff" size="32rpx"></u-icon>
                                    <text class="km-text">{{ pickupKm }}km</text>
                                </view>
                            </view>
                        </view>
                    </view>
                    <view class="dash"></view>
                    <view class="flex flex-col gap-12 mf-font-28" v-if="type === 'travel'">
                        <view class="row flex align-center gap-10">
                            <text style="color: #625d5d">全程距离：</text>
                            <text style="color: #000000">{{ totalKm }}公里</text>
                        </view>
                        <view class="row flex align-center gap-10" v-if="info.startTime">
                            <text style="color: #625d5d">取宠时间：</text>
                            <text style="color: #000000">{{ $u.timeFormat(info.startTime, "yyyy-mm-dd hh:MM:ss") }}</text>
                        </view>
                        <view class="row flex align-center gap-10" v-if="info.driverTime">
                            <text style="color: #625d5d">接宠时间：</text>
                            <text style="color: #000000">{{ $u.timeFormat(info.driverTime, "yyyy-mm-dd hh:MM:ss") }}</text>
                        </view>
                        <view class="row flex align-center gap-10" v-if="info.completeTime">
                            <text style="color: #625d5d">送达时间：</text>
                            <text style="color: #000000">{{ $u.timeFormat(info.completeTime, "yyyy-mm-dd hh:MM:ss") }}</text>
                        </view>
                    </view>
                    <view class="flex flex-col gap-12 mf-font-28" v-else>
                        <view class="row flex align-center gap-10">
                            <text style="color: #625d5d">上门时间：</text>
                            <text style="color: #000000">{{ $u.timeFormat(info.driverTime, "yyyy-mm-dd hh:MM:ss") }}</text>
                        </view>
                        <view class="row flex align-center gap-10">
                            <text style="color: #625d5d">服务名称：</text>
                            <text style="color: #000000">{{ info.title || "--" }}</text>
                        </view>
                        <view class="row flex align-center gap-10">
                            <text style="color: #625d5d">服务内容：</text>
                            <text style="color: #000000">{{ info.remark || "--" }}</text>
                        </view>
                    </view>
                </view>
            </view>
            <view class="upload-image" v-if="info.orderStatus === 4">
                <view class="flex align-center" style="margin-bottom: 30rpx">
                    <text class="mf-font-32" style="color: #000">上传照片</text>
                    <text class="mf-font-28" style="color: #6b7280">（建议上传清晰的照片）</text>
                </view>
                <c-upLoadImgs accept="image" width="180rpx" height="180rpx" :file.sync="images" :maxCount="3" format="Array" @update:file="handleImageUpload" color="#192D5A">
                    <view class="upload-icon">
                        <u-icon name="camera-fill" size="60rpx" color="#9CA3AF"></u-icon>
                    </view>
                </c-upLoadImgs>
            </view>
            <view class="upload-image" v-if="info.orderStatus > 4 && orderImg && orderImg.length > 0">
                <view class="flex align-center" style="margin-bottom: 30rpx">
                    <text class="mf-font-32" style="color: #000">上传照片</text>
                    <text class="mf-font-28" style="color: #6b7280">（建议上传清晰的照片）</text>
                </view>
                <view class="imgs">
                    <image class="image" v-for="(item, index) in orderImg" :key="index" :src="vuex_imgUrl + item" mode="scaleToFill" />
                </view>
            </view>
        </section>
        <section class="footer" v-if="type === 'travel' && info.orderStatus <= 4">
            <u-button border="none" :customStyle="{
                background: '#FFE5F0',
                borderRadius: '16rpx',
                flex: '0 0 200rpx',
            }" @click="$fn.callPhone(info.takePhone)">
                <view class="flex align-center gap-10">
                    <view class="flex align-center" style="padding: 10rpx; background: #ff80b5; border-radius: 50%">
                        <u-icon name="phone-fill" size="24rpx" top="1" color="#fff"></u-icon>
                    </view>
                    <text class="mg-font-28">取宠人</text>
                </view>
            </u-button>
            <u-button border="none" :customStyle="{
                background: '#FFE5F0',
                borderRadius: '16rpx',
                flex: '0 0 200rpx',
            }" @click="$fn.callPhone(info.sendPhone)">
                <view class="flex align-center gap-10">
                    <view class="flex align-center" style="padding: 10rpx; background: #ff80b5; border-radius: 50%">
                        <u-icon name="phone-fill" size="24rpx" top="1" color="#fff"></u-icon>
                    </view>
                    <text class="mg-font-28">接宠人</text>
                </view>
            </u-button>
            <u-button border="none" :customStyle="{
                color: '#fff',
                background: '#FF80B5',
                borderRadius: '16rpx',
                flex: '1 1 auto',
            }" v-if="info.orderStatus === 3" @click="confirmOperate(0)">
                <text class="mg-font-28">开始运送</text>
            </u-button>
            <u-button border="none" :customStyle="{
                color: '#fff',
                background: '#FF80B5',
                borderRadius: '16rpx',
                flex: '1 1 auto',
            }" v-if="info.orderStatus === 4" @click="confirmOperate(1)">
                <text class="mg-font-28">已送达</text>
            </u-button>
        </section>
        <section class="feed flex align-center justify-end" v-else-if="info.orderStatus <= 4">
            <u-button border="none" :customStyle="{
                margin: 0,
                background: '#FFE5F0',
                borderRadius: '16rpx',
                width: '240rpx',
            }" @click="$fn.callPhone(info.takePhone)">
                <view class="flex align-center gap-10">
                    <view class="flex align-center" style="padding: 10rpx; background: #ff80b5; border-radius: 50%">
                        <u-icon name="phone-fill" size="24rpx" top="1" color="#fff"></u-icon>
                    </view>
                    <text class="mg-font-28">联系客户</text>
                </view>
            </u-button>
            <u-button border="none" :customStyle="{
                margin: 0,
                color: '#fff',
                background: '#FF80B5',
                borderRadius: '16rpx',
                width: '240rpx',
            }" v-if="info.orderStatus === 3" @click="confirmOperate(0)">
                <text class="mg-font-28">开始服务</text>
            </u-button>
            <u-button border="none" :customStyle="{
                margin: 0,
                color: '#fff',
                background: '#FF80B5',
                borderRadius: '16rpx',
                width: '240rpx',
            }" v-if="info.orderStatus === 4" @click="confirmOperate(1)">
                <text class="mg-font-28">完成服务</text>
            </u-button>
        </section>

        <!-- 新订单弹窗 -->
        <c-newOrderPopup :show="showNewOrderPopup" :orderInfo="newOrderInfo" @close="closeNewOrderPopup" @goToDetail="goToNewOrderDetail"></c-newOrderPopup>
        
        <!-- 导航选择弹窗 -->
        <c-navPop :show="showNavPop" :address="currentAddress" :latitude="currentLat" :longitude="currentLng" @close="closeNavPop" @select="handleNavSelect"></c-navPop>
    </view>
</template>

<script>
import websocketMixin from '@/store/websocket.mixin.js';

export default {
    mixins: [websocketMixin],
    data() {
        return {
            type: "travel",
            statusText: "已派单",
            statusCode: "",
            orderId: 0,
            driverLat: 0,
            driverLng: 0,
            info: {
                id: "",
                driverTime: "",
                orderStatus: "",
                orderTime: "",
                sendAddress: "",
                takeAddress: "",
                sendPhone: "",
                takePhone: "",
                distanceSta: 0,
                distanceEnd: 0,
                distanceOrder: 0,
            },
            pickupKm: "",
            dropKm: "",
            totalKm: "",
            images: [],
            orderImg: [],
            isFull: false, // 是否返回全路径图片地址
            showNavPop: false, // 导航选择弹窗显示状态
            currentAddress: '', // 当前选择的地址
            currentLat: '', // 当前选择的纬度
            currentLng: '', // 当前选择的经度
        };
    },
    computed: {
        actionText() {
            return this.type === "travel" ? "开始运送" : "开始服务";
        },
    },
    onLoad(options) {
        this.orderId = options.orderId || 0;
        this.driverLat = options.driverLat || 0;
        this.driverLng = options.driverLng || 0;
        this.type = options.type || "travel";
        console.log(this.type);

        if (this.orderId) {
            this.handleGetDetail({ orderId: this.orderId, driverLat: this.driverLat, driverLng: this.driverLng });
        }
    },
    methods: {
        // 处理图片上传
        handleImageUpload(fileList) {
            console.log("图片上传数据:", fileList);
            this.images = fileList;
        },
        statusMap(code) {
            const map = { 1: "待接单", 2: "已接单", 3: "已派单", 4: "进行中", 5: "已完成", 6: "已退款" };
            return map[String(code)] || "";
        },
        // 获取订单详情
        async handleGetDetail(params) {
            try {
                const res = await this.$api.driverOrderDetailApi(params);
                if (res.code === 200) {
                    this.info = res.data;
                    this.orderImg = res.data.orderImg ? JSON.parse(res.data.orderImg) : []
                    this.statusCode = String(res.data.orderStatus || "");
                    this.statusText = this.statusMap(this.statusCode);
                    this.pickupKm = res.data.distanceSta;
                    this.dropKm = res.data.distanceEnd;
                    this.totalKm = res.data.distanceOrder;
                }
            } catch (e) {
                console.log("订单详情获取失败", e);
                this.$fn.showToast("订单详情获取失败");
            }
        },
        // 确认操作
        confirmOperate(status) {
            uni.showModal({
                title: "提示",
                content: "确定要操作吗？",
                success: (res) => {
                    if (res.confirm) {
                        this.handleOrderOperate(status);
                    }
                },
            });
        },
        // 订单操作
        async handleOrderOperate(status) {
            try {
                let data = {
                    orderId: this.orderId,
                    operation: status,
                    orderImg: this.images,
                };
                if (status === 0) {
                    delete data.orderImg;
                }
                const res = await this.$api.driverOrderOperateApi(data);
                if (res.code === 200) {
                    this.$fn.showToast("操作成功");
                    setTimeout(() => {
                        this.handleGetDetail({ orderId: this.orderId, driverLat: this.driverLat, driverLng: this.driverLng });
                    }, 1000)
                }
            } catch (error) {
                console.log("订单操作失败", error);
                this.$fn.showToast("订单操作失败");
            }
        },
        // 打开导航选择弹窗
        openNavigation(address, lat, lng) {
            if (!address) {
                this.$fn.showToast("地址信息不完整");
                return;
            }
            this.currentAddress = address;
            this.currentLat = lat || '';
            this.currentLng = lng || '';
            this.showNavPop = true;
        },
        // 关闭导航选择弹窗
        closeNavPop() {
            this.showNavPop = false;
        },
        // 处理导航选择
        handleNavSelect(navType) {
            if (navType === 'amap') {
                this.openAmapNavigation();
            } else if (navType === 'baidu') {
                this.openBaiduNavigation();
            }
        },
        // 打开高德地图导航
        openAmapNavigation() {
            const address = this.currentAddress;
            const lat = this.currentLat;
            const lng = this.currentLng;
            
            // 优先使用坐标导航，其次使用地址搜索
            let url = '';
            if (lat && lng) {
                // 使用坐标导航
                url = `amapuri://route/plan/?dlat=${lat}&dlon=${lng}&dname=${encodeURIComponent(address)}&dev=0&t=0`;
            } else {
                // 使用地址搜索
                url = `amapuri://openFeature?featureName=Search&query=${encodeURIComponent(address)}`;
            }
            
            // #ifdef APP-PLUS
            plus.runtime.openURL(url, (err) => {
                if (err) {
                    console.log("打开高德地图失败:", err);
                    this.$fn.showToast("请安装高德地图应用");
                }
            });
            // #endif
            
            // #ifdef H5
            window.open(url);
            // #endif
            
            // #ifdef MP
            // 小程序环境下的处理
            this.$fn.showToast("请在App中使用导航功能");
            // #endif
        },
        // 打开百度地图导航
        openBaiduNavigation() {
            const address = this.currentAddress;
            const lat = this.currentLat;
            const lng = this.currentLng;
            
            // 优先使用坐标导航，其次使用地址搜索
            let url = '';
            if (lat && lng) {
                // 使用坐标导航
                url = `baidumap://map/direction?destination=latlng:${lat},${lng}|name:${encodeURIComponent(address)}&mode=driving`;
            } else {
                // 使用地址搜索
                url = `baidumap://map/place/search?query=${encodeURIComponent(address)}`;
            }
            
            // #ifdef APP-PLUS
            plus.runtime.openURL(url, (err) => {
                if (err) {
                    console.log("打开百度地图失败:", err);
                    this.$fn.showToast("请安装百度地图应用");
                }
            });
            // #endif
            
            // #ifdef H5
            window.open(url);
            // #endif
            
            // #ifdef MP
            // 小程序环境下的处理
            this.$fn.showToast("请在App中使用导航功能");
            // #endif
        },
    },
};
</script>

<style lang="scss" scoped>
.view {
    min-height: 100vh;
    background: linear-gradient(180deg, #fed3ed 0%, rgba(216, 216, 216, 0) 100%);

    .content {
        padding: 24rpx;

        .status {
            background: linear-gradient(180deg, #ff80b5 0%, #ffa4c6 20%, #ffdfed 50%, #ffdfed 100%);
            border-radius: 24rpx;
            padding: 24rpx;
            padding-bottom: 46rpx;

            .box {
                background: #fff;
                border-radius: 40rpx;
                padding: 30rpx 28rpx;
                width: 100%;
                margin-top: 52rpx;

                .addr {
                    flex: 1;
                    position: relative;
                    background: #f8fafb;
                    padding: 24rpx;
                    border-radius: 8rpx;
                    margin-top: 20rpx;

                    .line {
                        position: absolute;
                        top: 60rpx;
                        left: 29rpx;
                        height: 72rpx;
                        width: 14rpx;
                    }

                    .addr-row {
                        display: flex;
                        align-items: center;
                        cursor: pointer;
                        transition: opacity 0.2s;

                        &:active {
                            opacity: 0.7;
                        }

                        .point {
                            width: 12rpx;
                            height: 12rpx;
                            border-radius: 50%;
                        }

                        .addr-text {
                            flex: 1;
                            font-weight: 400;
                            font-size: 28rpx;
                            color: #333333;

                            .tag {
                                width: 50rpx;
                                height: 50rpx;
                                border-radius: 8rpx;
                            }

                            .address {
                                max-width: 450rpx;
                            }
                        }
                    }
                }

                .km {
                    margin-left: 90rpx;

                    .km-text {
                        margin-left: 6rpx;
                        color: #595959;
                        font-size: 24rpx;
                    }
                }

                .dash {
                    height: 2rpx;
                    margin: 24rpx 0;
                    background: repeating-linear-gradient(90deg, #f1bed1 0, #f1bed1 16rpx, transparent 16rpx, transparent 28rpx);
                    position: relative;

                    &::after,
                    &::before {
                        content: "";
                        width: 40rpx;
                        height: 40rpx;
                        border-radius: 50%;
                        position: absolute;
                        top: 50%;
                        transform: translateY(-50%);
                        background: #ffdfed;
                        z-index: 2;
                    }

                    &::after {
                        left: -44rpx;
                    }

                    &::before {
                        right: -44rpx;
                    }
                }
            }
        }

        .upload-image {
            margin-top: 20rpx;
            background: #fff;
            border-radius: 12rpx;
            padding: 20rpx 32rpx;

            .imgs {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 20rpx;

                .image {
                    width: 180rpx;
                    height: 180rpx;
                    border-radius: 12rpx;
                }
            }
        }
    }

    .footer {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 12rpx 24rpx 28rpx;
        padding-bottom: calc(env(safe-area-inset-bottom));
        background: rgba(255, 255, 255, 0.96);
        display: flex;
        gap: 16rpx;
    }

    .feed {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 12rpx 24rpx 28rpx;
        padding-bottom: calc(env(safe-area-inset-bottom));
        background: rgba(255, 255, 255, 0.96);
        gap: 20rpx;
    }
}
</style>
