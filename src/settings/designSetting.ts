import { ThemeEnum } from '../enums/appEnum';

/**
 * css 前缀设置:用于修改项目内组件 class 的统一前缀
 * https://doc.vvbin.cn/guide/settings.html#%E4%B8%BB%E9%A2%98%E8%89%B2%E9%85%8D%E7%BD%AE
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
