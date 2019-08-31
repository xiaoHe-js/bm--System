<template>
  <div class="editor-upload-image">
     <el-upload
      action=""
      :http-request="upload"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-exceed="overLength"
      :limit='limit'>
      <i class="el-icon-plus"></i>
    </el-upload>

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { getSign, uploadImageData } from '../api/upload.js'

export default {
  name: 'editorUploadImage',
  // mixins: [uploadFileMixins],
  props: {
    // 默认图片
    defaultImage: {
      type: Array
    },
    // 是否预览， 默认不预览
    isPreview: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number,
      default: 1
    },
    // 需要在回调中注入的参数
    params: {
      type: Object,
      default() {
        return null
      }
    },
    // 图片尺寸验证信息
    imgCheckInfo: {
      type: Object,
      default: () => {
        return {
          // imageSize: 150,
          // imageSuffix: ['PNG', 'JPG', 'GIF'],
          // spec: [
          //   {width: 640, height: 100}
          // ]
        }
      }
    }
  },
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  methods: {
    // 超过限制张数
    overLength() {
      let size = this.limit
      this.$message({
        message: `最多可上传${size}张图片`,
        type: 'warning'
      })
    },
    // 删除图片的回调
    handleRemove(file, fileList) {
      console.log('删除图片--', file, fileList)
      let imgArr = []
      if (fileList.length > 0) {
        fileList.map(item => {
          imgArr.push(item.url)
        })
      }
      this.$emit('change', imgArr, true)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 选择图片执行的操作
    upload(data) {
      let _this = this,
        file = data.file,
        size = file.size || file.fileSize,
        type = file.type,
        imgCheckInfo = _this.imgCheckInfo,
        imageSuffix = imgCheckInfo.imageSuffix // 后缀

      _this.checkSuffix(type, imageSuffix).then(() => {
        _this.previewImage(file).then(res => {
          let imgInfo = {
            width: res.width,
            height: res.height,
            size: size
          }

          _this.checkImage(imgInfo, _this.imgCheckInfo).then(() => {
            _this.uploadFile([file])
          })
        })
      })
    },

    /**
     * 验证图片
     * imageSize: 150,
     * imageSuffix: ['PNG', 'JPG', 'GIF'],
     * spec: [
     *  {width: 640, height: 100}
     * ]
     */
    checkImage(imgInfo, imgCheckInfo) {
      return new Promise((resolve, reject) => {
        let _this = this,
          width = imgInfo.width,
          height = imgInfo.height,
          size = imgInfo.size,
          imageSize = imgCheckInfo.imageSize, // 大小
          spec = imgCheckInfo.spec // 规格

        Promise.all([
          _this.checkSize(size, imageSize),
          _this.checkSpec({ width, height }, spec)
        ])
          .then(() => {
            resolve()
          })
          .catch(() => {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject()
          })
      })
    },

    /**
     * 验证图片 大小
     * size 图片尺寸,
     * imageSize 图片验证尺寸,
     * ]
     */
    checkSize(size, imageSize) {
      return new Promise((resolve, reject) => {
        if (!imageSize || size < imageSize * 1024) {
          resolve()
        } else {
          this.$message({
            type: 'warning',
            message: `图片大小不大于${imageSize}kb`
          })
          // eslint-disable-next-line prefer-promise-reject-errors
          reject()
        }
      })
    },

    /**
     * 验证图片 后缀
     * suffix 文件类型,
     * imageSuffix 图片后缀
     */
    checkSuffix(suffix, imageSuffix) {
      return new Promise((resolve, reject) => {
        let ischeckSuffix = imageSuffix && imageSuffix.length // 是否验证尺寸

        if (!ischeckSuffix) {
          resolve()
        } else {
          let isPass = imageSuffix.some(item => {
            let index = suffix.toLowerCase().indexOf(item.toLowerCase())

            return index != -1
          })

          if (isPass) {
            resolve()
          } else {
            this.$message({
              type: 'warning',
              message: '请选择图片'
            })
            // eslint-disable-next-line prefer-promise-reject-errors
            reject()
          }
        }
      })
    },

    /**
     * 验证图片 验证规格
     * specInfo 文件信息, {width: 640, height: 100}
     * spec 图片验证 规格,
     */
    checkSpec(specInfo, spec) {
      return new Promise((resolve, reject) => {
        let ischeckSpec = spec && spec.length // 是否验证

        if (!ischeckSpec) {
          resolve()
        } else {
          let isPass = spec.some(item => {
            return (
              item.width == specInfo.width && item.height == specInfo.height
            )
          })

          if (isPass) {
            resolve()
          } else {
            this.$message({
              type: 'warning',
              message: `图片尺寸不对`
            })
            // eslint-disable-next-line prefer-promise-reject-errors
            reject()
          }
        }
      })
    },

    /**
     * 预览图片
     */
    previewImage(file) {
      var render = new FileReader()

      render.readAsDataURL(file)

      // 图片预览完成后的函数
      return new Promise((resolve, reject) => {
        render.onload = function(file) {
          let data = file.target.result,
            image = new Image()

          image.onload = function() {
            resolve({
              imgSrc: data,
              width: image.width,
              height: image.height
            })
          }

          image.onerror = function(e) {
            reject(e)
          }

          image.src = data
        }
      })
    },

    /**
     * 上传图片
     * @param {Object} fileList file对象 数组
     * @param {Function} callback 上传成功之后的回调函数
     */
    uploadFile(fileList, callback) {
      let _this = this,
        saveSign = sessionStorage.uploadSign
          ? JSON.parse(sessionStorage.uploadSign)
          : ''

      if (saveSign && Date.now() - saveSign.date < 9 * 60 * 1000) {
        // 上传图片
        _this.uploadData(fileList, saveSign.sign).then(res => {
          _this.uploadSuccess(res)
        })
      } else {
        getSign().then(data => {
          // 保存上传图片签名
          sessionStorage.setItem(
            'uploadSign',
            JSON.stringify({
              date: Date.now(),
              sign: data
            })
          )

          // 上传图片
          _this.uploadData(fileList, data).then(res => {
            _this.uploadSuccess(res)
          })
        })
      }
    },

    // 上传成功执行的回调函数
    uploadSuccess(res) {
      let _this = this
      _this.$emit('change', res)
    },

    /**
     * 上传图片数据
     * @param {Object} fileList 文件信息列表
     * @returns {Promise | Boolean} 返回promise对象
     */
    uploadData(fileList, sign, callback) {
      if (fileList.length == 0) {
        return false
      }
      if (!sign) {
        return false
      }
      let formData = new FormData()

      fileList.forEach(file => {
        formData.append('files[]', file)
      })

      return new Promise((resolve, reject) => {
        uploadImageData(sign, formData).then(res => {
          if (res) {
            resolve(res)
          }
        })
          .catch(() => {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject()
          })
      })
    },

    /**
     * 判断图片尺寸
     * @param {Object} file 文件对象
     * @param {Object} imageSizeInfo 需要限制的尺寸 {width: xxx(number), height: xxx(number)}
     */
    checkImageSize(fileData, imageSizeInfo) {
      let _this = this

      return new Promise((resolve, reject) => {
        _this
          .getFileSize(fileData)
          .then(res => {
            // 判断图片尺寸是否符合, 符合返回1  不符合返回 0
            if (
              res.width / res.height ===
              imageSizeInfo.width / imageSizeInfo.height
            ) {
              resolve(1)
            } else {
              resolve(0)
            }
          })
          .catch(e => {
            _this.$message({
              message: '获取图片文件失败，请重试',
              type: 'error'
            })
            reject(e)
          })
      })
    },

    /**
     * 获取图片file的长宽
     * @param {Object} file 图片对象
     * @returns {Object} 返回该图片的宽和高
     */
    getFileSize(file) {
      if (!file) return false

      let reader = new FileReader()

      return new Promise((resolve, reject) => {
        reader.onload = function(e) {
          let data = e.target.result,
            image = new Image()

          image.onload = function() {
            resolve({
              width: image.width,
              height: image.height
            })
          }

          image.onerror = function(e) {
            reject(e)
          }

          image.src = data
        }

        reader.readAsDataURL(file)
      })
    }
  }
}
</script>

<style lang="less">
.editor-upload-image {
  .upload-image-inner {
    width: 260px;

    .el-upload-dragger {
      width: 260px;
      height: 156px;
    }

    .el-upload--text {
      width: auto;
      height: auto;
    }
  }

  .preview-image {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 148px;
    height: 148px;

    img {
      max-width: 100%;
    }
  }
}
</style>
