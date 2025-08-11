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
        <view class="line"></view>
        <view class="ipt">
          <text class="label">新密码</text>
          <u-input v-model="form.newPwd" placeholder="请输入新密码" type="password" border="none" maxlength="20"></u-input>
        </view>
        <view class="line"></view>
        <view class="ipt">
          <text class="label">确认密码</text>
          <u-input v-model="form.confirmPwd" placeholder="请输入新密码" type="password" border="none" maxlength="20"></u-input>
        </view>
      </view>
      <view class="submit">
        <u-button type="error" color="#FF80B5" shape="circle" @click="submit">确认提交</u-button>
      </view>
    </section>
  </view>
</template>

<script>
export default {
  data(){
    return {
      form:{oldPwd:'', newPwd:'', confirmPwd:''}
    }
  },
  methods:{
    submit(){
      if(!this.form.oldPwd||!this.form.newPwd||!this.form.confirmPwd){
        uni.$u.toast('请完整填写')
        return
      }
      if(this.form.newPwd!==this.form.confirmPwd){
        uni.$u.toast('两次密码不一致')
        return
      }
      uni.$u.toast('提交成功')
    }
  }
}
</script>

<style lang="scss" scoped>
.view{
  min-height:100vh;
  background: linear-gradient(180deg, #FED3ED 0%, rgba(216,216,216,0) 100%);
  .content{padding:24rpx}
  .card{background:#fff; border-radius:16rpx; padding:0 12rpx}
  .ipt{height:112rpx; display:flex; align-items:center}
  .label{width:160rpx; padding-left:12rpx; color:#1A1A1A; font-size:28rpx}
  .line{height:2rpx; margin:0 12rpx; background:#F0F0F0}
  .submit{margin-top:40rpx; padding:0 24rpx}
}
</style>

