<template>
    <view id="app">
        <!-- 页面内容由各个页面组件处理 -->
    </view>
</template>

<script>
import wsManager from '@/store/websocket.manager.js';

export default {
    onLaunch: function () {
        console.log("App Launch");
        // 应用启动时不立即连接WebSocket，等页面加载后再连接
    },
    onShow: function () {
        console.log("App Show");
        // 应用从后台回到前台时，确保WebSocket连接正常
        if (wsManager.getStatus().isDestroyed) {
            // 如果WebSocket被销毁了，重新创建
            console.log("WebSocket已销毁，重新初始化");
        }
    },
    onHide: function () {
        console.log("App Hide");
        // 应用进入后台时保持WebSocket连接
    },
    onError: function(error) {
        console.error("App Error:", error);
    }
};
</script>

<style lang="scss">
@import "uview-ui/index.scss";
</style>
