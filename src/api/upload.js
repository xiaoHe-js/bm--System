import request from './request'
import config from '../config/urls'
import { formatGetParams } from '../utils'

// 获取上传签名
export function getSign(params) {
  return request({
    url: `${config.launch}/base/cos-sign`,
    data: params
  })
}

// 上传图片数据
export function uploadImageData(sign, params) {
  let url = `${config.medialibs}/api/upload?${formatGetParams(sign)}`

  return request({
    url,
    method: 'post',
    data: params
  })
}
