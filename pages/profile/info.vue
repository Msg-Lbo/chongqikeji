<template>
  <view class="view">
    <section class="nav-bar">
      <c-navBar title="个人信息" isSeat isPerch :isBack="true"></c-navBar>
    </section>
    <section class="content">
      <view class="card">
        <view class="row" @click="changeAvatar">
          <text class="label">头像</text>
          <view class="right">
            <image class="avatar" src="https://picsum.photos/200/200?random=1" mode="aspectFill"></image>
            <u-icon name="arrow-right" color="#646465" size="13" bold></u-icon>
          </view>
        </view>
        <view class="row" @click="editName">
          <text class="label">昵称</text>
          <view class="right">
            <text class="value">{{ form.name }}</text>
            <u-icon name="arrow-right" color="#646465" size="13" bold></u-icon>
          </view>
        </view>
        <view class="row" @click="editPhone">
          <text class="label">手机号</text>
          <view class="right">
            <text class="value">{{ form.phone }}</text>
            <u-icon name="arrow-right" color="#646465" size="13" bold></u-icon>
          </view>
        </view>
        <view class="row" @click="chooseCity">
          <text class="label">所属城市</text>
          <view class="right">
            <text class="city" :class="form.city ? '' : 'pink'">{{ form.city ? form.city : '去选择' }}</text>
            <u-icon name="arrow-right" color="#646465" size="13" bold></u-icon>
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
      form: {
        name: '游客231212',
        phone: '18900009201',
        city: ''
      }
    }
  },
  methods: {
    changeAvatar() { },
    editName() { },
    editPhone() { },
    chooseCity() { }
  }
}
</script>

<style lang="scss" scoped>
.view {
  min-height: 100vh;
  background: linear-gradient(180deg, #FED3ED 0%, rgba(216, 216, 216, 0) 100%);

  .content {
    padding: 20rpx
  }

  .card {
    background: #fff;
    border-radius: 20rpx
  }

  .row {
    padding: 26rpx 0;
    margin: 0 32rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 2rpx solid #F1F1F1;

    &:last-child {
      border-bottom: none
    }
  }

  .label {
    font-family: Source Han Sans, Source Han Sans;
    font-weight: bold;
    font-size: 28rpx;
    color: #000000;
  }

  .right {
    display: flex;
    align-items: center;
    gap: 17rpx
  }

  .avatar {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%
  }

  .value {
    font-family: Source Han Sans, Source Han Sans;
    font-weight: 400;
    font-size: 28rpx;
    color: #000000;
  }

  .city {
    font-family: Source Han Sans, Source Han Sans;
    font-weight: 400;
    font-size: 28rpx;
    color: #000000;
  }

  .pink {
    color: #FF80B5
  }


}
</style>
