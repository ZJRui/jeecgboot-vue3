/**
 * 1.同一个JSONUtils命名空间，拆分到不同的 ts文件
 *
 *
 * 2. 如果一个ts文件没有使用 export/import 关键字，
 * ts编译器会认为该文件 处于脚本模式运行，所以 该文件中声明的变量函数 可以在其他ts文件中直接使用，
 * 这个时候ts编译器不会报错提示找不到属性方法
 *
 *
 * 但是实际该文件是以模块方式运行，所以会报错，提示在window全局对象上找不到 对应的属性和方法。
 *
 * https://www.yuque.com/wuqimaheihuitailang/rklyzo/kfa9xlc8q0by61s1
 *
 */
namespace JSONUtils {
    // @ts-ignore
    export function isJson(obj:object){
        return false;
    }
}
