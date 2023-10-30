import type { InjectionKey, Ref } from 'vue';
import type { Emitter } from '/@/utils/mitt';
import { createContext, useContext } from '/@/hooks/core/useContext';

export interface SimpleRootMenuContextProps {
  rootMenuEmitter: Emitter;
  activeName: Ref<string | number>;
}

const key: InjectionKey<SimpleRootMenuContextProps> = Symbol();

export function createSimpleRootMenuContext(context: SimpleRootMenuContextProps) {
  /**
   * context 就是一个对象，该对象包含了响应式属性和方法。
   */
  return createContext<SimpleRootMenuContextProps>(context, key, { readonly: false, native: true });
}

export function useSimpleRootMenuContext() {
  return useContext<SimpleRootMenuContextProps>(key);
}
