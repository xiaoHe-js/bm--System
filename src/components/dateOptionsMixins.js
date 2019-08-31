export default {
  data() {
    return {
      // 日期选项配置
      pickerOptions: {
        shortcuts: [{
          text: '昨天',
          onClick(picker) {
            const end = new Date(),
              start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24)

            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date(),
              start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)

            picker.$emit('pick', [start, end])
          }
        }],
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      }
    }
  }
}
