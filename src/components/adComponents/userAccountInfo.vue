<template>
  <div class="user-account-info">
    今日账户消耗：{{ todayExpend }} 元
    <div class="segmentation">|</div>
    账户可用余额：{{ balance }}元
  </div>
</template>

<script>
import { queryAccountInfoApi } from '../../api/services/userAccountInfo'
export default {
  name: 'user-account-info',
  props: {

  },
  data() {
    return {
      balance: 0, // 余额
      todayExpend: 0 // 今日消耗
    }
  },
  created() {
    this.getDefault()
  },
  methods: {
    getDefault() {
      let _this = this

      queryAccountInfoApi().then(res => {
        _this.balance = res.balance
        _this.todayExpend = res.todayExpend
      })
    }
  }
}
</script>

<style scoped lang="less">
.user-account-info {
  height: 80px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ccc;

  .segmentation {
    margin: 0 16px;
    font-size: 20px;
  }
}
</style>
