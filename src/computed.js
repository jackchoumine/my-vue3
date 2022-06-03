/*
 * @Description : 计算属性
 * @Date        : 2022-06-04 03:37:25 +0800
 * @Author      : JackChou
 * @LastEditTime: 2022-06-04 04:39:05 +0800
 * @LastEditors : JackChou
 */
import { effect, track } from './effect.js'

export function computed(getter) {
  return new Compute(getter)
}

class Compute {
  constructor(getter) {
    this._value = null
    this._dirty = true
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
    // TODO:
  }
}
