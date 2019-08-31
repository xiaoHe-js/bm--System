import utils from './index'

/**
 * 导出数据
 * @param {String} url 导出链接
 * @param {Object} params 导出参数
 */
export function exportData(url, params = {}) {
  params.t = sessionStorage.getItem('t')

  location.href = `${url}?${utils.formatGetParams(params)}`
}
