<template>
    <view class="view">
        <section class="nav-bar">
            <c-navBar title="订单详情" isSeat isPerch :isBack="true"></c-navBar>
        </section>
        <section class="content">
            <view class="status flex flex-center flex-col">
                <u-image src="/static/common/order.png" width="90rpx" height="90rpx" mode="aspectFill"></u-image>
                <text class="status-text mf-font-32 mf-weight-bold" style="color: #fff; margin-top: 26rpx">{{ statusText }}</text>
                <view class="box">
                    <view class="row time-row mf-font-28">
                        <text style="color: #625d5d">派单时间：</text>
                        <text style="color: #000000">{{ info.dispatchTime }}</text>
                    </view>
                    <view v-if="type === 'travel'" class="flex flex-col gap-20" style="margin-top: 20rpx">
                        <view class="addr-row flex align-start gap-14">
                            <u-tag text="取" type="primary" size="mini" plain></u-tag>
                            <view class="flex flex-col gap-18">
                                <view class="flex align-center gap-10">
                                    <text class="addr">{{ info.pickup }}</text>
                                </view>
                                <view class="km">
                                    <u-icon name="map" color="#FF80B5" size="16"></u-icon>
                                    <text class="km-text">{{ pickupKm }}</text>
                                </view>
                            </view>
                        </view>
                        <view class="addr-row flex align-start gap-14">
                            <u-tag text="送" type="error" size="mini" plain></u-tag>
                            <view class="flex flex-col gap-18">
                                <view class="flex align-center gap-10">
                                    <text class="addr">{{ info.dropoff }}</text>
                                </view>
                                <view class="km">
                                    <u-icon name="map" color="#FF80B5" size="16"></u-icon>
                                    <text class="km-text">{{ dropKm }}</text>
                                </view>
                            </view>
                        </view>
                    </view>
                    <view v-else>
                        <view class="addr-row">
                            <u-icon name="map" color="#3C3C3C" size="16"></u-icon>
                            <text class="addr">{{ info.address }}</text>
                            <view class="km">
                                <u-icon name="map" color="#FF80B5" size="16"></u-icon>
                                <text class="km-text">{{ pickupKm }}</text>
                            </view>
                        </view>
                    </view>
                    <view class="dash"></view>
                    <view class="flex flex-col gap-12 mf-font-28">
                        <view class="row flex align-center gap-10">
                            <text style="color: #625d5d">全程距离：</text>
                            <text style="color: #000000">{{ totalKm }}公里</text>
                        </view>
                        <view class="row flex align-center gap-10">
                            <text style="color: #625d5d">取宠时间：</text>
                            <text style="color: #000000">{{ info.range }}</text>
                        </view>
                    </view>
                </view>
            </view>
            <view class="upload-image">
                <view class="flex align-center" style="margin-bottom: 30rpx;">
                    <text class="mf-font-32" style="color: #000">上传照片</text>
                    <text class="mf-font-28" style="color: #6b7280">（建议上传清晰的照片）</text>
                </view>
                <c-upLoadImgs
                    accept="image"
                    width="180rpx"
                    height="180rpx"
                    :file.sync="images"
                    :isFull="isFull"
                    :maxCount="5"
                    format="Array"
                    @update:file="handleImageUpload"
                    color="#192D5A">
                    <view class="upload-icon">
                        <u-icon name="photo-fill" size="60rpx" color="#192D5A"></u-icon>
                    </view>
                </c-upLoadImgs>
            </view>
        </section>
        <section class="footer">
            <u-button
                border="none"
                :customStyle="{
                    background: '#FFE5F0',
                    borderRadius: '16rpx',
                    flex: '0 0 200rpx',
                }">
                <view class="flex align-center gap-10">
                    <view class="flex align-center" style="padding: 10rpx; background: #ff80b5; border-radius: 50%">
                        <u-icon name="phone-fill" size="24rpx" top="1" color="#fff"></u-icon>
                    </view>
                    <text class="mg-font-28">取宠人</text>
                </view>
            </u-button>
            <u-button
                border="none"
                :customStyle="{
                    background: '#FFE5F0',
                    borderRadius: '16rpx',
                    flex: '0 0 200rpx',
                }">
                <view class="flex align-center gap-10">
                    <view class="flex align-center" style="padding: 10rpx; background: #ff80b5; border-radius: 50%">
                        <u-icon name="phone-fill" size="24rpx" top="1" color="#fff"></u-icon>
                    </view>
                    <text class="mg-font-28">取宠人</text>
                </view>
            </u-button>
            <u-button
                border="none"
                :customStyle="{
                    color: '#fff',
                    background: '#FF80B5',
                    borderRadius: '16rpx',
                    flex: '1 1 auto',
                }">
                <text class="mg-font-28">开始运送</text>
            </u-button>
        </section>
    </view>
</template>

<script>
export default {
    data() {
        return {
            type: "travel",
            statusText: "已派单",
            info: { dispatchTime: "", pickup: "", dropoff: "", address: "", range: "" },
            pickupKm: "",
            dropKm: "",
            totalKm: "",
            images: [],
            isFull: true, // 是否返回全路径图片地址
        };
    },
    computed: {
        actionText() {
            return this.type === "travel" ? "开始运送" : "开始服务";
        },
    },
    onLoad(query) {
        const orderId = query.orderId || 0;
        const driverLat = query.driverLat || 0;
        const driverLng = query.driverLng || 0;
        if (orderId) {
            this.fetchDetail({ orderId, driverLat, driverLng });
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
        async fetchDetail(params) {
            try {
                const res = await this.$api.driverOrderDetailApi(params);
                const d = res?.data || {};
                this.statusText = this.statusMap(d.orderStatus);
                this.info.dispatchTime = d.driverTime || "";
                this.info.range = d.orderTime || "";
                this.info.pickup = d.sendAddress || "";
                this.info.dropoff = d.takeAddress || "";
                this.info.address = d.sendAddress || "";
                this.pickupKm = (d.distanceSta ?? "") + (d.distanceSta !== undefined ? "km" : "");
                this.dropKm = (d.distanceEnd ?? "") + (d.distanceEnd !== undefined ? "km" : "");
                this.totalKm = d.distanceOrder ?? "";
                this.type = "travel";
            } catch (e) {
                console.log("订单详情获取失败", e);
            }
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
                width: calc(100% - 48rpx);
                margin-top: 52rpx;

                .addr-row {
                    padding: 24rpx;
                    background: #f8fafb;
                    background-repeat: 8rpx;

                    .addr {
                        flex: 1;
                        margin-left: 10rpx;
                        color: #1a1a1a;
                        font-size: 28rpx;
                    }

                    .km {
                        display: flex;
                        align-items: center;

                        .km-text {
                            margin-left: 6rpx;
                            color: #595959;
                            font-size: 24rpx;
                        }
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
        }
    }

    .footer {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 12rpx 24rpx 28rpx;
        background: rgba(255, 255, 255, 0.96);
        display: grid;
        display: flex;
        gap: 16rpx;
    }
}
</style>
