import { AppRouteModule } from '/@/router/types';
import { LAYOUT } from '@/router/constant';

/**
 *菜单是根据路由生成的，路由模式又分为
 *   // 权限模式,默认前端角色权限模式
 *   // ROUTE_MAPPING: 前端模式（菜单由路由生成，默认）
 *   // ROLE：前端模式（菜单路由分开）
 *   //Back: 后端模式（菜单路由分开）
 *   permissionMode: PermissionModeEnum.ROUTE_MAPPING,
 *
 * 默认情况下，使用后端模式，也就是从后端接口获取路由，然后根据路由生成菜单，因此这里配置了路由 也不会有对应的菜单。
 *
 */

const productRoutes: AppRouteModule = {
  path: '/shproduct',
  name: 'ShProduct',
  component: LAYOUT,
  redirect: '/shproduct/list',
  meta: {
    orderNo: 300,
    icon: 'ion:layers-outline',
    title: '商品管理',
  },
  children: [
    {
      path: 'list',
      name: 'ShProductList',
      component: () => import('@/views/sachin/shproduct/ShProductList.vue'),
      meta: {
        title: '商品列表',
      },
    },
    {
      path: 'list',
      name: 'ShProductList',
      component: () => import('@/views/sachin/shproduct/ShProductList.vue'),
      meta: {
        title: '商品列表2',
      },
      children: [
        {
          path: 'innerRouteA',
          name: 'innerRouteA',
          meta: {
            title: '内部三级路由A',
          },
          component: () => import('@/views/sachin/shproduct/ShProductList.vue'),
        },
      ],
    },
  ],
};

/**
 * careful: 路由配置项必须要通过default默认导出进行配置。因为index.ts加载的时候
 *  会从default属性上路由获取配置
 *
 */
export default productRoutes;
