/**
 * 注意文件开头没有 import RoleEnum
 */
export {};

/**
 *
 *1. 不能在模块扩充语法中增加新的顶层声明，只能扩充现有的声明。也就是说，我们只能对“'./a'”模块中已经存在的接口A进行扩
 * 充，而不允许增加新的声明，例如新定义一个接口B。
 * 2.
 *
 */
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
    // 菜单排序，只对第一级有效
    orderNo?: number;
    // 路由title  一般必填
    title: string;
    // 动态路由可打开Tab页数
    dynamicLevel?: number;
    // 动态路由的实际Path, 即去除路由的动态部分;
    realPath?: string;
    // 是否忽略权限，只在权限模式为Role的时候有效
    ignoreAuth?: boolean;
    /**
     * 1.可以访问的角色，只在权限模式为Role的时候有效
     *
     * 2.前端角色权限:实现原理: 在前端固定写死路由的权限，指定路由有哪些权限可以查看。只初始化通用的路由，需要权限才能访问的路由没有被加入
     * 路由表内。在登陆后或者其他方式获取用户角色后，通过角色去遍历路由表，获取该角色可以访问的路由表，
     * 生成路由表，再通过 router.addRoutes 添加到路由实例，实现权限的过滤。
     *
     * 3.question:为什么这个d.ts文件中可以直接使用 RoleEnum，而不需要import？
     *
     */
    roles?: RoleEnum[];
    // 是否忽略KeepAlive缓存
    ignoreKeepAlive?: boolean;
    // 是否固定标签
    affix?: boolean;
    // 图标，也是菜单图标
    icon?: string;
    // 内嵌iframe的地址
    frameSrc?: string;
    // 指定该路由切换的动画名
    transitionName?: string;
    // 隐藏该路由在面包屑上面的显示
    hideBreadcrumb?: boolean;
    // 隐藏所有子菜单
    hideChildrenInMenu?: boolean;
    // 如果该路由会携带参数，且需要在tab页上面显示。则需要设置为true
    carryParam?: boolean;
    // Used internally to mark single-level menus 内部用于标记单层菜单
    single?: boolean;
    // 当前激活的菜单。用于配置详情页时左侧激活的菜单路径
    currentActiveMenu?: string;
    // 当前路由不再标签页显示
    hideTab?: boolean;
    // 当前路由不再菜单显示
    hideMenu?: boolean;
    isLink?: boolean;
    // 忽略路由。用于在ROUTE_MAPPING以及BACK权限模式下，生成对应的菜单而忽略路由。2.5.3以上版本有效
    ignoreRoute?: boolean;
    // 是否在子级菜单的完整path中忽略本级path。2.5.3以上版本有效
    hidePathForChildren?: boolean;
  }
}
