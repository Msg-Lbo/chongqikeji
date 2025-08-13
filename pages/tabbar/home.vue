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
                    <view class="icon"><u-icon name="car" :color="tab === 0 ? '#000000' : '#6B7280'" size="25"></u-icon>
                    </view>
                    <text>出行</text>
                </view>
                <view class="top-tab" :class="tab === 1 ? 'active' : ''" @click="tab = 1">
                    <view class="bg right" v-if="tab === 1"></view>
                    <view class="icon"><u-icon name="coupon" :color="tab === 1 ? '#000000' : '#6B7280'"
                            size="25"></u-icon></view>
                    <text>喂养</text>
                </view>
            </view>
            <view class="status-tabs" v-if="tab === 0">
                <view v-for="(it, i) in travelStatuses" :key="i" class="status-item flex flex-center"
                    :class="statusIndex === i ? 'active' : ''" @click="statusIndex = i">{{ it }}</view>
            </view>
            <view class="status-tabs" v-else>
                <view v-for="(it, i) in feedStatuses" :key="i" class="status-item flex flex-center"
                    :class="statusIndexFeed === i ? 'active' : ''" @click="statusIndexFeed = i">{{ it }}</view>
            </view>
            <view v-if="tab === 0" class="list-wrap">
                <c-scroll-list :api="travelApi" :apiParams="travelApiParams" @load="onTravelLoad" ref="travelList"
                    :option="scrollOption">
                    <view v-for="(o, idx) in travelRender" :key="idx" class="card">
                        <view class="row time-row flex align-center">
                            <view class="title flex align-center">
                                <text class="label">派单时间：</text>
                                <text class="val">{{ o.dispatchTime }}</text>
                            </view>
                            <view class="tags">已派单</view>
                        </view>
                        <view class="route">
                            <view class="addr">
                                <view class="addr-row flex align-center">
                                    <view class="point" style="background: #0F6EFF;"></view>
                                    <view class="addr-text flex align-center gap-10">
                                        <view class="tag mf-font-28" style=" color:#0F6EFF;">取
                                        </view>
                                        <view> {{ o.pickup }}</view>
                                    </view>
                                    <image class="call flex flex-center" @click="callPhone(o.phone)"
                                        src="/static/common/call.png"></image>
                                </view>
                                <image class="line" src="/static/common/line.png" />
                                <view class="addr-row flex align-center">
                                    <view class="point" style="background: #FF80B5;"></view>
                                    <view class="addr-text flex align-center gap-10">
                                        <view class="tag mf-font-28" style="color: #FF80B5;">送
                                        </view>
                                        <view>{{ o.dropoff }}</view>
                                    </view>

                                    <image class="call flex flex-center" @click="callPhone(o.phone)"
                                        src="/static/common/call.png"></image>
                                </view>
                            </view>
                        </view>
                        <view class="row flex align-center">
                            <text class="label" style="font-weight: 400; font-size: 28rpx;color: #625D5D;">取宠时间：</text>
                            <text class="val" style="font-weight: 600;font-size: 28rpx;color: #000;">{{ o.range
                            }}</text>
                        </view>
                        <view class="btns flex justify-between gap-20">
                            <view class="seeDetail" @click="seeDetail(o, 'travel')">
                                查看详情
                            </view>
                            <view class="go-btn" @click="seeDetail(o, 'travel')">
                                开始运送
                            </view>
                        </view>
                    </view>
                </c-scroll-list>
            </view>
            <view v-else class="list-wrap">
                <c-scroll-list :api="feedApi" :apiParams="feedApiParams" @load="onFeedLoad" ref="feedList"
                    :option="scrollOption">
                    <view v-for="(o, idx) in feedRender" :key="idx" class="card">
                        <view class="row time-row flex align-center">
                            <view class="title flex align-center">
                                <text class="label">派单时间：</text>
                                <text class="val">{{ o.dispatchTime }}</text>
                            </view>
                            <view class="tags">已派单</view>
                        </view>
                        <view class="route single">
                            <view class="addr">
                                <view class="addr-row flex align-center"
                                    style="align-items: flex-start !important;padding-left: 2rpx;">
                                    <u-icon name="map-fill" color="#3384FE" size="18"></u-icon>
                                    <view class="addr-text flex align-center gap-10">
                                        <view>{{ o.address }}</view>
                                    </view>
                                </view>
                                <view class="flex align-center gap-10 call-row">
                                    <image class="call flex flex-center" @click="callPhone(o.phone)"
                                        src="/static/common/call.png"></image>
                                    <view class="">联系客服</view>
                                </view>
                            </view>
                        </view>
                        <view class="row flex align-center">
                            <text class="label" style="font-weight: 400; font-size: 28rpx;color: #625D5D;">上门时间：</text>
                            <text class="val" style="font-weight: 600;font-size: 28rpx;color: #000;">{{ o.range
                                }}</text>
                        </view>
                        <view class="btns flex justify-between gap-20">
                            <view class="seeDetail" @click="seeDetail(o, 'travel')">
                                查看详情
                            </view>
                            <view class="go-btn" @click="seeDetail(o, 'travel')">
                                开始运送
                            </view>
                        </view>
                    </view>
                </c-scroll-list>
            </view>
        </section>
    </view>
</template>

<script>
export default {
    data() {
        return {
            travelApi: this.$api.noticeList,
            travelApiParams: {
                pageNum: 1,
                pageSize: 10,
            },
            feedApi: this.$api.noticeList,
            feedApiParams: {
                pageNum: 1,
                pageSize: 10,
            },
            tab: 0,
            statusIndex: 0,
            statusIndexFeed: 0,
            travelStatuses: ['已派单', '运送中', '已送达', '已取消'],
            feedStatuses: ['已派单', '服务中', '已完成', '已取消'],
            travelRender: [
                { dispatchTime: '2025-07-31 09:01:20', pickup: '成都市高兴区天府软件园E区1...', dropoff: '南海子公园南1门', range: '2025-07-31 9:00-18:00', phone: '10086' },
                { dispatchTime: '2025-07-31 09:01:20', pickup: '成都市高兴区天府软件园E区1...', dropoff: '南海子公园南1门', range: '2025-07-31 9:00-18:00', phone: '10086' },
                { dispatchTime: '2025-07-31 09:01:20', pickup: '成都市高兴区天府软件园E区1...', dropoff: '南海子公园南1门', range: '2025-07-31 9:00-18:00', phone: '10086' },
                { dispatchTime: '2025-07-31 09:01:20', pickup: '成都市高兴区天府软件园E区1...', dropoff: '南海子公园南1门', range: '2025-07-31 9:00-18:00', phone: '10086' }
            ],
            feedRender: [
                { dispatchTime: '2025-07-31 09:01:20', address: '青羊区西华门街19青羊区西华门街办公区5号楼8/9层', range: '2025-07-31 9:00-18:00', phone: '10086' },
                { dispatchTime: '2025-07-31 09:01:20', address: '青羊区西华门街19号青羊区办公区', range: '2025-07-31 9:00-18:00', phone: '10086' },
                { dispatchTime: '2025-07-31 09:01:20', address: '青羊区西华门街19号青羊区办公区', range: '2025-07-31 9:00-18:00', phone: '10086' },
                { dispatchTime: '2025-07-31 09:01:20', address: '青羊区西华门街19号青羊区办公区', range: '2025-07-31 9:00-18:00', phone: '10086' }
            ],

            scrollOption: {
                auto: false,
                background: '#F8F7F7',
            }
        }
    },
    // onShow() {
    //     this.$nextTick(() => {
    //         this.$refs.List.refresh();
    //     });
    // },
    methods: {
        onTravelLoad(res) {
        },
        onFeedLoad(res) {
        },
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
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: linear-gradient(180deg, #FED3ED 0%, rgba(216, 216, 216, 0) 100%);

    .content {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;

        .search-box {
            margin: 32rpx;
            margin-bottom: 36rpx;

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
                font-weight: 400;
                font-size: 32rpx;
                color: #6B7280;
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
                    color: #000000;
                    font-weight: 600;
                    font-size: 32rpx;

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
            display: flex;
            justify-content: space-between;
            padding: 23rpx 32rpx;

            padding-top: 28rpx;
            background: linear-gradient(to bottom, #fff 0%, #F8F7F7 100%);

            .status-item {
                width: 148rpx;
                height: 64rpx;
                background: #EDEDEB;
                border-radius: 16rpx;
                font-weight: 400;
                font-size: 28rpx;
                color: #000000;
                line-height: 64rpx;
            }

            .status-item.active {
                background: #FF80B5;
                border-radius: 16rpx 16rpx 16rpx 16rpx;
                font-weight: 400;
                font-size: 28rpx;
                color: #FFFFFF;
            }
        }

        .list-wrap {
            flex: 1;
            padding: 0 32rpx;
            background: #F8F7F7;
            box-sizing: border-box;
        }

        .card {
            margin-bottom: 24rpx;
            background: #FFFFFF;
            border-radius: 16rpx;
            padding: 22rpx;

            .row {
                display: flex;
                align-items: center;
                margin-bottom: 20rpx;
                margin-top: 10rpx;
            }

            .time-row {
                position: relative;

                .title {
                    flex: 1;

                    .label {
                        font-weight: 400;
                        font-size: 28rpx;
                        color: #625D5D;
                    }

                    .val {
                        font-weight: 600;
                        font-size: 28rpx;
                        color: #000;
                    }
                }

                .tags {
                    width: 96rpx;
                    height: 48rpx;
                    background: #EEF6FF;
                    border-radius: 8rpx;
                    font-size: 24rpx;
                    color: #0F6EFF;
                    line-height: 48rpx;
                    text-align: center;
                }
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
                background: #F8FAFB;
                padding: 0 30rpx;

                .line {
                    position: absolute;
                    top: 60rpx;
                    left: 29rpx;
                    height: 72rpx;
                    width: 14rpx;
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

            .call-row {
                font-weight: 400;
                font-size: 28rpx;
                color: #FF80B5;
                line-height: 40rpx;
                margin-bottom: 22rpx;

                image {
                    width: 40rpx;
                    height: 40rpx;
                }
            }

            .addr-text {
                flex: 1;
                margin-left: 15rpx;
                font-weight: 400;
                font-size: 28rpx;
                color: #333333;

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
                justify-content: flex-end;
                gap: 16rpx;
                margin-top: 10rpx;

                .seeDetail {
                    width: 176rpx;
                    height: 72rpx;
                    background: #F3F4F6;
                    border-radius: 16rpx;
                    font-weight: 400;
                    font-size: 28rpx;
                    color: #374151;
                    line-height: 72rpx;
                    text-align: center;
                }

                .go-btn {
                    width: 176rpx;
                    height: 72rpx;
                    background: rgba(255, 128, 181, 0.2);
                    border-radius: 16rpx;
                    font-weight: 500;
                    font-size: 28rpx;
                    color: #FF80B5;
                    line-height: 72rpx;
                    text-align: center;
                }
            }
        }
    }
}
</style>
