import request from '../request'

// 获取用户数据
export function queryAccountInfoApi(data) {
  return request({
    url: '/information/admin/query-account-info',
    params: data
  })
}
