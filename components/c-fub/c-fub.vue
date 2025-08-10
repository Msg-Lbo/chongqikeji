<template>
  <view
    class="px-suspen-button"
    :style="{
      top: elTop,
      left: elLeft,
      right: elRight,
      bottom: elBottom,
      zIndex: zindex,
    }"
    @touchmove.stop.prevent="onTouchMove"
  >
    <view
      :class="['center-button', 'px-button', { active: open }]"
      @click.stop="onOpen"
      :style="{
        backgroundColor: bgColor,
        height: _size,
        width: _size,
        zIndex: zindex + 1,
        opacity: opacity,
      }"
    >
      <image
        v-if="!$slots.center"
        mode="widthFix"
        :style="{ width: _iconSize }"
        :src="centerIcon || defaultCenterIcon"
      >
      </image>
      <slot name="center"></slot>
    </view>
    <view
      :class="[
        'top-button',
        'px-button',
        'ot-button',
        { 'active-top': open, 'hidden-top': !first && !open },
      ]"
      :style="{
        backgroundColor: bgColor,
        height: _size,
        width: _size,
        zIndex: zindex,
      }"
      @click.stop="onClickTop"
    >
      <image
        v-if="!$slots.top"
        mode="widthFix"
        :style="{ width: _iconSize }"
        :src="topIcon || defaultTopIcon"
      >
      </image>
      <slot name="top"></slot>
    </view>
    <view
      :class="[
        'left-button',
        'px-button',
        'ot-button',
        { 'active-left': open, 'hidden-left': !first && !open },
      ]"
      :style="{
        backgroundColor: bgColor,
        height: _size,
        width: _size,
        zIndex: zindex,
      }"
      @click.stop="onClickLeft"
    >
      <image
        v-if="!$slots.left"
        mode="widthFix"
        :style="{ width: _iconSize }"
        :src="leftIcon || defaultLeftIcon"
      >
      </image>
      <slot name="left"></slot>
    </view>
    <view
      :class="[
        'bottom-button',
        'px-button',
        'ot-button',
        { 'active-bottom': open, 'hidden-bottom': !first && !open },
      ]"
      :style="{
        backgroundColor: bgColor,
        height: _size,
        width: _size,
        zIndex: zindex,
      }"
      @click.stop="onClickBottom"
    >
      <image
        v-if="!$slots.bottom"
        mode="widthFix"
        :style="{ width: _iconSize }"
        :src="bottomIcon || defaultBottomIcon"
      >
      </image>
      <slot name="bottom"></slot>
    </view>
  </view>
</template>

<script>
import {
  centerIcon as defaultCenterIcon,
  leftIcon as defaultLeftIcon,
  topIcon as defaultTopIcon,
  bottomIcon as defaultBottomIcon,
} from "./config/iconBase64.js";
export default {
  props: {
    top: {
      type: [Number, String],
      default: "70%",
    },
    left: {
      type: [Number, String],
      default: "85%",
    },
    bgColor: {
      //按钮底色
      type: String,
      default: "rgb(235, 155, 50)",
    },
    size: {
      //按钮直径大小
      type: [Number, String],
      default: 80,
    },
    opacity: {
      type: Number,
      default: 0.8,
    },
    move: {
      //可移动
      type: Boolean,
      default: true,
    },
    centerIcon: {
      type: String,
      default: "",
    },
    topIcon: {
      type: String,
      default: "",
    },
    leftIcon: {
      type: String,
      default: "",
    },
    bottomIcon: {
      type: String,
      default: "",
    },
    zindex: {
      type: Number,
      default: 999,
    },
    iconSize: {
      //图标尺寸
      type: [Number, String],
      default: "100%",
    },
    turn: {
      //是否可以展开
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      first: true,
      open: false,
      elTop: "",
      elLeft: "",
      elRight: "",
      elBottom: "",
      _size: "",
      _iconSize: "",
      defaultCenterIcon,
      defaultLeftIcon,
      defaultTopIcon,
      defaultBottomIcon,
      windowHeight: "",
      windowWidth: "",
      rate: "",
      //#ifdef H5||APP
      windowTop: "",
      //#endif
    };
  },
  watch: {
    top: {
      handler(newval) {
        this.elTop = this.unitCheck(newval);
      },
      immediate: true,
    },
    left: {
      handler(newval) {
        this.elLeft = this.unitCheck(newval);
      },
      immediate: true,
    },
    right: {
      handler(newval) {
        this.elRight = this.unitCheck(newval);
      },
      immediate: true,
    },
    bottom: {
      handler(newval) {
        this.elBottom = this.unitCheck(newval);
      },
      immediate: true,
    },
    size: {
      handler(newval) {
        this._size = this.unitCheck(newval);
      },
      immediate: true,
    },
    iconSize: {
      handler(newval) {
        this._iconSize = this.unitCheck(newval);
      },
      immediate: true,
    },
  },
  mounted() {
    uni.getSystemInfo({
      success: (res) => {
        let width = res.windowWidth;
        let rate = 750.0 / width;
        this.windowHeight = res.windowHeight;
        this.windowWidth = width;
        this.rate = rate;
        //#ifdef H5||APP
        this.windowTop = res.windowTop;
        //#endif
      },
    });
  },
  methods: {
    unitCheck(value) {
      const val = String(value);
      if (!val.includes("px") && !val.includes("%")) {
        return `${val}rpx`;
      }
      return val;
    },
    onOpen() {
      if (this.turn) {
        this.open = !this.open;
        this.first = false;
        this.$emit(this.open ? "open" : "close");
      } else {
        this.$emit("click");
      }
    },
    onTouchMove(e) {
      if (!this.move) {
        return;
      }

      let x = e.touches[0].clientX;
      let y = e.touches[0].clientY;

      let tmpX = this.windowWidth - this.size / this.rate + this.size / 4;
      if (x < 0) {
        x = 0;
      } else if (x > tmpX) {
        x = tmpX;
      }

      //#ifndef H5||APP-PLUS
      let tmpY = this.windowHeight - this.size / this.rate + this.size/2;
      if (y < 0) {
        y = 0;
      } else if (y > tmpY) {
        y = tmpY;
      }
      //#endif
      this.elLeft = (x ? (x - this.size/4) : x) + "px";
      this.elTop = (y ? (y - this.size/4) : y) + "px";
    },
    onClickTop() {
      this.$emit("top");
    },
    onClickLeft() {
      this.$emit("left");
    },
    onClickBottom() {
      this.$emit("bottom");
    },
  },
};
</script>

<style lang="scss" scoped>
.px-suspen-button {
  position: fixed;
  z-index: 999;
}

.px-button {
  position: absolute;
  border-radius: 50%;
  top: 0rpx;
  left: 0rpx;
  height: 90rpx;
  width: 90rpx;
  background: rgb(235, 155, 50);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 999;
  overflow: hidden;

  &.center-button {
    z-index: 1000;
  }

  &.active {
    animation: 0.5s ease center forwards;
  }

  &.ot-button {
    display: none;
    opacity: 0;

    &.active-top {
      animation: 0.5s ease top forwards;
      display: flex;
    }

    &.hidden-top {
      animation: 0.5s ease hidetop forwards;
      display: flex;
    }

    &.active-left {
      animation: 0.5s ease left forwards;
      display: flex;
    }

    &.hidden-left {
      animation: 0.5s ease hideleft forwards;
      display: flex;
    }

    &.active-bottom {
      animation: 0.5s ease bottom forwards;
      display: flex;
    }

    &.hidden-bottom {
      animation: 0.5s ease hidebottom forwards;
      display: flex;
    }
  }
}

@keyframes center {
  0% {
  }

  100% {
    transform: rotate(315deg);
    opacity: 1;
  }
}

@keyframes bottom {
  0% {
    opacity: 0;
  }

  100% {
    top: 100rpx;
    left: -120rpx;
    transform: rotate(360deg);
    opacity: 1;
  }
}

@keyframes left {
  0% {
    opacity: 0;
  }

  100% {
    top: 0rpx;
    left: -180rpx;
    transform: rotate(360deg);
    opacity: 1;
  }
}

@keyframes top {
  0% {
    opacity: 0;
  }

  100% {
    top: -100rpx;
    left: -120rpx;
    transform: rotate(360deg);
    opacity: 1;
  }
}

@keyframes hideleft {
  0% {
    top: 0rpx;
    left: -180rpx;
    opacity: 1;
  }

  100% {
    top: 0rpx;
    left: 0rpx;
    transform: rotate(360deg);
    opacity: 0;
  }
}

@keyframes hidebottom {
  0% {
    top: 100rpx;
    left: -120rpx;
    opacity: 1;
  }

  100% {
    top: 0rpx;
    left: 0rpx;
    transform: rotate(360deg);
    opacity: 0;
  }
}

@keyframes hidetop {
  0% {
    top: -100rpx;
    left: -120rpx;
    opacity: 1;
  }

  100% {
    top: 0rpx;
    left: 0rpx;
    transform: rotate(360deg);
    opacity: 0;
  }
}
</style>
