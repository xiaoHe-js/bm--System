/**
 * 获取域名是什么环境
 * @param {String} domain 域名，为空默认为当前域名
 * @return {String} dev:开发 test:测试 prod:生产
 */
export function getEnv(domain = window.location.href) {
  // 可配置开发与测试环境的域名关键词
  let devKeysArr = ['-dev', 'new.', 'web2.', 'vote2.', 'difference2.', 'draw2.', 'home2.'],
    testKeysArr = ['-test', 'wx.', 'web1.', 'vote1.', 'difference1.', 'draw1.', 'home1.'],
    isUrlContainStr = str => domain.indexOf(str) >= 0,
    isDev = devKeysArr.some(isUrlContainStr),
    isTest = testKeysArr.some(isUrlContainStr)

  if (isDev) { return 'dev' } else if (isTest) { return 'test' } else { return 'prod' }
}

/**
* 格式化get参数
* @param {Object} params 需要格式化的参数对象
* @returns {String} 格式化之后的字符串
*/
/**
 * 乘法函数，用来得到精确的乘法结果
 * @param {Number} arg1 第一个乘数
 * @param {Number} arg2 第二个乘数
 * @returns {Number} 返回相乘之后的准确结果
 */
export function accMul(arg1, arg2) {
  var m = 0,
    s1 = arg1.toString(),
    s2 = arg2.toString()
  try {
    m += s1.split('.')[1].length
  } catch (e) { }
  try {
    m += s2.split('.')[1].length
  } catch (e) { }
  return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m)
}

/**
 * 除法函数，用来得到精确的除法结果
 * @param {Number} arg1 第一个乘数
 * @param {Number} arg2 第二个乘数
 * @returns {Number} arg1除以arg2的精确结果
 */
export function accDivision(arg1, arg2) {
  var t1 = 0,
    t2 = 0,
    r1,
    r2

  try {
    t1 = arg1.toString().split('.')[1].length
  } catch (e) {

  }
  try {
    t2 = arg2.toString().split('.')[1].length
  } catch (e) {

  }
  r1 = Number(arg1.toString().replace('.', ''))
  r2 = Number(arg2.toString().replace('.', ''))
  return (r1 / r2) * Math.pow(10, t2 - t1)
}

/**
 * 加法函数，用来得到精确的加法结果
 * 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
 * 调用：accAdd(arg1,arg2)
 * 返回值：arg1加上arg2的精确结果
 **/
export function accAdd(arg1, arg2) {
  arg1 = arg1 || 0
  arg2 = arg2 || 0
  let r1, r2, m, c
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  c = Math.abs(r1 - r2)
  m = Math.pow(10, Math.max(r1, r2))
  if (c > 0) {
    let cm = Math.pow(10, c)
    if (r1 > r2) {
      arg1 = Number(arg1.toString().replace('.', ''))
      arg2 = Number(arg2.toString().replace('.', '')) * cm
    } else {
      arg1 = Number(arg1.toString().replace('.', '')) * cm
      arg2 = Number(arg2.toString().replace('.', ''))
    }
  } else {
    arg1 = Number(arg1.toString().replace('.', ''))
    arg2 = Number(arg2.toString().replace('.', ''))
  }
  return (arg1 + arg2) / m
}

/**
 * 减法函数，用来得到精确的减法结果
 * 说明：javascript的减法结果会有误差，在两个浮点数相减的时候会比较明显。这个函数返回较为精确的减法结果。
 * 调用：accSub(arg1,arg2)
 * 返回值：arg1加上arg2的精确结果
 **/
export function accSub(arg1, arg2) {
  let r1, r2, m, n
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2)) // last modify by deeka //动态控制精度长度
  n = (r1 >= r2) ? r1 : r2
  return ((arg1 * m - arg2 * m) / m).toFixed(n)
}

/**
 * 校验是否是正数（包含正整数和正浮点数）
 * @param {Number | String} number 需要校验的数字
 * @returns {Boolean} 返回校验结果
 */
export function checkPositiveNumber(number) {
  let reg = /^\+?\d+(.\d+)?$/

  return reg.test(number)
}

/**
 * 校验是否是正整数
 * @param {Number | String} number 需要校验的数字
 * @returns {Boolean} 返回校验结果
 */
export function checkPositiveInt(number) {
  let reg = /^[0-9]\d*$/

  return reg.test(number)
}

/**
 * 科学计数法字符 转换 为数字字符， 突破正数21位和负数7位的Number自动转换
 * @param {Number | String} numInStr 需要转换的数字
 * @returns {String} 返回转换之后的数字
 */
export function convertNum(numInStr) {
  // 兼容 小数点左边有多位数的情况，即 a×10^b（aEb），a非标准范围（1≤|a|<10）下的情况。如 3453.54E-6 or 3453.54E6
  let resValue = '',
    power = '',
    result = null,
    dotIndex = 0,
    resArr = [],
    sym = '',
    numStr = numInStr.toString()
  if (numStr[0] == '-') { // 如果为负数，转成正数处理，先去掉‘-’号，并保存‘-’.
    numStr = numStr.substr(1)
    sym = '-'
  };
  if ((numStr.indexOf('E') != -1) || (numStr.indexOf('e') != -1)) {
    let regExp = new RegExp('^(((\\d+.?\\d+)|(\\d+))[Ee]{1}((-(\\d+))|(\\d+)))$', 'ig')
    result = regExp.exec(numStr)
    if (result != null) {
      resValue = result[2]
      power = result[5]
      result = null
    }
    if (!resValue && !power) {
      return false
    }
    dotIndex = resValue.indexOf('.') != -1 ? resValue.indexOf('.') : 1 // 小数点所在的位置
    resValue = resValue.replace('.', '') // 去掉小数点的字符串
    resArr = resValue.split('') // 所有数字的数组
    if (Number(power) >= 0) { // 正次方
      let subres = resValue.substr(dotIndex)
      power = Number(power)
      // 幂数大于小数点后面的数字位数时，后面加0
      for (let i = 0; i < power - subres.length; i++) {
        resArr.push('0')
      }
      if (power - subres.length < 0) {
        resArr.splice(dotIndex + power, 0, '.')
      }
    } else { // 负次方
      power = power.replace('-', '')
      power = Number(power) // 幂数
      // 幂数大于等于 小数点的index位置, 前面加0
      for (let i = 0; i <= power - dotIndex; i++) {
        resArr.unshift('0')
      }
      let n = power - dotIndex >= 0 ? 1 : -(power - dotIndex)
      resArr.splice(n, 0, '.')
    }

    resValue = resArr.join('')
    return sym + resValue
  } else {
    return numInStr
  }
}

/**
 * 判断DOM节点是否包含某个class
 * @param ele 节点
 * @param className class名称
 */
export function hasClass(ele, className) {
  if (!(ele instanceof HTMLElement)) {
    return false
  }

  if (!className) {
    return false
  }

  let eleClassName = ele.getAttribute('class')

  return eleClassName && eleClassName.indexOf(className) !== -1
}

// 判断是否是对象或数组
function isArrayOrObject(obj) {
  return isArray(obj) || isObject(obj)
}

// 处理对象get参数
function handlerObjectGetParam(params, paramsKey = '') {
  let result = ''

  // 判断是否是数组或对象
  if (isArrayOrObject(params)) {
    // 处理函数
    let handlerFn = function(data, key) {
      // 如果子项是数组或对象，递归处理
      if (isArrayOrObject(data)) {
        paramsKey = paramsKey ? `${paramsKey}[${key}]` : key

        result += formatGetParams(data, paramsKey)
      } else {
        result += `&${paramsKey}[${key}]=${data}`
      }
    }

    if (isArray(params)) {
      for (let index = 0; index < params.length; index++) {
        handlerFn(params[index], index)
      }
    }

    if (isObject(params)) {
      for (let key in params) {
        handlerFn(params[key], key)
      }
    }
  } else {
    result += `&${paramsKey}=${params}`
  }

  return result
}

/**
 * 格式化get参数
 * @param {Object} params 需要格式化的参数对象
 * @returns {String} 格式化之后的字符串
 */
export function formatGetParams(params, result = '') {
  for (let key in params) {
    result += handlerObjectGetParam(params[key], key)
  }

  return result.replace('&', '')
}

// 判断是否是数组
export function isArray(arg) {
  return toString.call(arg) === '[object Array]'
}

// 判断是否是对象
export function isObject(arg) {
  return toString.call(arg) === '[object Object]'
}

/**
 * 格式化数字
 * @param {*} value 需要格式化的字符
 * @param { Number } minLength 需要处理的最小长度，小于这个值直接返回
 */
export function formatNumber(value, minLength = 4) {
  if (value) {
    // 判断是否是数字，如果是数字转换为字符串
    if (typeof value === 'number') {
      value = String(value)
    } else if (isNaN(Number(value))) {
      return value
    }

    if (value.length <= minLength) {
      return value
    }

    let splitValue = value.split('.'), // 从.的位置截取字符串
      handerValue = splitValue[0],
      formatLength = 3, // 需要处理的间隔
      prepend = '', // 需要添加的前缀
      suffix = '', // 需要添加的后缀
      result = ''

    // 判断是否是负数
    if (Number(handerValue) < 0) {
      handerValue = handerValue.slice(1)
      prepend = '-'
    }

    // 判断是否需要添加后缀
    if (splitValue[1]) {
      suffix = '.' + splitValue[1]
    };

    // 判断长度是否足够
    if (handerValue.length <= formatLength) {
      return value
    }

    result = formatInt(handerValue)

    return prepend + result + suffix
  }

  return value
}

// 格式化整数
export function formatInt(value, length = 3) {
  if (typeof value === 'number') {
    value = String(value)
  }

  if (value.length <= length) {
    return value
  }

  let startIndex = value.length % length,
    cycles = Math.floor(value.length / length), // 需要循环的次数
    resultArray = []

  if (startIndex === 0) {
    startIndex += length
    cycles -= 1
  }

  resultArray.push(value.slice(0, startIndex))

  for (let i = 0; i < cycles; i++) {
    resultArray.push(value.slice(startIndex, startIndex + length))

    startIndex += length
  }

  return resultArray.join(',')
}

/**
 * 处理秒数
 * @param {*} time 秒
 * @param { String } formatString 时分秒连接符
 * @returns { String } 返回处理好的数据
 */
export function handlerSecond(time, formatString) {
  if (!time) {
    return ''
  }

  formatString = formatString || ' '

  let resultArr = [],
    hour = Math.floor(time / 3600),
    minute = Math.floor((time % 3600) / 60),
    second = Math.floor((time % 3600) % 60)

  resultArr.push(hour ? hour <= 9 ? `0${hour}` : hour : '00')
  resultArr.push(minute ? minute <= 9 ? `0${minute}` : minute : '00')
  resultArr.push(second ? second <= 9 ? `0${second}` : second : '00')

  return resultArr.join(formatString)
}

/**
  * 校验邮箱地址
  * @param {String} email 邮箱地址
  * @returns {Boolean} 返回验证结果
  */
export function checkEmail(email) {
  let reg = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/

  return reg.test(email)
}

/**
 * 校验url
 * @param {String} url 网站地址
 * @returns {Boolean} 返回验证结果
 */
export function checkUrl(url) {
  let reg = /(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/

  return reg.test(url)
}

/**
 * 校验版本号
 * @param {String} version 版本号
 * @returns {Boolean} 返回验证结果
 */
export function checkVersion(version) {
  let reg = /^\d+(.\d+){2,2}$/

  return reg.test(version)
}

/**
 * base64解码
 * @param {String} str base64字符串
 * @returns {String} 解码后字符串
 */
export function b64DecodeUnicode(str) {
  if (this.isBase64(str)) {
    return decodeURIComponent(atob(str).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
  } else {
    return str
  }
}

/**
 * base64转码
 * @param {String} str base64字符串
 * @returns {String} 转码后字符串
 */
export function b64EncodeUnicode(str) {
  if (this.isBase64(str)) {
    return str
  } else {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
      return String.fromCharCode('0x' + p1)
    }))
  }
}

/**
 * 是否是base64字符串
 * @param {String} str 字符串
 * @returns {Boolean} 是否是base64字符串
 */
export function isBase64(str) {
  var reg = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/
  return reg.test(str)
}

/**
 * 时间格式化
 * @param {String} time 时间戳
 * @param {String} format 时间格式 (例如:yyyy-MM-dd hh:mm:ss)
 * @return {String} 返回的时间格式
 */
export function formatTime(time, format = 'yyyy-MM-dd') {
  if (time == null) {
    return
  };

  if ((typeof time).toLowerCase() === 'string') {
    time = Number(time)
  };

  time = time.length == 10 ? new Date(time * 1000) : new Date(time)

  let timeSplit = {
    M: time.getMonth() + 1,
    d: time.getDate(),
    h: time.getHours(),
    m: time.getMinutes(),
    s: time.getSeconds()
  }

  format = format.replace(/(M+|d+|h+|m+|s+)/g, (value) => {
    return ((value.length > 1 ? '0' : '') + timeSplit[value.slice(-1)]).slice(-2)
  })

  return format.replace(/(y+)/g, (value) => {
    return time.getFullYear().toString().slice(-value.length)
  })
}
/**
 * 保留后两位小数
 * @param {Number} number 数字
 * @param {Number} decimalNum 要保留几位
 * @returns {Number} 返回处理后的数字
 */
export function toFixed(number = 0, decimalNum = 2) {
  const type = typeof Number(number)
  if (type !== 'number') return 0
  let index = String(number).indexOf('.')
  if (index !== -1) {
    const result = Number(number).toFixed(decimalNum)
    return Number(result) || 0
  }
  return Number(number) || 0
}
