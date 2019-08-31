import { formatTime } from '@/utils/index'

export default {
  methods: {
    /**
     * 处理小时为单位的数据
     * @param {Function} fn 处理函数，需返回当前时间对应的值
     * @returns 返回处理好的数据
     */
    handelerHourData(fn) {
      let formatSource = []

      // 遍历24小时数据
      for (let index = 0; index <= 23; index++) {
        let timeLine = index <= 9 ? `0${index}:00` : `${index}:00`,
          sourceItem = [timeLine]

        sourceItem = sourceItem.concat(fn(timeLine))
        formatSource.push(sourceItem)
      }

      return {
        source: formatSource
      }
    },

    /**
     * 处理天为单位的数据
     * @param { Array } 时间段范围  [ 开始时间， 结束时间 ] 需要能被new Date()解析
     * @param {Function} fn 处理函数，需返回当前时间对应的值
     * @returns 返回处理好的数据
     */
    handelerDayData(timeRange, fn) {
      let oneDay = 86400 * 1000, // 一天时间毫秒数
        startDate = new Date(timeRange[0]).getTime(),
        endDate = new Date(timeRange[1]).getTime(),
        timeRangeLen = Math.ceil((endDate - startDate) / oneDay),
        formatSource = []

      // 遍历日期数据
      for (let index = 0; index <= timeRangeLen; index++) {
        let timeLine = formatTime(startDate + oneDay * index, 'yyyy-MM-dd'),
          sourceItem = [timeLine]

        sourceItem = sourceItem.concat(fn(timeLine))
        formatSource.push(sourceItem)
      }

      return {
        source: formatSource
      }
    }
  }
}
