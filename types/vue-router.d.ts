/**
 * 注意文件开头没有 import RoleEnum
 */
export {};

declare module 'vue-router' {
  /**
   * 1. Record是一个type
   * type Record<K extends keyof any, T> = {
   *     [P in K]: T;
   * };
   * 为什么RouteMeta接口可以 extends Type？
   * 2. interface接口中不是应该定义方法吗？ 怎么这里都是定义的属性？
   */
  interface RouteMeta extends Record<string | number | symbol, unknown> {
    orderNo?: number;
    // title
    title: string;
    // dynamic router level.
    dynamicLevel?: number;
    // dynamic router real route path (For performance).
    realPath?: string;
    // Whether to ignore permissions
    ignoreAuth?: boolean;
    // role info
    //question:为什么这个d.ts文件中可以直接使用 RoleEnum，而不需要import？
    roles?: RoleEnum[];
    // Whether not to cache
    ignoreKeepAlive?: boolean;
    // Is it fixed on tab
    affix?: boolean;
    // icon on tab
    icon?: string;
    frameSrc?: string;
    // current page transition
    transitionName?: string;
    // Whether the route has been dynamically added
    hideBreadcrumb?: boolean;
    // Hide submenu
    hideChildrenInMenu?: boolean;
    // Carrying parameters
    carryParam?: boolean;
    // Used internally to mark single-level menus 内部用于标记单层菜单
    single?: boolean;
    // Currently active menu
    currentActiveMenu?: string;
    // Never show in tab
    hideTab?: boolean;
    // Never show in menu
    hideMenu?: boolean;
    isLink?: boolean;
    // only build for Menu
    ignoreRoute?: boolean;
    // Hide path for children
    hidePathForChildren?: boolean;
  }
}
