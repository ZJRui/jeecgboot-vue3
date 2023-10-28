import type { AppRouteRecordRaw, Menu } from '/@/router/types';

import { defineStore } from 'pinia';
import { store } from '/@/store';
import { useI18n } from '/@/hooks/web/useI18n';
import { useUserStore } from './user';
import { useAppStoreWithOut } from './app';
import { toRaw } from 'vue';
import { transformObjToRoute, flatMultiLevelRoutes, addSlashToRouteComponent } from '/@/router/helper/routeHelper';
import { transformRouteToMenu } from '/@/router/helper/menuHelper';

import projectSetting from '/@/settings/projectSetting';

import { PermissionModeEnum } from '/@/enums/appEnum';

import { asyncRoutes } from '/@/router/routes';
import { ERROR_LOG_ROUTE, PAGE_NOT_FOUND_ROUTE } from '/@/router/routes/basic';

import { filter } from '/@/utils/helper/treeHelper';

import { getMenuList, switchVue3Menu } from '/@/api/sys/menu';
import { getPermCode } from '/@/api/sys/user';

import { useMessage } from '/@/hooks/web/useMessage';
import { PageEnum } from '/@/enums/pageEnum';

// 系统权限
interface AuthItem {
  // 菜单权限编码，例如：“sys:schedule:list,sys:schedule:info”,多个逗号隔开
  action: string;
  // 权限策略1显示2禁用
  type: string | number;
  // 权限状态(0无效1有效)
  status: string | number;
  // 权限名称
  describe?: string;
  isAuth?: boolean;
}

interface PermissionState {
  // Permission code list
  permCodeList: string[] | number[];
  /**
   * 是否动态添加了路由。在actions.login中会调用afterLoginAction,在afterLoginAction函数中
   * 会判断如果isDynamicAddedRoute为false，则构建routes，遍历每一个routes，使用
   * router.addRoute添加到路由中，然后将isDynamicAddedRoute设置为true。
   */
  isDynamicAddedRoute: boolean;
  // To trigger a menu update
  lastBuildMenuTime: number;
  // Backstage menu list
  backMenuList: Menu[];
  frontMenuList: Menu[];
  // 用户所拥有的权限
  authList: AuthItem[];
  // 全部权限配置
  allAuthList: AuthItem[];
  // 系统安全模式
  sysSafeMode: boolean;
  // online子表按钮权限
  onlineSubTableAuthMap: object;
}
export const usePermissionStore = defineStore({
  id: 'app-permission',
  /**
   * note: ():PermissionState=>{ return { }} 定义一个函数，指定函数的返回值类型是PermissionState, 当函数返回值
   *  是一个字面量对象是，为了避免对象的{}被解析为代码块，需要将其用()包裹起来，否则会报错。
   */
  state: (): PermissionState => ({
    permCodeList: [],
    // Whether the route has been dynamically added
    isDynamicAddedRoute: false,
    // To trigger a menu update
    lastBuildMenuTime: 0,
    // Backstage menu list
    backMenuList: [],
    // menu List
    frontMenuList: [],
    authList: [],
    allAuthList: [],
    sysSafeMode: false,
    onlineSubTableAuthMap: {},
  }),
  getters: {
    getPermCodeList(): string[] | number[] {
      return this.permCodeList;
    },
    getBackMenuList(): Menu[] {
      return this.backMenuList;
    },
    getFrontMenuList(): Menu[] {
      return this.frontMenuList;
    },
    getLastBuildMenuTime(): number {
      return this.lastBuildMenuTime;
    },
    getIsDynamicAddedRoute(): boolean {
      return this.isDynamicAddedRoute;
    },

    //update-begin-author:taoyan date:2022-6-1 for: VUEN-1162 子表按钮没控制
    getOnlineSubTableAuth: (state) => {
      return (code) => state.onlineSubTableAuthMap[code];
    },
    //update-end-author:taoyan date:2022-6-1 for: VUEN-1162 子表按钮没控制
  },
  actions: {
    setPermCodeList(codeList: string[]) {
      this.permCodeList = codeList;
    },

    setBackMenuList(list: Menu[]) {
      this.backMenuList = list;
      list?.length > 0 && this.setLastBuildMenuTime();
    },

    setFrontMenuList(list: Menu[]) {
      this.frontMenuList = list;
    },

    setLastBuildMenuTime() {
      this.lastBuildMenuTime = new Date().getTime();
    },

    setDynamicAddedRoute(added: boolean) {
      this.isDynamicAddedRoute = added;
    },
    resetState(): void {
      this.isDynamicAddedRoute = false;
      this.permCodeList = [];
      this.backMenuList = [];
      this.lastBuildMenuTime = 0;
    },
    async changePermissionCode() {
      /**
       * 该方法的调用是在afterLoginAction中如果permissionStore.isDynamicAddedRoute为false，
       * 则 buildRoutesAction，build时如果permissionMode为back后台，则调用该方法。
       *
       * 1.allAuth:全部menu_type=2的按钮权限配置集合
       * codeList:当前用户所拥有的menu_type=2的菜单权限编码
       * auth:当前用户 所拥有的menu_type=2的按钮权限（用户拥有的权限集合）
       * code_list 和auth都是当前用户的按钮权限信息，前者只存放了编码。
       * 后者存放了编码、权限策略，菜单名称

       * menu_type:0:一级菜单 1：子菜单，2：按钮权限
       *
       * {
       *     "allAuth": [
       *         {
       *             "action": "btn:add",
       *             "describe": "btn:add",
       *             "type": "1",---》权限策略1显示2禁用
       *             "status": "1"
       *         },
       *         {
       *             "action": "system:user:edit",
       *             "describe": "用户编辑",
       *             "type": "1",
       *             "status": "1"
       *         },
       *
       *     ]
       *     "auth": [
       *     {
       *         "action": "demo.dbarray",
       *         "describe": "禁用",
       *         "type": "2"
       *     },
       *     {
       *         "action": "onl:drag:page:delete",
       *         "describe": "删除仪表盘",
       *         "type": "1"
       *     }, ]
       * ],
       * "codeList": [
       *     "demo.dbarray",
       *     "onl:drag:page:delete",
       *     "drag:template:edit",
       *     "system:user:changepwd",
       *     "system:permission:add",
       * ]
       * }
       */
      const systemPermission = await getPermCode();
      const codeList = systemPermission.codeList;
      this.setPermCodeList(codeList);
      this.setAuthData(systemPermission);
    },
    async buildRoutesAction(): Promise<AppRouteRecordRaw[]> {
      // @ts-ignore
      const { t } = useI18n();
      const userStore = useUserStore();
      const appStore = useAppStoreWithOut();

      let routes: AppRouteRecordRaw[] = [];
      const roleList = toRaw(userStore.getRoleList) || [];
      const { permissionMode = projectSetting.permissionMode } = appStore.getProjectConfig;

      /**
       * 根据路由的元信息（meta）中的角色信息（roles）来判断当前用户是否有权限访问该路由。
       *
       */
      const routeFilter = (route: AppRouteRecordRaw) => {
        const { meta } = route;
        const { roles } = meta || {};
        if (!roles) return true;
        return roleList.some((role) => roles.includes(role));
      };

      /**
       * 根据路由的元信息（meta）中的 ignoreRoute 属性，判断当前路由是否需要被忽略（即不包含在结果中）。
       * @param route
       */
      const routeRemoveIgnoreFilter = (route: AppRouteRecordRaw) => {
        const { meta } = route;
        const { ignoreRoute } = meta || {};
        return !ignoreRoute;
      };

      /**
       * @description 根据设置的首页path，修正routes中的affix标记（固定首页）
       *
       * 在路由配置中找到与用户的主页路径匹配的路由，并给该路由的元信息（meta）中添加一个 affix: true 的属性，
       * 表示该路由需要在侧边栏保持固定状态。这通常用于将用户的主页（Home 页面）设置为固定的标签页，无法被关闭。
       * */
      const patchHomeAffix = (routes: AppRouteRecordRaw[]) => {
        if (!routes || routes.length === 0) return;
        let homePath: string = userStore.getUserInfo.homePath || PageEnum.BASE_HOME;
        function patcher(routes: AppRouteRecordRaw[], parentPath = '') {
          //parentPath 表示当前处理的路由的父级路径，用于构建当前路由的完整路径。
          if (parentPath) parentPath = parentPath + '/';
          routes.forEach((route: AppRouteRecordRaw) => {
            const { path, children, redirect } = route;
            const currentPath = path.startsWith('/') ? path : parentPath + path;
            if (currentPath === homePath) {
              if (redirect) {
                homePath = route.redirect! as string;
              } else {
                route.meta = Object.assign({}, route.meta, { affix: true });
                throw new Error('end');
              }
            }
            //如果当前路由有子路由（children 存在且不为空数组），则继续递归处理子路由，并
            // 将当前路由的路径作为父级路径传入。
            children && children.length > 0 && patcher(children, currentPath);
          });
        }
        try {
          patcher(routes);
        } catch (e) {
          // 已处理完毕跳出循环
        }
        return;
      };

      /**
       * projectSetting.ts中设置了permissionMode为back
       */
      switch (permissionMode) {
        case PermissionModeEnum.ROLE:
          routes = filter(asyncRoutes, routeFilter);
          routes = routes.filter(routeFilter);
          //  将多级路由转换为二级
          routes = flatMultiLevelRoutes(routes);
          break;

        case PermissionModeEnum.ROUTE_MAPPING:
          routes = filter(asyncRoutes, routeFilter);
          routes = routes.filter(routeFilter);
          const menuList = transformRouteToMenu(routes, true);
          routes = filter(routes, routeRemoveIgnoreFilter);
          routes = routes.filter(routeRemoveIgnoreFilter);
          menuList.sort((a, b) => {
            return (a.meta?.orderNo || 0) - (b.meta?.orderNo || 0);
          });

          this.setFrontMenuList(menuList);
          // 将多级路由转换为二级
          routes = flatMultiLevelRoutes(routes);
          break;

        // 后台菜单构建
        case PermissionModeEnum.BACK:
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { createMessage, createWarningModal } = useMessage();
          // 菜单加载提示
          // createMessage.loading({
          //   content: t('sys.app.menuLoading'),
          //   duration: 1,
          // });

          // 从后台获取权限码，
          // 这个函数可能只需要执行一次，并且实际的项目可以在正确的时间被放置
          let routeList: AppRouteRecordRaw[] = [];
          try {
            this.changePermissionCode();
            /**
             * 获取菜单树
             * [
             *   {
             *     "redirect": null,
             *     "path": "/demo/test",
             *     "component": "layouts/RouteView",
             *     "route": "1", //是否路由菜单: 0:不是  1:是（默认值1）
             *     "children": [
             *       {
             *         "path": "/online/cgformList/558798e2e1a04ed6aad0e1ca01a0efea",
             *         "component": "111",
             *         "route": "0",
             *         "meta": {
             *           "keepAlive": false,
             *           "internalOrExternal": false,
             *           "componentName": "111",
             *           "title": "Bank"
             *         },
             *         "name": "online-cgformList-558798e2e1a04ed6aad0e1ca01a0efea",
             *         "id": "1714829031943294978"
             *       },
             *       {
             *         "path": "/abc",
             *         "component": "abc",
             *         "route": "0",
             *         "children": [
             *          ...
             *         ],
             *         "meta": {
             *           "keepAlive": false,
             *           "internalOrExternal": false,
             *           "componentName": "abc",
             *           "title": "组件测试"
             *         },
             *         "name": "abc",
             *         "id": "1714940010819604482"
             *       }
             *     ],
             *     "meta": {
             *       "keepAlive": false,
             *       "internalOrExternal": false,
             *       "componentName": "RouteView",
             *       "title": "Demo_Test"
             *     },
             *     "name": "demo-test",
             *     "id": "1714572866088869890"
             *   },
             *   {
             *     "redirect": "/online/cgform",//重定向到 菜单“online表单开发”
             *     "path": "/online",
             *     "component": "layouts/default/index",
             *     "route": "1",
             *     "hidden": true,
             *     "children": [
             *
             *     ],
             *     "meta": {
             *       "hideMenu": true
             *     },
             *     "name": "online",
             *     "id": "1455100420297859074"
             *   }
             * ]
             */
            routeList = (await getMenuList()) as AppRouteRecordRaw[];
            // update-begin----author:sunjianlei---date:20220315------for: 判断是否是 vue3 版本的菜单 ---
            let hasIndex: boolean = false;
            let hasIcon: boolean = false;
            /**
             * note: for of 和for in的区别   for ... in 循环读取键名， for ... of 循环读取键值
             */
            for (const menuItem of routeList) {
              // 条件1：判断组件是否是 layouts/default/index
              if (!hasIndex) {
                hasIndex = menuItem.component === 'layouts/default/index';
              }
              // 条件2：判断图标是否带有 冒号
              if (!hasIcon) {
                hasIcon = !!menuItem.meta?.icon?.includes(':');
              }
              // 满足任何一个条件都直接跳出循环
              if (hasIcon || hasIndex) {
                break;
              }
            }
            // 两个条件都不满足，就弹出提示框
            if (!hasIcon && !hasIndex) {
              // 延迟1.5秒之后再出现提示，否则提示框出不来
              setTimeout(
                () =>
                  createWarningModal({
                    title: '检测提示',
                    content: '当前菜单表是 <b>Vue2版本</b>，导致菜单加载异常!<br>点击确认，切换到Vue3版菜单！',
                    onOk: function () {
                      switchVue3Menu();
                      location.reload();
                    },
                  }),
                100
              );
            }
            // update-end----author:sunjianlei---date:20220315------for: 判断是否是 vue3 版本的菜单 ---
          } catch (error) {
            console.error(error);
          }
          // 组件地址前加斜杠处理  author: lsq date:2021-09-08
          routeList = addSlashToRouteComponent(routeList);
          // 动态引入组件
          routeList = transformObjToRoute(routeList);

          // 构建后台路由菜单
          const backMenuList = transformRouteToMenu(routeList);
          this.setBackMenuList(backMenuList);

          // 删除meta.ignoreRoute项
          routeList = filter(routeList, routeRemoveIgnoreFilter);
          routeList = routeList.filter(routeRemoveIgnoreFilter);

          routeList = flatMultiLevelRoutes(routeList);
          routes = [PAGE_NOT_FOUND_ROUTE, ...routeList];
          break;
      }

      routes.push(ERROR_LOG_ROUTE);
      patchHomeAffix(routes);
      return routes;
    },
    setAuthData(systemPermission) {
      this.authList = systemPermission.auth;
      this.allAuthList = systemPermission.allAuth;
      this.sysSafeMode = systemPermission.sysSafeMode;
    },
    setAuthList(authList: AuthItem[]) {
      this.authList = authList;
    },
    setAllAuthList(authList: AuthItem[]) {
      this.allAuthList = authList;
    },

    //update-begin-author:taoyan date:2022-6-1 for: VUEN-1162 子表按钮没控制
    setOnlineSubTableAuth(code, hideBtnList) {
      this.onlineSubTableAuthMap[code] = hideBtnList;
    },
    //update-end-author:taoyan date:2022-6-1 for: VUEN-1162 子表按钮没控制
  },
});

// 需要在设置之外使用
export function usePermissionStoreWithOut() {
  /**
   * question: usePermissionStore是defineStore的返回值，这是一个函数，为什么可以传递store（createPinia的返回值）作为参数？
   *  一般对usePermissionStore的使用都是 const permissionStore = usePermissionStore(); permissionStore.setPermCodeList(codeList);
   */
  return usePermissionStore(store);
}
