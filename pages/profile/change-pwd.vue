<template>
  <view class="view">
    <section class="nav-bar">
      <c-navBar title="修改密码" isSeat isPerch :isBack="true"></c-navBar>
    </section>
    <section class="content">
      <view class="card">
        <view class="ipt">
          <text class="label">旧密码</text>
          <u-input v-model="form.oldPwd" placeholder="请输入旧密码" type="password" border="none" maxlength="20"></u-input>
        </view>
        <view class="ipt">
          <text class="label">新密码</text>
          <u-input v-model="form.newPwd" placeholder="请输入新密码" type="password" border="none" maxlength="20"></u-input>
        </view>
        <view class="ipt">
          <text class="label">确认密码</text>
          <u-input v-model="form.confirmPwd" placeholder="请输入新密码" type="password" border="none"
            maxlength="20"></u-input>
        </view>
      </view>
      <view class="submit" @click="submit">确认提交</view>
    </section>
  </view>
</template>

<script>
export default {
  data() {
    return {
      form: { oldPwd: '', newPwd: '', confirmPwd: '' }
    }
  },
  methods: {
    async submit() {
      if (!this.form.oldPwd || !this.form.newPwd || !this.form.confirmPwd) {
        uni.$u.toast('请完整填写')
        return
      }
      if (this.form.newPwd !== this.form.confirmPwd) {
        uni.$u.toast('两次密码不一致')
        return
      }
      try {
        const payload = { newPassword: this.form.newPwd, oldPassword: this.form.oldPwd }
        const res = await this.$api.updatePasswordApi(payload)
        console.log('修改密码:', res)
        uni.$u.toast('修改成功，请重新登录')
        try { this.$u.vuex('vuex_token', '') } catch (e) {}
        try { uni.removeStorageSync('token') } catch (e) {}
        try { uni.removeStorageSync('userInfo') } catch (e) {}
        setTimeout(() => {
          uni.reLaunch({ url: '/pages/tabbar/login' })
        }, 1000)
      } catch (e) {
        uni.$u.toast('修改失败')
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
    padding: 20rpx
  }

  .card {
    // padding: 26rpx 0;
    // margin: 0 32rpx;
    background: #fff;
    border-radius: 20rpx;
  }

  .ipt {
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
    width: 160rpx;
    padding-left: 12rpx;
    font-family: Source Han Sans, Source Han Sans;
    font-weight: 600;
    font-size: 28rpx;
    color: #000000;
  }

  .submit {
    width: 690rpx;
    height: 88rpx;
    background: #FF7BAC;
    border-radius: 16rpx;
    font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
    font-weight: 700;
    font-size: 32rpx;
    color: #FFFFFF;
    line-height: 88rpx;
    text-align: center;
    margin: auto;
    margin-top: 40rpx;
  }
}
</style>
