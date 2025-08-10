<template>
    <view class="view">
        <section class="nav-bar">
            <c-navBar title="登录" isSeat isPerch></c-navBar>
        </section>
        <section class="content">
            <view class="form-wrapper">
                <u-form :model="form" ref="formRef">
                    <u-form-item>
                        <view class="input-card flex align-center">
                            <u--input v-model="form.phone" inputAlign="center" placeholder="请输入账号" border="none" clearable placeholderStyle="color: #B3B3B3;" />
                        </view>
                    </u-form-item>
                    <u-form-item>
                        <view class="input-card flex align-center">
                            <u--input v-model="form.password" inputAlign="center" placeholder="请输入密码" border="none" clearable password placeholderStyle="color: #B3B3B3;" />
                        </view>
                    </u-form-item>
                </u-form>

                <view class="remember-row flex align-center">
                    <u-checkbox-group v-model="rememberArr" placement="row" @change="onRememberChange">
                        <u-checkbox :name="'remember'" shape="square" size="18" activeColor="#FF7BAC" />
                    </u-checkbox-group>
                    <text class="remember-text">记住密码</text>
                </view>

                <view class="login-btn flex flex-center gap-30" @click="handleLogin">
                    <text class="mf-font-40 mf-weight-700">去登录</text>
                    <view class="btn-icon flex flex-center">
                        <u-icon name="arrow-right" color="#FFFFFF" size="24rpx" style="margin-left: 4rpx;"></u-icon>
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
                phone: '',
                password: '',
                remember: true
            },
            // 通过 group 管理选中状态
            rememberArr: ['remember']
        }
    },
    methods: {
        // 登陆
        async handleLogin() {
            try {
                const res = await this.$api.loginApi(this.form)
                if (res.code === 200) {
                    this.$u.vuex('vuex_token', res.data.accessToken)
                }
            } catch (error) {

            }
        },
        onRememberChange(arr) {
            this.form.remember = arr.includes('remember')
        }
    }
}
</script>
<style lang="scss" scoped>
.view {
    min-height: 100vh;
    background: linear-gradient(180deg, #FED3ED 0%, rgba(216, 216, 216, 0) 100%);

    .content {
        width: 100%;
        height: 100%;

        .form-wrapper {
            padding: 0 48rpx;
            margin-top: 300rpx;

            .input-card {
                height: 110rpx;
                padding: 0 32rpx;
                background: #ffffff;
                border-radius: 16rpx;
            }

            .remember-row {
                margin: 30rpx 0 40rpx;

                .remember-text {
                    margin-left: 16rpx;
                    color: #3C3C3C;
                    font-size: 28rpx;
                    font-weight: 500;
                }
            }

            .login-btn {
                height: 110rpx;
                border-radius: 16rpx;
                background: #FF80B5;
                box-shadow: 0rpx 8rpx 20rpx 0rpx rgba(255, 128, 181, 0.7);
                color: #ffffff;

                .btn-icon {
                    width: 36rpx;
                    height: 36rpx;
                    margin-top: 8rpx;
                    border: 4rpx solid #ffffff;
                    border-radius: 50%;

                    ::v-deep .u-icon__icon {
                        margin-left: 4rpx;
                    }
                }
            }

        }
    }
}
</style>