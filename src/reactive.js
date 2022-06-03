/*
 * @Description :
 * @Date        : 2022-06-03 23:02:27 +0800
 * @Author      : JackChou
 * @LastEditTime: 2022-06-03 23:57:41 +0800
 * @LastEditors : JackChou
 */
import { isOject } from './utils.js'
import { track, trigger } from './effect.js'

export function reactive(target) {
  if (!isOject(target)) return target
  const proxy = new Proxy(target, {
    get(target, key, receiver) {
      console.log('get', key)
      const value = Reflect.get(target, key, receiver)
      // TODO 如何让副作用和proxy 发生联系
      // NOTE 收集副作用的依赖
      track(target, key)
      return value
    },
    set(target, key, value, receiver) {
      console.log('set', key, value)
      const _value = Reflect.set(target, key, value, receiver)
      // NOTE 触发副作用
      trigger(target, key)
      return _value
    },
  })
  return proxy
}
