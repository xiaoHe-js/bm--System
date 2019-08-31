import request from '../request'

// 获取新建编辑 广告组的 相关参数
export function getPlanApi(data) {
  return request({
    url: '/ad/promotion/get-plan',
    method: 'get',
    params: data
  })
}

// 保存 广告组
export function promotionPlanSaveApi(data) {
  return request({
    url: '/ad/promotion/promotion-plan-save',
    method: 'post',
    data
  })
}
