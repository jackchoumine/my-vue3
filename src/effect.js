/*
 * @Description : 副作用
 * @Date        : 2022-06-03 23:06:05 +0800
 * @Author      : JackChou
 * @LastEditTime: 2022-06-04 03:15:47 +0800
 * @LastEditors : JackChou
 */
import { isFn } from './utils.js'

const effectStack = []
// NOTE 记录当前副作用
let activeEffect = null

export function effect(fn) {
  if (!isFn(fn)) return
  const effectFn = () => {
    try {
      activeEffect = fn
      effectStack.push(fn)
      fn()
    } catch (error) {
      console.log(error)
    } finally {
      // NOTE 副作用执行完毕，当前副作用设置为 null
      effectStack.pop() // NOTE 之前的副作用出栈
      activeEffect = effectStack.pop()
    }
  }
  effectFn()
  return effectFn
}
/**
 * {
 *  [target]:{
 *    [key]:[]
 *  }
 * }
 */
const targetMap = new WeakMap()

/**
 * 收集副作用的依赖 --- 副作用和其依赖建议对应关系
 * @param {Object} target 响应式对象
 * @param {String} key 响应式对象的key
 */
export function track(target, key) {
  if (!activeEffect) return
  console.log('依赖收集-----', key)
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  let deps = depsMap.get(key)
  if (!deps) {
    depsMap.set(key, (deps = new Set()))
  }
  // NOTE 记录副作用的依赖
  deps.add(activeEffect)
  // console.log(targetMap.get(target))
  // console.log(targetMap.get(target).get(key))
  // console.log(deps)
}

/**
 * 响应式对象发生变化，执行副作用
 * @param {Object} target 响应式对象
 * @param {String} key  响应式对象的key
 */
export function trigger(target, key) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return
  const deps = depsMap.get(key)
  if (!deps) return
  console.log('deps')
  console.log(deps.size)
  deps.forEach((effect) => {
    effect()
  })
}
