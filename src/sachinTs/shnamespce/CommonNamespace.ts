namespace JSONUtils {
    /**
     * 默认情况下，在命名空间内部的声明只允许在该命名空间内部使用，在命名空间之外访问命名空间内部的声明会产生错误。
     * @param object
     */
    export function parseToStr(object: object): string {
        return JSON.stringify(object);parseToStr
    }

    // @ts-ignore
    function parseA():string{
        return "hello"
    }
}

let objA={
    name:"zhangsan"
}
console.log("JSONUtils.parseToStr(objA);",JSONUtils.parseToStr(objA))
// 不可以 访问 parseA函数

namespace  MathUtils{
    export function add(a:number,b:number):number{
        return a+b;
    }
    // @ts-ignore
    function multiply(a:number,b:number):number{
        return a*b;
    }
}