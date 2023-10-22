import { Slots } from 'vue';
import { isFunction } from '/@/utils/is';

/**
 * 1.关于tsx： tsx会被编译生成jsx
 * JSX是ECMAScript的类似于XML的语法扩展，没有特定的语义。它不由引擎或浏览器实现。将JSX合并到ECMAScript规范本身不是一个好的建议。JSX 被各种转译器
 * （ transpiler ） 使 用 ， 并 把 它 们 所 接 收 的 内 容 转 换 为 标 准 的ECMAScript。JSX允许用户在 JavaScript中书写类似于HTML的视图代码，因此
 * 你可以这样做。
 *
 */

/**
 * @description:  Get slot to prevent empty error
 */
export function getSlot(slots: Slots, slot = 'default', data?: any) {
  /**
   * 如果slots对象为空，或者在slots中没有指定名称的slot，则返回null
   */
  if (!slots || !Reflect.has(slots, slot)) {
    return null;
  }
  /**
   * 为什么要判断 如果不是函数，则返回null呢？
   * 原因是 setup的context对象上解构出来的slots对象 其属性的名称是 slot的名称，其值是一个函数
   * {
   *   default:(...args) => {…},//default slot对应的函数
   * }
   *
   * slots对象的定义是：
   * type InternalSlots = {
   *     [name: string]: Slot | undefined;
   * };
   * InternalSlots是一个类型定义，该定义中通过索引签名的方式指定所有的属性名都是string类型，属性值是Slot类型。
   *
   * export type Slot<T extends any = any> = (...args: IfAny<T, any[], [T] | (T extends undefined ? [] : never)>) => VNode[];
   * slot类型是一个泛型类型Slot<T> 其中T extends any，且T的默认值是any
   * slot类型的值是一个函数，该函数的参数是一个数组，数组的元素类型是T，返回值是一个VNode数组。
   * 所以这里通过slot名称得到的slot应该是一个函数
   * 且执行slot函数得到的返回值就是要渲染的内容。
   */
  if (!isFunction(slots[slot])) {
    console.error(`${slot} is not a function!`);
    return null;
  }
  const slotFn = slots[slot];
  if (!slotFn) return null;
  //执行slot函数，返回要渲染的内容
  return slotFn(data);
}

/**
 * extends slots
 * @param slots
 * @param excludeKeys
 */
export function extendSlots(slots: Slots, excludeKeys: string[] = []) {
  const slotKeys = Object.keys(slots);
  const ret: any = {};
  slotKeys.map((key) => {
    if (excludeKeys.includes(key)) {
      return null;
    }
    ret[key] = () => getSlot(slots, key);
  });
  return ret;
}
