<template>
  <div class='slecte-adProgram'>
    <p class='title'>请选择已有的广告计划</p>
    <dl>
      <dt>列表</dt>
      <dd v-for="(item,index) in list" :key='index' @click="choosAdProgram(item)" :class="chooseId===item?'active':''">{{item}}</dd>
    </dl>
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
    <el-button type="info" class='go-back' plain @click="goBack">取消</el-button>
    <el-button type="primary" class='next' @click="next">下一步</el-button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      page: 0,
      pageSize: 20, // 每页显示多少条数据
      total: 0, // 总条数
      totalPage: 0, // 总页数
      list: ['计划1', '计划2'],
      chooseId: ''
    }
  },
  methods: {
    choosAdProgram(item) {
      this.chooseId = item
    },
    goBack() {
      window.history.go(-1)
    },
    next() {
      if (!this.chooseId) {
        this.$message({
          message: '请先选择广告计划',
          type: 'warning'
        })
        return
      }
      this.$router.push({
        name: 'addAdCreative',
        query: {
          id: this.chooseId
        } })
    },
    // 点击分页，获取数据
    handleCurrentChange(curPage) {
      this.page = curPage
    }
  }
}
</script>
<style lang="less">
.slecte-adProgram {
  background: #fff;
  padding: 15px;
  box-sizing: border-box;
  height: 100%;
  overflow: auto;
  .title {
    color: #717bff;
    font-size: 18px;
  }
  dl {
    width: 60%;
    height: 80%;
    border: 1px solid #ccc;
    margin-top: 20px;
    overflow-y: auto;
    dt,dd {
      padding: 15px;
      width: 100%;
      border-bottom: 2px solid #909090;
      box-sizing: border-box;
    }
    dd {
      border-bottom: 1px solid #ccc;
      cursor: pointer;
    }
  }
  .active {
    background: #717bff;
    color: #fff;
  }
  .next ,.go-back {
    margin-top: 20px;
  }
}
</style>
