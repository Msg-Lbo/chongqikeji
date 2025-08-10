// 将公共方法统一挂载，所有该文件内的方法均以断言的字母+'_'开头,以避免方法名冲突
import * as common from './common.js'
import * as time from './time.js'
import * as uni from './uni.js'

// import * as B from './xxx.js' 如果有新增


export default {
	...common,
	...time,
	...uni,
}