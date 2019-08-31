import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'

// 数据概况
import dataProfile from './views/dataProfile/route'
// 广告组分路由
import advertisingGroup from './views/advertisingGroup/route'
// 广告计划分路由
import advertisingProgram from './views/advertisingProgram/route'
// 广告创意分路由
import advertisingCreative from './views/advertisingCreative/route'
// 创意库分路由
import creativeLibrary from './views/creativeLibrary/route'
// 财务/账号
import financialInfo from './views/financialInfo/route'
Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: Home,
      children: [
        dataProfile,
        advertisingGroup,
        advertisingProgram,
        advertisingCreative,
        creativeLibrary,
        financialInfo
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})
