<template>
  <div class='pdd-detail'>
    <div class='box'>
      <span class='left-title'>商品名称</span>
      <el-input class='name' v-model="form.name" placeholder="请输入商品名称"></el-input>
    </div>
    <div class='box'>
      <span class='left-title'>商品缩略图</span>
      <UploadImage @change="handlerMinImg" :limit="1" :defaultImage="form.thumbPic" :isPreview="true"></UploadImage>
    </div>

    <div class='box'>
      <span class='left-title'>商品轮播图</span>
      <UploadImage @change="handlerBanner" :limit="6" :defaultImage="form.bannerPic" :isPreview="true"></UploadImage>
    </div>
    <div class='box'>
      <span class='left-title'>商品描述</span>
      <wangEditor
        :editorMenus="editorMenus"
        :content="form.desc"
        ref="editor"
        v-model="form.desc"
      ></wangEditor>
    </div>

    <div class="price-box">
      <h3>商品价格</h3>
      <div>
          <p>
            <span class='title'>原价</span>
            <span><el-input v-model="form.originalPrice" :disabled="true"></el-input>元</span>
          </p>
          <p>
            <span class='title'>优惠券</span>
            <span><el-input v-model="form.couponValue" :disabled="true"></el-input> 元</span>
          </p>
      </div>
      <div>
          <p>
            <span class='title'>领券购买</span>
            <span><el-input v-model="couponsPrice" :disabled="true" ></el-input>元</span>
          </p>
          <p>
            <span class='title'>返现比例</span>
            <span><el-input v-model="cashbackRate" :disabled="true"></el-input> %</span>
            <span style="margin-left:10px;">返现金额<i>{{cashbackCNY}}</i>元</span>
          </p>
      </div>
      <div>
          <p>
            <span class='title'>积分换购</span>
            <span><el-input v-model="Integral"></el-input>积分+</span>
            <span>{{couponsPrice}}元（券后）</span>
          </p>
          <p>
            <span class='title' >返现比例</span>
            <span><el-input v-model="IntegralCashbackRate" :disabled="true"></el-input> %</span>
            <span style="margin-left:10px;">返现金额<i>{{cashbackGBT}}</i>元</span>
          </p>
      </div>
    </div>

    <div class='button-box'>
      <el-button type="info" class='go-back' plain @click="goBack">取消</el-button>
      <el-button type="primary" class='next' @click="submit">保存</el-button>
    </div>
  </div>
</template>
<script>
import UploadImage from '../../components/UploadImage.vue'
import wangEditor from '../../components/editor/wangEditor'
export default {
  data() {
    return {
      deatilData: '',
      form: {
        name: '', // 商品名称
        thumbPic: [], // 商品缩略图
        bannerPic: [], // 商品轮播图
        desc: '', // 商品描述
        goodsId: '', // 商品id
        goodsType: 1, // 类型
        originalPrice: '', // 商品原价
        couponValue: '', // 优惠券面值
        salesConfig: [
          {
            amount: 0, // 领券购买金额
            promotionRate: '', // 领券购买返现比例
            type: 'CNY' // 类型---人民币
          },
          {
            amount: 0, // 积分金额
            promotionRate: '', // 积分购买返现比例
            type: 'GBT' // 类型---gbt
          }
        ]
      },
      couponsPrice: 0, // 领券购买
      cashbackRate: '', // 返现比例
      Integral: '', // 积分换购
      IntegralCashbackRate: '', // 积分换购返现比例
      cashbackCNY: 0, // CNY返现金额
      cashbackGBT: 0, // GBT返现金额
      editorMenus: [
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
        // 'image', // 插入图
        // 'video', // 插入视频
        'undo', // 撤销
        'redo' // 重复
      ]
    }
  },
  components: {
    UploadImage,
    wangEditor
  },
  mounted() {
    let vm = this
    this.deatilData = JSON.parse(sessionStorage.getItem('data'))
    console.log('this.deatilData--', this.deatilData)
    for (let key in vm.form) {
      // 将后台数据回填到表单
      vm.form[key] = this.deatilData[key]
    }
    vm.form.salesConfig.map(item => {
      if (item.type === 'CNY') {
        this.couponsPrice = item.amount
        this.cashbackRate = item.promotionRate / 100
      } else {
        this.Integral = item.amount
        this.IntegralCashbackRate = item.promotionRate / 100
      }
    })
    this.cashbackCNY = this.couponsPrice * this.cashbackRate / 100
    this.cashbackGBT = this.couponsPrice * this.IntegralCashbackRate / 100
  },
  methods: {
    // 处理轮播图片
    handlerBanner(data, isdelete) {
      if (isdelete) {
        this.banner = data
      } else {
        if (data[0]) {
          this.banner.push(data[0].accessUrl)
        }
      }
      console.log('BANNER---', this.banner)
    },
    // 处理缩略图片
    handlerMinImg(data) {
      console.log('DATA---', data)
      this.minImg = []
      if (data[0]) {
        this.minImg.push(data[0].accessUrl)
      }
      console.log('minImg---', this.minImg)
    },
    changeCouponsPrice() {
      this.couponsPrice = this.originalPrice - this.coupons
    },
    changeCashbackCNY() {
      this.cashbackCNY = this.couponsPrice * this.cashbackRate / 100
    },
    changecashbackGBT() {
      this.cashbackGBT = this.couponsPrice * this.IntegralCashbackRate / 100
    },
    goBack() {
      window.history.go(-1)
    },
    submit() {
      // let form = Object.assign({}, {
      //   bannerPic: this.banner,
      //   desc: this.$refs.editor.getContent().content || '',
      //   goodsType: 1,
      //   thumbPic: this.minImg,
      //   name: this.name,
      //   originalPrice: this.originalPrice
      // })
    }
  }
}
</script>
<style lang="less">
.pdd-detail {
  background: #fff;
  padding: 15px;
  box-sizing: border-box;
  height: 100%;
  overflow: auto;
  .box {
    margin-bottom:30px;
  }
  .left-title {
    display: inline-block;
    width: 150px;
  }
  .name {
    display: inline-block;
    width: 300px;
  }
  .el-input__inner {
    border:1px solid #909090;
  }
  .editor-upload-image {
    display: inline-block;
  }
  .wang-editor {
    display: inline-block;
    #editor-content {
      height: 200px;
    }
  }
  .price-box {
    overflow: hidden;
    p {
      float: left;
      width: 45%;
      margin-top: 20px;
      .title {
        width: 100px;
        display: inline-block;
      }
      .el-input {
        width: 100px;
        margin-right: 20px;
        text-align: center;
        .el-input__inner {
          text-align: center;
        }
      }
    }
  }
  .button-box {
    margin-top: 20px;
    text-align: right;
    padding-right: 100px;
  }

}
</style>
