<template>
  <div class="select-time-area">
    <div class="content"
      v-for="(item, index) in timeSelectList"
      :key="index"
      >
      <el-time-select
        class="item"
        placeholder="起始时间"
        v-model="item.startTime"
        :picker-options="{
          start: '00:00',
          step: '01:00',
          end: '24:00',
          maxTime: item.endTime
        }">
      </el-time-select>
      <el-time-select
        class="item"
        placeholder="结束时间"
        v-model="item.endTime"
        :picker-options="{
          start: '00:00',
          step: '01:00',
          end: '24:00',
          minTime: item.startTime
        }">
      </el-time-select>
      <i class="item icon el-icon-plus" @click="handleAddTime"></i>
      <i class="item icon el-icon-minus" @click="handleDeleteTime(index)" v-if="timeSelectList.length > 1"></i>
    </div>

    <div class="erro-msg" v-if="erroMsg">{{ erroMsg }}</div>
  </div>
</template>

<script>
export default {
  props: {

  },
  data() {
    return {
      timeSelectList: [
        { startTime: '', endTime: '' }
      ],
      erroMsg: ''
    }
  },
  components: {

  },
  computed: {

  },
  created() {

  },
  mounted() {

  },
  watch: {

  },
  methods: {
    // 添加
    handleAddTime() {
      this.timeSelectList.push({
        startTime: '',
        endTime: ''
      })
    },

    // 删除
    handleDeleteTime(index) {
      this.timeSelectList.splice(index, 1)
    },

    // 提供外部验证
    validate() {
      let _this = this,
        timeSelectList = JSON.parse(JSON.stringify(_this.timeSelectList)),
        isFull = timeSelectList.every(item => { return (item.startTime && item.endTime) || (!item.startTime && !item.endTime) }), // 都存在或者都不存在
        noRepetitionList = timeSelectList.filter(item => { return (item.startTime && item.endTime) }), // 只保留完整数据
        len = noRepetitionList.length

      if (len == 0) {
        _this.erroMsg = '请选择时间段'
        return false
      }

      // 没有填写完整
      if (!isFull) {
        _this.erroMsg = '请选择完整的 时间段'
        return false
      }

      // 将小时数取出来  10:00 =>  10
      noRepetitionList.forEach(item => {
        item.startHour = Number(item.startTime.split(':')[0]) || 0
        item.endHour = Number(item.endTime.split(':')[0]) || 0
      })

      // 以开始时间 降序排序
      noRepetitionList.sort((a, b) => { return (b.startHour - a.startHour) })

      for (let i = 0; i < len; i++) {
        let afterItem = noRepetitionList[i + 1] || {},
          thisItem = noRepetitionList[i]

        // 降序 排序后，当前时间段的开始时间 不能 小于下一个时间段的结束时间
        if (thisItem.startHour < (afterItem.endHour || 0)) {
          _this.erroMsg = '时间段不能交叉'
          return false
        }
      }

      _this.erroMsg = ''
      return true
    },

    // 获取参数 对外提供
    getValue() {
      let _this = this

      return _this.timeSelectList.filter(item => { return (item.startTime && item.endTime) })
    }
  }
}
</script>

<style scoped lang="less">
.select-time-area {
  .content {
    margin: 10px 0 0 0;

    .item {
      margin: 0 16px 0 0;

      &.icon {
        font-size: 20px;
        cursor: pointer;
      }
    }
  }

  .erro-msg {
    color: red
  }
}
</style>
