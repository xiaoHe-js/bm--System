<template>
  <div class="query">

    <el-select class="query-item" v-model="query.target" clearable placeholder="选择目标" @change="handleQueryChange">
      <el-option
        v-for="(item, index) in targetList"
        :key="index"
        :label="item.target"
        :value="item.target">
      </el-option>
    </el-select>

    <el-select class="query-item" v-model="query.status" clearable placeholder="选择状态" @change="handleQueryChange">
      <el-option
        v-for="(item, index) in statusList"
        :key="index"
        :label="item.status"
        :value="item.status">
      </el-option>
    </el-select>

    <el-input class="query-item input" v-model="query.keyword" placeholder="广告组关键词"></el-input>

    <el-button class="query-item" type="primary" @click="handleClearQuery">清除所有筛选</el-button>
  </div>
</template>

<script>

export default {
  props: {
    requestQuery: {
      type: Object,
      default: () => {
        return {}
      }
    },

    // 目标列表
    targetList: {
      type: Array,
      default: () => {
        return []
      }
    },

    // 目标列表
    statusList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      query: {
        target: '', // 目标
        status: '', // 状态
        keyword: '' // 关键字
      }
    }
  },
  watch: {
    requestQuery: {
      deep: true,
      immediate: true,
      handler(value) {
        this.setQuery(value)
      }
    }
  },
  methods: {

    // 设置 query
    setQuery() {
      let _this = this,
        requestQuery = _this.requestQuery,
        query = _this.query

      for (let key in requestQuery) {
        query[key] = requestQuery[key]
      }
    },

    // 筛选条件发生改变
    handleQueryChange() {
      let _this = this

      _this.$emit('handleQueryChange', _this.query)
    },

    // 清空所有搜索条件
    handleClearQuery() {
      let _this = this

      for (let key in _this.query) {
        _this.query[key] = ''
      }
      _this.handleQueryChange()
    }
  }
}
</script>

<style scoped lang="less">
.query {
  .query-item {
    margin: 10px 20px 0 0;

    &.input {
      width: 200px;
    }
  }
}
</style>
