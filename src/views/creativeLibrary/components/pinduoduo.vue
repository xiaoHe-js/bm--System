<template>
  <div class="pinduoduo">
    <!-- 表格 -->
    <el-table ref="multipleTable" :data="tableData"  tooltip-effect="dark" highlight-current-row  @current-change="select" style="width: 100%;margin-top:20px;" >
      <el-table-column label="商品图">
        <template slot-scope="scope">
          <el-image style="width: 100px; height: 100px" :src="scope.row.thumbPic[0]"></el-image>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="商品名称" prop="name"></el-table-column>
      <el-table-column show-overflow-tooltip label="原价（元）" prop="originalPrice"></el-table-column>
      <el-table-column show-overflow-tooltip label="佣金比例" prop="promotionRate"></el-table-column>
      <el-table-column show-overflow-tooltip label="券后价（元）" prop="sellingPrice"></el-table-column>
      <el-table-column show-overflow-tooltip label="券后购买返现比" prop="CNYRate"></el-table-column>
      <el-table-column show-overflow-tooltip label="消耗流量主积分" prop="amount"></el-table-column>
      <el-table-column show-overflow-tooltip label="消耗流量主积分返现比" prop="GBTRate"></el-table-column>
      <el-table-column show-overflow-tooltip label="创建时间" prop="createdAt"></el-table-column>
      <el-table-column show-overflow-tooltip label="操作" v-if="from!=='addPdd'">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="del(scope.row)" type="text" size="small">删除</el-button>
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
import { materialListApi, deleteMaterial } from '../../../api/services/adCreative'
export default {
  data() {
    return {
      page: 0,
      pageSize: 20, // 每页显示多少条数据
      total: 0, // 总条数
      totalPage: 0, // 总页数
      tableData: [] // 表格数据
    }
  },
  props: {
    from: {
      type: String
    }
  },
  components: {
  },
  methods: {
    select(val) {
      this.$emit('select', val)
    },
    // 获取创意列表
    getPddCreativeData() {
      let _this = this,
        params = {
          goodsType: 1,
          page: 0
        }
      materialListApi(params).then(res => {
        _this.tableData = res.list
        _this.total = Number(res.totalCount)
        res.list.map(item => {
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
      })
    },
    // 编辑优惠券
    edit(data) {
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
    },
    // 删除创意列表
    del(data) {
      console.log(data)
      this.$confirm('是否确认删除这条创意?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let idsArr = [],
          vm = this
        idsArr.push(data._id)
        deleteMaterial({ ids: idsArr }).then(res => {
          console.log(res)
          vm.getPddCreativeData()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 点击分页，获取数据
    handleCurrentChange(curPage) {
      this.page = curPage
      this.getPddCreativeData()
    }
  }
}
</script>

<style lang="less">
</style>
