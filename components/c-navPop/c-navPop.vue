<template>
    <!-- 导航选择弹窗组件 -->
    <view>
        <u-popup :show="show" mode="bottom" round="30" :mask-close-able="true" :safeAreaInsetBottom="true" @close="closeBtn">
            <view class="nav-box">
                <view class="nav-header">
                    <view class="nav-title">选择导航应用</view>
                    <view class="nav-subtitle">{{ address }}</view>
                </view>
                <view class="nav-list">
                    <view class="nav-item" @click="selectNav('amap')">
                        <view class="nav-icon amap-icon">
                            <text class="icon-text">高德</text>
                        </view>
                        <view class="nav-name">高德地图</view>
                    </view>
                    <view class="nav-item" @click="selectNav('baidu')">
                        <view class="nav-icon baidu-icon">
                            <text class="icon-text">百度</text>
                        </view>
                        <view class="nav-name">百度地图</view>
                    </view>
                </view>
                <view class="nav-cancel" @click="closeBtn">
                    <view class="cancel-btn">取消</view>
                </view>
            </view>
        </u-popup>
    </view>
</template>

<script>
export default {
    name: "navPop",
    props: {
        show: {
            type: Boolean,
            default: false
        },
        address: {
            type: String,
            default: ''
        },
        latitude: {
            type: [String, Number],
            default: ''
        },
        longitude: {
            type: [String, Number],
            default: ''
        }
    },
    methods: {
        // 选择导航应用
        selectNav(type) {
            this.$emit('select', type);
            this.closeBtn();
        },
        // 关闭弹窗
        closeBtn() {
            this.$emit('close');
        }
    }
}
</script>

<style lang="scss" scoped>
.nav-box {
    background: #FFFFFF;
    border-radius: 30rpx 30rpx 0 0;
    padding: 40rpx 40rpx 0;
    
    .nav-header {
        text-align: center;
        margin-bottom: 60rpx;
        
        .nav-title {
            font-size: 36rpx;
            font-weight: bold;
            color: #1A1A1A;
            margin-bottom: 20rpx;
        }
        
        .nav-subtitle {
            font-size: 28rpx;
            color: #666666;
            line-height: 40rpx;
            padding: 0 20rpx;
        }
    }
    
    .nav-list {
        display: flex;
        justify-content: space-around;
        margin-bottom: 60rpx;
        
        .nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
            
            .nav-icon {
                width: 120rpx;
                height: 120rpx;
                border-radius: 24rpx;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 20rpx;
                
                .icon-text {
                    font-size: 32rpx;
                    font-weight: bold;
                    color: #fff;
                }
                
                &.amap-icon {
                    background: linear-gradient(135deg, #00B96B, #52C41A);
                }
                
                &.baidu-icon {
                    background: linear-gradient(135deg, #2979FF, #1976D2);
                }
            }
            
            .nav-name {
                font-size: 28rpx;
                color: #333333;
            }
            
            &:active {
                opacity: 0.7;
            }
        }
    }
    
    .nav-cancel {
        padding: 30rpx 0;
        border-top: 1rpx solid #F0F0F0;
        margin-top: 20rpx;
        
        .cancel-btn {
            text-align: center;
            font-size: 32rpx;
            color: #666666;
            padding: 20rpx 0;
            
            &:active {
                opacity: 0.7;
            }
        }
    }
}
</style>
