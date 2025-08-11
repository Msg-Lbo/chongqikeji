<template>
    <view class="view">
        <section class="nav-bar">
            <c-navBar title="我的订单" isSeat isPerch></c-navBar>
        </section>
        <section class="content">
            <view class="search-box">
                <view class="search-input flex align-center gap-12">
                    <u-icon name="search" color="#979797" size="44rpx"></u-icon>
                    <input type="text" placeholder="搜索我的订单" placeholder-style="color: #979797;" />
                </view>
            </view>
            <view class="top-tabs">
                <view class="top-tab" :class="tab === 0 ? 'active' : ''" @click="tab = 0">
                    <view class="bg" v-if="tab === 0"></view>
                    <view class="icon"><u-icon name="car" color="#3C3C3C" size="18"></u-icon></view>
                    <text>出行</text>
                </view>
                <view class="top-tab" :class="tab === 1 ? 'active' : ''" @click="tab = 1">
                    <view class="bg right" v-if="tab === 1"></view>
                    <view class="icon"><u-icon name="coupon" color="#3C3C3C" size="18"></u-icon></view>
                    <text>喂养</text>
                </view>
            </view>
            <view class="status-tabs" v-if="tab === 0">
                <view v-for="(it, i) in travelStatuses" :key="i" class="status-item flex flex-center" :class="statusIndex === i ? 'active' : ''" @click="statusIndex = i">{{ it }}</view>
            </view>
            <view class="status-tabs" v-else>
                <view v-for="(it, i) in feedStatuses" :key="i" class="status-item flex flex-center" :class="statusIndexFeed === i ? 'active' : ''" @click="statusIndexFeed = i">{{ it }}</view>
            </view>
            <view v-if="tab === 0" class="list-wrap">
                <view v-for="(o, idx) in travelOrders" :key="idx" class="card">
                    <view class="row time-row flex align-center">
                        <text class="label">派单时间：</text>
                        <text class="val">{{ o.dispatchTime }}</text>
                        <view class="tag"><u-tag text="已派单" size="mini" type="primary"></u-tag></view>
                    </view>
                    <view class="route">
                        <view class="addr">
                            <view class="addr-row flex align-center">
                                <view class="point" style="background: #0F6EFF;"></view>
                                <view class="addr-text flex align-center gap-10">
                                    <view class="tag mf-font-28" style="background: #EEF6FF60; color:#0F6EFF;">取</view>
                                    <text> {{ o.pickup }}</text>
                                </view>
                                <view class="call flex flex-center" @click="callPhone(o.phone)"><u-icon name="phone" color="#FF80B5" size="18"></u-icon></view>
                            </view>
                            <view class="line"></view>
                            <view class="addr-row flex align-center">
                                <view class="point" style="background: #FF80B5;"></view>
                                <view class="addr-text flex align-center gap-10">
                                    <view class="tag mf-font-28" style="background: #FFECF460; color: #FF80B5;">送</view>
                                    <text>{{ o.dropoff }}</text>
                                </view>
                                <view class="call flex flex-center" @click="callPhone(o.phone)"><u-icon name="phone" color="#FF80B5" size="18"></u-icon></view>
                            </view>
                        </view>
                    </view>
                    <view class="row flex align-center">
                        <text class="label">取宠时间：</text>
                        <text class="val">{{ o.range }}</text>
                    </view>
                    <view class="btns flex justify-between gap-20">
                        <u-button shape="circle" plain type="primary" size="small" @click="seeDetail(o, 'travel')">查看详情</u-button>
                        <u-button shape="circle" type="error" color="#FF80B5" size="small" @click="startTransport(o)">开始运送</u-button>
                    </view>
                </view>
            </view>
            <view v-else class="list-wrap">
                <view v-for="(o, idx) in feedOrders" :key="idx" class="card">
                    <view class="row time-row flex align-center">
                        <text class="label">派单时间：</text>
                        <text class="val">{{ o.dispatchTime }}</text>
                        <view class="tag"><u-tag text="已派单" size="mini" type="primary"></u-tag></view>
                    </view>
                    <view class="route single">
                        <view class="addr">
                            <view class="addr-row flex align-center">
                                <view class="point" style="background: #FF80B5;"></view>
                                <view class="addr-text flex align-center gap-10">
                                    <view class="tag mf-font-28" style="background: #FFECF460; color: #FF80B5;">址</view>
                                    <text>{{ o.address }}</text>
                                </view>
                                <view class="call flex flex-center" @click="callPhone(o.phone)"><u-icon name="phone" color="#FF80B5" size="18"></u-icon></view>
                            </view>
                        </view>
                    </view>
                    <view class="row flex align-center">
                        <text class="label">上门时间：</text>
                        <text class="val">{{ o.range }}</text>
                    </view>
                    <view class="btns flex justify-between gap-20">
                        <u-button shape="circle" plain type="primary" size="small" @click="seeDetail(o, 'feed')">查看详情</u-button>
                        <u-button shape="circle" type="error" color="#FF80B5" size="small" @click="startService(o)">开始服务</u-button>
                    </view>
                </view>
            </view>
        </section>
    </view>
</template>

<script>
export default {
    data() {
        return {
            tab: 0,
            statusIndex: 0,
            statusIndexFeed: 0,
            travelStatuses: ['已派单', '运送中', '已送达', '已取消'],
            feedStatuses: ['已派单', '服务中', '已完成', '已取消'],
            travelOrders: [
                { dispatchTime: '2025-07-31 09:01:20', pickup: '成都市高兴区天府软件园E区1...', dropoff: '南海子公园南1门', range: '2025-07-31 9:00-18:00', phone: '10086' },
                { dispatchTime: '2025-07-31 09:01:20', pickup: '成都市高兴区天府软件园E区1...', dropoff: '南海子公园南1门', range: '2025-07-31 9:00-18:00', phone: '10086' }
            ],
            feedOrders: [
                { dispatchTime: '2025-07-31 09:01:20', address: '青羊区西华门街19号某办公区5号楼8/9层', range: '2025-07-31 9:00-18:00', phone: '10086' },
                { dispatchTime: '2025-07-31 09:01:20', address: '青羊区西华门街19号青羊区办公区', range: '2025-07-31 9:00-18:00', phone: '10086' }
            ]
        }
    },
    methods: {
        seeDetail(o, type) {
            const q = type === 'travel' ? `type=travel&dispatchTime=${encodeURIComponent(o.dispatchTime)}&pickup=${encodeURIComponent(o.pickup)}&dropoff=${encodeURIComponent(o.dropoff)}&range=${encodeURIComponent(o.range)}` : `type=feed&dispatchTime=${encodeURIComponent(o.dispatchTime)}&address=${encodeURIComponent(o.address)}&range=${encodeURIComponent(o.range)}`
            uni.navigateTo({ url: `/pages/order/detail?${q}` })
        },
        startTransport(o) { },
        startService(o) { },
        callPhone(p) { uni.makePhoneCall({ phoneNumber: String(p) }) }
    }
}
</script>

<style lang="scss" scoped>
.view {
    min-height: 100vh;
    background: linear-gradient(180deg, #FED3ED 0%, rgba(216, 216, 216, 0) 100%);

    .content {
        // padding: 24rpx;

        .search-box {
            margin: 32rpx;

            .search-input {
                display: flex;
                align-items: center;
                background: #fff;
                border-radius: 16rpx;
                padding: 20rpx 26rpx;
                gap: 12rpx;

                input {
                    flex: 1;
                    font-family: Source Han Sans, Source Han Sans;
                    font-weight: 350;
                    font-size: 28rpx;
                    color: #979797;
                    line-height: 40rpx;
                }
            }
        }

        .top-tabs {
            margin-top: 8rpx;
            display: flex;
            background: #ffffff60;
            border-radius: 40rpx 40rpx 0 0;
            padding: 24rpx 0 16rpx 0;
            position: relative;

            .top-tab {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 16rpx 0;
                color: #808080;
                font-size: 28rpx;
                position: relative;
                z-index: 99;

                .bg {
                    position: absolute;
                    top: -38rpx;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: #fff;
                    padding: 30rpx 0;
                    border-radius: 40rpx 40rpx 0 0;
                    z-index: -1;
                    overflow: visible;

                    /* create rounded trapezoid extension on the right */
                    &::after {
                        content: '';
                        position: absolute;
                        top: 0;
                        right: -36rpx;
                        width: 120rpx;
                        height: 100%;
                        background: #fff;
                        transform: skewX(18deg);
                        border-top-right-radius: 40rpx;
                        border-bottom-right-radius: 0;
                    }
                }

                /* mirror extension for the right tab: extend white bg to the left */
                .bg.right {
                    &::after {
                        left: -36rpx;
                        right: auto;
                        transform: skewX(-18deg);
                        border-top-left-radius: 40rpx;
                        border-top-right-radius: 0;
                        border-bottom-left-radius: 0;
                    }
                }

                .icon {
                    margin-right: 8rpx;
                }

                &.active {
                    color: #1A1A1A;
                    font-weight: 700;


                    &::after {
                        content: '';
                        position: absolute;
                        bottom: -16rpx;
                        left: 50%;
                        transform: translateX(-50%) skewX(-22deg);
                        width: 120rpx;
                        height: 14rpx;
                        background: #FF80B5;
                        border-radius: 999rpx;
                    }
                }
            }
        }

        .status-tabs {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 32rpx;
            padding: 20rpx 0;
            background: #fff;
            padding-left: 24rpx;
            padding-right: 24rpx;

            .status-item {
                padding: 12rpx 22rpx;
                background: #F5F5F5;
                border-radius: 16rpx;
                color: #595959;
                font-size: 26rpx
            }

            .status-item.active {
                background: #FFE7F1;
                color: #FF80B5;
                font-weight: 700
            }
        }

        .list-wrap {
            padding: 8rpx 24rpx 24rpx;
            background: #fff;
        }

        .card {
            background: #fff;
            border-radius: 16rpx;
            padding: 20rpx;
            box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.04);
            margin-bottom: 20rpx;

            .row {
                display: flex;
                align-items: center;
                margin-bottom: 14rpx
            }

            .time-row {
                position: relative
            }

            .label {
                color: #808080;
                font-size: 26rpx
            }

            .val {
                color: #1A1A1A;
                font-size: 28rpx;
                margin-left: 8rpx
            }

            .route {
                display: flex;
                padding: 8rpx 0 12rpx
            }

            .route.single {
                padding-bottom: 4rpx
            }

            .dot {
                width: 8rpx;
                height: 8rpx;
                background: #3CA0FF;
                border-radius: 50%;
                margin: 18rpx 16rpx 0 8rpx
            }

            .addr {
                flex: 1;
                position: relative;

                .line {
                    position: absolute;
                    top: 70rpx;
                    left: 4rpx;
                    height: 60rpx;
                    width: 5rpx;
                    background: #D8D8D8;
                }
            }

            .addr-row {
                display: flex;
                align-items: center;
                padding: 20rpx 0;

                .point {
                    width: 12rpx;
                    height: 12rpx;
                    border-radius: 50%;
                }
            }

            .addr-text {
                flex: 1;
                margin-left: 10rpx;
                color: #1A1A1A;
                font-size: 28rpx;

                .tag {
                    padding: 10rpx;
                    border-radius: 8rpx;
                }
            }

            .call {
                width: 44rpx;
                height: 44rpx;
                border-radius: 50%;
                background: #FFF0F6;
                display: flex;
                align-items: center;
                justify-content: center
            }

            .link {
                color: #FF80B5
            }

            .link-text {
                margin-left: 8rpx;
                color: #FF80B5
            }

            .btns {
                display: flex;
                justify-content: space-between;
                gap: 20rpx;
                margin-top: 10rpx
            }
        }
    }
}
</style>
