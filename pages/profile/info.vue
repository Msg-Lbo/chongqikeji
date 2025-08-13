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
            <u--input v-model="form.name" inputAlign="right" placeholder="请输入昵称" border="none"
               style="width: 360rpx;" />
            <u-icon name="arrow-right" color="#646465" size="13" bold></u-icon>
          </view>
        </view>
        <view class="row">
          <text class="label">手机号</text>
          <view class="right">
            <text class="value">{{ maskedPhone }}</text>
            <u-icon name="arrow-right" color="#646465" size="13" bold></u-icon>
          </view>
        </view>
        <view class="row">
          <text class="label">所属城市</text>
          <view class="right">
            <text class="city" :class="form.city ? '' : 'pink'">{{ form.city ? form.city : '暂无' }}</text>
            <u-icon name="arrow-right" color="#646465" size="13" bold></u-icon>
          </view>
        </view>
      </view>
      <view class="submit" @click="submit">确认提交</view>
    </section>
  </view>
</template>

<script>
export default {
  computed: {
    maskedPhone() {
      const p = String(this.form.phone || '')
      if (p.length < 7) return p
      return p.slice(0, 3) + '****' + p.slice(-4)
    }
  },
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
  onLoad(options) {
    try {
      this.form.avatar = options?.avatar ? decodeURIComponent(options.avatar) : ''
      this.form.name = options?.name ? decodeURIComponent(options.name) : ''
      this.form.phone = options?.phone ? decodeURIComponent(options.phone) : ''
      this.form.city = options?.city ? decodeURIComponent(options.city) : ''
    } catch (e) { }
  },
  methods: {
    async changeAvatar() {
      try {
        const res = await this.$fn.uploadImage.call(this, 1)
        console.log("上传", res);
        let parsed
        try { parsed = typeof res === 'string' ? JSON.parse(res) : res } catch (e) { parsed = {} }
        const url = parsed?.fileName || parsed?.data?.fileName || ''
        if (!url) {
          uni.$u.toast('上传失败，请重试')
          return
        }
        this.form.avatar = url
      } catch (error) {
        console.log('上传头像失败:', error)
      }
    },
    async saveProfile(payload) {
      try {
        const body = { avatar: this.form.avatar, name: this.form.name, phone: this.form.phone, ...payload }
        const res = await this.$api.updateDriverApi(body)
        console.log('信息更新:', res)
        try {
          const userInfo = uni.getStorageSync('userInfo') || {}
          uni.setStorageSync('userInfo', { ...userInfo, ...body })
        } catch (e) { }
        return res
      } catch (error) {
        console.log('更新失败:', error)
        uni.$u.toast('更新失败')
        throw error
      }
    },
    chooseCity() { uni.$u.toast('暂未开放') },
    async submit() {
      const name = (this.form.name || '').trim()
      if (!name) {
        uni.$u.toast('请输入昵称')
        return
      }
      const phone = String(this.form.phone || '').trim()
      if (phone && !/^1\d{10}$/.test(phone)) {
        uni.$u.toast('请输入正确的手机号')
        return
      }
      try {
        await this.saveProfile({})
        uni.$u.toast('保存成功')
        setTimeout(() => { this.$fn.jumpBack() }, 400)
      } catch (e) {}
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
