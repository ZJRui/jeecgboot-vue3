/**
 * 参考对下面文件的理解
 * node_modules/.pnpm/registry.npmmirror.com+axios@1.5.0_debug@4.3.4/node_modules/axios/index.d.ts
 *
 * 1.对于axios的 index.d.ts 他内部 export default axios，所以我们的项目在使用的时候可以直接
 *
 * import axios from 'axios';//src/utils/http/axios/Axios.ts
 *
 * 2.axios的index.d.ts文件中 为什么可以使用 axios变量呢？毕竟整个文件中并没有定义axios变量。
 * 他是通过 先通过 declare const axios: AxiosStatic; 进行了声明。然后 export
 *
 * 3. axios的index.d.ts中 export class AxiosHeaders，但是AxiosHeaders中没有定义构造函数、普通函数以及属性的
 * 具体内容，这个是为什么？我只知道 对interface 可以省略方法的实现
 *
 * export class AxiosHeaders {
 *   constructor(
 *       headers?: RawAxiosHeaders | AxiosHeaders
 *   );
 *
 *   [key: string]: any;
 *
 *   set(headerName?: string, value?: AxiosHeaderValue, rewrite?: boolean | AxiosHeaderMatcher): AxiosHeaders;
 *   }
 *
 *   note: 是一个 TypeScript 类的声明，但它并没有提供具体的实现。这种情况通常出现在声明文件（Declaration Files）
 *    或者抽象类中。在这种文件中，我们可以定义类的结构、方法和属性，但不提供具体的实现。这是因为声明文件通常用于描述外部库
 *    、模块或者接口的结构，而这些结构的实现在外部文件中。在编写 TypeScript 类型声明时，我们不需要提供具体的实现代码。
 *
 *  note:普通的ts文件（非d.ts文件）中对 导出类的声明，需要提供对应的实现
 *   export class ZipCodeValidator implements StringValidator {
 *     isAcceptable(s: string) {
 *         return s.length === 5 && numberRegexp.test(s);
 *     }
 *    }
 * 对interface 进行export
 * export interface AxiosRequestTransformer {
 *   (this: InternalAxiosRequestConfig, data: any, headers: AxiosRequestHeaders): any;
 * }
 *
 * 4.careful:导出类声明有两种形式： 普通的ts文件中 export class  A,在普通的ts文件中需要提供A的具体实现内容。 d.ts文
 *      件中export class A的时候只需要提供A的定义，不需要提供A中方法、属性、构造器的具体实现，看图
 *
 * 5. d.ts文件是如何被使用的？ d.ts文件也需要被导入，然后才可以使用他内部export的属性。比如项目的types/axios.d.ts
 * 就是在src/utils/http/axios/Axios.ts 中使用了
 * import type { RequestOptions, Result, UploadFileParams, UploadFileCallBack } from '/#/axios';
 * 导入 axios.d.ts文件，然后才能使用
 */

/**
 * 这里export 一个Person类，并给出 Person类的定义，但是没有给出具体的实现，这个是可以的。
 * 实际上项目中可能根本就没有Person类
 */
export class Person {
  [key: string]: any;
}

export interface PersonInterface {
  //存在一个方法接收 两个参数 返回一个Person对象
  (name: string, age: number): Person;

  //返回值 PersonNotExistClass 类型并没有定义，这里也没有报错
  (name: string, age: string): PersonNotExistClass;
}

export type Address = string | Array<string>;

declare const mainPerson: Person;

export default mainPerson;
