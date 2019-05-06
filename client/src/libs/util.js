// 插件
import Cookies from 'js-cookie'
let util = {}

/**
 * @description 得到现在的用户
 */
util.uuid = function () {
  return Cookies.get('uuid')
}
export default util
