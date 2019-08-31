<template>
  <div class="pie-wrap">
    <div :id="wrapId" class="pie-chart"></div>
  </div>
</template>

<script>
var echarts = require('echarts/lib/echarts');
require('echarts/lib/chart/pie');
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
    pieData: {
      type: Object,
      default() {
        return {};
      }
    },

    wrapId: {
      type: String,
      default: 'pie-chart'
    },

    queryType: {
      type: Number,
      default: 1
    }
  },
  watch: {
    pieData: {
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
        legend: {
          left: 'center',
          bottom: '0',
          itemWidth: 10,
          itemHeight: 3
        },
        tooltip: {
          padding: [10, 15],
          backgroundColor: '#FFF',
          textStyle: {
            color: '#6B6F7B'
          },
          extraCssText: 'box-shadow: 0 0 4px 1px rgba(0,0,0,0.10)',
          trigger: 'item',
          formatter({color, data, percent}) {
            return `<span class="pie-flag" style="background:${color}"></span>${data.name} : ${name[_this.queryType]} ${data.value}${_this.queryType == 3 ? '%' : ''} (占比: ${percent}%)`;
          }
        },
        series: [data]
      });

      _this.charts = chart;
    }
  }
};
</script>

<style lang="less">
.pie-wrap {
  .pie-chart {
    width: 100%;
    height: 360px;
    margin: 20px 0;
  }

  .pie-flag {
    display:inline-block;
    margin-right: 4px;
    width:10px;
    height:3px;
    vertical-align:middle;
  }
}
</style>
