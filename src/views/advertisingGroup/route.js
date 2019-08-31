
// 平台用户管理分路由
import advertisingGroup from './index'

import adGroupList from './adGroupList/adGroupList'
import adGroupSave from './adGroupSave/adGroupSave'

export default {
  name: 'advertisingGroup',
  path: '/advertising-group',
  component: advertisingGroup,
  redirect: {
    name: 'adGroupList'
  },
  children: [
    {
      path: 'adGroupList',
      name: 'adGroupList',
      component: adGroupList
    },
    {
      path: 'adGroupSave',
      name: 'adGroupSave',
      component: adGroupSave
    }
  ]
}
