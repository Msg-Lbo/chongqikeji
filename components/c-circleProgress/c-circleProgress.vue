<template>
  <view class="c-circle-progress" :style="{ width: `${size}rpx`, height: `${size}rpx` }">
    <view class="circle-wrapper" :style="{ width: `${size}rpx`, height: `${size}rpx` }">
      <canvas canvas-id="circleProgress" id="circleProgress" :style="{ width: `${size}rpx`, height: `${size}rpx` }"></canvas>
    </view>
    <view class="content-wrapper" :style="{ width: `${size}rpx`, height: `${size}rpx` }">
      <slot>
        <view class="default-content">
          <text class="value" :style="{ fontSize: `${size * 0.2}rpx`, color: textColor }">{{ percentage }}%</text>
          <text class="label" :style="{ fontSize: `${size * 0.08}rpx`, color: subTextColor }">{{ label }}</text>
        </view>
      </slot>
    </view>
  </view>
</template>

<script>
/**
 * c-circleProgress 圆形进度条
 * @description 自定义圆形进度条，支持自定义大小、颜色、背景色和文字内容
 * @property {Number} percentage 进度百分比，范围 0-100 （默认 0）
 * @property {Number} size 圆环大小，单位rpx （默认 200）
 * @property {Number} strokeWidth 圆环宽度，单位rpx （默认 10）
 * @property {String} strokeColor 圆环颜色 （默认 #FD0100）
 * @property {String} backgroundColor 圆环背景色 （默认 #EBEEF5）
 * @property {String} textColor 中心文字颜色 （默认 #1A1A1A）
 * @property {String} subTextColor 副文字颜色 （默认 #999999）
 * @property {String} label 中心文字标签 （默认 ''）
 * @property {Boolean} showText 是否显示中心文字 （默认 true）
 * @property {Boolean} clockwise 是否顺时针增加 （默认 true）
 * @slot default 自定义中心内容
 */

export default {
  name: 'c-circleProgress',
  props: {
    // 进度百分比，范围 0-100
    percentage: {
      type: Number,
      default: 0
    },
    // 圆环大小，单位rpx
    size: {
      type: Number,
      default: 200
    },
    // 圆环宽度，单位rpx
    strokeWidth: {
      type: Number,
      default: 10
    },
    // 圆环颜色
    strokeColor: {
      type: String,
      default: '#FD0100'
    },
    // 圆环背景色
    backgroundColor: {
      type: String,
      default: '#EBEEF5'
    },
    // 中心文字颜色
    textColor: {
      type: String,
      default: '#1A1A1A'
    },
    // 副文字颜色
    subTextColor: {
      type: String,
      default: '#999999'
    },
    // 中心文字标签
    label: {
      type: String,
      default: ''
    },
    // 是否显示中心文字
    showText: {
      type: Boolean,
      default: true
    },
    // 是否顺时针增加
    clockwise: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      ctx: null,
      canvasWidth: 0,
      canvasHeight: 0,
      pixelRatio: 1
    };
  },
  watch: {
    percentage: {
      handler(newVal) {
        this.drawCircle();
      },
      immediate: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
  methods: {
    // 初始化画布
    init() {
      const query = uni.createSelectorQuery().in(this);
      query.select('#circleProgress').boundingClientRect(data => {
        // 获取画布宽高
        this.canvasWidth = data.width;
        this.canvasHeight = data.height;
        
        // 获取设备像素比
        const info = uni.getSystemInfoSync();
        this.pixelRatio = info.pixelRatio || 1;
        
        // 创建canvas上下文
        this.ctx = uni.createCanvasContext('circleProgress', this);
        
        // 绘制圆环
        this.drawCircle();
      }).exec();
    },
    
    // 绘制圆环
    drawCircle() {
      if (!this.ctx) return;
      
      const ctx = this.ctx;
      const centerX = this.canvasWidth / 2;
      const centerY = this.canvasHeight / 2;
      const radius = (this.canvasWidth - this.strokeWidth) / 2;
      const lineWidth = uni.upx2px(this.strokeWidth);
      
      // 清空画布
      ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      
      // 绘制灰色背景圆环
      ctx.beginPath();
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = this.backgroundColor;
      ctx.lineCap = 'round'; // 设置线段端点为圆角
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
      ctx.stroke();
      
      // 计算弧度
      const percentage = Math.min(Math.max(this.percentage, 0), 100);
      const angle = this.clockwise 
        ? (percentage / 100) * 2 * Math.PI - 0.5 * Math.PI
        : -(percentage / 100) * 2 * Math.PI + 1.5 * Math.PI;
      
      // 绘制进度条圆环
      ctx.beginPath();
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = this.strokeColor;
      ctx.lineCap = 'round'; // 设置线段端点为圆角
      ctx.arc(
        centerX, 
        centerY, 
        radius, 
        -0.5 * Math.PI, // 从12点方向开始
        angle,
        !this.clockwise
      );
      ctx.stroke();
      
      // 绘制
      ctx.draw();
    }
  }
};
</script>

<style lang="scss" scoped>
.c-circle-progress {
  position: relative;
  
  .circle-wrapper {
    position: absolute;
    top: 0;
    left: 0;
  }
  
  .content-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .default-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      
      .value {
        font-weight: bold;
        margin-bottom: 8rpx;
      }
      
      .label {
        font-size: 24rpx;
      }
    }
  }
}
</style> 