<template>
  <div class="wang-editor" v-loading="uploadEditorImageLoading">
    <div id="editor-title" class="editor-title"></div>
    <div id="editor-content" class="editor-content"></div>
    <div class="el-form-item__error">{{ contentWarning }}</div>

    <div id="copy" style="height: 0; opacity: 0;"></div>
  </div>
</template>

<script>
import configUrls from '../../config/urls'
import { getSign, uploadImageData } from '../../api/upload.js'
export default {
  props: {
    isGetContent: {
      type: Boolean,
      default: false
    },
    content: {
      type: String,
      default: ''
    },
    editorMenus: {
      type: Array,
      default() {
        return [
          'head', // 标题
          'bold', // 粗体
          'fontSize', // 字号
          'fontName', // 字体
          'italic', // 斜体
          'underline', // 下划线
          'strikeThrough', // 删除线
          'foreColor', // 文字颜色
          'backColor', // 背景颜色
          'link', // 插入链接
          'list', // 列表
          'justify', // 对齐方式
          'quote', // 引用
          // 'emoticon', // 表情
          'image', // 插入图片
          // 'table', // 表格
          // 'video', // 插入视频
          // 'code', // 插入代码
          'undo', // 撤销
          'redo' // 重复
        ]
      }
    }
  },
  data() {
    return {
      urls: {
        getUploadSign: '/houtai/event/sign' // 获取上传图片签名
      },

      editor: undefined, // 编辑器实例
      uploadEditorImageLoading: false, // 上次图片时的loading
      contentWarning: ''
    }
  },
  components: {

  },
  computed: {

  },
  watch: {
    content(val) {
      let _this = this
      if (_this.editor) {
        _this.editor.txt.html(val)
      }
    },
    isGetContent(val) {
      if (val) {
        this.getContent()
      }
    }
  },
  created() {

  },
  mounted() {
    let _this = this,
      E = require('wangeditor') // 使用 npm 安装

    _this.editor = new E('#editor-title', '#editor-content') // 创建编辑器
    _this.editor.customConfig.menus = _this.editorMenus
    _this.editor.customConfig.zIndex = 100
    // _this.editor.customConfig.uploadImgShowBase64 = true; // 使用 base64 保存图片
    _this.editor.customConfig.uploadImgServer = configUrls.medialibs // 上传图片
    _this.editor.customConfig.uploadImgMaxSize = 3 * 1024 * 1024 // 不超过3M
    _this.editor.customConfig.uploadImgMaxLength = 100 // 不多于100张
    _this.editor.customConfig.customAlert = (info) => { // 自定义提示 info 是需要提示的内容
      _this.$message(info)
    }
    _this.editor.customConfig.customUploadImg = (files, insert) => { // 自定义上次图片
      // files 是 input 中选中的文件列表
      // insert 是获取图片 url 后，插入到编辑器的方法
      _this.uploadEditorImageLoading = true

      // 返回的msg是一个数组
      _this.uploadFile(files, (msg) => {
        _this.uploadEditorImageLoading = false
        // res && insert(res.accessUrl);// 上传代码返回结果之后，将图片插入到编辑器中
        if (Array.isArray(msg)) {
          msg.forEach(imgInfo => {
            insert(imgInfo.accessUrl)
          })
        }
      })
    }

    // 拦截COPY内容
    _this.editor.customConfig.pasteTextHandle = (content) => {
      let reg = /xmlns:o="urn:schemas-microsoft-com:office:office"/,
        editorContent
      if (reg.test(content)) {
        let copy = document.getElementById('copy')
        copy.innerHTML = content
        editorContent = copy.innerText
      } else {
        editorContent = content
      }
      return editorContent
    }

    _this.editor.create()
  },
  methods: {
    // 获取编辑器数据
    getContent() {
      let _this = this,
        imageList = [],
        contentText = _this.editor.txt.text(),
        contentHtml = _this.editor.txt.html(),
        editorData = {
          isValidate: false,
          content: contentHtml
        }

      // 匹配图片（g表示匹配所有结果i表示区分大小写）
      var imgReg = /<img.*?(?:>|\/>)/gi,
        srcReg = /src=['"]?([^'"]*)['"]?/i, // 匹配src属性
        arr = contentHtml.match(imgReg) // 匹配的img列表
      if (Array.isArray(arr)) {
        for (let i = 0; i < arr.length; i++) {
          let src = arr[i].match(srcReg)
          // 获取图片地址
          if (src[1]) {
            imageList.push(src[1])
          }
        }
      }

      if (contentText == '' && imageList.length === 0) { // 无文本，并且无图片
        _this.contentWarning = '内容不能为空'
        editorData.isValidate = false
      } else if (contentText.length > 10000) {
        _this.contentWarning = '内容不能超过10000字'
        editorData.isValidate = false
      } else {
        _this.contentWarning = ''
        editorData.isValidate = true
      }

      _this.$emit('update:isGetContent', false)

      _this.$emit('getEditorContent', editorData)

      return editorData
    },

    /**
     * 上传图片
     * @param {Object} fileList file对象 数组
     * @param {Function} callback 上传成功之后的回调函数
     */
    uploadFile(fileList, callback) {
      let _this = this,
        saveSign = sessionStorage.uploadSign ? JSON.parse(sessionStorage.uploadSign) : ''

      if (saveSign && (Date.now() - saveSign.date < 9 * 60 * 1000)) {
        // 上传图片
        _this.uploadImageData(fileList, saveSign.sign, callback)
      } else {
        _this.getUploadSign().then(data => {
          // 保存上传图片签名
          sessionStorage.setItem('uploadSign', JSON.stringify({
            date: Date.now(),
            sign: data
          }))

          // 上传图片
          _this.uploadImageData(fileList, data, callback)
        }).catch(() => {
          callback && callback()
        })
      }
    },

    /**
     * 上传图片数据
     * @param {Object} fileList 文件信息列表
     * @returns {Promise | Boolean} 返回promise对象
     */
    uploadImageData(fileList, sign, callback) {
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

      // 上传图片数据

      uploadImageData(formData, sign).then(res => {
        callback && callback(res)
      }).catch(() => {
        callback && callback()
      })
    },

    /**
     * 获取上传图片签名
     * @param {Function} callback 签名获取成功之后的回调函数
     */
    getUploadSign(callback) {
      return new Promise((resolve, reject) => {
        getSign(this.urls.getUploadSign).then(res => {
          callback && callback(res)
          resolve(res)
        }).catch((e) => {
          reject(e)
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
.wang-editor {
  .editor-title {
    width: 800px;
    border: 1px solid #ccc;
  }
  .editor-content {
    width: 800px;
    height: 600px;
    border: 1px solid #ccc;
    border-top: none;
  }
}
</style>
