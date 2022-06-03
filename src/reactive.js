/*
 * @Description :
 * @Date        : 2022-06-03 23:02:27 +0800
 * @Author      : JackChou
 * @LastEditTime: 2022-06-03 23:03:39 +0800
 * @LastEditors : JackChou
 */
import { isOject } from './utils.js'
export function reactive(target) {
  if (!isOject(target)) return target
  const proxy = new Proxy(target, {
    get(target, key, receiver) {
      console.log('get', key)
      const value = Reflect.get(target, key, receiver)
      return value
    },
    set(target, key, value, receiver) {
      console.log('set', key, value)
      const _value = Reflect.set(target, key, value, receiver)
      return _value
    },
  })
  return proxy
}
