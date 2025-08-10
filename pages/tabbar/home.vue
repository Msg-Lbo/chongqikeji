<template>
    <view class="view">
        <section class="nav-bar">
            <c-navBar title="首页" isSeat isPerch></c-navBar>
        </section>
        <section class="content">
            <view class="search-box">
                <u-search shape="square" placeholder="搜索我的订单" :showAction="false" height="80rpx"></u-search>
            </view>
            <view class="tabs flex align-center">
                <view class="tab flex-1 flex flex-center active">出行</view>
                <view class="tab flex-1 flex flex-center">喂养</view>
            </view>
        </section>
    </view>
</template>

<script>
export default {
    data() {
        return {};
    },
};
</script>

<style lang="scss" scoped>
.view {
    min-height: 100vh;
    background: linear-gradient(180deg, #FED3ED 0%, rgba(216, 216, 216, 0) 100%);

    .content {
        padding: 32rpx;

        .tabs {
            margin-top: 20rpx;
            background: #FFFFFF60;
            border-radius: 40rpx 40rpx 0rpx 0rpx;
            .tab{
                padding: 16rpx 0;
            }
        }
    }

}
</style>
