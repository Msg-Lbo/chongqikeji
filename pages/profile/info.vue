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
            <image class="avatar" :src="vuex_imgUrl + form.avatar" mode="aspectFill"></image>
            <u-icon name="arrow-right" color="#646465" size="13" bold></u-icon>
          </view>
        </view>
        <view class="row">
          <text class="label">昵称</text>
          <view class="right">
            <u--input v-model="form.name" inputAlign="right" placeholder="请输入昵称" border="none" @blur="onNameBlur"
              clearable style="width: 360rpx;" />
            <u-icon name="arrow-right" color="#646465" size="13" bold></u-icon>
          </view>
        </view>
        <view class="row">
          <text class="label">手机号</text>
          <view class="right">
            <u--input v-model="form.phone" type="number" inputAlign="right" placeholder="请输入手机号" border="none"
              @blur="onPhoneBlur" clearable style="width: 360rpx;" maxlength="11" />
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
        avatar: '',
        name: '',
        phone: '',
        city: ''
      }
    }
  },
  methods: {
    async changeAvatar() {
      try {
        const res = await this.$fn.uploadImage.call(this, 1)
        console.log("上传", res);

        let url = res.fileName


        this.form.avatar = url
        await this.saveProfile({ avatar: url })
      } catch (error) {
        console.log('上传头像失败:', error)
      }
    },
    async onNameBlur() {
      const name = (this.form.name || '').trim()
      if (!name) {
        uni.$u.toast('请输入昵称')
        return
      }
      try {
        await this.saveProfile({ name })
      } catch (e) { }
    },
    async onPhoneBlur() {
      const phone = String(this.form.phone || '').trim()
      if (!/^1\d{10}$/.test(phone)) {
        uni.$u.toast('请输入正确的手机号')
        return
      }
      try {
        await this.saveProfile({ phone })
      } catch (e) { }
    },
    async saveProfile(payload) {
      try {
        const body = { avatar: this.form.avatar, name: this.form.name, phone: this.form.phone, ...payload }
        const res = await this.$api.updateDriverApi(body)
        console.log('信息更新:', res)
        // 可选：更新本地缓存的用户信息
        try {
          const userInfo = uni.getStorageSync('userInfo') || {}
          uni.setStorageSync('userInfo', { ...userInfo, ...payload })
        } catch (e) { }
      } catch (error) {
        console.log('更新失败:', error)
        uni.$u.toast('更新失败')
        throw error
      }
    },
    chooseCity() { uni.$u.toast('暂未开放') }
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
