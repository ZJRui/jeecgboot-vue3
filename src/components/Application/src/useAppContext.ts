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

/**
 * 2.createAppProviderContext 只有在刷新整个页面的时候才会执行，因为 app.vue中是   <AppProvider> <RouterView /> </AppProvider>
 * 因此路由切换只会切换appprovider的内部组件，appProvider组件不会重新创建。
 *
 * 3.createAppProviderContext函数是在AppProvider的setUp中被调用的。传递的context是 一个对象，该对象的部分属性值是从AppProvider的props
 * 解构出来的。
 * @param context
 */
export function createAppProviderContext(context: AppProviderContextProps) {
  return createContext<AppProviderContextProps>(context, key);
}

export function useAppProviderContext() {
  return useContext<AppProviderContextProps>(key);
}
