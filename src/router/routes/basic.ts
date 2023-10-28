import type { AppRouteRecordRaw } from '/@/router/types';
import { t } from '/@/hooks/web/useI18n';
import { REDIRECT_NAME, LAYOUT, EXCEPTION_COMPONENT, PAGE_NOT_FOUND_NAME } from '/@/router/constant';

// 404 on a page
export const PAGE_NOT_FOUND_ROUTE: AppRouteRecordRaw = {
  /**
   * note: 这里是  :path表示定义一个动态路由参数名称叫做path，然后可以通过$route.params.path获取到这个参数.
   *  这个参数的值 是 /:path(.*)* 中去掉:path后(.*)*的正则匹配到的值. ，以冒号开头 (:) 表示这是一个路由参数。任何被匹配
   *  到的路径片段都会被当作 path 参数的值传递给路由组件。
   *  2:(.*)*： 这是一个正则表达式，其中 .* 匹配任意字符（除了换行符 \n），而 * 表示匹配前面的表达式零次或多次，即匹配任意数量的字符。
   *  3:综合起来,就是匹配所有的路径，将路径放到$route.params.path中，这种路由路径的设置通常用于捕捉所有不被其他具体路由匹配的路径，常
   *  用于处理“页面未找到”（Page Not Found）或者“404 页面”的情况。在这种情况下，任何无法匹配到具体路由的路径都会被重定
   *  向到这个通配符路由，使得应用程序能够在一个特定的页面中显示友好的“页面未找到”提示信息。
   *  参考《E:\programme\vue-router\官方文档\带参数的动态路由匹配 I Vue Router.pdf》
   *
   * 4.question: 为什么这里配置的path和 children中配置的path是相同的？  直接配置一个不就好了吗？
   */
  path: '/:path(.*)*',
  //定义命名路由，然后可以$router.push({name:'page-not-found'})跳转到这个路由
  name: PAGE_NOT_FOUND_NAME,
  component: LAYOUT,
  meta: {
    title: 'ErrorPage',
    hideBreadcrumb: true,
    hideMenu: true, //不显示在菜单中
  },
  children: [
    {
      path: '/:path(.*)*',
      name: PAGE_NOT_FOUND_NAME,
      component: EXCEPTION_COMPONENT,
      meta: {
        title: 'ErrorPage',
        hideBreadcrumb: true,
        hideMenu: true,
      },
    },
  ],
};

export const REDIRECT_ROUTE: AppRouteRecordRaw = {
  path: '/redirect',
  component: LAYOUT,
  name: 'RedirectTo',
  meta: {
    title: REDIRECT_NAME,
    hideBreadcrumb: true,
    hideMenu: true,
  },
  children: [
    {
      path: '/redirect/:path(.*)',
      name: REDIRECT_NAME,
      component: () => import('/@/views/sys/redirect/index.vue'),
      meta: {
        title: REDIRECT_NAME,
        hideBreadcrumb: true,
      },
    },
  ],
};

export const ERROR_LOG_ROUTE: AppRouteRecordRaw = {
  path: '/error-log',
  name: 'ErrorLog',
  component: LAYOUT,
  redirect: '/error-log/list',
  meta: {
    title: 'ErrorLog',
    hideBreadcrumb: true,
    hideChildrenInMenu: true,
  },
  children: [
    {
      path: 'list',
      name: 'ErrorLogList',
      component: () => import('/@/views/sys/error-log/index.vue'),
      meta: {
        title: t('routes.basic.errorLogList'),
        hideBreadcrumb: true,
        currentActiveMenu: '/error-log',
      },
    },
  ],
};
