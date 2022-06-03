/*
 * @Description :
 * @Date        : 2022-06-04 05:09:44 +0800
 * @Author      : JackChou
 * @LastEditTime: 2022-06-04 05:09:44 +0800
 * @LastEditors : JackChou
 */
export function isObject(value) {
  return typeof value === 'object' && value !== null
}

export function isFn(value) {
  return typeof value === 'function'
}

export function isReactive(target) {
  return target && target.__isReactive
}

export function hasChange(newValue, oldValue) {
  // NOTE NaN !== NaN true
  if (Number.isNaN(newValue) && Number.isNaN(oldValue)) return false
  return oldValue !== newValue
}
