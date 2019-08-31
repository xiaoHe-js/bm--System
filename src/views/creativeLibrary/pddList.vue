<template>
  <div class="pdd-list">
    <header>
      <h1>新建拼多多商品</h1>
      <div class="search">
        <el-input class="header-search"
          v-model="keyword"
          placeholder="请输入很实惠小程序的拼多多商品名称或商品ID"
          clearable
          @clear="inputClear">
        </el-input>
        <el-button type="primary" @click="searchKey" class='search-button'>搜索</el-button>
      </div>
    </header>
    <!-- 表格 -->
    <el-table ref="multipleTable" :data="tableData"  tooltip-effect="dark" highlight-current-row style="width: 100%;margin-top:20px;" >
      <el-table-column label="商品图">
        <template slot-scope="scope">
          <el-image style="width: 100px; height: 100px" :src="scope.row.goodsThumbnailUrl"></el-image>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="商品ID" prop="goodsId"></el-table-column>
      <el-table-column show-overflow-tooltip label="商品名称" prop="goodsName"></el-table-column>
      <el-table-column show-overflow-tooltip label="商品销量" prop="salesTip"></el-table-column>
      <el-table-column show-overflow-tooltip label="状态" prop="onSale"></el-table-column>

      <el-table-column show-overflow-tooltip label="原价（元）" prop="minNormalPrice"></el-table-column>
      <el-table-column show-overflow-tooltip label="佣金比例" prop="promotionRate"></el-table-column>
      <el-table-column show-overflow-tooltip label="领券购买返现比" prop="CNYRate"></el-table-column>
      <el-table-column show-overflow-tooltip label="积分消耗" prop="amount"></el-table-column>
      <el-table-column show-overflow-tooltip label="积分换购返现比" prop="GBTRate"></el-table-column>
      <el-table-column show-overflow-tooltip label="操作">
        <template slot-scope="scope">
          <el-button @click="toDetail(scope.row)" type="text" size="small">选择</el-button>
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
import { searchMaterial } from '../../api/services/adCreative'
export default {
  data() {
    return {
      page: 0,
      pageSize: 20, // 每页显示多少条数据
      total: 0, // 总条数
      totalPage: 0, // 总页数
      tableData: [], // 表格数据
      keyword: '' // 搜索关键字
    }
  },
  mounted() {
    this.getPddList()
  },
  methods: {
    // 输入框清空
    inputClear() {
      this.keyword = ''
      this.getPddList()
    },
    // 搜索输入框内容
    searchKey() {
      this.page = 0
      this.getPddList()
    },
    // 获取拼多多商品列表
    getPddList() {
      let _this = this,
        params = {
          goodsType: 1,
          page: 0,
          keyword: this.keyword
        }
      searchMaterial(params).then(res => {
        console.log(res)
        _this.tableData = res.data
        _this.total = res.total
        _this.totalPage = res.totalPage
        if (_this.tableData.length) {
          _this.tableData.map(item => {
            item.minNormalPrice = item.minNormalPrice / 100
            item.promotionRate = `${item.promotionRate / 10}%`
            item.onSale = item.onSale === '1' ? '在售' : '仓库'
            item.salesConfig.map(item2 => {
              if (item2.type === 'CNY') {
                item2.amount = item2.amount ? item2.amount : 0
                item.CNYRate = `${item2.promotionRate / 100}%`
              } else {
                item.amount = item2.amount
                item.GBTRate = `${item2.promotionRate / 100}%`
              }
            })
          })
        }
      })
    },
    // 点击分页，获取数据
    handleCurrentChange(curPage) {
      this.page = curPage
      this.getPddList()
    },
    toDetail(data) {
      let goodsThumbnailUrl = [],
        params
      goodsThumbnailUrl = goodsThumbnailUrl.push(data.goodsThumbnailUrl)
      params = {
        name: data.goodsName, // 商品名称
        thumbPic: goodsThumbnailUrl, // 商品缩略图
        bannerPic: data.goodsGalleryUrls, // 商品轮播图
        desc: '', // 商品描述
        goodsId: data.goodsId, // 商品id
        goodsType: 1, // 类型
        originalPrice: data.minNormalPrice, // 商品原价
        couponValue: data.couponInfo.couponDiscount / 100, // 优惠券面值
        salesConfig: data.salesConfig
      }
      this.$router.push({ name: 'pddDetail' })
      sessionStorage.setItem('data', JSON.stringify(params))
    }
  }
}
</script>

<style lang="less">
.pdd-list {
  background: #fff;
  padding: 15px;
  box-sizing: border-box;
  height: 100%;
  overflow: auto;
  header {
    overflow: hidden;
    margin-bottom: 20px;
    line-height: 37px;
    h1 {
      float: left;
    }
    .search {
      float: right;
      overflow: hidden;
      margin-right: 15px;
      .header-search {
        width: 300px;
        .el-input__inner {
          border-radius:4px 0 0 4px;
          height: 38px;
        }
      }
      .header-search,.search-button {
        float: left;
      }
      .el-button {
          border-radius:0 4px 4px 0;
      }
    }
  }
}
</style>
