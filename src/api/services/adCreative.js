import request from '../request'
import urlConfig from '../../config/urls'
// 创意库列表
export function materialListApi(data) {
  return request({
    url: urlConfig.backend + '/material/admin/material-list',
    method: 'get',
    params: data
  })
}
// 删除创意
export function deleteMaterial(data) {
  return request({
    url: urlConfig.backend + '/material/admin/delete-material',
    method: 'post',
    data
  })
}
// 新增创意--选择拼多多or优惠券
export function searchMaterial(data) {
  return request({
    url: urlConfig.backend + '/material/admin/search-material',
    method: 'get',
    params: data
  })
}
