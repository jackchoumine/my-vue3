/*
 * @Description : 计算属性
 * @Date        : 2022-06-04 03:37:25 +0800
 * @Author      : JackChou
 * @LastEditTime: 2022-06-04 04:58:49 +0800
 * @LastEditors : JackChou
 */
import { effect, track } from './effect.js'
import { isObject } from './utils.js'
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
        console.log('computed scheduler')
        this._dirty = true
      },
    })
  }
  get value() {
    if (this._dirty) {
      // debugger
      this._value = this.effect()
      this._dirty = false
      // debugger
      track(this, 'value')
    }
    return this._value
  }
  set value(value) {
    console.log('setter', value)
    this._setter(value)
  }
}
