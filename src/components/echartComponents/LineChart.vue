<template>
  <div class="line-chart">
    <div class="chart" id="chart"></div>
  </div>
</template>

<script>
var echarts = require('echarts/lib/echarts')
// 引入柱状图
require('echarts/lib/chart/line')
// 引入提示框和标题组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/dataset')
require('echarts/lib/component/legend')
export default {
  data() {
    return {
      chart: null // 图表实例
      // chartData: []
    }
  },
  props: {
    // 图表的数据名称
    // dimensions: ['product', '花费(ADF)', '展示数', '点击数', '点击率', '平均点击单价(ADF)', '平均千次点击单价(ADF)']
    dimensions: {
      type: Array,
      default() {
        return []
      }
    },
    // 数据源
    /**
     * {
     *  source: [
     *    '2018-08-01',
     *    dimensions对应的数据值
     *    .
     *    .
     *    .
     *  ]
     * }
     */
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  watch: {
    // 监听chartData,动态生成表格数据
    data: {
      handler(val) {
        this.initChart(val)
      },
      deep: true
    }
  },
  mounted() {
    let _this = this

    // _this.initChart();

    window.addEventListener('resize', () => {
      if (_this.chart) {
        _this.chart.resize()
      }
    })
  },
  beforeDestroy() {
    let _this = this
    if (!_this.chart) {
      return
    }

    _this.chart.dispose() // 销毁echarts表格
    _this.chart = null
  },
  methods: {
    // 初始化图表
    initChart(data) {
      let _this = this,
        dimensions = _this.dimensions,
        legend = [],
        series = [],
        chart

      for (let index = 1, len = dimensions.length; index < len; index++) {
        let options = {
          type: 'line',
          smooth: true,
          lineStyle: {
            width: 5
          }
        }

        series.push(options)

        legend.push(dimensions[index])
      }

      chart = echarts.init(document.getElementById('chart'))

      chart.setOption({
        legend: {
          data: legend
        },
        tooltip: {
          trigger: 'axis',
          // 配置坐标轴指示器样式
          axisPointer: {
            lineStyle: {
              color: '#BFC1C7',
              type: 'dashed'
            }
          },
          textStyle: {
            color: '#6B6F7B',
            lineHeight: '26'
          },
          padding: [10, 10, 16, 23],
          backgroundColor: '#fff',
          extraCssText: 'box-shadow: 0 0 4px 1px rgba(0,0,0,0.10);'
          // formatter(data) {
          //   let str = ''
          //   data.forEach(({ seriesName, marker, color, data, name }, index) => {
          //     if (index == 0) {
          //       str += name + '<br />'
          //     }
          //     // str += `${marker} ${seriesName} : ${data[index + 1]}${index == 3 ? '%' : ''}<br /> `
          //   })
          //   return str
          // }
        },
        xAxis: {
          type: 'category',
          // data: data.xAxis,
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#e5e5e5'
            }
          },
          splitLine: {// 分割线
            show: true,
            lineStyle: {
              color: '#F7F7F7',
              type: 'solid'
            }
          },
          axisLabel: {
            color: '#6B6F7B'
          },
          grid: {
            show: true
          }
        },
        yAxis: {
          type: 'value',
          // 坐标轴字体样式
          axisLabel: {
            color: '#6B6F7B'
          },
          // 分割线样式
          splitLine: {// 分割线
            show: true,
            lineStyle: {
              color: '#F7F7F7',
              type: 'solid'
            }
          },
          // 坐标轴轴线样式
          axisLine: {
            lineStyle: {
              color: '#e5e5e5'
            }
          },
          grid: {
            show: true
          }
        },
        series: series,
        dataset: {
          dimensions: dimensions,
          source: data.source
        },
        color: ['#6699FF', '#836DF2', '#CE61F2', '#FF809A', '#FF9F40', '#FFCF40', '#6CD99A']
      })

      _this.chart = chart
    }
  }

}
</script>

<style lang="less">
  .line-chart {
    .chart {
      width: 100%;
      height: 500px;
    }
  }
</style>
