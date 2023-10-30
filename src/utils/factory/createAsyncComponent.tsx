import {
  defineAsyncComponent,
  // FunctionalComponent, CSSProperties
} from 'vue';
import { Spin } from 'ant-design-vue';
import { noop } from '/@/utils/index';

// const Loading: FunctionalComponent<{ size: 'small' | 'default' | 'large' }> = (props) => {
//   const style: CSSProperties = {
//     position: 'absolute',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//   };
//   return (
//     <div style={style}>
//       <Spin spinning={true} size={props.size} />
//     </div>
//   );
// };

interface Options {
  size?: 'default' | 'small' | 'large';
  delay?: number;
  timeout?: number;
  loading?: boolean;
  retry?: boolean;
}

export function createAsyncComponent(loader: Fn, options: Options = {}) {
  /**
   *
   *
   *
   */
  const { size = 'small', delay = 100, timeout = 30000,
    loading = false, retry = true } = options;
  return defineAsyncComponent({
    loader,
    /**
     * 加载异步组件时使用的组件
     * 如果提供了一个加载组件，它将在内部组件加载时先行显示。在加载组件显示之前有一个默认的
     * 200ms  延迟——这是因为在网络状况较好时，加载完成得很快，加载组件和最终组件之间的替换
     * 太快可能产生闪烁，反而影响用户感受。
     */
    loadingComponent: loading ? <Spin spinning={true} size={size} /> : undefined,
    //  如果提供了一个  timeout  时间限制，并超时了
    //  也会显示这里配置的报错组件，默认值是：Infinity
    // TODO
    timeout,
    //  展示加载组件前的延迟时间，默认为  200ms
    // errorComponent
    // Defining if component is suspensible. Default: true.
    // suspensible: false,
    delay,
    //errorComponent: //  加载失败后展示的组件
    /**
     *
     * @param {*} error Error message object
     * @param {*} retry A function that indicating whether the async component should retry when the loader promise rejects
     * @param {*} fail  End of failure
     * @param {*} attempts Maximum allowed retries number
     */
    onError: !retry
      ? noop
      : (error, retry, fail, attempts) => {
          if (error.message.match(/fetch/) && attempts <= 3) {
            // retry on fetch errors, 3 max attempts
            retry();
          } else {
            // Note that retry/fail are like resolve/reject of a promise:
            // one of them must be called for the error handling to continue.
            fail();
          }
        },
  });
}

/**
 * note: 上面 定义 onError属性的时候使用了一个表达式
 */
let boolVar = false;
// @ts-ignore
let samsung = {
  error: boolVar
      ? () => {}
      : (p1, p2, p3) => {
        console.log(p1);
        console.log(p2);
        console.log(p3);
      }
};
// console.log(samsung.error);//输出p1 p2 p3的函数
boolVar = false;
// console.log(samsung.error);//输出p1 p2 p3的函数