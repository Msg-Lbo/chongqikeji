// 通用时间函数
/**
 * @description 计算距离现在的时间
 * @param {String} time 所需计算的时间的字符串，格式为2022-04-06 09:58:05
 */
export function timeFromNow(time) {
	let nowTime = new Date().getTime()
	let timeNum = new Date(time.replace('-', '/')).getTime()
	let times = (nowTime - timeNum) / 1000
	if (times < 60) {
		return times + '秒前'
	}
	if (times < 60 * 60) {
		return parseInt(times / 60) + '分钟前'
	}
	if (times < 60 * 60 * 24) {
		return parseInt(times / 60 / 60) + '小时前'
	}
	if (times < 60 * 60 * 24 * 3) {
		let text = ''
		switch (parseInt(times / 60 / 60 / 24)) {
			case 1:
				text = '一'
				break;
			case 2:
				text = '二'
				break;
			case 3:
				text = '三'
				break
		}
		return text + '天前'
	}
	return time.split(' ')[0].replace('-', '.')
}

// 通用时间函数
/**
 * @description 转换时间格式
 * @param {String} time 所需计算的时间的字符串，格式为时间戳或者Date格式
 */
export function timeDeal(dateData) {
	var date = new Date(dateData);
	let Y = date.getFullYear() + '.';
	let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '.';
	let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
	let h = date.getHours() < 10 ? '0' + date.getHours()  + ':': date.getHours() + ':';
	let m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
	let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
	return Y + M + D + " " + h + m + s;
}


/**
 * 日期格式化
 * @param {Date} time 时间对象
 * @param {String} pattern  格式化模板字符串 y-年 m-月 d-日 h-时 i-分 s-秒
 * @returns
 */
export function parseTime(time, pattern) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = pattern || "{y}-{m}-{d} {h}:{i}:{s}"
  let date
  if (typeof time === "object") {
    date = time
  } else {
    if (typeof time === "string" && /^[0-9]+$/.test(time)) {
      time = parseInt(time)
    } else if (typeof time === "string") {
      time = time
        .replace(new RegExp(/-/gm), "/")
        .replace("T", " ")
        .replace(new RegExp(/\.[\d]{3}/gm), "")
    }
    if (typeof time === "number" && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === "a") {
      return ["日", "一", "二", "三", "四", "五", "六"][value]
    }
    if (result.length > 0 && value < 10) {
      value = "0" + value
    }
    return value || 0
  })
  return time_str
}