/*
 * @Description :
 * @Date        : 2022-06-03 23:02:27 +0800
 * @Author      : JackChou
 * @LastEditTime: 2022-06-04 00:19:13 +0800
 * @LastEditors : JackChou
 */
import { isOject, isReactive, hasChange } from './utils.js'
import { track, trigger } from './effect.js'

const proxyMap = new WeakMap()

export function reactive(target) {
  if (!isOject(target)) return target

  //NOTE 处理 reactive(reactive)
  if (isReactive(target)) return target
  //NOTE  const a = reactive(obj), b = reactive(obj)
  if (proxyMap.has(target)) return target

  const proxy = new Proxy(target, {
    get(target, key, receiver) {
      console.log('get', key)
      if (key === '__isReactive') return true
      const value = Reflect.get(target, key, receiver)
      // TODO 如何让副作用和proxy 发生联系
      // NOTE 收集副作用的依赖
      track(target, key)
      return value
    },
    set(target, key, value, receiver) {
      console.log('set', key, value)
      const oldValue = target[key]
      const newValue = Reflect.set(target, key, value, receiver)
      // NOTE 依赖发生改变，才触发副作用
      hasChange(oldValue, newValue) && trigger(target, key)
      return newValue
    },
  })
  proxyMap.set(target, proxy)
  return proxy
}
