<template>
    <view v-if="show" class="new-order-popup" @touchmove.prevent style="transform: none; animation: none; transition: none;">
        <view class="popup-mask" @click="handleClose" style="transform: none; animation: none; transition: none;"></view>
        <view class="popup-content" @click.stop style="transform: none; animation: none; transition: none; scale: 1;">
            <view class="popup-header">
                <text class="popup-title">您有一个新订单</text>
            </view>
            <!-- <view class="popup-body">
                <view class="order-info">
                    <view class="info-row">
                        <text class="label">订单类型：</text>
                        <text class="value">{{ orderInfo.orderType === 0 ? '出行' : '喂养' }}</text>
                    </view>
                    <view class="info-row" v-if="orderInfo.pickup">
                        <text class="label">{{ orderInfo.orderType === 0 ? '取货地址：' : '服务地址：' }}</text>
                        <text class="value">{{ orderInfo.pickup }}</text>
                    </view>
                    <view class="info-row" v-if="orderInfo.dropoff && orderInfo.orderType === 0">
                        <text class="label">送达地址：</text>
                        <text class="value">{{ orderInfo.dropoff }}</text>
                    </view>
                    <view class="info-row" v-if="orderInfo.orderTime">
                        <text class="label">上门时间：</text>
                        <text class="value">{{ $u.timeFormat(orderInfo.orderTime, "yyyy-mm-dd hh:MM:ss") }}</text>
                    </view>
                </view>
            </view> -->
            <view class="popup-footer">
                <view class="btn-know" @click="handleClose">知道了</view>
                <view class="btn-view" @click="handleGoToDetail">去查看</view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    name: 'c-newOrderPopup',
    props: {
        show: {
            type: Boolean,
            default: false
        },
        orderInfo: {
            type: Object,
            default: () => ({
                id: '',
                orderType: 0,
                pickup: '',
                dropoff: '',
                orderTime: '',
                sendPhone: '',
                takePhone: '',
            })
        }
    },
    methods: {
        handleClose() {
            console.log('弹窗关闭事件触发');
            this.$emit('close');
        },
        
        handleGoToDetail() {
            console.log('去查看详情事件触发, 订单信息:', this.orderInfo);
            this.$emit('goToDetail', this.orderInfo);
        }
    },
    
    watch: {
        show(newVal) {
            console.log('弹窗显示状态变化:', newVal);
        },
        orderInfo(newVal) {
            console.log('订单信息变化:', newVal);
        }
    }
}
</script>

<style lang="scss" scoped>
.new-order-popup {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    min-height: 100vh;
    z-index: 999999;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: none;
    animation: none;
    transition: none;

    .popup-mask {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        min-height: 100vh;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1;
        transform: none;
        animation: none;
        transition: none;
    }

    .popup-content {
        position: relative;
        width: 500rpx;
        background: #ffffff;
        border-radius: 24rpx;
        padding: 40rpx;
        box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
        z-index: 2;
        transform: none;
        animation: none;
        transition: none;
        scale: 1;

        .popup-header {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 40rpx;

            .popup-title {
                font-weight: 600;
                font-size: 36rpx;
                color: #000000;
                text-align: center;
            }
        }

        .popup-body {
            margin-bottom: 40rpx;

            .order-info {
                .info-row {
                    display: flex;
                    align-items: flex-start;
                    margin-bottom: 20rpx;

                    .label {
                        min-width: 160rpx;
                        font-weight: 400;
                        font-size: 28rpx;
                        color: #666666;
                        line-height: 40rpx;
                    }

                    .value {
                        flex: 1;
                        font-weight: 500;
                        font-size: 28rpx;
                        color: #000000;
                        line-height: 40rpx;
                        word-break: break-all;
                    }
                }
            }
        }

        .popup-footer {
            display: flex;
            gap: 24rpx;

            .btn-know,
            .btn-view {
                flex: 1;
                height: 80rpx;
                border-radius: 16rpx;
                font-weight: 500;
                font-size: 32rpx;
                line-height: 80rpx;
                text-align: center;
                transform: none;
                animation: none;
                transition: none;
            }

            .btn-know {
                background: #f3f4f6;
                color: #374151;

                &:active {
                    background: #e5e7eb;
                }
            }

            .btn-view {
                background: #ff80b5;
                color: #ffffff;

                &:active {
                    background: #ff6ba3;
                }
            }
        }
    }
}

/* 确保弹窗内所有元素都没有动画效果 */
.new-order-popup * {
    transform: none !important;
    animation: none !important;
    transition: none !important;
    scale: 1 !important;
}
</style>
