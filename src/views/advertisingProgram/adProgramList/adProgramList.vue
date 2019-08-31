<template>
  <div class="ad-program-list" v-loading="loading">
    <userAccountInfo></userAccountInfo>

    <!-- 筛选 -->
    <query class="query" :requestQuery="requestQuery" @handleQueryChange="handleQueryChange"></query>

    <!-- 操作 -->
    <div class="batch-handle">
      <el-select v-model="batchHandleType" placeholder="批量操作" @change="handleBatch">
        <el-option
          v-for="(value, key) in batchHandleList"
          :key="key"
          :label="value"
          :value="key">
        </el-option>
      </el-select>

      <el-button type="primary" @click="handleEdit({})">新建</el-button>
    </div>

    <!-- 表格 -->
    <div class="table">
      <el-table
        @selection-change="handleSelectionChange"
        :data="tableData"
        stripe>
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="channelName" label="开关">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="channelName" label="广告组"></el-table-column>
        <el-table-column prop="channelName" label="广告计划"></el-table-column>
        <el-table-column prop="channelName" label="状态"></el-table-column>
        <el-table-column prop="channelName" label="推广目标"></el-table-column>
        <el-table-column prop="channelName" label="投放范围"></el-table-column>
        <el-table-column prop="channelName" label="投放时间"></el-table-column>
        <el-table-column prop="channelName" label="计费方式"></el-table-column>
        <el-table-column prop="channelName" label="推广预算"></el-table-column>
        <el-table-column prop="channelName" label="总花费"></el-table-column>
        <el-table-column prop="channelName" label="展示数"></el-table-column>
        <el-table-column prop="channelName" label="点击数"></el-table-column>
        <el-table-column prop="channelName" label="转换数"></el-table-column>
        <el-table-column prop="channelName" label="转换率"></el-table-column>
        <el-table-column prop="channelName" label="平均转换成本(元)"></el-table-column>
        <el-table-column prop="ID" label="操作">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="text"
              @click="handleEdit(scope.row)">
              编辑
            </el-button>
          </template>
        </el-table-column>
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
  </div>
</template>

<script>
import query from './components/query'
import userAccountInfo from '@/components/adComponents/userAccountInfo'
export default {
  name: 'ad-program-list',
  props: {

  },
  data() {
    return {
      tableData: [],
      selectionTableData: [], // 所选择的 列表

      // 请求参数
      requestQuery: {
        target: '', // 目标
        status: '', // 状态
        keyword: '' // 关键字
      },

      // 分页信息
      page: {
        page: 1,
        pageSize: 20,
        total: 0
      },

      batchHandleType: '', // 批量操作类型
      batchHandleList: {
        open: '启用',
        stop: '停用'
      },

      loading: false
    }
  },
  components: {
    userAccountInfo,
    query
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取数据
    getList() {
      let _this = this,
        requestQuery = _this.requestQuery,
        parameter = {
          target: requestQuery.target,
          status: requestQuery.status,
          page: _this.page.page
        }
      console.log(parameter)

      // _this.loading = true
      // api(parameter).then(res => {
      //   _this.loading = false
      //   _this.page.page += 1
      //   _this.selectionTableData = []
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

    // 搜索项发生改变
    handleQueryChange(query) {
      let _this = this

      _this.requestQuery = query
      _this.page.page = 1

      _this.getList()
    },

    // 选择表格数据
    handleSelectionChange(value) {
      this.selectionTableData = value
    },

    // 批量操作
    handleBatch(value) {
      let _this = this,
        selectionTableData = _this.selectionTableData

      this.batchHandleType = ''

      if (selectionTableData.length) {
        let ids = []

        selectionTableData.forEach(item => {
          ids.push(item.id)
        })
        // api({
        //   id: ids
        // }).then(res => {
        //   _this.page.page = 1
        //   _this.getList()
        // })
      } else {
        this.$message('请选择列表项')
      }
    },

    // 编辑
    handleEdit(row) {
      let _this = this

      if (row.id) {
        _this.$router.push({
          path: 'adProgramSave',
          query: {
            id: row.id
          }
        })
      } else {
        _this.$router.push({
          path: 'adProgramSelect'
        })
      }
    }
  }
}
</script>

<style scoped lang="less">
.ad-program-list {
  min-height: 100%;
  box-sizing: border-box;
  padding: 15px;
  background: #fff;

  .query {
    margin: 24px 0;
  }

  .batch-handle {
    margin: 0 0 24px 0;
    display: flex;
    justify-content: space-between;
  }

  .pagination-wrap {
    margin: 24px 0;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
