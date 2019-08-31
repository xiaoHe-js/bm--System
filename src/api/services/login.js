import request from '../request'
import config from '../../config/urls'

// 登录
export function loginApi(data) {
  return request({
    url: config.admin + '/amount/login',
    method: 'post',
    data
  })
}

// 发送手机验证码
export function sendValidCodeApi(data) {
  return request({
    url: config.admin + '/amount/verify-code',
    method: 'post',
    data
  })
}
