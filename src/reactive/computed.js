/*
 * @Description : 计算属性
 * @Date        : 2022-06-04 03:37:25 +0800
 * @Author      : JackChou
 * @LastEditTime: 2022-06-04 05:10:50 +0800
 * @LastEditors : JackChou
 */
import { effect, track, trigger } from './effect.js'
import { isObject } from '../utils/index.js'

export function computed(getterOrSetter) {
  let setter = () => {
      console.warn('computed is read only, please provide setter')
    },
    getter = null
  if (isObject(getterOrSetter)) {
    getter = getterOrSetter.get
    getterOrSetter.set && (setter = getterOrSetter.set)
  } else {
    getter = getterOrSetter
  }
  return new Compute(getter, setter)
}

class Compute {
  constructor(getter, setter) {
    this._value = null
    this._dirty = true
    this._setter = setter
    this.effect = effect(getter, {
      lazy: true,
      //NOTE 依赖边触发，触发调度程序
      scheduler: () => {
        if (!this._dirty) {
          console.log('computed scheduler')
          this._dirty = true
          trigger(this, 'value')
        }
      },
    })
  }
  get value() {
    if (this._dirty) {
      this._value = this.effect()
      this._dirty = false
      track(this, 'value')
    }
    return this._value
  }
  set value(value) {
    console.log('setter', value)
    // trigger(this, 'value')
    this._setter(value)
  }
}
