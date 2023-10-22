import { InjectionKey, Ref } from 'vue';
import { createContext, useContext } from '/@/hooks/core/useContext';

export interface AppProviderContextProps {
  prefixCls: Ref<string>;
  isMobile: Ref<boolean>;
}

/**
 * 注意这个key，他是一个固定的Symbol对象，且没有对外暴露。 在createAppProviderContext中  使用了vue的provide，
 * 将key作为 provide函数的key，value是 传入的context对象。
 *
 * 在useAppProviderContext中，使用了vue的inject，将key作为inject函数的key，获取到context对象。
 */
const key: InjectionKey<AppProviderContextProps> = Symbol();

export function createAppProviderContext(context: AppProviderContextProps) {
  return createContext<AppProviderContextProps>(context, key);
}

export function useAppProviderContext() {
  return useContext<AppProviderContextProps>(key);
}
