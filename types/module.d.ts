declare module '*.vue' {
  import { DefineComponent } from 'vue';
  const Component: DefineComponent<{}, {}, any>;
  export default Component;
}

declare module 'ant-design-vue/es/locale/*' {
  import { Locale } from 'ant-design-vue/types/locale-provider';
  const locale: Locale & ReadonlyRecordable;
  export default locale as Locale & ReadonlyRecordable;
}

/**
 * 如果没有下面的声明，则  import svgIcons from 'virtual:svg-icons-names';  将会报错
 * question： virtual:svg-icons-names这个是什么
 */
declare module 'virtual:*' {
  const result: any;
  export default result;
}
