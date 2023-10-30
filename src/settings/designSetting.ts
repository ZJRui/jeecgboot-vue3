import { ThemeEnum } from '../enums/appEnum';

/**
 * 1.css 前缀设置:用于修改项目内组件 class 的统一前缀
 * https://doc.vvbin.cn/guide/settings.html#%E4%B8%BB%E9%A2%98%E8%89%B2%E9%85%8D%E7%BD%AE
 *
 * 2.这个设置是怎么起到作用的呢？
 * 首先在ts中，这个下面的prefixCls属性会被provide到子组件中，子组件inject后 子组件会使用prefixCls生成一个自己的prefixCls属性，
 * 比如叫做 prefixcls-abc,然后在子组件的class中使用  :class="prefixCls"
 *
 * 其次在less中，index.less文件中 定义了一个 namespace变量： @namespace: jeecg.
 * 子组件中style中的 会使用这个namespace变量 构建一个自己的变量名称，比如叫做 @prefix-cls: ~'@{namespace}-abc';
 * .@{prefix-cls} {}就会匹配上ts的类名了。
 *
 *
 */
export const prefixCls = 'jeecg';

export const darkMode = ThemeEnum.LIGHT;

// app theme preset color
export const APP_PRESET_COLOR_LIST: string[] = ['#0960bd', '#1890ff', '#009688', '#536dfe', '#ff5c93', '#ee4f12', '#0096c7', '#9c27b0', '#ff9800'];

// header preset color
export const HEADER_PRESET_BG_COLOR_LIST: string[] = [
  '#ffffff',
  '#151515',
  '#009688',
  '#5172DC',
  '#018ffb',
  '#409eff',
  '#e74c3c',
  '#24292e',
  '#394664',
  '#001529',
  '#383f45',
];

// sider preset color
export const SIDE_BAR_BG_COLOR_LIST: string[] = [
  '#001529',
  '#212121',
  '#273352',
  '#ffffff',
  '#191b24',
  '#191a23',
  '#304156',
  '#001628',
  '#28333E',
  '#344058',
  '#383f45',
];
