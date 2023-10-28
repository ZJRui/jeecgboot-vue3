import type { AppRouteRecordRaw, AppRouteModule } from '/@/router/types';

import { PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE } from '/@/router/routes/basic';

import { mainOutRoutes } from './mainOut';
import { PageEnum } from '/@/enums/pageEnum';
import { t } from '/@/hooks/web/useI18n';

/**
 * 1.Glob导入： vite支持使用特殊的import.meta.glob函数从文件系统导入多个模块   1
 * glob的导入返回值的形式参考 E:\programme\Vite\官方文档\功能 I Vite 官方中文文档.pdf
 *   默认情况下是懒加载 返回值是一个对象：
 *   const  modules_importGlob  =  {
 * ' ./dir/foo.js ' :  ()  =>  import ( ' ./dir/foo.js ' ) ,
 * ' ./dir/bar.js ' :  ()  =>  import ( ' ./dir/bar.js ' ) ,
 * }
 * 如果使用了eager:true,则等价于
 * import  *  as  __glob__0_0  from  ' ./dir/foo.js '
 * import  *  as  __glob__0_1  from  ' ./dir/bar.js '
 * const  modules  =  {
 * ' ./dir/foo.js ' :  __glob__0_0 ,
 * ' ./dir/bar.js ' :  __glob__0_1 ,
 * }
 *
 * 2.好处：不需要import modules下的文件了。需要注意的是
 */
const modules = import.meta.glob('./modules/**/*.ts', { eager: true });

const routeModuleList: AppRouteModule[] = [];

// 加入到路由集合中
Object.keys(modules).forEach((key) => {
  //使用模块对象的default 作为路由配置项
  const mod = (modules as Recordable)[key].default || {};
  const modList = Array.isArray(mod) ? [...mod] : [mod];
  routeModuleList.push(...modList);
});

/**
 * routeModuleList:
 * [
 *     {
 *         "path": "/about",
 *         "name": "About",
 *         "redirect": "/about/index",
 *         "meta": {
 *             "hideChildrenInMenu": true,
 *             "icon": "simple-icons:about-dot-me",
 *             "title": "routes.dashboard.about",
 *             "orderNo": 100000
 *         },
 *         "children": [
 *             {
 *                 "path": "index",
 *                 "name": "AboutPage",
 *                 "meta": {
 *                     "title": "routes.dashboard.about",
 *                     "icon": "simple-icons:about-dot-me",
 *                     "hideMenu": true
 *                 }
 *             }
 *         ]
 *     },
 *     {
 *         "path": "/dashboard",
 *         "name": "Dashboard",
 *         "redirect": "/dashboard/analysis",
 *         "meta": {
 *             "orderNo": 10,
 *             "icon": "ion:grid-outline",
 *             "title": "routes.dashboard.dashboard"
 *         },
 *         "children": [
 *             {
 *                 "path": "analysis",
 *                 "name": "Analysis",
 *                 "meta": {
 *                     "title": "routes.dashboard.analysis"
 *                 }
 *             },
 *             {
 *                 "path": "workbench",
 *                 "name": "Workbench",
 *                 "meta": {
 *                     "title": "routes.dashboard.workbench"
 *                 }
 *             }
 *         ]
 *     },
 * ]
 */
export const asyncRoutes = [PAGE_NOT_FOUND_ROUTE, ...routeModuleList];

export const RootRoute: AppRouteRecordRaw = {
  path: '/',
  name: 'Root',
  redirect: PageEnum.BASE_HOME,
  meta: {
    title: 'Root',
  },
};

export const LoginRoute: AppRouteRecordRaw = {
  path: '/login',
  name: 'Login',
  //新版后台登录，如果想要使用旧版登录放开即可
  // component: () => import('/@/views/sys/login/Login.vue'),
  component: () => import('/@/views/system/loginmini/MiniLogin.vue'),
  meta: {
    title: t('routes.basic.login'),
  },
};

//update-begin---author:wangshuai ---date:20220629  for：auth2登录页面路由------------
export const Oauth2LoginRoute: AppRouteRecordRaw = {
  path: '/oauth2-app/login',
  name: 'oauth2-app-login',
  //新版钉钉免登录，如果想要使用旧版放开即可
  // component: () => import('/@/views/sys/login/OAuth2Login.vue'),
  component: () => import('/@/views/system/loginmini/OAuth2Login.vue'),
  meta: {
    title: t('routes.oauth2.login'),
  },
};
//update-end---author:wangshuai ---date:20220629  for：auth2登录页面路由------------

/**
 * 【通过token直接静默登录】流程办理登录页面 中转跳转
 */
export const TokenLoginRoute: AppRouteRecordRaw = {
  path: '/tokenLogin',
  name: 'TokenLoginRoute',
  component: () => import('/@/views/sys/login/TokenLoginPage.vue'),
  meta: {
    title: '带token登录页面',
    ignoreAuth: true,
  },
};

// Basic routing without permission
export const basicRoutes = [LoginRoute, RootRoute, ...mainOutRoutes, REDIRECT_ROUTE, PAGE_NOT_FOUND_ROUTE, TokenLoginRoute, Oauth2LoginRoute];
