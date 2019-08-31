<template>
  <div class="ad-creative-list">
    <header class='header-box'>
      <p>
        <span>今日账户消耗:<i>3000</i>元</span>
        <span>|</span>
        <span>账户可用余额:<i>10000</i>元</span>
      </p>
      <el-button type="primary" class='add-creative' @click="addtAdProgram">新建广告创意</el-button>
    </header>
    <!-- 搜索条件 -->
    <div class="search">
      <!-- 操作表格开关 -->
      <el-select v-model="switchValueStatus" clearable placeholder="批量修改" @change="switchValueStatusChange">
        <el-option
        v-for="(item,index) in switchValueOptine"
        :key="index"
        :label="item"
        :value="index">
        </el-option>
      </el-select>

      <span>选择推广目标</span>
      <el-select v-model="promotionTarget" clearable placeholder="请选择推广目标" @change="promotionTargetChange">
        <el-option
        v-for="(item,index) in promotionTargetOptions"
        :key="index"
        :label="item"
        :value="index">
        </el-option>
      </el-select>

      <span>状态</span>
      <el-select v-model="status" clearable placeholder="请选择状态" @change="statusChange">
        <el-option
        v-for="(item,index) in statusOptions"
        :key="index"
        :label="item"
        :value="index">
        </el-option>
      </el-select>

      <el-input class="header-search"
        v-model="keyword"
        placeholder="请输入广告创意组关键词"
        clearable
        @clear="inputClear">
      </el-input>
      <el-button type="primary" @click="searchKey">搜索</el-button>
      <el-button type="success" class="export-btn" @click="clearAll" >清除所有筛选</el-button>
    </div>
    <!-- 表格 -->
    <el-table ref="multipleTable" :data="tableData"  tooltip-effect="dark" style="width: 100%;margin-top:20px;"  @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column show-overflow-tooltip label="开关" prop="unionId">
        <template>
          <el-switch  v-model="switchValue" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="广告创意" prop="nickName"></el-table-column>
      <el-table-column show-overflow-tooltip label="广告计划" prop="phone"></el-table-column>
      <el-table-column show-overflow-tooltip label="广告组" prop="authLoginTime"></el-table-column>
      <el-table-column show-overflow-tooltip label="状态" prop="nickName"></el-table-column>
      <el-table-column show-overflow-tooltip label="推广目标" prop="regTime"></el-table-column>
      <el-table-column show-overflow-tooltip label="投放范围" prop="enterAppletTime"></el-table-column>
      <el-table-column show-overflow-tooltip label="投放形式" prop="merchantLinkName"></el-table-column>
      <el-table-column show-overflow-tooltip label="投放时间" prop="userType"></el-table-column>
      <el-table-column show-overflow-tooltip label="计费方式" prop="nickName"></el-table-column>
      <el-table-column show-overflow-tooltip label="推广预算" prop="regTime"></el-table-column>
      <el-table-column show-overflow-tooltip label="总花费" prop="enterAppletTime"></el-table-column>
      <el-table-column show-overflow-tooltip label="展示数" prop="merchantLinkName"></el-table-column>
      <el-table-column show-overflow-tooltip label="点击数" prop="userType"></el-table-column>
       <el-table-column show-overflow-tooltip label="转化数" prop="enterAppletTime"></el-table-column>
      <el-table-column show-overflow-tooltip label="转化率" prop="merchantLinkName"></el-table-column>
      <el-table-column show-overflow-tooltip label="平均转化成本（元）" prop="userType"></el-table-column>
      <el-table-column show-overflow-tooltip label="操作" prop="userType">
         <template slot-scope="scope">
           <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
          </template>
      </el-table-column>
    </el-table>

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
// import userActiveData from './components/userActiveData.vue'

export default {
  data() {
    return {
      page: 0,
      pageSize: 20, // 每页显示多少条数据
      total: 0, // 总条数
      totalPage: 0, // 总页数
      promotionTarget: '', // 推广目标
      promotionTargetOptions: ['目标1', '目标2'],
      status: '', // 状态
      statusOptions: ['投放中', '未投放'],
      keyword: '', // 输入框,
      switchValueOptine: ['启用', '暂停'], // 批量修改选项
      switchValueStatus: '',
      tableData: [], // 表格数据
      multipleSelection: [], // 多选
      switchValue: true // 开关（默认开)
    }
  },
  components: {
  },
  mounted() {
  },
  methods: {
    addtAdProgram() {
      this.$router.push({
        name: 'selectAdProgram'
      })
    },
    // 选择推广目标
    promotionTargetChange(val) {
      this.promotionTarget = val
      this.page = 1
      this.getData(this.getQueryData())
    },
    // 选择状态
    statusChange(val) {
      this.status = val
      this.page = 1
      this.getData(this.getQueryData())
    },
    // 输入框清空
    inputClear() {
      this.keyword = ''
    },
    // 搜索输入框内容
    searchKey() {
      this.page = 1
      this.getData(this.getQueryData())
    },
    // 清除所有筛选条件
    clearAll() {
      this.promotionTarget = ''
      this.status = ''
      this.keyword = ''
      this.getData(this.getQueryData())
    },
    // 批量修改
    switchValueStatusChange(val) {
      this.switchValueStatus = val
      val === 0 ? this.switchValue = true : this.switchValue = false
    },
    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    getData(params) {
      console.log('params--', params)
      // let _this = this
      // newUsersApi(params).then(res => {
      //   _this.tableData = res.list
      //   _this.newUserTotal = res.newUserTotal
      //   _this.total = Number(res.count)
      // })
    },
    // 获取筛选数据
    getQueryData() {
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        promotionTarget: this.promotionTarget === '' ? '' : this.promotionTarget,
        status: this.status === '' ? '' : this.status,
        keyword: this.keyword === '' ? '' : this.keyword
      }
      return params
    },
    // 点击分页，获取数据
    handleCurrentChange(curPage) {
      this.page = curPage
      this.getData(this.getQueryData())
    }
  }
}
</script>

<style lang="less">
.ad-creative-list {
  background: #fff;
  padding: 15px;
  box-sizing: border-box;
  height: 100%;
  overflow: auto;
  .header-box {
    height: 40px;
    p {
      float: left;
      span {
        margin-right: 10px;
        i {
          color: #717bff;
        }
      }
    }
    .add-creative {
      float: right;
    }
  }
  .search {
    margin-top: 20px;
    .el-input {
      width: 200px;
      margin-right: 15px;
    }
    .el-select {
      margin-right: 15px;
    }
    span {
      font: 12px;
      padding-right:10px;
    }
  }
}

</style>
