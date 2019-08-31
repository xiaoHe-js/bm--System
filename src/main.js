import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'reset-css'
import ElementUI from 'element-ui'
import { formatNumber } from './utils/index'
import './theme/index.css'

Vue.use(ElementUI)

Vue.config.productionTip = false

// 注册格式化数字的filter
Vue.filter('add_comma_toThousands', (value) => {
  if (value) {
    return formatNumber(value)
  };

  return value
})

// 将vue实例保存在全局
window.vm = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
