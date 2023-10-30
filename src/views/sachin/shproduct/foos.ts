import {PropType} from "vue";

export interface Options{

}
class Person{

}
export type PersonType=Person;
export function doSomething(options:Options){

    let person:Person=new Person();
    console.log(options);
}

export type UnionType = string | number;
export const unionValue: UnionType = '1';

let tmp={
    api: {
        /**
         *  PropType<(...arg: any[]) => Promise<any>> 这是函数类型字面量的写法，PropType是输入参数，Promise是返回值
         */

        type: Function as PropType<(...arg: any[]) => Promise<any>>,
        default: null,
    },
}


interface Samsung{
    error?:(p1:string, p2:number , p3:()=>number)=>any
}

let boolVar:boolean=false;
let samsung:Samsung={
    error:boolVar?()=>{}:(p1,p2,p3)=>{
        console.log(p1);
        console.log(p2);
        console.log(p3);
    }

}




