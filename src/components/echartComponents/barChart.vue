<template>
  <div class="bar-wrap">
    <div :id="wrapId" class="bar-chart"></div>
  </div>
</template>

<script>
var echarts = require('echarts/lib/echarts');
require('echarts/lib/chart/bar');
// 引入提示框和标题组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');

export default {
  data() {
    return {
      charts: null // 图表实例
    };
  },
  props: {
    // 地图数据
    barData: {
      type: Object,
      default() {
        return {};
      }
    },

    wrapId: {
      type: String,
      default: 'bar-chart'
    },

    queryType: {
      type: Number,
      default: 1
    }
  },
  watch: {
    barData: {
      handler(val) {
        this.initcharts(val);
      }
    }
  },
  mounted() {
    let _this = this;

    window.addEventListener('resize', () => {
      if (_this.charts) {
        _this.charts.resize();
      }
    });
  },
  beforeDestroy() {
    let _this = this;
    if (!_this.charts) {
      return;
    }
    _this.charts.dispose(); // 销毁echarts表格
    _this.charts = null;
  },
  methods: {
    // 初始化echarts
    initcharts(data) {
      let _this = this,
        chart = null,
        name = {
          1: '展示数',
          2: '点击数',
          3: '点击率'
        };

      // 销毁表格
      _this.charts && _this.charts.dispose();

      chart = echarts.init(document.getElementById(_this.wrapId));

      chart.setOption({
        title: {
          text: data.title,
          left: 'center'
        },
        tooltip: {
          padding: [10, 15],
          backgroundColor: '#FFF',
          textStyle: {
            color: '#6B6F7B'
          },
          extraCssText: 'box-shadow: 0 0 4px 1px rgba(0,0,0,0.10)',
          trigger: 'item',
          formatter({data}) {
            return `${data[0]} : ${name[_this.queryType]} ${data[1]}${_this.queryType == 3 ? '%' : ''} (占比: ${data[2]})`;
          }
        },
        // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
        xAxis: {
          type: 'category', // 分割线样式
          splitLine: {// 分割线
            show: true,
            lineStyle: {
              color: '#F7F7F7',
              type: 'solid'
            }
          }
        },
        // 声明一个 Y 轴，数值轴。
        yAxis: {
          splitLine: {// 分割线
            show: true,
            lineStyle: {
              color: '#F7F7F7',
              type: 'solid'
            }
          }
        },

        dataset: {
          source: data.source
        },
        series: [
          {
            type: 'bar',
            itemStyle: {
              normal: _this.wrapId == 'bar-cmp-1' ? {
                color: '#FCA56A'
              } : {
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    {offset: 0, color: '#83bff6'},
                    {offset: 1, color: '#188df0'}
                  ]
                )
              },
              emphasis: _this.wrapId == 'bar-cmp-1' ? {
                color: '#FCA56A'
              } : {
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    {offset: 0, color: '#31A3FF'},
                    {offset: 1, color: '#166AFF'}
                  ]
                )
              }
            }
          }
        ]
      });

      _this.charts = chart;
    }
  }
};
</script>

<style lang="less">
.bar-wrap {
  .bar-chart {
    width: 100%;
    height: 400px;
    margin: 20px 0;
  }
}
</style>
