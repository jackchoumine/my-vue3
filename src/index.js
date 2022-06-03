/*
 * @Description :
 * @Date        : 2022-06-03 22:48:01 +0800
 * @Author      : JackChou
 * @LastEditTime: 2022-06-03 22:58:44 +0800
 * @LastEditors : JackChou
 */
import { isOject } from './utils.js'
export function reactive(target) {
  if (!isOject(target)) return target
  const proxy = new Proxy(target, {
    get(target, key, receiver) {
      const value = Reflect.get(target, key, receiver)
      return value
    },
    set(target, key, value, receiver) {
      const _value = Reflect.set(target, key, value, receiver)
      return _value
    },
  })
  return proxy
}
