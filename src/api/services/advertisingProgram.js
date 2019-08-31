import request from '../request'

// 获取城市列表
export function getCityListApi(data) {
  return request({
    url: '/ad/promotion/get-city-list',
    method: 'get',
    params: {
      lang: 'zh-CN',
      id: 7042
    }
  })
}

// 新建/编辑广告计划接口
export function getUnitApi(data) {
  return request({
    url: '/ad/promotion/get-unit',
    method: 'get',
    params: data
  })
}

// 保存广告计划接口
export function promotionUnitSaveApi(data) {
  return request({
    url: '/ad/promotion/promotion-unit-save',
    method: 'post',
    data
  })
}
