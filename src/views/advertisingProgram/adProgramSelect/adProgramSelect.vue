<template>
  <div class="ad-program-select" v-loading="loading">
    <!-- 进度条 -->
    <stepsToCreateAnAd :active="1"></stepsToCreateAnAd>

    <div class="title">新建广告计划</div>

    <!-- 表格 -->
    <div class="table">
      <div class="table-title">请选择已有的广告组</div>
      <el-table
        size="medium"
        highlight-current-row
        @row-click="handleRowClick"
        :data="tableData">
        <el-table-column align="center" prop="id" label="广告组名称"></el-table-column>
        <el-table-column align="center" prop="id" label="推广目标"></el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-wrap">
      <el-pagination
          @current-change="handleCurrentChange"
          :current-page="page.page"
          :page-size="page.pageSize"
          layout="prev, pager, next, jumper"
          :total="parseInt(page.total)">
      </el-pagination>
    </div>

    <div class="footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" :disabled="!selectionTableData.id" @click="handleNextStep">下一步</el-button>
    </div>

  </div>
</template>

<script>
import stepsToCreateAnAd from '@/components/adComponents/stepsToCreateAnAd'
export default {
  name: 'ad-program-select',
  components: {
    stepsToCreateAnAd
  },
  data() {
    return {
      tableData: [
        { id: 1 },
        { id: 2 }
      ],
      selectionTableData: {}, // 所选择的 列表项

      // 分页信息
      page: {
        page: 1,
        pageSize: 20,
        total: 0
      },

      loading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取数据
    getList() {
      let _this = this,
        parameter = {
          page: _this.page.page
        }
      console.log(parameter)

      // _this.loading = true
      // api(parameter).then(res => {
      //   _this.loading = false
      //   _this.page.page += 1
      //   _this.selectionTableData = {}
      // }).catch(() => {
      //   _this.loading = false
      // })
    },

    // 分页获取数据
    handleCurrentChange(curPage) {
      let _this = this
      _this.page.page = curPage

      _this.getList()
    },

    // 点击表格行
    handleRowClick(row) {
      this.selectionTableData = row
    },

    // 取消
    handleCancel() {
      this.$router.go(-1)
    },

    // 下一步
    handleNextStep(row) {
      let _this = this,
        id = _this.selectionTableData.id

      _this.$router.push({
        path: 'adProgramSave',
        query: {
          adPlanId: id
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.ad-program-select {
  min-height: 100%;
  box-sizing: border-box;
  padding: 15px;
  background: #fff;

  .title {
    margin: 24px 0;
      font-size: 20px;
    font-weight: 700;
    display: inline-block;
    padding: 0 0 12px 0;
    border-bottom: 2px solid #4D5AFF;
  }

  .table {
    .table-title {
      font-size: 18px;
      margin: 0 0 16px;
    }
  }

  .pagination-wrap {
    margin: 24px 0;
    display: flex;
    justify-content: flex-end;
  }

  .footer {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
