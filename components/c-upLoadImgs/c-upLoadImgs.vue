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
                    :style="{width: '100%', height: '300px'}"
                    @error="onVideoError">
                </video>
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
    },
    data() {
        return {
            fileList: [],
            showVideoPreview: false,
            currentVideoUrl: '',
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
        if (this.file) {
            this.handleImg(this.file);
        }
    },
    methods: {
        // 处理图片格式
        handleImg(newValue) {
            // console.log('newValue',newValue);
            if (typeof newValue == "object") {
                this.fileList =
                    newValue.map((v) => {
                        return {
                            url: this.isFullUrl(v) ? v : this.vuex_imgUrl + v,
                        };
                    }) || [];
            } else if (newValue.includes(",")) {
                this.fileList = newValue.split(",").map((v) => {
                    return {
                        url: this.isFullUrl(v) ? v : this.vuex_imgUrl + v,
                    };
                });
            } else {
                this.fileList = [
                    {
                        url: this.isFullUrl(newValue) ? newValue : this.vuex_imgUrl + newValue,
                    },
                ];
            }
        },
        
        // 判断是否为完整URL
        isFullUrl(url) {
            return url && (url.startsWith('http://') || url.startsWith('https://'));
        },
        // 删除图片
        deletePic(e) {
            console.log("e", e);
            this.fileList.splice(e.index, 1);
            let arr = this.fileList.map((v, i) => {
                if (v.url && typeof v.url === 'string') {
                    return v.url; // 返回完整URL
                } else if (v.uploadResult && v.uploadResult.fileName) {
                    return this.vuex_imgUrl + v.uploadResult.fileName; // 拼接完整URL
                }
                return '';
            }).filter(item => item !== '');
            
            if (this.format == "string" || this.format == "String") {
                arr = arr.join(",");
            }
            this.$emit("update:file", arr);
        },
        // 新增图片
        async afterRead(event) {
            // 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
            let lists = [].concat(event.file);
            let fileListLen = this.fileList.length;
            lists.map((item) => {
                this.fileList.push({
                    ...item,
                    status: "uploading",
                    message: "上传中",
                });
            });
            for (let i = 0; i < lists.length; i++) {
                const result = await this.uploadFilePromise(lists[i].url);
                let item = this.fileList[fileListLen];
                // 从上传结果中提取fileName并拼接完整URL
                let actualUrl = '';
                if (result && result.fileName) {
                    actualUrl = this.vuex_imgUrl + result.fileName;
                }
                this.fileList.splice(
                    fileListLen,
                    1,
                    Object.assign(item, {
                        status: "success",
                        message: "",
                        url: actualUrl,
                        uploadResult: result, // 保存完整的上传结果以备后用
                    })
                );
                fileListLen++;
            }

            console.log("this.fileList", this.fileList);
            let arr = this.fileList.map((v, i) => {
                if (v.url && typeof v.url === 'string') {
                    return v.url; // 返回完整URL
                } else if (v.uploadResult && v.uploadResult.fileName) {
                    return this.vuex_imgUrl + v.uploadResult.fileName; // 拼接完整URL
                }
                return '';
            }).filter(item => item !== '');
            if (this.format == "string" || this.format == "String") {
                arr = arr.join(",");
            }
            console.log("arr", arr);
            this.$emit("update:file", arr);
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
                urls: this.fileList.map((v) => v.url),
            });
        },
        
        // 处理预览点击
        handlePreview(file, index) {
            console.log('预览点击:', file, this.accept);
            if (this.accept === 'video') {
                this.previewVideo(file);
            } else if (this.accept === 'image') {
                this.previewImage();
            }
        },
        
        // 图片预览
        previewImage() {
            uni.previewImage({
                urls: this.fileList.map((v) => v.url),
            });
        },
        
        // 视频预览
        previewVideo(file) {
            this.currentVideoUrl = file.url;
            this.showVideoPreview = true;
        },
        
        // 关闭视频预览
        closeVideoPreview() {
            this.showVideoPreview = false;
            this.currentVideoUrl = '';
        },
        
        // 视频加载错误
        onVideoError(e) {
            console.error('视频加载失败:', e);
            uni.showToast({
                title: '视频加载失败',
                icon: 'none'
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
