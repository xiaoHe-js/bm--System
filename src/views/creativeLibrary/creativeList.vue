<template>
  <div class='creative-list'>
    <div class='type-box'>
      <el-radio-group v-model="type" @change='tabChange'>
        <el-radio-button label="拼多多"></el-radio-button>
        <el-radio-button label="优惠券"></el-radio-button>
      </el-radio-group>
      <el-button type="primary" class='add-creative' @click="addtAdProgram">新建创意内容</el-button>
    </div>

    <div class='table'>
      <pinduoduo v-show="type==='拼多多'" ref="pdd"></pinduoduo>
      <youhuiquan v-show="type==='优惠券'" ref="yhq"></youhuiquan>
    </div>

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

  </div>
</template>

<script>
import pinduoduo from './components/pinduoduo.vue'
import youhuiquan from './components/youhuiquan.vue'

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
  mounted() {
    // 获取创意列表
    this.$refs.pdd.getPddCreativeData()
  },
  methods: {
    // 切换tab
    tabChange() {
      if (this.type === '拼多多') {
        this.$refs.pdd.getPddCreativeData()
      } else {
        this.$refs.yhq.getYhqCreativeData()
      }
    },
    // 点击分页，获取数据
    handleCurrentChange(curPage) {
      this.page = curPage
    },
    addtAdProgram() {
      if (this.type === '拼多多') {
        this.$router.push({ name: 'pddList' })
      } else {
        this.$router.push({ name: 'yhqList' })
      }
    }
  }
}
</script>
<style lang="less">
.creative-list {
  background: #fff;
  padding: 15px;
  box-sizing: border-box;
  height: 100%;
  overflow: auto;
  .type-box {
    margin-bottom:20px;
    overflow: hidden;
    .add-creative {
      float: right;
    }
  }
  .type {
    margin: 0 15px;
  }
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
