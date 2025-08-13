<template>
    <view class="view">
        <section class="nav-bar">
            <c-navBar title="我的订单" isSeat isPerch></c-navBar>
        </section>
        <section class="content">
            <view class="search-box">
                <view class="search-input flex align-center gap-12">
                    <u-icon name="search" color="#979797" size="44rpx"></u-icon>
                    <input
                        type="text"
                        v-model="travelApiParams.keyword"
                        confirm-type="search"
                        @confirm="handleSearch"
                        @input="handleInput"
                        placeholder="搜索我的订单"
                        placeholder-style="color: #979797;" />
                </view>
            </view>
            <view class="top-tabs">
                <view class="top-tab" :class="tab === 0 ? 'active' : ''" @click="handleChangeTab(0)">
                    <view class="bg" v-if="tab === 0"></view>
                    <view class="icon">
                        <u-icon name="car" :color="tab === 0 ? '#000000' : '#6B7280'" size="25"></u-icon>
                    </view>
                    <text>出行</text>
                </view>
                <view class="top-tab" :class="tab === 1 ? 'active' : ''" @click="handleChangeTab(1)">
                    <view class="bg right" v-if="tab === 1"></view>
                    <view class="icon">
                        <u-icon name="coupon" :color="tab === 1 ? '#000000' : '#6B7280'" size="25"></u-icon>
                    </view>
                    <text>喂养</text>
                </view>
            </view>
            <view class="status-tabs">
                <view
                    v-for="(it, i) in tab === 0 ? travelStatuses : feedStatuses"
                    :key="i"
                    class="status-item flex flex-center"
                    :class="statusIndex === i ? 'active' : ''"
                    @click="handleChangeStatus(i)">
                    {{ it }}
                </view>
            </view>
            <view class="list-wrap">
                <c-scroll-list :api="travelApi" :apiParams="travelApiParams" @load="onTravelLoad" ref="travelList" :option="scrollOption">
                    <view v-for="(o, idx) in travelRender" :key="idx" class="card">
                        <view class="row time-row flex align-center">
                            <view class="title flex align-center">
                                <text class="label">派单时间：</text>
                                <text class="val">{{ $u.timeFormat(o.dispatchTime, "yyyy-mm-dd hh:MM:ss") }}</text>
                            </view>
                            <view class="tags">已派单</view>
                        </view>
                        <view class="route">
                            <view class="addr" v-if="tab === 0">
                                <view class="addr-row flex align-center">
                                    <view class="point" style="background: #0f6eff"></view>
                                    <view class="addr-text flex align-center gap-10">
                                        <view class="tag mf-font-28" style="color: #0f6eff">取 </view>
                                        <view> {{ o.pickup }}</view>
                                    </view>
                                    <image class="call flex flex-center" @click="callPhone(o.takePhone)" src="/static/common/call.png">
                                    </image>
                                </view>
                                <image class="line" src="/static/common/line.png" />
                                <view class="addr-row flex align-center">
                                    <view class="point" style="background: #ff80b5"></view>
                                    <view class="addr-text flex align-center gap-10">
                                        <view class="tag mf-font-28" style="color: #ff80b5">送 </view>
                                        <view>{{ o.dropoff }}</view>
                                    </view>
                                    <image class="call flex flex-center" @click="callPhone(o.sendPhone)" src="/static/common/call.png">
                                    </image>
                                </view>
                            </view>
                            <!-- 喂养 -->
                            <view class="addr" v-if="tab === 1">
                                <view class="addr-row flex align-center">
                                    <view class="addr-text flex align-center gap-10" style="margin-left: 5rpx">
                                        <u-icon name="map-fill" size="32rpx" color="#3384FE"></u-icon>
                                        <view> {{ o.pickup }}</view>
                                    </view>
                                </view>
                                <view class="addr-row flex align-center gap-10" @click="callPhone(o.takePhone)">
                                    <image class="call flex flex-center" src="/static/common/call.png"> </image>
                                    <text class="mf-font-28" style="color: #ff80b5">联系客户</text>
                                </view>
                            </view>
                        </view>
                        <view class="row flex align-center">
                            <text class="label" style="font-weight: 400; font-size: 28rpx; color: #625d5d">上门时间：</text>
                            <text class="val" style="font-weight: 600; font-size: 28rpx; color: #000">
                                {{ $u.timeFormat(o.range, "yyyy-mm-dd hh:MM:ss") }}
                            </text>
                        </view>
                        <view class="btns flex justify-between gap-20">
                            <view class="seeDetail" @click="seeDetail(o, 'travel')"> 查看详情 </view>
                            <view class="go-btn" @click="seeDetail(o, 'travel')"> 开始服务 </view>
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
            travelApi: this.$api.orderListApi,
            travelApiParams: {
                pageNum: 1,
                pageSize: 10,
                orderStatus: 3, // 订单状态(3=已派单，4=进行中,5=已完成,6=已退款)
                orderType: 0, // 订单类型(0=出行,1=喂养)
                keyword: "",
            },
            tab: 0,
            statusIndex: 0,
            statusIndexFeed: 0,
            travelStatuses: ["已派单", "运送中", "已送达", "已取消"],
            feedStatuses: ["已派单", "服务中", "已完成", "已取消"],
            list: [],
            scrollOption: {
                auto: true,
                background: "#F8F7F7",
                refreshDelayed: 0,
                refreshFinishDelayed: 0,
            },
            driverLat: 0,
            driverLng: 0,
        };
    },
    computed: {
        travelRender() {
            if (!Array.isArray(this.list)) return [];
            return this.list.map((item) => {
                return {
                    id: item.id,
                    dispatchTime: item.driverTime,
                    pickup: item.sendAddress,
                    dropoff: item.takeAddress,
                    range: item.orderTime,
                    sendPhone: item.sendPhone,
                    takePhone: item.takePhone,
                };
            });
        },
    },
    onShow() {
        this.handleGetLocation();
    },
    methods: {
        handleInput(e) {
            console.log(e);

            if (e.detail.value.length == 0) {
                this.travelApiParams.keyword = "";
                this.list = [];
                this.travelApiParams.pageNum = 1;
                this.$refs.travelList.refresh();
            }
        },
        handleSearch() {
            this.list = [];
            this.travelApiParams.pageNum = 1;
            this.$refs.travelList.refresh();
        },
        handleChangeTab(i) {
            this.list = [];
            this.tab = i;
            this.travelApiParams.pageNum = 1;
            this.travelApiParams.orderType = i;
            this.travelApiParams.keyword = this.searchValue;
            this.$refs.travelList.refresh();
        },
        handleChangeStatus(i) {
            this.list = [];
            this.statusIndex = i;
            this.travelApiParams.pageNum = 1;
            this.travelApiParams.orderStatus = i + 3;
            this.travelApiParams.keyword = this.searchValue;
            this.$refs.travelList.refresh();
        },
        // 获取经纬度
        async handleGetLocation() {
            try {
                const res = await this.$fn.getLocation();
                if (res.latitude && res.longitude) {
                    this.driverLat = res.latitude
                    this.driverLng = res.longitude
                }
            } catch (error) {
                console.error();
                this.$fn.showToast("获取经纬度失败");
            }
        },
        onTravelLoad(res) {
            this.list = res.list;
        },
        seeDetail(o, type) {
            const q = `orderId=${o.id}&driverLat=${this.driverLat || 0}&driverLng=${this.driverLng || 0}`
            uni.navigateTo({ url: `/pages/order/detail?${q}` })
        },
        startTransport(o) {},
        startService(o) {},
        callPhone(p) {
            uni.makePhoneCall({ phoneNumber: String(p) });
        },
    },
};
</script>

<style lang="scss" scoped>
.view {
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: linear-gradient(180deg, #fed3ed 0%, rgba(216, 216, 216, 0) 100%);

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
                color: #6b7280;
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
                        content: "";
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
                        content: "";
                        position: absolute;
                        bottom: -16rpx;
                        left: 50%;
                        transform: translateX(-50%) skewX(-22deg);
                        width: 120rpx;
                        height: 14rpx;
                        background: #ff80b5;
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
            background: linear-gradient(to bottom, #fff 0%, #f8f7f7 100%);

            .status-item {
                width: 148rpx;
                height: 64rpx;
                background: #ededeb;
                border-radius: 16rpx;
                font-weight: 400;
                font-size: 28rpx;
                color: #000000;
                line-height: 64rpx;
            }

            .status-item.active {
                background: #ff80b5;
                border-radius: 16rpx 16rpx 16rpx 16rpx;
                font-weight: 400;
                font-size: 28rpx;
                color: #ffffff;
            }
        }

        .list-wrap {
            flex: 1;
            padding: 0 32rpx;
            background: #f8f7f7;
            box-sizing: border-box;
        }

        .card {
            margin-bottom: 24rpx;
            background: #ffffff;
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
                        color: #625d5d;
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
                    background: #eef6ff;
                    border-radius: 8rpx;
                    font-size: 24rpx;
                    color: #0f6eff;
                    line-height: 48rpx;
                    text-align: center;
                }
            }

            .route {
                display: flex;
                padding: 8rpx 0 12rpx;
            }

            .route.single {
                padding-bottom: 4rpx;
            }

            .dot {
                width: 8rpx;
                height: 8rpx;
                background: #3ca0ff;
                border-radius: 50%;
                margin: 18rpx 16rpx 0 8rpx;
            }

            .addr {
                flex: 1;
                position: relative;
                background: #f8fafb;
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
                color: #ff80b5;
                line-height: 40rpx;
                margin-bottom: 22rpx;

                image {
                    width: 40rpx;
                    height: 40rpx;
                }
            }

            .addr-text {
                flex: 1;
                font-weight: 400;
                font-size: 28rpx;
                color: #333333;

                .tag {
                    padding: 10rpx;
                    border-radius: 8rpx;
                }
            }

            .call {
                width: 40rpx;
                height: 40rpx;
                border-radius: 50%;
                background: #fff0f6;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .link {
                color: #ff80b5;
            }

            .link-text {
                margin-left: 8rpx;
                color: #ff80b5;
            }

            .btns {
                display: flex;
                justify-content: flex-end;
                gap: 16rpx;
                margin-top: 10rpx;

                .seeDetail {
                    width: 176rpx;
                    height: 72rpx;
                    background: #f3f4f6;
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
                    color: #ff80b5;
                    line-height: 72rpx;
                    text-align: center;
                }
            }
        }
    }
}
</style>
