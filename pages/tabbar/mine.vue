<template>
  <view class="view">
    <section class="nav-bar">
      <c-navBar title="个人中心" isSeat isPerch></c-navBar>
    </section>
    <section class="content">
      <view class="profile-card">
        <view class="avatar-wrap">
          <image class="avatar" src="https://picsum.photos/200/200?random=1" mode="aspectFill"></image>
        </view>
        <view class="name">{{ user.name }}</view>
        <view class="phone">{{ maskedPhone }}</view>
        <view class="loc">
          <u-icon name="map" color="#3C3C3C" size="16"></u-icon>
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
  computed:{
    maskedPhone(){
      const p = String(this.user.phone||'')
      if(p.length<7) return p
      return p.slice(0,3)+'****'+p.slice(-4)
    }
  },
  methods:{
    toProfile(){uni.navigateTo({url:'/pages/profile/info'})},
    toChangePwd(){uni.navigateTo({url:'/pages/profile/change-pwd'})},
    toLogout(){}
  }
}
</script>

<style lang="scss" scoped>
.view {
  min-height: 100vh;
  background: linear-gradient(180deg, #FED3ED 0%, rgba(216, 216, 216, 0) 100%);
  .content{
    padding: 24rpx;
    .profile-card{
      margin: 24rpx 0;
      background:#fff; border-radius:24rpx; padding:48rpx 24rpx; display:flex; align-items:center; justify-content:center; flex-direction:column; box-shadow:0 8rpx 20rpx rgba(255,128,181,0.15);
      .avatar-wrap{width:140rpx; height:140rpx; border-radius:50%; background:#FFE7F1; display:flex; align-items:center; justify-content:center}
      .avatar{width:120rpx; height:120rpx; border-radius:50%}
      .name{margin-top:20rpx; font-size:34rpx; font-weight:700; color:#1A1A1A}
      .phone{margin-top:8rpx; color:#808080; font-size:26rpx}
      .loc{margin-top:8rpx; display:flex; align-items:center}
      .loc-text{margin-left:6rpx; color:#3C3C3C; font-size:26rpx}
    }
    .menu{margin-top:16rpx}
    .cell{height:96rpx; padding:0 24rpx; background:#fff; border-radius:16rpx; display:flex; align-items:center; justify-content:space-between; margin-bottom:16rpx}
    .left{display:flex; align-items:center}
    .text{margin-left:12rpx; color:#1A1A1A; font-size:28rpx}
  }
}
</style>
