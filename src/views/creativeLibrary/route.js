
// 平台用户管理分路由
import creativeLibrary from './index'
import pddDetail from './pddDetail'
import creativeList from './creativeList'
import pddList from './pddList'
import yhqList from './yhqList'

export default {
  path: '/creative-library',
  redirect: {
    name: 'creativeLibrary'
  },
  component: creativeLibrary,
  children: [
    {
      path: 'creativeList',
      name: 'creativeList',
      component: creativeList,
      meta: {
        parent: 'creativeList'
      }
    },
    {
      path: 'pddDetail',
      name: 'pddDetail',
      component: pddDetail,
      meta: {
        parent: 'creativeLibrary'
      }
    },
    {
      path: 'pddList',
      name: 'pddList',
      component: pddList,
      meta: {
        parent: 'creativeList'
      }
    },
    {
      path: 'yhqList',
      name: 'yhqList',
      component: yhqList,
      meta: {
        parent: 'creativeList'
      }
    }
  ]
}
