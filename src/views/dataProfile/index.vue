<template>
  <div class="data-profile" v-loading="loading">
    <div class="balance">
      <div class="balance-item">
        <span class="label">今日账户消耗 : </span>
        <span class="value">{{ accountInfo.balance }}元</span>
      </div>
      <div class="balance-item">
        <span class="label">账户可用余额 : </span>
        <span class="value">{{ accountInfo.todayExpend }}元</span>
      </div>
    </div>

    <div class="header">
      <div class="title">
        数据概览
      </div>

      <div class="query">
        <el-date-picker
          v-model="time"
          :clearable="false"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          @change="getData">
        </el-date-picker>
      </div>
    </div>
    <totalData :data="dataProfile"></totalData>
    <LineChart :dimensions="dimensions" :data="chartData"></LineChart>
  </div>
</template>

<script>
import totalData from './components/totalData'
import dateOptionsMixins from '@/components/dateOptionsMixins'
import LineChart from '@/components/echartComponents/LineChart'
import chartData from './components/chartData'
import { getOverviewApi, getAccountInfoApi } from '@/api/services/dataProfile'
import { formatTime } from '@/utils/index'

export default {
  name: 'platform-user-data',
  mixins: [dateOptionsMixins, chartData],
  components: {
    totalData,
    LineChart
  },
  data() {
    let nowDate = Date.now(),
      oneDay = 86400 * 1000 // 一天时间毫秒数

    return {
      loading: false, // 加载loading
      time: [nowDate - oneDay * 8, nowDate - oneDay], // 日期筛选
      // 账户信息
      accountInfo: {
        balance: 0, // 余额
        todayExpend: 0 // 今日花费
      },
      dataProfile: [
        {
          name: '总花费(元)',
          value: 0,
          key: 'totalExpend'
        },
        {
          name: '展示数',
          value: 0,
          key: 'showCount'
        },
        {
          name: '点击数',
          value: 0,
          key: 'clickCount'
        },
        {
          name: '转化数',
          value: 0,
          key: 'exchangeNumber'
        },
        {
          name: '转化率',
          value: 0,
          key: 'exchangePrec'
        },
        {
          name: '平均转化成本(元)',
          value: 0,
          key: 'avgPrice'
        }
      ],
      dimensions: ['product', '展示数', '点击数', '转化数', '总花费(元)'],
      chartData: {}, // 图表数据
      originData: {} // 源数据
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      let _this = this,
        time = _this.time,
        params = {}

      if (time) {
        params.startAt = formatTime(time[0], 'yyyyMMdd')
        params.endAt = formatTime(time[1], 'yyyyMMdd')
      }

      _this.loading = true

      // 获取概览信息
      getOverviewApi(params).then(res => {
        let overview = res.overview

        _this.dataProfile.forEach(item => {
          item.value = overview[item.key] || 0
        })

        _this.originData = res.overviewList // 图表源数据

        _this.handlerDate()

        _this.loading = false
      })

      // 获取账户信息
      getAccountInfoApi().then(res => {
        _this.accountInfo = res
      })
    },

    // 处理返回数据
    handlerDate() {
      let _this = this

      _this.chartData = _this.handelerDayData(_this.time, _this.handlerChartData)
    },

    // 处理天数据
    handlerChartData(time) {
      let currentData = this.originData[formatTime(new Date(time), 'yyyy-MM-dd')],
        showCount = 0, // 展示数
        exchangeNumber = 0, // 转化数
        totalExpend = 0, // 总花费
        clickCount = 0 // 点击数

      if (currentData) {
        showCount = currentData.showCount || 0
        clickCount = currentData.clickCount || 0
        exchangeNumber = currentData.exchangeNumber || 0
        totalExpend = currentData.totalExpend || 0
      }

      return [showCount, clickCount, exchangeNumber, totalExpend]
    }
  }
}
</script>
<style lang="less" scoped>
.data-profile {
  background: #fff;
  border-radius: 8px;

  .balance {
    display: flex;
    align-items: center;
    height: 60px;
    border-bottom: 1px solid #F2F3F7;

    .balance-item {
      display: flex;
      align-items: center;
      padding: 0 24px;

      & + .balance-item {
        position: relative;

        &::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          width: 1px;
          height: 30px;
          background: #606166;
        }
      }
    }
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 16px;

    .title {
      font-size: 20px;
    }
  }
}
</style>
