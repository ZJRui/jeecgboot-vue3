import { Slots } from 'vue';

export function getSlot(slots: Slots, slot = 'default', data?: any) {
  /**
   * 如果slots对象为空，或者在slots中没有指定名称的slot，则返回null
   */
  if (!slots || !Reflect.has(slots, slot)) {
    return null;
  }
  if (typeof slots[slot] !== 'function') {
    console.error(`${slot} is not a function!`);
    return null;
  }
  const slotFn = slots[slot];
  if (!slotFn) return null;
  return slotFn(data);
}
