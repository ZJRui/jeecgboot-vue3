import type { ComponentRenderProxy, VNode, VNodeChild, ComponentPublicInstance, FunctionalComponent, PropType as VuePropType } from 'vue';

/**
 *1.扩充全局声明 declare global { }
 */
declare global {
  /**
   * question: 1.declare const varName:string 是外部变量声明，不允许定义初始值。
   *  但是下面的 没有使用declare，为什么他没有设置初始值？
   */
  const __APP_INFO__: {
    pkg: {
      name: string;
      version: string;
      dependencies: Recordable<string>;
      devDependencies: Recordable<string>;
    };
    lastBuildTime: string;
  };
  // declare interface Window {
  //   // Global vue app instance
  //   __APP__: App<Element>;
  // }

  // vue
  declare type PropType<T> = VuePropType<T>;
  declare type VueNode = VNodeChild | JSX.Element;

  export type Writable<T> = {
    -readonly [P in keyof T]: T[P];
  };

  declare type Nullable<T> = T | null;
  declare type NonNullable<T> = T extends null | undefined ? never : T;
  declare type Recordable<T = any> = Record<string, T>;
  declare type ReadonlyRecordable<T = any> = {
    readonly [key: string]: T;
  };
  declare type Indexable<T = any> = {
    [key: string]: T;
  };
  declare type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
  };
  declare type TimeoutHandle = ReturnType<typeof setTimeout>;
  declare type IntervalHandle = ReturnType<typeof setInterval>;

  declare interface ChangeEvent extends Event {
    target: HTMLInputElement;
  }

  declare interface WheelEvent {
    path?: EventTarget[];
  }
  interface ImportMetaEnv extends ViteEnv {
    __: unknown;
  }

  /**
   * 外部类型声明
   */
  declare interface ViteEnv {
    VITE_PORT: number;
    VITE_USE_MOCK: boolean;
    VITE_PUBLIC_PATH: string;
    VITE_PROXY: [string, string][];
    VITE_GLOB_APP_TITLE: string;
    VITE_GLOB_APP_SHORT_NAME: string;
    VITE_USE_CDN: boolean;
    //20230720 作废参数
    VITE_DROP_CONSOLE: boolean;
    VITE_BUILD_COMPRESS: 'gzip' | 'brotli' | 'none';
    VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE: boolean;
    VITE_LEGACY: boolean;
    VITE_USE_IMAGEMIN: boolean;
    VITE_GENERATE_UI: string;
  }

  declare function parseInt(s: string | number, radix?: number): number;

  declare function parseFloat(string: string | number): number;

  /**
   * 1.命名空间被转换成了立即执行的函数表达式。
   * 外部命名空间的成员默认为导出成员，不需要使用export关键字来明确地导出它们，但使用了export关键字也没有错误
   *
   * 2.JSX是⼀种嵌⼊式的、类似XML的语法，可以被转换成合法的
   * JavaScript（尽管转换的语义是依据不同的实现⽽定的）。JSX因React
   * 框架⽽流⾏，但也存在其他的实现
   */
  namespace JSX {
    // tslint:disable no-empty-interface
    type Element = VNode;
    // tslint:disable no-empty-interface
    type ElementClass = ComponentRenderProxy;
    interface ElementAttributesProperty {
      $props: any;
    }

    /**
     * 1. 如果使用JSX全局模块，你可以定制JSX.IntrinsicElements的接口成员，以控制哪些HTML标签可用，以及如何对其进行类型检查。
     * E:\programme\TypeScript\深入理解TypeScript .pdf
     */
    interface IntrinsicElements {
      [elem: string]: any;
    }
    interface IntrinsicAttributes {
      [elem: string]: any;
    }
  }
}

/**
 * 1.扩充模块声明 declare module 'vue' { }
 */
declare module 'vue' {
  export type JSXComponent<Props = any> = { new (): ComponentPublicInstance<Props> } | FunctionalComponent<Props>;
}
