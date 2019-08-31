<template>
  <div class='add-adCreative'>
    <p class='title'>创意投放形式</p>
    <div class='type-box'>
      <span class='type'>投放形式</span>
      <el-radio-group v-model="type">
        <el-radio-button label="拼多多"></el-radio-button>
        <el-radio-button label="优惠券"></el-radio-button>
      </el-radio-group>
    </div>

    <p class='title'>制作创意</p>
    <div class='type-box'>
      <span class='type'>创意内容</span>
      <el-button type="primary" @click="addCreative">从创意库中添加</el-button>
    </div>

    <div class='table'>
      <pinduoduo v-if="type==='拼多多'"></pinduoduo>
      <youhuiquan v-if="type==='优惠券'"></youhuiquan>
    </div>

    <!-- 从创意库添加 -->
    <el-dialog :visible.sync="isEditDialog">
      <span style="font-size:20px">{{type}}创意库</span>
      <pinduoduo v-if="type==='拼多多'" from="addPdd" @select="selectPDD" ref="pdd"></pinduoduo>
      <youhuiquan v-if="type==='优惠券'" from="addYhq" ref="yhq"></youhuiquan>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isEditDialog = false" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="toDeatil">选 择</el-button>
      </span>
    </el-dialog>
    <!-- 分页 -->
    <div class="pagination-wrap" v-if="parseInt(total) > 1">
      <el-pagination
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="parseInt(total)">
      </el-pagination>
    </div>
    <div class='button-box'>
      <el-button type="info" class='go-back' plain @click="goBack">取消</el-button>
      <el-button type="primary" class='next' @click="submit">保存</el-button>
    </div>

  </div>
</template>

<script>
import pinduoduo from '../creativeLibrary/components/pinduoduo.vue'
import youhuiquan from '../creativeLibrary/components/youhuiquan.vue'

export default {
  data() {
    return {
      page: 0,
      pageSize: 20, // 每页显示多少条数据
      total: 0, // 总条数
      totalPage: 0, // 总页数
      type: '拼多多',
      isEditDialog: false, // 编辑弹窗显示隐藏
      detailData: '' // 创意详情
    }
  },
  components: {
    pinduoduo,
    youhuiquan
  },
  methods: {
    goBack() {
      window.history.go(-1)
    },
    submit() {

    },
    // 从创意库中添加--弹出创意库弹窗
    addCreative() {
      let _this = this
      this.isEditDialog = true
      if (this.type === '拼多多') {
        setTimeout(() => {
          _this.$refs.pdd.getPddCreativeData()
        }, 200)
      } else {
        setTimeout(() => {
          _this.$refs.yhq.getYhqCreativeData()
        }, 200)
      }
    },
    selectPDD(data) { // 选中拼多多创意库商品
      this.detailData = data
    },
    toDeatil() { // 创意详情
      sessionStorage.setItem('data', JSON.stringify(this.detailData))
    },
    // 点击分页，获取数据
    handleCurrentChange(curPage) {
      this.page = curPage
    }
  }
}
</script>
<style lang="less">
.add-adCreative {
  background: #fff;
  padding: 15px;
  box-sizing: border-box;
  height: 100%;
  overflow: auto;
  .title {
    font-size: 20px;
    margin-bottom: 20px;
  }
  .type-box {
    margin-bottom:20px;
  }
  .type {
    margin: 0 15px;
  }
  // .table {
  //   height: 60%;
  //   overflow: auto;
  // }
  .el-radio-button__inner {
    width: 100px;
  }
  .button-box{
    position: absolute;
    right:100px;
    bottom: 40px;
  }
  .el-dialog {
    max-width: 80%;
    padding: 20px;
    height: 60%;
    overflow-y: auto;
  }
}
</style>
