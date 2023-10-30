import {
  InjectionKey,
  provide,
  inject,
  reactive,
  readonly as defineReadonly,
  // defineComponent,
  UnwrapRef,
} from 'vue';

export interface CreateContextOptions {
  readonly?: boolean;
  createProvider?: boolean;
  native?: boolean;
}

type ShallowUnwrap<T> = {
  [P in keyof T]: UnwrapRef<T[P]>;
};

export function createContext<T>(context: any, key: InjectionKey<T> = Symbol(), options: CreateContextOptions = {}) {
  const { readonly = true, createProvider = false, native = false } = options;

  /**
   * question： 为什么这个地方要再包装一次？
   *
   */
  const state = reactive(context);

  /**
   * 根据readonly的值，决定是否对state进行readonly包装
   */
  const provideData = readonly ? defineReadonly(state) : state;

  /**
   * 根据native的值，决定注入的是 参数context还是 reactive之后的provideData
   *
   */
  !createProvider && provide(key, native ? context : provideData);

  return {
    state,
  };
}

export function useContext<T>(key: InjectionKey<T>, native?: boolean): T;
export function useContext<T>(key: InjectionKey<T>, defaultValue?: any, native?: boolean): T;

export function useContext<T>(key: InjectionKey<T> = Symbol(), defaultValue?: any): ShallowUnwrap<T> {
  return inject(key, defaultValue || {});
}
