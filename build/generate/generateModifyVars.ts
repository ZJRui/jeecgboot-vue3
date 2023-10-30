import { generateAntColors, primaryColor } from '../config/themeConfig';
import { getThemeVariables } from 'ant-design-vue/dist/theme';
import { resolve } from 'path';

/**
 * less global variable
 */
export function generateModifyVars(dark = false) {
  const palettes = generateAntColors(primaryColor);
  const primary = palettes[5];

  /**
   * Record 该工具类型能够使用给定的对象属性名类型和对象属性类型创建
   * 一个新的对象类型。“Record<K, T>”工具类型中的类型参数K提供了
   * 对象属性名联合类型，类型参数T提供了对象属性的类型。
   */
  const primaryColorObj: Record<string, string> = {};

  for (let index = 0; index < 10; index++) {
    primaryColorObj[`primary-${index + 1}`] = palettes[index];
  }

  const modifyVars = getThemeVariables({ dark });
  /**
   * modifyVars.hack true;@import "D:\LocalProjects\jeecg\jeecgboot-vue3\node_modules\.pnpm\ant-design-vue@3.2.20_vue@3.3.4\node_modules\ant-design-vue\lib\style\color\colorPalette.less";                                        13:49:26
   * modifyVars.hack true;@import "D:\LocalProjects\jeecg\jeecgboot-vue3\node_modules\.pnpm\ant-design-vue@3.2.20_vue@3.3.4\node_modules\ant-design-vue\lib\style\color\colorPalette.less";
   */
  // console.log("modifyVars.hack",modifyVars.hack)
  return {
    ...modifyVars,
    /**
     * 1.用于全局导入，避免单独导入每个样式文件。
     * //Reference：避免重复引用
     *
     * 2. question: 这里返回的对象会被传递到 less.modifyVars() 方法中，less.modifyVars() 方法会将这些变量替换到 less 文件中。
     *   hack属性是什么？ https://stackoverflow.com/questions/60809336/customizing-ant-designs-theme-what-exactly-is-that-hack-key-in-the-modifyva
     *   他的值为什么可以这样写 :https://github.com/vueComponent/ant-design-vue-pro/issues/445
     *   E:\programme\Less\博文\less-loader modifyvars hack-掘金.pdf
     *
     * 3.@import  (reference) 使用  导入外部文件，但除非引用，否则不会将导入的样式添加到编译的输出中。
     * 加上 reference 可以解决页面内重复引用导致实际生成的 style 样式表重复的问题。
     *
     * 4.这段代码的目的是构建一个字符串，其中包含了 modifyVars.hack 的值和 src/design/config.less 文件的路径。这样的字符串
     * 通常被用作 LESS 预处理器的输入，用于动态地引入外部的 LESS 文件，并将其中的样式规则合并到当前的样式中。
     *
     */
    // Used for global import to avoid the need to import each style file separately
    // reference:  Avoid repeated references
    hack: `${modifyVars.hack} @import (reference) "${resolve('src/design/config.less')}";`,
    'primary-color': primary,
    ...primaryColorObj,
    'info-color': primary,
    'processing-color': primary,
    'success-color': '#55D187', //  Success color
    'error-color': '#ED6F6F', //  False color
    'warning-color': '#EFBD47', //   Warning color
    //'border-color-base': '#EEEEEE',
    'font-size-base': '14px', //  Main font size
    'border-radius-base': '2px', //  Component/float fillet
    'link-color': primary, //   Link color
    'app-content-background': '#fafafa', //   Link color
  };
}
