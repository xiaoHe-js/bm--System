
// 平台用户管理分路由
import advertisingProgram from './index'

import adProgramList from './adProgramList/adProgramList'
import adProgramSave from './adProgramSave/adProgramSave'
import adProgramSelect from './adProgramSelect/adProgramSelect'

export default {
  name: 'advertisingProgram',
  path: '/advertising-program',
  component: advertisingProgram,
  redirect: {
    name: 'adProgramList'
  },
  children: [
    {
      path: 'adProgramList',
      name: 'adProgramList',
      component: adProgramList
    },
    {
      path: 'adProgramSave',
      name: 'adProgramSave',
      component: adProgramSave
    },
    {
      path: 'adProgramSelect',
      name: 'adProgramSelect',
      component: adProgramSelect
    }
  ]
}
