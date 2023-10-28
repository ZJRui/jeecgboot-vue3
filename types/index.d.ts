/**
 *
 * 1.函数在本质上是一个对象，可以使用对象类型来表示函数类型。 如果在对象类型中定义了调用签名类型成员，我们称该对象类型为函数类型
 *  {
 *      ({ParameterList}):Type
 *  }
 *  上面就是一个调用签名语法，是一个带有调用签名的函数类型字面量 可以简写成 (ParameterList)=>Type
 *
 *
 */
declare interface Fn<T = any, R = T> {
  //定义FN是一个接口，接口中有一个调用签名，入参为数组，返回值为R
  (...arg: T[]): R;
}

declare interface PromiseFn<T = any, R = T> {
  (...arg: T[]): Promise<R>;
}

declare type RefType<T> = T | null;

declare type LabelValueOptions = {
  label: string;
  value: any;
  [key: string]: string | number | boolean;
}[];

declare type EmitType = (event: string, ...args: any[]) => void;

declare type TargetContext = '_self' | '_blank';

declare interface ComponentElRef<T extends HTMLElement = HTMLDivElement> {
  $el: T;
}

declare type ComponentRef<T extends HTMLElement = HTMLDivElement> = ComponentElRef<T> | null;

declare type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>;
