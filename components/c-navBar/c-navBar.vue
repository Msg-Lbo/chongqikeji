<template>
    <!-- 头部导航栏 -->
    <view>
        <view class="top_nav" :class="{ ps: isSeat, tran: isTran }" :style="{ 'background-color': backgroundColor }">
            <view :style="{ height: statusHeight + 'px' }"></view>
            <!-- 与小程序胶囊高度一致 -->
            <view v-if="custom" :style="{ height: titleHeight + 'px' }">
                <slot></slot>
            </view>
            <view v-else class="nav" :style="{ height: titleHeight + 'px' }">
                <view class="na-img" @click="jumpBack">
                    <u-icon v-if="isBack" name="arrow-left" :color="color" size="18" bold />
                </view>
                <view class="nav-title" :style="{ color: color }">
                    <text>{{ title }}</text>
                </view>
                <!-- 右侧插槽 -->
                <view class="right-slot">
                    <slot v-if="showRight" name="right"></slot>
                </view>
            </view>
        </view>

        <view v-if="isPerch" :style="{ height: statusHeight + titleHeight + 'px' }"></view>
    </view>
</template>

<script>
/**
 * c-navBar 弹窗
 * @description 头部导航栏
 * @property {String}			title				头部导航栏文字 (默认 头部导航栏文字 )
 * @property {String}			color				头部导航栏文字颜色 (默认 #000 )
 * @property {Boolean}			isBack				是否显示左侧返回按钮 （默认 false ）
 * @property {Boolean}			isSeat				是否透视背景(脱离文档流)（默认 false ）
 * @property {Boolean}			isPerch				是否占位（默认 false ）
 * @property {Boolean}			isTran				是否透明（默认 false ）
 * @property {Boolean}			custom				自定义头部 （false ）
 * @property {Boolean}			showRight			是否显示右侧插槽 （默认 false ）
 * @event {Function} back 点击左侧按钮事件
 * @slot right                               右侧内容插槽
 * @slot default                             自定义整个导航栏内容（当custom为true时生效）
 *
 */
import imgs from "./images.js";

export default {
    props: {
        title: {
            default: "头部导航栏文字",
            type: String,
        },
        color: {
            default: "#000",
            type: String,
        },
        isBack: {
            default: false,
            type: Boolean,
        },
        isSeat: {
            default: false,
            type: Boolean,
        },
        isPerch: {
            default: false,
            type: Boolean,
        },
        isTran: {
            default: false,
            type: Boolean,
        },
        custom: {
            default: false,
            type: Boolean,
        },
        type: {
            default: 0,
            type: Number,
        },
        backgroundColor: {
            default: "",
            type: String,
        },
        showRight: {
            default: false,
            type: Boolean,
        },
    },
    data() {
        return {
            statusHeight: 0,
            titleHeight: 0,
            imgs,
            scrollNum: 0,
        };
    },
    onPageScroll(e) {
        console.log("e", e);
        this.scrollNum = e;
    },
    created() {
        this.getPhe();
    },
    methods: {
        // 获取手机导航栏高度
        getPhe() {
            // 状态栏高度
            let systemInfo = uni.getSystemInfoSync();
            this.statusHeight = systemInfo.safeArea.top;
            // app端的标题栏高度
            this.titleHeight = 46;
            // 小程序端的标题栏的高度
            // #ifdef MP-WEIXIN
            let titleSize = wx.getMenuButtonBoundingClientRect();
            this.titleHeight = titleSize.height + (titleSize.top - systemInfo.safeArea.top) * 2;
            // #endif
        },
        // 跳转回上一个页面
        jumpBack() {
            if (this.$listeners.leftFn) {
                this.$emit("leftFn");
                return;
            }
            uni.navigateBack({
                fail: function (res) {
                    uni.reLaunch({ url: "/pages/tabbar/home" });
                },
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.top_nav {
    z-index: 10;
    color: #1a1a1a;
    font-size: 32rpx;
    position: fixed;
    top: 0;
    background: #fff;
    width: 750rpx;
    &.tran {
        background: transparent;
    }
    &.ps {
        position: absolute;
        background: transparent;
    }

    .nav {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;

        .na-img {
            width: 150rpx;
            height: 60rpx;
            display: flex;
            align-items: center;
            margin-left: 20rpx;
            image {
                width: 35rpx;
                height: 35rpx;
            }
        }
        .nav-title {
            text-align: center;
            flex: 1;
            font-weight: bold;
            font-size: 36rpx;
        }

        .right-slot {
            width: 150rpx;
            height: 60rpx;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            margin-right: 20rpx;
        }

        .address {
            width: 32rpx;
            height: 32rpx;
            margin-left: 30rpx;
            margin-right: 8rpx;
        }

        .tabbar-title {
            font-size: 36rpx;
            font-weight: bold;
            color: #1a1a1a;
            line-height: 42rpx;
        }
    }
}
</style>
