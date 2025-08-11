<template>
  <view class="view">
    <section class="nav-bar">
      <c-navBar title="订单详情" isSeat isPerch :isBack="true"></c-navBar>
    </section>
    <section class="content">
      <view class="panel">
        <view class="status">
          <view class="status-icon">
            <image class="bg" src="/static/common/bg.png" mode="aspectFill"></image>
            <u-icon name="file-text" color="#fff" size="36"></u-icon>
          </view>
          <text class="status-text">{{ statusText }}</text>
        </view>
        <view class="box">
          <view class="row time-row">
            <text class="label">派单时间：</text>
            <text class="val">{{ info.dispatchTime }}</text>
          </view>
          <view v-if="type === 'travel'">
            <view class="addr-row">
              <u-tag text="取" type="primary" size="mini" plain></u-tag>
              <text class="addr">{{ info.pickup }}</text>
              <view class="km"><u-icon name="map" color="#FF80B5" size="16"></u-icon><text class="km-text">{{ pickupKm
              }}</text></view>
            </view>
            <view class="addr-row">
              <u-tag text="送" type="error" size="mini" plain></u-tag>
              <text class="addr">{{ info.dropoff }}</text>
              <view class="km"><u-icon name="map" color="#FF80B5" size="16"></u-icon><text class="km-text">{{ dropKm
              }}</text></view>
            </view>
          </view>
          <view v-else>
            <view class="addr-row">
              <u-icon name="map" color="#3C3C3C" size="16"></u-icon>
              <text class="addr">{{ info.address }}</text>
              <view class="km"><u-icon name="map" color="#FF80B5" size="16"></u-icon><text class="km-text">{{ pickupKm
              }}</text></view>
            </view>
          </view>
          <view class="dash"></view>
          <view class="row">
            <text class="label">全程距离：</text>
            <text class="val">{{ totalKm }}公里</text>
          </view>
          <view class="row">
            <text class="label">取宠时间：</text>
            <text class="val">{{ info.range }}</text>
          </view>
        </view>
      </view>
      <view class="footer">
        <u-button shape="circle" plain type="primary"><u-icon name="phone" size="16"></u-icon><text
            class="btn-text">取宠人</text></u-button>
        <u-button shape="circle" plain type="primary"><u-icon name="phone" size="16"></u-icon><text
            class="btn-text">接宠人</text></u-button>
        <u-button shape="circle" type="error" color="#FF80B5">{{ actionText }}</u-button>
      </view>
    </section>
  </view>
</template>

<script>
export default {
  data() {
    return {
      type: 'travel',
      statusText: '已派单',
      info: { dispatchTime: '2025-07-31 09:01:20', pickup: '', dropoff: '', address: '', range: '2025-07-31 09:00-18:00' },
      pickupKm: '5.1km',
      dropKm: '15.1km',
      totalKm: '20.19'
    }
  },
  computed: {
    actionText() { return this.type === 'travel' ? '开始运送' : '开始服务' }
  },
  onLoad(query) {
    if (query && query.type) { this.type = query.type }
    if (query.dispatchTime) { this.info.dispatchTime = decodeURIComponent(query.dispatchTime) }
    if (query.range) { this.info.range = decodeURIComponent(query.range) }
    if (this.type === 'travel') {
      this.info.pickup = query.pickup ? decodeURIComponent(query.pickup) : ''
      this.info.dropoff = query.dropoff ? decodeURIComponent(query.dropoff) : ''
    } else {
      this.info.address = query.address ? decodeURIComponent(query.address) : ''
    }
  }
}
</script>

<style lang="scss" scoped>
.view {
  min-height: 100vh;
  background: linear-gradient(180deg, #FED3ED 0%, rgba(216, 216, 216, 0) 100%);

  .content {
    padding: 24rpx 24rpx 140rpx
  }

  .panel {
    background: transparent
  }

  .status {
    height: 240rpx;
    background: #FFA3C5;
    border-radius: 24rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column
  }

  .status-icon {
    width: 120rpx;
    height: 120rpx;
    border-radius: 24rpx;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center
  }

  .status-icon .bg {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 24rpx
  }

  .status-text {
    margin-top: 12rpx;
    color: #fff;
    font-size: 32rpx;
    font-weight: 700
  }

  .box {
    margin: 16rpx 12rpx 0;
    background: #fff;
    border-radius: 16rpx;
    padding: 16rpx
  }

  .row {
    display: flex;
    align-items: center;
    margin: 8rpx 0
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

  .addr-row {
    display: flex;
    align-items: center;
    padding: 12rpx 0
  }

  .addr {
    flex: 1;
    margin-left: 10rpx;
    color: #1A1A1A;
    font-size: 28rpx
  }

  .km {
    display: flex;
    align-items: center
  }

  .km-text {
    margin-left: 6rpx;
    color: #595959;
    font-size: 24rpx
  }

  .dash {
    height: 2rpx;
    margin: 8rpx 0;
    background: repeating-linear-gradient(90deg, #F1BED1 0, #F1BED1 16rpx, transparent 16rpx, transparent 28rpx)
  }

  .footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 12rpx 24rpx 28rpx;
    background: rgba(255, 255, 255, .96);
    display: flex;
    gap: 16rpx
  }

  .btn-text {
    margin-left: 6rpx
  }
}
</style>
