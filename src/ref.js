/*
 * @Description : ref
 * @Date        : 2022-06-04 03:20:14 +0800
 * @Author      : JackChou
 * @LastEditTime: 2022-06-04 03:29:20 +0800
 * @LastEditors : JackChou
 */
import { track, trigger } from './effect.js'
import { reactive } from './index.js'
import { isObject, hasChange } from './utils.js'

export function ref(value) {
  if (isRef(value)) return value
  return new Ref(value)
}

export function isRef(value) {
  return value && value.__isRef
}

class Ref {
  constructor(value) {
    this.__isRef = true
    this._value = convert(value)
  }
  get value() {
    track(this, 'value')
    return this._value
  }
  set value(newValue) {
    if (hasChange(this._value, newValue)) {
      // NOTE 顺序重要
      this._value = convert(newValue) //NOTE 新值需要转换
      trigger(this, 'value')
    }
  }
}

function convert(value) {
  return isObject(value) ? reactive(value) : value
}
