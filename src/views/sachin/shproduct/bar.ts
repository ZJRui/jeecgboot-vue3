import {doSomething, Options, PersonType} from "@/views/sachin/shproduct/foos.js";


export function doSomethingBetter() {
    let person: PersonType;
    let options: Options = {}
    doSomething(options)
}

doSomethingBetter();

console.log("Object------------->",Object)

// import type {UnionType, unionValue} from './foos.js';
//
// const value1: UnionType = 'value1'; // 作为类型使用
//
// const value2: typeof unionValue = 'value2'; // 获取类型
//
//
// const p={}
//
// console.log(p.toString())
// // let a: typeof "abc"= new Object();
// // type p = "a";
// // let pa:p="b";
// // // Error: "unionValue" 是使用 "import type" 导入的，因此不能用作值
// // const value3 = unionValue; // 作为值使用'
// // console.log("typeof unionValue",typeof unionValue)
// // console.log(typeof unionValue);

// interface ObjInterface{
//     propb:boolean;
// }
//
// function fna(obj:ObjInterface){
//     console.log(obj.propb)
// }
// fna({propb:true})


