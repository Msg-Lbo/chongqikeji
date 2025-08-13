<template>
  <view class="view">
    <section class="nav-bar">
      <c-navBar title="订单详情" isSeat isPerch :isBack="true"></c-navBar>
    </section>
    <section class="content">
      <view class="status flex flex-center flex-col">
        <u-image src="/static/common/order.png" width="90rpx" height="90rpx" mode="aspectFill"></u-image>
        <text class="status-text mf-font-32 mf-weight-bold" style=" color:#fff; margin-top: 26rpx;">{{ statusText }}</text>
        <view class="box">
          <view class="row time-row mf-font-28">
            <text style="color: #625D5D;">派单时间：</text>
            <text style="color: #000000;">{{ info.dispatchTime }}</text>
          </view>
          <view v-if="type === 'travel'" class="flex flex-col gap-20" style="margin-top: 20rpx;">
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
              <text style="color: #625D5D;">全程距离：</text>
              <text style="color: #000000;">{{ totalKm }}公里</text>
            </view>
            <view class="row flex align-center gap-10">
              <text style="color: #625D5D;">取宠时间：</text>
              <text style="color: #000000;">{{ info.range }}</text>
            </view>
          </view>
        </view>
      </view>
    </section>
    <section class="footer">
      <u-button border="none" :customStyle="{
        background: '#FFE5F0',
        borderRadius: '16rpx',
        flex: '0 0 200rpx'
      }">
        <view class="flex align-center gap-10">
          <view class="flex align-center" style="padding: 10rpx; background: #FF80B5; border-radius: 50%;">
            <u-icon name="phone-fill" size="24rpx" top="1" color="#fff"></u-icon>
          </view>
          <text class="mg-font-28">取宠人</text>
        </view>
      </u-button>
      <u-button border="none" :customStyle="{
        background: '#FFE5F0',
        borderRadius: '16rpx',
        flex: '0 0 200rpx'
      }">
        <view class="flex align-center gap-10">
          <view class="flex align-center" style="padding: 10rpx; background: #FF80B5; border-radius: 50%;">
            <u-icon name="phone-fill" size="24rpx" top="1" color="#fff"></u-icon>
          </view>
          <text class="mg-font-28">取宠人</text>
        </view>
      </u-button>
      <u-button border="none" :customStyle="{
        color: '#fff',
        background: '#FF80B5',
        borderRadius: '16rpx',
        flex: '1 1 auto'
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
      type: 'travel',
      statusText: '已派单',
      info: { dispatchTime: '', pickup: '', dropoff: '', address: '', range: '' },
      pickupKm: '',
      dropKm: '',
      totalKm: ''
    }
  },
  computed: {
    actionText() { return this.type === 'travel' ? '开始运送' : '开始服务' }
  },
  onLoad(query) {
    const orderId = query.orderId || 0
    if (orderId) {
      this.fetchDetail({ orderId})
    }
  },
  methods: {
    statusMap(code) {
      const map = { '1': '待接单', '2': '已接单', '3': '已派单', '4': '进行中', '5': '已完成', '6': '已退款' }
      return map[String(code)] || ''
    },
    async fetchDetail(params) {
      try {
        const res = await this.$api.driverOrderDetailApi(params)
        const d = res?.data || {}
        this.statusText = this.statusMap(d.orderStatus)
        this.info.dispatchTime = d.driverTime || ''
        this.info.range = d.orderTime || ''
        this.info.pickup = d.sendAddress || ''
        this.info.dropoff = d.takeAddress || ''
        this.info.address = d.sendAddress || ''
        this.pickupKm = (d.distanceSta ?? '') + (d.distanceSta !== undefined ? 'km' : '')
        this.dropKm = (d.distanceEnd ?? '') + (d.distanceEnd !== undefined ? 'km' : '')
        this.totalKm = d.distanceOrder ?? ''
        this.type = 'travel'
      } catch (e) {
        console.log('订单详情获取失败', e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.view {
  min-height: 100vh;
  background: linear-gradient(180deg, #FED3ED 0%, rgba(216, 216, 216, 0) 100%);

  .content {
    padding: 24rpx;

    .status {
      background: linear-gradient(180deg, #FF80B5 0%, #FFA4C6 20%, #FFDFED 50%, #FFDFED 100%);
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
          background: #F8FAFB;
          background-repeat: 8rpx;

          .addr {
            flex: 1;
            margin-left: 10rpx;
            color: #1A1A1A;
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
          background: repeating-linear-gradient(90deg, #F1BED1 0, #F1BED1 16rpx, transparent 16rpx, transparent 28rpx);
          position: relative;

          &::after,
          &::before {
            content: '';
            width: 40rpx;
            height: 40rpx;
            border-radius: 50%;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: #FFDFED;
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



  }

  .footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 12rpx 24rpx 28rpx;
    background: rgba(255, 255, 255, .96);
    display: grid;
    display: flex;
    gap: 16rpx;
  }
}
</style>
