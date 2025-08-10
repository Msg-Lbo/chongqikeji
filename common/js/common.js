import md5 from 'js-md5';

// 通用方法
/**
 * @description 对象转url参数,只支持简单数据类型
 * @param {Object}  params 要转换成url参数的对象，例如:{a:1,b:2}
 * @return {String} 返回的为?a=1&b=2
 */

export function objToStr(params = {}) {
  let arr = Object.keys(params)
  let str = '?'
  for (var i = 0; i < arr.length; i++) {
    str += arr[i] + '=' + params[arr[i]] + '&'
  }
  return str.slice(0, str.length - 1)
}

/**
 * @description 将url?后面的参数转成对象
 * @alias url 别名
 * @param {String} url url字符串
 * @returns {object}
 */

export function urlToObj(url) {
  if (!url) return {}
  let dourl = decodeURIComponent(url)
  let arr = dourl.split('?')[1].split('&')
  let obj = {}
  for (var i = 0; i < arr.length; i++) {
    let key = arr[i].split('=')[0]
    let value = arr[i].split('=')[1]
    obj[key] = value
  }
  return obj
}

/**
 * @description 表单验证未填写
 * @param {Object}  obj 要上传的对象
 * @param {Array}  tipsList 验证未填写的内容 { name: '对象名称', tips: '未填写时提示信息'}
 * @return {Boolean}  如没有未填写内容没有返回值 反之,返回true 可在写上: let res = this.$fn.notFilled(obj,list)
 * 																	if(!res){return}
 *															来结束后续操作
 */
export function notFilled(obj, tipsList) {
  for (let key in obj) {
    // console.log(key);
    // console.log(obj[key]);
    let err = null
    if (!obj[key] || obj[key].length < 1) {
      tipsList.forEach((v) => {
        if (v.name == key) {
          err = v.tips
          console.log('err', err)
        }
      })
    }
    if (err) {
      uni.showToast({
        title: err,
        icon: 'none',
      })
      return false
    }
  }
  return true
}

// 手机号正则验证
export function phoVerify(phoneNumber) {
  console.log('phoneNumber', phoneNumber)
  // 使用正则表达式字面量
  let reg = /^((13[0-9])|(14[0-9])|(15[0-9])|(16[2-7])|(17[0-8])|(18[0-9])|(19[0-9]))\d{8}$/

  if (reg.test(phoneNumber)) {
    console.log('手机号正确')
    return true
  }

  // 如果测试失败，显示提示
  uni.showToast({
    title: '手机号不正确',
    icon: 'none',
  })

  console.log('手机号不正确')
  return false
}

// 身份证正则验证
export function idNumberVerify(idNum) {
  console.log('idNum', idNum)
  // 使用正则表达式字面量
  let reg = /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/

  if (reg.test(idNum)) {
    console.log('身份证号正确')
    return true
  }
  // 如果测试失败，显示提示
  uni.showToast({
    title: '身份证号不正确',
    icon: 'none',
  })
  return false
}


/**
 * @description 电话号码加密
 * @param {string|number}  phone 电话号码
 * @return {String}  返回加密后的电话
 *
 */
export function phoneEn(phone) {
  let reg = /(\d{3})\d{4}(\d{4})/ // 正则表达式匹配电话号码
  let encryptedPhone = phone.replace(reg, '$1****$2')
  console.log('encryptedPhone', encryptedPhone)
  return encryptedPhone // 输出加密后的电话号码
}

/**
 * @description base64添加前缀
 * @param {Object} base64
 */
export function fixBase64(base64) {
  return 'data:image/jpeg;base64,' + base64
}

/**
 * @description base64转为url格式(canvas需要使用)
 * @param {base64}  base64 base64文件
 * @param {Boolean} type 默认为false ture截取前缀 false不截取
 * @return {Promise}  转换后的文件.then获取
 *
 */

export function base64ToUrl(base64, type = false) {
  let filePath = wx.env.USER_DATA_PATH + '/qrcode.png'
  base64 = type ? base64.split(',')[1] : base64

  return new Promise((resolve, reject) => {
    uni.getFileSystemManager().writeFile({
      filePath: filePath, //创建一个临时文件名
      data: base64, //写入的文本或二进制数据
      encoding: 'base64', //写入当前文件的字符编码
      success: (res) => {
        console.log(filePath, 'filePath')
        resolve(filePath)
      },
      fail: (err) => {
        console.log(err)
        reject(err)
      },
    })
  })
}

/**
 * @description  富文本图片控制大小
 * @param {Object} html 富文本
 * @return {Promise}  处理后的富文本
 */
export function formatRichText(html) {
  if (!html) {
    return
  }
  let newContent = html.replace(/<img([^>]*?)style="[^"]*?"([^>]*?)>/gi, function (match, preAttrs, postAttrs) {
    // 移除 img 标签中的 style 属性，并添加新的样式
    return `<img ${preAttrs} style="width:100%;height:auto;display:inline-block;margin:10rpx auto;" ${postAttrs}>`
  })
  // 移除多余的<br>标签（如果不需要的话）
  newContent = newContent.replace(/<br[^>]*\/>/gi, '')
  return newContent
}

/**
 * @description  图片添加前缀
 * @param {String} str 字符串
 * @return {Promise}  处理后的数据
 */
export function substrStr(str) {
  let res = str
  if (str) {
    if (str.indexOf(',') != -1) {
      let index = str.indexOf(',')
      res = str.substring(0, index)
    }
    if (str.indexOf('http') == -1) {
      res = this.vuex_imgUrl + res
    }
  }
  return res
}


/**
 * @description 从header中提取token
 * @param {Object} response 完整请求
 * @returns {String} token
 */
export function getToken(response) {
  const token = response.header['Authorization']
  return token.split(' ')[1]
}

/**
 * @description 腾讯云逆解析
 * @param {String} key 开发密钥（Key）
 * @param {String} location 经纬度信息
 * @returns {Object} 地名信息
 */
export function getLocationName(key, location, SecretKey) {
  // console.log(`/ws/geocoder/v1?key=${key}&location=${location}${SecretKey}`);
  const sig = md5(`/ws/geocoder/v1?key=${key}&location=${location}${SecretKey}`)
  // console.log(sig);
  return new Promise((resolve, reject) => {
    uni.request({
      url: 'https://apis.map.qq.com/ws/geocoder/v1',
      method: 'GET',
      data: {
        key: encodeURIComponent(key),
        location: encodeURIComponent(location),
        sig: encodeURIComponent(sig)
      },
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}


/**
 * @deprecated 计算两点之间的距离
 * @param {Object} point1 点1
 * @param {Object} point2 点2
 * @returns {Number} 距离
 */
export function calculateDistance(point1, point2) {
  const lat1 = point1.lat;
  const lng1 = point1.lng;
  const lat2 = point2.lat;
  const lng2 = point2.lng;
  const R = 6378137; // 地球半径，单位为米
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}