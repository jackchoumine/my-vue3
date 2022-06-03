/*
 * @Description : 副作用
 * @Date        : 2022-06-03 23:06:05 +0800
 * @Author      : JackChou
 * @LastEditTime: 2022-06-04 05:10:35 +0800
 * @LastEditors : JackChou
 */
import { isFn } from '../utils/index.js'

const effectStack = []
// NOTE 记录当前副作用
let activeEffect = null

export function effect(effectFn, { lazy = false, scheduler = '' } = {}) {
  if (!isFn(effectFn)) return

  const fn = () => {
    try {
      activeEffect = effectFn
      effectStack.push(effectFn)
      // NOTE 返回，否则计算属性不会更新
      return effectFn()
    } catch (error) {
      console.log(error)
    } finally {
      // NOTE 副作用执行完毕，当前副作用设置为 null
      effectStack.pop() // NOTE 之前的副作用出栈
      activeEffect = effectStack.pop()
    }
  }

  !lazy && fn()
  effectFn.scheduler = scheduler
  // NOTE 返回副作用
  return fn
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
  console.log('deps size', deps.size)
  deps.forEach((effectFn) => {
    if (effectFn.scheduler) {
      effectFn.scheduler()
    } else {
      effectFn()
    }
  })
}
