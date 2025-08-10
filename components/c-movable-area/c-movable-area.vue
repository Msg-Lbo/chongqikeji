<template>
    <!-- 可拖动区域组件 -->
    <view class="movable-container">
        <movable-area class="movable-area">
            <movable-view class="movable-view" direction="all" :x="x" :y="y" @change="onChange">
                <slot>
                    <!-- 默认浮动按钮 -->
                    <view class="default-button" :style="{ backgroundColor: backgroundColor }">
                        <u-icon :name="iconName" :color="iconColor" :size="iconSize" />
                    </view>
                </slot>
            </movable-view>
        </movable-area>
    </view>
</template>

<script>
/**
 * c-movable-area 可拖动区域
 * @description 可拖动区域组件，支持自定义内容，不传入时显示默认浮动按钮
 * @property {String}      iconName            默认按钮图标名称 (默认 plus )
 * @property {String}      iconColor           默认按钮图标颜色 (默认 #fff )
 * @property {Number}      iconSize            默认按钮图标大小 (默认 24 )
 * @property {String}      backgroundColor     默认按钮背景颜色 (默认 #007AFF )
 * @property {Number}      initialX            初始X坐标位置 (默认 250 )
 * @property {Number}      initialY            初始Y坐标位置 (默认 250 )
 * @event {Function}       change              位置变化时触发事件
 * @slot default           自定义内容插槽，不传入时显示默认浮动按钮
 */
//   基本用法
// <c-movable-area />

//  自定义图标和颜色
// <c-movable-area iconName="home" iconColor="#ff0000" backgroundColor="#000000" />

//  使用插槽自定义内容
// <c-movable-area>
//   <view class="custom-content">自定义内容</view>
// </c-movable-area>
export default {
    props: {
        iconName: {
            default: "plus",
            type: String,
        },
        iconColor: {
            default: "#fff",
            type: String,
        },
        iconSize: {
            default: 24,
            type: Number,
        },
        backgroundColor: {
            default: "#007AFF",
            type: String,
        },
        initialX: {
            default: 250,
            type: Number,
        },
        initialY: {
            default: 250,
            type: Number,
        },
    },
    data() {
        return {
            x: this.initialX,
            y: this.initialY,
        };
    },
    methods: {
        onChange(e) {
            this.x = e.detail.x;
            this.y = e.detail.y;
            this.$emit("change", {
                x: this.x,
                y: this.y,
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.movable-container {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    pointer-events: none;
    z-index: 999;

    .movable-area {
        width: 100%;
        height: 100%;

        .movable-view {
            pointer-events: auto;

            .default-button {
                width: 100rpx;
                height: 100rpx;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.2);
            }
        }
    }
}
</style>
