import request from '../request'

// 获取用户数据
export function getOverviewApi(data) {
  return request({
    url: '/information/admin/query-overview',
    params: data
  })
}

// 获取账户信息
export function getAccountInfoApi(data) {
  return request({
    url: '/information/admin/query-account-info',
    params: data
  })
}
