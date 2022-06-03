/*
 * @Description : 工具函数
 * @Date        : 2022-06-03 22:53:29 +0800
 * @Author      : JackChou
 * @LastEditTime: 2022-06-04 00:06:18 +0800
 * @LastEditors : JackChou
 */
export function isOject(value) {
  return typeof value === 'object' && value !== null
}

export function isFn(value) {
  return typeof value === 'function'
}

export function isReactive(target) {
  return target && target.__isReactive
}
