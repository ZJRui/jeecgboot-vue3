/* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */
import { App, Directive } from 'vue';
// @ts-ignore
const myDirective: Directive = {
  /**
   * 在绑定元素的attribute前 或事件监听器应用前调用
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  created(el, binding, vnode, prevVnode) {},

  /**
   * 在元素被插入到Dom前调用
   */
  beforeMount(el, binding, vnode, prevVnode) {},
  /**
   *在绑定元素的父组件及他自己的所有子节点都挂载完成后调用
   */
  mounted(el, binding, vnode, prevVnode) {},
  /**
   * 绑定元素的父组件更新前调用
   */
  beforeUpdate(el, binding, vnode, prevVnode) {},
  /**
   * 在绑定元素的父组件及他的所有子组件更新完成后调用
   */
  updated(el, binding, vnode, prevVnode) {},
  beforeUnmount(el, binding, vnode, prevVnode) {},
  unmounted(el, binding, vnode, prevVnode) {},
};

/**
 * binding 对象：
 * ：传递给指令的值。例如在  中，值是  。  value  v-my-directive="1  +  1"  2
 * ：之前的值，仅在  和  中可用。无论值是否更改，它都  oldValue  beforeUpdate  updated
 * 可用。
 * ：传递给指令的参数  (如果有的话)。例如在  中，参数是  arg  v-my-directive:foo
 * 。  "foo"
 * ：一个包含修饰符的对象 (如果有的话)。例如在  modifiers  v-my-directive.foo.bar
 * 中，修饰符对象是  。  {  foo:  true,  bar:  true  }
 * ：使用该指令的组件实例。  instance
 * ：指令的定义对象。  dir
 */

export function setUpMyColorDirective(app: App) {
  //函数会在mounted 和updated时调用
  app.directive('my-color', (el, binding) => {
    console.log('v-my-color, el', el, ' binding:', binding);
  });
}
