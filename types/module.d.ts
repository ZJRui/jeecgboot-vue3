/**
 *
 * 1. declare module的时候，不能在模块扩充语法中增加新的顶层声明，只能扩充现有的声明。也就是说，我们只能对“'./a'”模块中已经存在的接口A进行扩
 * 充，而不允许增加新的声明，例如新定义一个接口B。
 *
 * 2. declare namespace:默认导出所有的成员，因此内部成员不需要 加export关键字。
 *
 * 2.它的作用是告诉 TypeScript 编译器：当你在代码中 import 一个 .vue 文件时，该文件的类型符合这个声明。在这个声
 * 明中，export default Component; 的目的是指定导出的默认值（default export），而不是导出一个具名的变量。
 *
 * 这种用法是符合 TypeScript 的模块系统规范的。在 TypeScript 中，你可以使用 export default 语法来导出一个默认的值
 * ，这个默认值可以是任意的类型，包括对象、函数、类等。在其他文件中导入时，可以使用 import 语句来引入默认导出的值。
 *
 * 因此，这个 declare module 声明告诉 TypeScript 编译器，当你导入一个 .vue 文件时，可以期望该文件导出的是一个 DefineComponent 类型的
 * 默认组件。在实际的 Vue.js 项目中，.vue 文件通常包含了一个 Vue 组件的定义，而这个默认导出的组件正是我们想要的类型信息。
 *
 * 3.question:不理解下面代码有什么作用。 书中提到：▪无法使用模块扩充语法对模块的默认导出进行扩充，只能对命名模块导出进行扩充，因为在进行模块扩充时需要依赖于导出的名字。
 *    为什么这里可以对模块的默认导出进行扩充？ 而且 模块名称*.vue是什么意思？
 *
 *    是不是因为 模块本身没有定义 默认导出，所以这里可以对默认导出做扩充？
 */

declare module '*.vue' {
  import { DefineComponent } from 'vue';
  const Component: DefineComponent<{}, {}, any>;
  /**
   * 让TypeScript可以识别Vue后缀的文件，将其识别为一个组件
   */
  export default Component;
}

// declare module "my-module" {
//    export default React.Component;
//   declare export var foo: string;
// }
// import DefaultReactComponent from "my-module";
// import {foo} from "my-module";


/**
 * declare module ”name“ 模块声明支持通配符导入，借此可以为匹配指定模式的任何导入路径声明类型。导入路径使用通配符* 匹配
 *
 * 为webpack的json-loader导入的json文件声明类型
 */
// declare module 'json|*'{
//   let value:object
//   export default value
// }
/**
 * 为webpack的style-loader导入的css文件声明类型。
 */
// declare module "*.css"{
//   let css: CSSRuleList
//   export default css
// }

/**
 * 其他文件中可以加载JSON 和css文件了
 */
// import a from 'json!myFile'
// a//object
// import b from './widget.css'
// b//CSSRuleList
// import data from "json!http://example.com/data.json";




declare module 'ant-design-vue/es/locale/*' {
  import { Locale } from 'ant-design-vue/types/locale-provider';
  const locale: Locale & ReadonlyRecordable;
  export default locale as Locale & ReadonlyRecordable;
}

/**
 * 如果没有下面的声明，则  import svgIcons from 'virtual:svg-icons-names';  将会报错
 * question： virtual:svg-icons-names这个是什么
 *
 *  这里定义了 针对 virtual:*的模块的 导出类型
 *
 */
declare module 'virtual:*' {
  const result: any;
  export default result;
}

/**
 * svg并不能被TypeScript正确解析为一个模块，这时需要自己补充
 * 一下类型定义。
 */
// declare module '*.svg' {
//   const content: string
//   export default content
// }
