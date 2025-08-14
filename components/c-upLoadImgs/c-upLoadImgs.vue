<template>
    <view class="upload-container">
        <!-- 上传图片多个 -->
        <u-upload
            v-if="!echo"
            :fileList="fileList"
            :accept="accept"
            @delete="deletePic"
            @afterRead="afterRead"
            @preview="handlePreview"
            name="3"
            multiple
            :maxCount="maxCount"
            :previewFullImage="false"
            :width="width"
            :height="height"
            :deletable="deletable">
            <!-- <image src="/static/common/upLoad-icon.png" :style="{ width: width, height: height }" mode=""></image> -->
            <view class="upload-icon" :style="{ width: width, height: height, borderRadius: '8rpx', border: `2rpx dashed ${color}` }">
                <slot>
                    <u-icon name="plus" size="24rpx" :color="color"></u-icon>
                </slot>
            </view>
        </u-upload>
        <view class="ec-box" v-else>
            <image v-for="(v, i) in fileList" :key="i" @click="previewImg" :style="{ width: width, height: height }" :src="v.url"> </image>
        </view>

        <!-- 视频预览弹窗 -->
        <u-modal
            v-model="showVideoPreview"
            :mask-close-able="true"
            :show-cancel-button="false"
            :show-confirm-button="false"
            :width="600"
            :border-radius="16">
            <view class="video-preview-container">
                <video
                    v-if="currentVideoUrl"
                    :src="currentVideoUrl"
                    controls
                    :style="{ width: '100%', height: '300px' }"
                    @error="onVideoError"></video>
                <view class="video-close-btn" @click="closeVideoPreview">
                    <u-icon name="close-circle-fill" size="32" color="#999"></u-icon>
                </view>
            </view>
        </u-modal>
    </view>
</template>

<script>
/*
 * c-upLoadImgs
 * @description 上传图片
 * @property {Number | String} accept上传文件格式（默认 image）
 * @property {Number | String} maxCount最多上传数（默认 1）
 * @property {Number | String} width宽度（默认 200rpx）
 * @property {Number | String} height高度（默认 200rpx）
 * @property {Number | String} file文件字段 使用时加上.sync  file.sync
 * @property {Boolean} deletable是否能删除（默认 true）
 * @property {Boolean} echo回显模式(不能修改)（默认 false）
 * @property {Array} format返回数据格式（默认 Array）
 * @property { Number | String} maxSize限制图片上传大小（默认 10MB）
 * @slot default - 自定义上传按钮的内容。
 *
 * */
export default {
    props: {
        // 上传文件格式 video
        accept: {
            default: "image",
            type: String,
        },
        // 最多上传数
        maxCount: {
            default: 1,
            type: Number | String,
        },
        // 宽度
        width: {
            default: "200rpx",
            type: Number | String,
        },
        // 高度
        height: {
            default: "200rpx",
            type: Number | String,
        },
        // 文件字段 使用时加上.sync  file.sync
        file: {
            default: () => [],
            type: Array | String,
        },
        // 是否能删除
        deletable: {
            default: true,
            type: Boolean,
        },
        // 回显模式(不能修改)
        echo: {
            default: false,
            type: Boolean,
        },
        // 返回数据格式
        format: {
            default: "Array",
            type: String,
        },
        // 限制图片上传大小 默认10MB
        maxSize: {
            default: 10 * 1024 * 1024,
            type: Number | String,
        },
        color: {
            default: "#999",
            type: String,
        },
        // 是否返回全路径
        isFull: {
            default: false,
            type: Boolean,
        },
    },
    data() {
        return {
            fileList: [],
            showVideoPreview: false,
            currentVideoUrl: "",
        };
    },
    watch: {
        file: {
            handler(newValue) {
                this.handleImg(newValue);
            },
        },
    },
    mounted() {
        if (this.file && this.file.length > 0) {
            this.handleImg(this.file);
        } else {
            // 即使没有初始文件，也要发射一次空数组事件
            this.emitFileUpdate();
        }
    },
    computed: {
        vuex_imgUrl() {
            return this.$store.state.vuex_imgUrl;
        },
    },
    methods: {
        // 处理图片格式
        handleImg(newValue) {
            if (!newValue || !Array.isArray(newValue)) {
                this.fileList = [];
                this.emitFileUpdate();
                return;
            }
            
            this.fileList = newValue.map((v) => {
                if (v.uploadResult && v.uploadResult.fileName) {
                    return {
                        url: this.getDisplayUrl(v.uploadResult.fileName), // 预览用完整URL
                        uploadResult: v.uploadResult, // 保存完整上传结果
                    };
                } else if (typeof v === 'string') {
                    // 如果是字符串，可能是fileName
                    return {
                        url: this.getDisplayUrl(v),
                        fileName: v, // 保存原始fileName
                    };
                }
                return v;
            });
            
            // 处理完数据后发射更新事件
            this.emitFileUpdate();
        },

        // 格式化图片/视频URL（根据isFull属性决定返回格式）
        formatUrl(url) {
            if (!url) return "";
            // 如果isFull为true，返回拼接的完整路径
            if (this.isFull) {
                return this.vuex_imgUrl + url;
            } else {
                return url;
            }
        },

        // 获取显示用的完整URL（用于回显和预览，总是返回完整路径）
        getDisplayUrl(url) {
            if (!url) return "";

            // 如果已经是完整URL，直接返回
            if (url.startsWith("http://") || url.startsWith("https://")) {
                return url;
            }

            // 如果是相对路径，拼接成完整URL
            return this.vuex_imgUrl + url;
        },

        // 判断是否为完整URL（保留原函数，用于其他地方可能的调用）
        isFullUrl(url) {
            return url && (url.startsWith("http://") || url.startsWith("https://"));
        },

        // 统一处理文件更新事件发射
        emitFileUpdate() {
            let result = this.fileList.map((item) => {
                let pathToEmit = "";
                
                if (item.uploadResult && item.uploadResult.fileName) {
                    // 有上传结果的情况
                    pathToEmit = this.isFull 
                        ? this.vuex_imgUrl + item.uploadResult.fileName  // 完整URL
                        : item.uploadResult.fileName;  // 只要fileName
                } else if (item.fileName) {
                    // 只有fileName的情况
                    pathToEmit = this.isFull 
                        ? this.vuex_imgUrl + item.fileName  // 完整URL
                        : item.fileName;  // 只要fileName
                } else if (item.url) {
                    // 兜底：从url中提取
                    if (this.isFullUrl(item.url)) {
                        pathToEmit = this.isFull 
                            ? item.url  // 已经是完整URL
                            : item.url.replace(this.vuex_imgUrl, '');  // 去掉前缀
                    } else {
                        pathToEmit = this.isFull 
                            ? this.vuex_imgUrl + item.url  // 拼接完整URL
                            : item.url;  // 直接使用
                    }
                }
                
                return pathToEmit;
            }).filter(item => item !== "");

            // 根据format决定返回数组还是字符串
            if (this.format === "string" || this.format === "String") {
                result = result.join(",");
            }

            console.log(`发射 update:file 事件 (isFull: ${this.isFull}):`, result);
            this.$emit("update:file", result);
        },
        // 删除图片
        deletePic(e) {
            console.log("删除图片:", e);
            this.fileList.splice(e.index, 1);
            this.emitFileUpdate();
        },
        // 新增图片
        async afterRead(event) {
            // 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
            let lists = [].concat(event.file);
            let fileListLen = this.fileList.length;
            
            // 添加上传中的状态显示
            lists.map((item) => {
                this.fileList.push({
                    ...item,
                    status: "uploading",
                    message: "上传中",
                });
            });
            
            // 逐个上传文件
            for (let i = 0; i < lists.length; i++) {
                try {
                    const result = await this.uploadFilePromise(lists[i].url);
                    let currentIndex = fileListLen + i;
                    
                    console.log("上传结果:", result);
                    
                    if (result && result.fileName) {
                        // 更新fileList项目
                        this.fileList.splice(currentIndex, 1, {
                            status: "success",
                            message: "",
                            url: this.getDisplayUrl(result.fileName), // 预览用完整URL
                            uploadResult: result, // 保存完整的上传结果
                        });
                    } else {
                        // 上传失败处理
                        this.fileList.splice(currentIndex, 1, {
                            status: "failed",
                            message: "上传失败",
                            url: lists[i].url,
                        });
                    }
                } catch (error) {
                    console.error("上传失败:", error);
                    let currentIndex = fileListLen + i;
                    this.fileList.splice(currentIndex, 1, {
                        status: "failed", 
                        message: "上传失败",
                        url: lists[i].url,
                    });
                }
            }

            console.log("上传完成后的 fileList:", this.fileList);
            
            // 发射更新事件
            this.emitFileUpdate();
        },
        // 上传图片
        uploadFilePromise(url) {
            return new Promise((resolve, reject) => {
                let a = uni.uploadFile({
                    url: this.vuex_baseUrl + "/common/upload",
                    filePath: url,
                    name: "file",
                    formData: {
                        user: "test",
                    },
                    success: (res) => {
                        console.log("res", res);
                        setTimeout(() => {
                            resolve(JSON.parse(res.data));
                        }, 1000);
                    },
                });
            });
        },
        // 图片预览
        previewImg() {
            uni.previewImage({
                urls: this.fileList.map((v) => this.getDisplayUrl(v.url)),
            });
        },

        // 处理预览点击
        handlePreview(file, index) {
            console.log("预览点击:", file, this.accept);
            if (this.accept === "video") {
                this.previewVideo(file);
            } else if (this.accept === "image") {
                this.previewImage();
            }
        },

        // 图片预览
        previewImage() {
            uni.previewImage({
                urls: this.fileList.map((v) => this.getDisplayUrl(v.url)),
            });
        },

        // 视频预览
        previewVideo(file) {
            this.currentVideoUrl = this.getDisplayUrl(file.url);
            this.showVideoPreview = true;
        },

        // 关闭视频预览
        closeVideoPreview() {
            this.showVideoPreview = false;
            this.currentVideoUrl = "";
        },

        // 视频加载错误
        onVideoError(e) {
            console.error("视频加载失败:", e);
            uni.showToast({
                title: "视频加载失败",
                icon: "none",
            });
        },
    },
};
</script>

<style lang="scss" scoped>
::v-deep .u-upload__wrap__preview {
    margin: 0;
}
.upload-icon {
    border-radius: 8rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}
.ec-box {
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    image {
        // border: 1rpx solid red;
        margin-right: 10rpx;
        margin-bottom: 10rpx;
    }
}

// 视频预览样式
.video-preview-container {
    position: relative;
    padding: 20rpx;

    .video-close-btn {
        position: absolute;
        top: 10rpx;
        right: 10rpx;
        z-index: 10;
        padding: 10rpx;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>
