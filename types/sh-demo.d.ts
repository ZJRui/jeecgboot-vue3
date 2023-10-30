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

  /**
   * 接口属性签名
   */
  x?:number;
  y?:number;


  //方法签名： 存在一个方法接收 两个参数 返回一个Person对象
  funA (name: string, age: number): Person;

  /**
   * 1.方法签名
   *
   * 2. 返回值 PersonNotExistClass 类型并没有定义，这里也没有报错 ，为什么？
   * 在 TypeScript 的声明文件（`.d.ts` 文件）中，你可以声明接口、类型、函数、类等，而无需实际的实现或引入其他文件。这
   *  是因为声明文件主要用于描述类型结构，而不关心具体的实现。当你在声明文件中定义了 `PersonInterface` 接口，并没有具体
   *  的实现，也没有引入 `PersonNotExistClass`，TypeScript 编译器并不会强制要求你提供具体的实现或引入相关的类。
   *
   * 声明文件的目的是为了在开发过程中提供类型信息，使得 TypeScript 编译器和开发工具能够提供更好的类型检查和代码提示
   * ，而不是用于运行时。在实际的代码中，你需要确保在使用 `PersonInterface` 的地方，提供了符合该接口定义的实现。
   *
   * 如果在实际代码中使用了 `PersonInterface`，而没有提供符合该接口定义的实现，那么在类型检查阶段可能会出现错误。但在声明
   * 文件中本身，并不会因为没有提供具体实现或引入相关类而报错。这种设计使得声明文件可以独立于实现存在，方便在不同的项目中共享类型信息。
   *
   * 也就是说，在这里声明不会提示错误，也不需要导入。但是当你在其他ts文件中 使用 PersonInterface这个接口的时候
   * let testA:PersonInterface={
   *   funA:(name, age)=>{
   *     return {
   *       name:name,
   *       age:age
   *     }
   *   },
   *   funB(name: string, age: string): PersonNotExistClass {//报错提示找不到 PersonNotExistClass
   *   }
   * }
   *
   * 3.  funB?():void 表示funB是可选方法
   *
   * 4. 注意区分ts的调用签名和方法签名
   *
   *
   * @param name
   * @param age
   */
  funB(name: string, age: string): PersonNotExistClass;
}

/**
 * 定义一个调用签名， 这里声明了一个调用签名，调用签名是 可被调用的，也就是当作函数来执行
 *
 */
declare let addDemoTest:(x:number,y:number)=>number;
addDemoTest(1,2);
/**
 * 外部模块提供具体的实现
 * addDemoTest=(x,y)=>{
 *   return x+y;
 * }
 */


//接口中定义调用签名
interface AInter{
    (x:number,y:number):number;
}
let aInter:AInter;
//将调用签名作为函数使用
aInter(1,2);
interface BInter{
  add:(x:number,y:number)=>number;
  toStr(obj:object):string;
}
//多个调用签名的使用
let bInter:BInter;
bInter.add(1,3)
bInter.toStr({name:"sachin"})
//接口中同时定义调用签名和方法签名
interface CInter{
  (x:number,y:number):number;
  add(x:number,y:number):number;
  toStr(obj:object):string;
}
let cInter:CInter;
cInter(1,2);
cInter.add(1,2);




declare function funDemoA():XXNOtExit;
declare interface YInter{
  //方法签名
  afun(name:string):OXNotExitType
  //调用签名
  bFun:(x:number,y:number)=>PPPNotExitType;
  //调用签名
  (x:number,y:string):MMMNotExitType;
  //属性
  uofw:PropNotExitType;
}


export type Address = string | Array<string>;

declare const mainPerson: Person;

export default mainPerson;

// declare namespace  JONSUtils{
//   /**
//    * 默认情况下，在命名空间内部的声明只允许在该命名空间内部使用，在命名空间之外访问命名空间内部的声明会产生错误。
//    * @param object
//    */
//   function parseToStr(object:object):string;
//
//   /**
//    * 导出命名空间中的
//    */
// }
