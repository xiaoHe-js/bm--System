import axios from 'axios'
import { Message } from 'element-ui'
import qs from 'qs'
import urlConfig from '../config/urls'

const service = axios.create({
  baseURL: urlConfig.launch, // 默认url
  timeout: 15000, // 请求超时时间,
  withCredentials: true
})

// 判断是否需要使用QS转换
function isNeedStringify(config) {
  const whiteList = [urlConfig.medialibs] // 白名单列表

  for (let index = 0; index < whiteList.length; index++) {
    const element = whiteList[index]

    if (config.url.indexOf(element) !== -1) {
      return false
    }
  }

  if (config.method != 'get') {
    return true
  }

  return true
}

// 请求拦截
service.interceptors.request.use(function(config) {
  if (isNeedStringify(config)) {
    config.data = qs.stringify(config.data)
  }

  // 判断token是否存在，存在则加上
  // let t = config.url.indexOf(urlConfig.medialibs) !== -1 ? sessionStorage.getItem('t') : undefined // 跨域请求票据
  let t = sessionStorage.getItem('t'),
    params = {
      ...config.params
    }

  if (config.url.indexOf(urlConfig.medialibs) === -1) {
    params.t = t
  }

  config.params = params

  return config
}, function(error) {
  return Promise.reject(error)
})

// 返回拦截器
service.interceptors.response.use(
  res => {
    let data = res.data,
      status = data.return_code,
      msg = data.return_msg,
      vm = window.vm // vue实例

    if (res.config.method !== 'options') {
      if (status === 'SUCCESS') {
        return msg
      } else if (msg == 'GUEST' || status === 'GUEST') { // 未登录
        let routePath = vm && vm.$route.fullPath

        Message({
          type: 'error',
          message: '登陆过期，请重新登陆'
        })

        sessionStorage.setItem('historyUrl', routePath || location.href)

        setTimeout(() => {
          vm.$router.push({
            path: '/login'
          })
        }, 1000)
      } else {
        Message({
          type: 'error',
          message: msg
        })
        return Promise.reject(msg)
      }
    }
  },
  error => {
    Message({
      message: error.return_msg,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
