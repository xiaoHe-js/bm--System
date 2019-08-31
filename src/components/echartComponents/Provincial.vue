<template>
  <div class="data-map-provincial">
    <div id="china-map"></div>
  </div>
</template>

<script>
var echarts = require('echarts/lib/echarts');
require('echarts/lib/chart/map');
// 引入提示框和标题组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
require('echarts/theme/macarons');

export default {
  data() {
    return {
      chinaData: require('echarts/map/json/china.json'),
      charts: null // 图表实例
    };
  },
  props: {
    // 地图数据
    mapData: {
      type: Object,
      default() {
        return {};
      }
    },
    queryType: {
      type: Number,
      default: 1
    }
  },
  watch: {
    mapData: {
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
        chinaData = this.chinaData,
        chart = null;

      // 销毁表格
      _this.charts && _this.charts.dispose();

      chart = echarts.init(document.getElementById('china-map'), '');

      echarts.registerMap('china', chinaData);

      chart.setOption({
        title: {
          text: '省级地域分布',
          left: 'center'
        },
        tooltip: {
          padding: [10, 15],
          backgroundColor: '#FFF',
          textStyle: {
            color: '#6B6F7B'
          },
          extraCssText: 'box-shadow: 0 0 4px 1px rgba(0,0,0,0.10)',
          formatter({name, seriesName, data, percent}) {
            let _type = _this.queryType == 1 ? 'traffic' : _this.queryType == 2 ? 'click' : 'clickRate',
              typeName = {
                traffic: '展示数',
                click: '点击数',
                clickRate: '点击率'
              },
              _typeObj = data ? data[_type] : null;

            return `${name}<br />占比 : ${_typeObj && _typeObj.rate ? _typeObj.rate + '%' : '-'}<br />${_typeObj && _typeObj.name ? _typeObj.name : typeName[_type]} : ${_typeObj && _typeObj.value ? _typeObj.value : '-'}`;
          }
        },
        visualMap: {
          min: 0,
          max: data.maxVisal,
          left: 'left',
          top: 'bottom',
          text: ['高', '低'],
          textStyle: {
            color: '#436bab'
          },
          inRange: {
            color: ['#8FCDFF', '#166AFF']
          },
          calculable: true
        },
        geo: {
          map: 'china',
          itemStyle: {
            normal: {
              areaColor: '#98BDFF',
              borderColor: '#fff',
              borderWidth: 2
            },
            emphasis: {
              areaColor: '#11c2ec'
            }
          },
          label: {
            normal: {
              show: true, // 显示省份标签
              textStyle: {
                // 省份标签字体颜色
                color: '#fff',
                fontSize: 12
              }
            }
          },
          emphasis: {
            // 对应的鼠标悬浮效果
            show: true,
            backgroundColor: '#fff',
            color: 'red',
            textStyle: { color: '#fff' }
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
  .data-map-provincial {
    #china-map {
      width: 100%;
      height: 500px;
    }
  }
</style>
