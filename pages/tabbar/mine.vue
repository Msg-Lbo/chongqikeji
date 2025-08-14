<template>
    <view class="view">
        <section class="nav-bar">
            <c-navBar title="个人中心" isSeat isPerch></c-navBar>
        </section>
        <section class="content">
            <image class="bg" src="/static/common/top.png" />
            <view class="profile-card">
                <view class="avatar-wrap">
                    <image class="avatar" :src="vuex_imgUrl + user.avatar || ''" mode="aspectFill"></image>
                </view>
                <view class="name">{{ user.name }}</view>
                <view class="phone">{{ maskedPhone }}</view>
                <view class="loc">
                    <u-icon name="map-fill" color="#3384FE" size="18"></u-icon>
                    <text class="loc-text">{{ user.city || "暂无" }}</text>
                </view>
            </view>

            <view class="menu">
                <view class="cell" @click="toProfile">
                    <view class="left">
                        <image class="s-logo" src="/static/common/grxx.png" />
                        <text class="text">个人信息</text>
                    </view>
                    <u-icon name="arrow-right" color="#666666" size="16" bold></u-icon>
                </view>
                <view class="cell">
                    <view class="left">
                        <image class="s-logo" src="/static/common/zt.png" />
                        <text class="text">状态修改</text>
                    </view>
                    <u-switch
                        v-model="userStatus"
                        size="20"
                        activeColor="#FF80B5"
                        inactiveColor="#E8E8EA"
                        @change="onStatusChange"></u-switch>
                </view>
                <view class="cell" @click="toChangePwd">
                    <view class="left">
                        <image class="s-logo" src="/static/common/xg.png" />
                        <text class="text">修改密码</text>
                    </view>
                    <u-icon name="arrow-right" color="#666666" size="16" bold></u-icon>
                </view>

                <view class="cell" @click="toLogout">
                    <view class="left">
                        <image class="s-logo" src="/static/common/tc.png" />
                        <text class="text">退出登录</text>
                    </view>
                    <u-icon name="arrow-right" color="#666666" size="16" bold></u-icon>
                </view>
            </view>
        </section>
    </view>
</template>

<script>
export default {
    data() {
        return {
            user: {},
            userStatus: false,
        };
    },
    computed: {
        maskedPhone() {
            const p = String(this.user.phone || "");
            if (p.length < 7) return p;
            return p.slice(0, 3) + "****" + p.slice(-4);
        },
    },
    onShow() {
        this.getDriverInfo();
    },
    methods: {
        toProfile() {
            const { avatar = "", name = "", phone = "", city = "" } = this.user || {};
            const url = `/pages/profile/info?avatar=${encodeURIComponent(avatar || "")}&name=${encodeURIComponent(
                name || ""
            )}&phone=${encodeURIComponent(phone || "")}&city=${encodeURIComponent(city || "")}`;
            uni.navigateTo({ url });
        },
        toChangePwd() {
            uni.navigateTo({ url: "/pages/profile/change-pwd" });
        },
        toLogout() {
            uni.showModal({
                title: "提示",
                content: "确定退出登录？",
                confirmText: "退出",
                confirmColor: "#FF80B5",
                cancelColor: "#666666",
                success: (res) => {
                    if (res.confirm) {
                        try {
                            this.$u.vuex("vuex_token", "");
                        } catch (e) {}
                        try {
                            uni.removeStorageSync("token");
                        } catch (e) {}
                        try {
                            uni.removeStorageSync("userInfo");
                        } catch (e) {}
                        uni.$u.toast("已退出登录");
                        setTimeout(() => {
                            uni.reLaunch({ url: "/pages/tabbar/login" });
                        }, 300);
                    }
                },
            });
        },
        async getDriverInfo() {
            try {
                const res = await this.$api.driverInfoApi();
                console.log("个人中心:", res);
                this.user = res.data;
                const s = String(this.user?.status ?? "");
                this.userStatus = s === "1";
            } catch (error) {
                console.log("个人中心:", error);
            }
        },
        async onStatusChange(val) {
            const status = val ? "1" : "0";
            try {
                await this.updateStatus(status);
            } catch (e) {
                this.userStatus = String(this.user?.status ?? "") === "1";
            }
        },
        async updateStatus(status) {
            try {
                await this.$api.updateDriverApi({ status });
                this.user.status = status;
                this.userStatus = status === "1";
                // uni.$u.toast('状态已更新')
            } catch (error) {
                // uni.$u.toast('更新失败')
                throw error;
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.view {
    min-height: 100vh;
    background: linear-gradient(180deg, #fed3ed 0%, #f5f5f5 100%);

    .content {
        padding: 24rpx;
        padding-top: 50rpx;
        position: relative;

        .bg {
            width: 330rpx;
            height: 56rpx;
            position: relative;
            top: 10rpx;
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
            box-shadow: 0 10rpx 22rpx rgba(255, 128, 181, 0.15);
            position: relative;

            .avatar-wrap {
                width: 160rpx;
                height: 160rpx;
                border-radius: 50%;
                position: relative;
                top: -65rpx;
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
                color: #7e7e7e;
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
                margin-left: 8rpx;
            }
        }

        .menu {
            margin-top: 20rpx;
        }

        .cell {
            height: 98rpx;
            padding: 0 36rpx;
            background: #fff;
            border-radius: 16rpx;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20rpx;
        }

        .left {
            display: flex;
            align-items: center;

            .s-logo {
                width: 44rpx;
                height: 44rpx;
            }
        }

        .text {
            margin-left: 30rpx;
            font-weight: 700;
            font-size: 28rpx;
            color: #0b0a07;
            font-family: Alibaba PuHuiTi 3, Alibaba PuHuiTi 30;
        }
    }
}
</style>
