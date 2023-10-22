/**
 * `vue-router` 中的 `RouteRecordRaw` 是 TypeScript 中的一个类型，用于描述路由配置的数据结构。在 Vue 3 中，路
 * 由的配置使用 `RouteRecordRaw` 类型来进行类型检查和推断。
 *
 * `RouteRecordRaw` 是 `vue-router` 模块中导出的一个泛型接口，用于定义路由记录（route records）。它的定义如下：
 *
 * ```typescript
 * interface RouteRecordRaw {
 *   path: string;
 *   name?: string;
 *   component?: Component;
 *   components?: Components;
 *   redirect?: string | Location | NavigationGuardRedirectCallback;
 *   alias?: string | string[];
 *   children?: Array<RouteRecordRaw>;
 *   meta?: any;
 *   beforeEnter?: NavigationGuard;
 *   props?: boolean | Object | RoutePropsFunction;
 * }
 * ```
 *
 * 这里简要解释一下 `RouteRecordRaw` 的属性：
 *
 * - **`path: string`：** 路由的路径，例如 `'/home'`。
 * - **`name?: string`：** 路由的名称，用于编程式导航时引用。
 * - **`component?: Component`：** 路由的组件。可以是一个 Vue 组件对象，也可以是一个返回一个 Promise 的函数，用于异步加载组件。
 * - **`redirect?: string | Location | NavigationGuardRedirectCallback`：** 重定向配置，用于在访问当前路由时自动跳转到其他路由。
 * - **`alias?: string | string[]`：** 路由的别名，允许多个路径指向同一个组件。
 * - **`children?: Array<RouteRecordRaw>`：** 子路由的配置，表示当前路由下的嵌套路由。
 * - **`meta?: any`：** 路由元信息，可以用来存储一些自定义的数据。
 * - **`beforeEnter?: NavigationGuard`：** 路由独享的守卫，用于在路由进入前执行一些逻辑。
 * - **`props?: boolean | Object | RoutePropsFunction`：** 路由组件的 props 配置，可以是一个布尔值、一个对象或者一个函数。
 *
 * 使用 `RouteRecordRaw` 类型，你可以在 Vue 3 的路由配置中明确地定义每个路由的数据结构，使得开发过程更加可维护和类型安全。
 *
 *
 * 2. RouteMeta
 * 在 `vue-router` 中，`RouteMeta` 是一个泛型接口，用于定义路由元信息（meta information）。路由元信息是附加到路由上的自
 * 定义数据，可以用于描述路由的一些特性或者标记，例如页面的标题、权限信息、页面类型等。
 *
 * `RouteMeta` 接口的定义如下：
 *
 * ```typescript
 * interface RouteMeta {
 *   [key: string]: any;
 *   title?: string; // 用于描述页面的标题
 *   requiresAuth?: boolean; // 用于描述是否需要登录权限
 *   // 其他自定义的元信息属性...
 * }
 * ```
 *
 * 在这个接口中，`[key: string]: any` 表示可以定义任意数量的自定义属性，用于存储各种元信息。例如，`title` 属性可以用来
 * 描述页面的标题，`requiresAuth` 属性可以用来标记该路由是否需要登录权限。
 *
 * 在路由配置中，你可以将元信息添加到路由对象的 `meta` 属性中。例如：
 *
 * ```javascript
 * const routes = [
 *   {
 *     path: '/home',
 *     component: Home,
 *     meta: {
 *       title: 'Home Page', // 页面标题
 *       requiresAuth: true, // 需要登录权限
 *     },
 *   },
 *   // 其他路由配置...
 * ];
 * ```
 *
 * 在这个例子中，`/home` 路由的元信息包括了 `title` 和 `requiresAuth` 属性。这些信息可以在导航守卫中被访
 * 问到，用于进行权限控制、页面标题的动态设置等操作。
 *
 * 在路由组件中，你可以通过 `this.$route.meta` 访问当前路由的元信息，例如：
 *
 * ```javascript
 * export default {
 *   created() {
 *     console.log(this.$route.meta.title); // 输出：'Home Page'
 *     console.log(this.$route.meta.requiresAuth); // 输出：true
 *   },
 * };
 * ```
 *
 * 这样，`RouteMeta` 接口提供了一种在路由中传递自定义信息的标准方式，使得开发者能够更灵活地配置路由，并且方便地在路由组件中使用这些信息。
 *
 */
import type { RouteRecordRaw, RouteMeta } from 'vue-router';
import { RoleEnum } from '/@/enums/roleEnum';
import { defineComponent } from 'vue';

/**
 * 定义两个函数的类型
 */
type AF = () => Promise<string>;
/**
 *  typeof import("") =object
 *
 *  let t =Promise.resolve();
 *  typeof t --->object
 */
console.log("typeof import('*.vue')", typeof import('*.vue'));

/**
 * //Module{Symbol(Symbol.toStringTag): 'Module'} //Promise {<pending>}
 */
console.log(import('@/app.vue').then((res) => console.log(res)));

/**
 * 1.export type Component<T extends any = any>： 这行代码定义了一个 TypeScript 类型，它叫做 Component，并接受一个泛型参数 T，
 * 该参数的默认类型是 any。
 * 2.ReturnType<typeof defineComponent>： 这部分表示可以是一个 Vue 组件对象。defineComponent 是 Vue 3
 * 提供的一个函数，用于定义组件。typeof defineComponent 表示获取 defineComponent 函数的类型
 * ，而 ReturnType 泛型表示获取函数返回值的类型。因此，ReturnType<typeof defineComponent> 表示一个 Vue 组件对象的类型。
 *
 * 3.() => Promise<typeof import('*.vue')>： 这部分表示一个函数，该函数返回一个 Promise，这个 Promise 的结果是一个
 * Vue 组件的类型。import('*.vue') 是一个动态导入的语法，它表示导入所有以 .vue 结尾的文件，返回一个模块对象。
 * typeof import('*.vue') 获取了这个模块对象的类型，而 Promise<typeof import('*.vue')> 表示返回一个
 * Promise，其 resolved 值是 Vue 组件对象的类型。
 *
 * 4.() => Promise<T>： 这部分表示一个函数，该函数返回一个 Promise，这个 Promise 的结果是泛型参数 T 的类型。这允许你传递一个自定义类型作为组件的类型。
 *
 * 5. ()=>Any: 表示函数类型定义
 * 综合起来，Component<T> 类型表示一个 Vue 组件，它可以是一个 Vue 组件对象（使用 defineComponent 定义的组件），
 * 也可以是一个返回 Promise 的函数（动态导入的 Vue 组件），或者是一个返回泛型类型 T 的 Promise 函数。
 * 这种灵活性使得 Component 类型适用于不同类型的 Vue 组件定义和导入。
 *
 */
export type Component<T extends any = any> = ReturnType<typeof defineComponent> | (() => Promise<typeof import('*.vue')>) | (() => Promise<T>);

/**
 * “Omit<T, K>”工具类型与“Pick<T, K>”工具类型是互补的，它能够从已有对象类型中剔除给定的属性，然后构建出一个新的对象类型。
 */
// @ts-ignore
export interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta'> {
  name: string;
  meta: RouteMeta;
  component?: Component | string;
  components?: Component;
  children?: AppRouteRecordRaw[];
  props?: Recordable;
  fullPath?: string;
  alwaysShow?: boolean;
}

export interface MenuTag {
  type?: 'primary' | 'error' | 'warn' | 'success';
  content?: string;
  dot?: boolean;
}

export interface Menu {
  name: string;

  icon?: string;

  path: string;

  // path contains param, auto assignment.
  paramPath?: string;

  disabled?: boolean;

  children?: Menu[];

  orderNo?: number;

  roles?: RoleEnum[];

  meta?: Partial<RouteMeta>;

  tag?: MenuTag;

  hideMenu?: boolean;

  alwaysShow?: boolean;
}

export interface MenuModule {
  orderNo?: number;
  menu: Menu;
}

// export type AppRouteModule = RouteModule | AppRouteRecordRaw;
export type AppRouteModule = AppRouteRecordRaw;
