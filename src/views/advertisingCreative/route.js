
// 平台用户管理分路由
import advertisingCreative from './index'
import adCreativeList from './adCreativeList'
import selectAdProgram from './selectAdProgram'
import addAdCreative from './addAdCreative'

export default {
  path: '/advertising-creative',
  redirect: {
    name: 'advertisingCreative'
  },
  component: advertisingCreative,
  children: [
    {
      path: 'adCreativeList',
      name: 'adCreativeList',
      component: adCreativeList,
      meta: {
        parent: 'adCreativeList'
      }
    }, {
      path: 'selectAdProgram',
      name: 'selectAdProgram',
      component: selectAdProgram,
      meta: {
        parent: 'adCreativeList'
      }
    }, {
      path: 'addAdCreative',
      name: 'addAdCreative',
      component: addAdCreative,
      meta: {
        parent: 'adCreativeList'
      }
    }
  ]
}
