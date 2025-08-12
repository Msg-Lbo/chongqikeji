<template>
  <view class="view">
    <section class="nav-bar">
      <c-navBar title="个人中心" isSeat isPerch></c-navBar>
    </section>
    <section class="content">
      <image class="bg" src="/static/common/top.png" />
      <view class="profile-card">
        <view class="avatar-wrap">
          <image class="avatar" src="https://picsum.photos/200/200?random=1" mode="aspectFill"></image>
        </view>
        <view class="name">{{ user.name }}</view>
        <view class="phone">{{ maskedPhone }}</view>
        <view class="loc">
          <u-icon name="map-fill" color="#3384FE" size="18"></u-icon>
          <text class="loc-text">{{ user.city }}</text>
        </view>
      </view>

      <view class="menu">
        <view class="cell" @click="toProfile">
          <view class="left">
            <u-icon name="edit-pen" color="#FF80B5" size="18"></u-icon>
            <text class="text">个人信息</text>
          </view>
          <u-icon name="arrow-right" color="#C2C2C2" size="16"></u-icon>
        </view>

        <view class="cell">
          <view class="left">
            <u-icon name="setting" color="#FF80B5" size="18"></u-icon>
            <text class="text">状态修改</text>
          </view>
          <u-switch v-model="userStatus" size="20"></u-switch>
        </view>

        <view class="cell" @click="toChangePwd">
          <view class="left">
            <u-icon name="lock" color="#FF80B5" size="18"></u-icon>
            <text class="text">修改密码</text>
          </view>
          <u-icon name="arrow-right" color="#C2C2C2" size="16"></u-icon>
        </view>

        <view class="cell" @click="toLogout">
          <view class="left">
            <u-icon name="arrow-left" color="#FF80B5" size="18"></u-icon>
            <text class="text">退出登录</text>
          </view>
          <u-icon name="arrow-right" color="#C2C2C2" size="16"></u-icon>
        </view>
      </view>
    </section>
  </view>
</template>

<script>
export default {
  data() {
    return {
      user: { name: '唐晨涛', phone: '18912342331', city: '成都' },
      userStatus: false
    }
  },
  computed: {
    maskedPhone() {
      const p = String(this.user.phone || '')
      if (p.length < 7) return p
      return p.slice(0, 3) + '****' + p.slice(-4)
    }
  },
  methods: {
    toProfile() { uni.navigateTo({ url: '/pages/profile/info' }) },
    toChangePwd() { uni.navigateTo({ url: '/pages/profile/change-pwd' }) },
    toLogout() { }
  }
}
</script>

<style lang="scss" scoped>
.view {
  min-height: 100vh;
  background: linear-gradient(180deg, #FED3ED 0%, rgba(216, 216, 216, 0) 100%);

  .content {
    padding: 24rpx;
    padding-top: 50rpx;
    position: relative;

    .bg {
      width: 330rpx;
      height: 56rpx;
      position: relative;
      top: 8rpx;
      left: 50%;
      transform: translateX(-50%);
    }

    .profile-card {
      // margin: 24rpx 0;
      background: #fff;
      border-radius: 24rpx;
      padding: 48rpx 24rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      box-shadow: 0 8rpx 20rpx rgba(255, 128, 181, 0.15);
      position: relative;

      .avatar-wrap {
        width: 160rpx;
        height: 160rpx;
        border-radius: 50%;
        position: relative;
        top: -63rpx;
        left: -2rpx;
      }

      .avatar {
        width: 100%;
        height: 100%;
        border-radius: 50%;

      }

      .name {
        font-weight: 400;
        font-size: 36rpx;
        color: #000000;
        position: relative;
        top: -30rpx;
        left: -2rpx;
      }

      .phone {
        font-weight: 400;
        font-size: 28rpx;
        color: #7E7E7E;
        position: relative;
        top: -20rpx;
        left: -2rpx;
      }

      .loc {
        display: flex;
        align-items: center;
        position: relative;
        top: 5rpx;
        left: -20rpx;
      }

      .loc-text {
        font-weight: 400;
        font-size: 28rpx;
        color: #333333;
      }
    }

    .menu {
      margin-top: 16rpx
    }

    .cell {
      height: 96rpx;
      padding: 0 24rpx;
      background: #fff;
      border-radius: 16rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16rpx
    }

    .left {
      display: flex;
      align-items: center
    }

    .text {
      margin-left: 12rpx;
      color: #1A1A1A;
      font-size: 28rpx
    }
  }
}
</style>
