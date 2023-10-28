import type { AppRouteModule, AppRouteRecordRaw } from '/@/router/types';
import type { Router, RouteRecordNormalized } from 'vue-router';

import { getParentLayout, LAYOUT, EXCEPTION_COMPONENT } from '/@/router/constant';
import { cloneDeep, omit } from 'lodash-es';
import { warn } from '/@/utils/log';
import { createRouter, createWebHashHistory } from 'vue-router';
import { getTenantId, getToken } from '/@/utils/auth';
import { URL_HASH_TAB } from '/@/utils';
//引入online lib路由
import { packageViews } from '/@/utils/monorepo/dynamicRouter';
import { useI18n } from '/@/hooks/web/useI18n';

export type LayoutMapKey = 'LAYOUT';
const IFRAME = () => import('/@/views/sys/iframe/FrameBlank.vue');
const LayoutContent = () => import('/@/layouts/default/content/index.vue');

const LayoutMap = new Map<string, () => Promise<typeof import('*.vue')>>();

//@/layouts/default/index.vue
LayoutMap.set('LAYOUT', LAYOUT);
///@/views/sys/iframe/FrameBlank.vue
LayoutMap.set('IFRAME', IFRAME);
///@/layouts/default/content/index.vue
LayoutMap.set('LayoutsContent', LayoutContent);

/**
 * dynamicViewsModules["../../views/dashboard/Analysis/components/BdcTabCard.vue"]=()=>{}
 * dynamicViewsModules["../../views/demo/jeecg/JCodeEditDemo.vue"]=()=>
 */
let dynamicViewsModules: Record<string, () => Promise<Recordable>>;

// Dynamic introduction
function asyncImportRoute(routes: AppRouteRecordRaw[] | undefined) {
  /**
   * 如果该属性没有赋值，则导入多个模块。
   */
  if (!dynamicViewsModules) {
    /**
     * 1.Glob导入： vite支持使用特殊的import.meta.glob函数从文件系统导入多个模块
     * 2.注意 dynamicViewsModules是vite的返回值
     * 3. packageViews是online lib的路由，这里使用import.meta.glob导入本地项目的路由，然后两者合并
     * 4. glob的导入返回值的形式参考 E:\programme\Vite\官方文档\功能 I Vite 官方中文文档.pdf
     *   默认情况下是懒加载 返回值是一个对象：
     *   const  modules_importGlob  =  {
     * ' ./dir/foo.js ' :  ()  =>  import ( ' ./dir/foo.js ' ) ,
     * ' ./dir/bar.js ' :  ()  =>  import ( ' ./dir/bar.js ' ) ,
     * }
     */
    dynamicViewsModules = import.meta.glob('../../views/**/*.{vue,tsx}');
    //合并online lib路由
    dynamicViewsModules = Object.assign({}, dynamicViewsModules, packageViews);
  }
  if (!routes) return;
  routes.forEach((item) => {
    //【jeecg-boot/issues/I5N2PN】左侧动态菜单怎么做国际化处理  2022-10-09
    //菜单支持国际化翻译
    if (item?.meta?.title) {
      const { t } = useI18n();
      if (item.meta.title.includes("t('") && t) {
        item.meta.title = eval(item.meta.title);
        //console.log('译后: ',item.meta.title)
      }
    }

    // update-begin--author:sunjianlei---date:20210918---for:适配旧版路由选项 --------
    // @ts-ignore 适配隐藏路由
    if (item?.hidden) {
      item.meta.hideMenu = true;
      //是否隐藏面包屑
      item.meta.hideBreadcrumb = true;
    }
    // @ts-ignore 添加忽略路由配置, route: 是否路由菜单: 0:不是  1:是（默认值1）
    if (item?.route == 0) {
      item.meta.ignoreRoute = true;
    }
    // @ts-ignore 添加是否缓存路由配置
    item.meta.ignoreKeepAlive = !item?.meta.keepAlive;
    const token = getToken();
    const tenantId = getTenantId();
    // URL支持{{ window.xxx }}占位符变量
    //update-begin---author:wangshuai ---date:20220711  for：[VUEN-1638]菜单tenantId需要动态生成------------
    item.component = (item.component || '')
      .replace(/{{([^}}]+)?}}/g, (s1, s2) => eval(s2))
      .replace('${token}', token)
      .replace('${tenantId}', tenantId);
    //update-end---author:wangshuai ---date:20220711  for：[VUEN-1638]菜单tenantId需要动态生成------------
    // 适配 iframe
    if (/^\/?http(s)?/.test(item.component as string)) {
      item.component = item.component.substring(1, item.component.length);
    }
    if (/^http(s)?/.test(item.component as string)) {
      if (item.meta?.internalOrExternal) {
        // @ts-ignore 外部打开
        item.path = item.component;
        // update-begin--author:sunjianlei---date:20220408---for: 【VUEN-656】配置外部网址打不开，原因是带了#号，需要替换一下
        item.path = item.path.replace('#', URL_HASH_TAB);
        // update-end--author:sunjianlei---date:20220408---for: 【VUEN-656】配置外部网址打不开，原因是带了#号，需要替换一下
      } else {
        // @ts-ignore 内部打开
        item.meta.frameSrc = item.component;
      }
      delete item.component;
    }
    // update-end--author:sunjianlei---date:20210918---for:适配旧版路由选项 --------
    if (!item.component && item.meta?.frameSrc) {
      item.component = 'IFRAME';
    }
    let { component, name } = item;
    const { children } = item;
    if (component) {
      const layoutFound = LayoutMap.get(component.toUpperCase());
      if (layoutFound) {
        item.component = layoutFound;
      } else {
        // update-end--author:zyf---date:20220307--for:VUEN-219兼容后台返回动态首页,目的适配跟v2版本配置一致 --------
        if (component.indexOf('dashboard/') > -1) {
          //当数据标sys_permission中component没有拼接index时前端需要拼接
          if (component.indexOf('/index') < 0) {
            component = component + '/index';
          }
        }
        /**
         * 如果从LayoutMap中 没有对应的 组件，那么就进行动态导入，动态导入的本质就是
         * 从对象 dynamicViewsModules中，component本身就是一个路径，然后component作为属性key到dynamicViewsModules中获取属性值，
         * 这个属性值是一个动态导入函数()=>import('xxxxxx.vue')
         *
         */
        // update-end--author:zyf---date:20220307---for:VUEN-219兼容后台返回动态首页,目的适配跟v2版本配置一致 --------
        item.component = dynamicImport(dynamicViewsModules, component as string);
      }
    } else if (name) {
      item.component = getParentLayout();
    }
    children && asyncImportRoute(children);
  });
}

function dynamicImport(dynamicViewsModules: Record<string, () => Promise<Recordable>>, component: string) {
  const keys = Object.keys(dynamicViewsModules);
  /**
   *  根据路径，过滤出匹配的属性key.
   *
   *  比如：component: /demo/sachin/jvxetabledemo/index (注意数据库中菜单的前端组件属性component字段不以/开头，前端会添加/)
   *  dynamicViewModules对象有一个属性名 ['../../views/demo/sachin/jvxetabledemo/index.vue'] 对应的属性
   *  值是() => import("/src/views/demo/sachin/jvxetabledemo/index.vue")
   *
   */
  const matchKeys = keys.filter((key) => {
    /**
     * 1.为什么下面要replace '../../views'? 因为 views的上级目录是src，src的上级目录是项目根目录，
     *   dynamicViewsModules = import.meta.glob('../../views/ ** / *.{vue,tsx}'); 返回的对象的属性key是以../../views开头的
     *   所以我们保持一致，dynamicViewsModules对象的属性key是以../../views开头的
     *   component表示菜单配置中的前端组件属性，这个属性是vue文件在src/views/目录下的位置，比如 ‘demo/sachin/jvxetabledemo/index’
     *   示例：component=/super/online/cgform/auto/erp/OnlCgformErpList 匹配到 dynamicViewsModules的
     *   '../../views/super/online/cgform/auto/erp/OnlCgformErpList.vue'属性
     *
     */
    const k = key.replace('../../views', '');
    const startFlag = component.startsWith('/');
    const endFlag = component.endsWith('.vue') || component.endsWith('.tsx');
    const startIndex = startFlag ? 0 : 1;
    const lastIndex = endFlag ? k.length : k.lastIndexOf('.');
    return k.substring(startIndex, lastIndex) === component;
  });
  if (matchKeys?.length === 1) {
    const matchKey = matchKeys[0];
    return dynamicViewsModules[matchKey];
  } else if (matchKeys?.length > 1) {
    warn(
      'Please do not create `.vue` and `.TSX` files with the same file name in the same hierarchical directory under the views folder. This will cause dynamic introduction failure'
    );
    return;
  }
}

// Turn background objects into routing objects
export function transformObjToRoute<T = AppRouteModule>(routeList: AppRouteModule[]): T[] {
  /**
   *
   * 1.该方法接收的参数routeList 是请求 当前用户菜单接口返回的菜单数据，在查询当前用户的菜单时会将一些有特性的菜单查询出来，
   * 比如： or (p.url like '%:code' and p.url like '/online%' and p.hidden = 1)
   * or (p.url like '%:id' and p.url like '/online%' and p.hidden = 1)
   * or p.url = '/online')
   *
   * 因此：（菜单：Online表单开发, url: /online/cgform, component :super/online/cgform/index）
   *    （菜单：Online表单视图，url:/online/copyform/:code, component:super/online/cgform/CgformCopyList）
   * 就被查询出来了。
   *
   * 那么现在问题就是如何确定 这个菜单用哪个组件渲染， 根据compoent属性，我们要计算出来 ‘super/online/cgform/CgformCopyList’对应哪个组件。
   * 在 getViews是模块 @jeecg/online 的默认导出对象身上的属性，该方法返回一个对象，对象的属性是动态页面的路径，值是动态导入函数
   * 对于表单视图 component=super/online/cgform/CgformCopyList 会匹配到如下 组件
   * "./src/views/super/online/cgform/CgformCopyList.vue": ()=>import("/node_modules/.pnpm/@jeecg+online@3.5.3-vite4/node_modules/@jeecg/online/CgformCopyList-3adab58f.mjs?v=5bf0c8c0"),
   *
   *2. 对于routeList中的每一个route（也就是一级菜单）， 如果route.component!==Layout,则会嵌入一层parent路由
   * 路由name (通过URL生成路由name,路由name供前端开发，页面跳转使用),也就是菜单的url 将/替换为-,作为路由的name
   * 嵌入路由的name=route.name+'Parent', 因此devTools中看到路由信息如下：
   * {
   *     path:""
   *     name:"demo-testParent"  // 菜单名： Demo_Test, 菜单Url:/demo/test,为什么不使用菜单名作为路由name？因为命名路由导航使用路由name，需要全是英文。
   *     //没有component属性，没有path，因此无法访问到该路由
   * }
   * {
   *     name:"onlineParent",//菜单名称：低代码开发,菜单url:/online
   *     redirect:"/online/cgform"
   * }
   *
   */
  routeList.forEach((route) => {
    const component = route.component as string;
    if (component) {
      if (component.toUpperCase() === 'LAYOUT') {
        route.component = LayoutMap.get(component.toUpperCase());
      } else {
        /**
         *
         * 将当前的route 设置为当前route对象的 children。相当于插入一层路由。
         *
         * 设置当前route的component为 LAYOUT，这是一个异步导入的组件
         * 设置当前route的name 为 原来的name-Parent.
         *
         * question: 为什么要嵌入一层-parent路由
         *
         */
        route.children = [cloneDeep(route)];
        route.component = LAYOUT;
        route.name = `${route.name}Parent`;
        route.path = '';
        const meta = route.meta || {};
        meta.single = true;
        //affix:贴上,
        meta.affix = false;
        route.meta = meta;
      }
    } else {
      warn('请正确配置路由：' + route?.name + '的component属性');
    }
    /**
     * 对route.children仅从动态导入，因为原来的route已经变成了route.children=cloneDeep(route)
     */
    route.children && asyncImportRoute(route.children);
  });
  return routeList as unknown as T[];
}

/**
 *  将多级路由转换为二级
 *  请解释下面代码的含义:
 *  1.遍历modules,对于每一个routeModule
 *  2.如果routeModule不是多级路由，那么就跳过当前循环，进行下一轮循环
 *  3.如果routeModule是多级路由，那么就进行路由等级提升
 *  4.路由等级提升的含义是什么？就是将多级路由转换为二级路由
 */
export function flatMultiLevelRoutes(routeModules: AppRouteModule[]) {
  const modules: AppRouteModule[] = cloneDeep(routeModules);
  for (let index = 0; index < modules.length; index++) {
    const routeModule = modules[index];
    if (!isMultipleRoute(routeModule)) {
      continue;
    }
    promoteRouteLevel(routeModule);
  }
  return modules;
}

//提升路由级别
function promoteRouteLevel(routeModule: AppRouteModule) {
  // Use vue-router to splice menus 使用视图-路由器到拼接菜单
  //slice（切割）split（分离）
  //splice: 粘接(胶片、磁带等);绞接(两段绳子);捻接
  //详细解释下面的代码：
  let router: Router | null = createRouter({
    routes: [routeModule as unknown as RouteRecordNormalized],
    history: createWebHashHistory(),
  });

  const routes = router.getRoutes();
  addToChildren(routes, routeModule.children || [], routeModule);
  router = null;
  /**
   * 1.lodash.omit 是 Lodash 中的一个函数，它用于从对象中删除指定的属性（或多个属性）并返回一个新的对象。在给定的场景中，lodash.omit(item, 'children')
   * 的作用是从对象 item 中删除属性名为 'children' 的属性，并返回一个不包含 'children' 属性的新对象。
   *
   * 在上述代码中，这个函数的使用场景可能是为了在处理路由配置时，去除嵌套路由对象中的子路由信息。通常，父路由对象会包含一个 children 属性，里面存放
   * 了子路由的配置。在某些情况下，可能希望获取一个不包含子路由信息的新对象，这时就可以使用 lodash.omit 函数。
   *
   * 2. 因为在上面的addToChildren函数中我们已经将 所有的深层次的路由提升到routeModule.children中，因此我们可以将routeModule.children中的每一个路由对象
   * 的children属性都删除
   *
   * 3.路由提升存在一个疑问： 就是  内部嵌套路由的path是一个相对路径，他实际的完整路径是由父路由的path+子路由的path组成的，那么在路由提升后，子路由的path
   * 是如何变通的？ 实际上 createRouter().getRoutes()得到的每一个Route对象的path都是完整的路径，而不是相对路径。
   * 比如配置中 path:'innerRouteA' 在router中route的path变成了"/shproduct/list/innerRouteA"
   *
   *
   */

  routeModule.children = routeModule.children?.map((item) => omit(item, 'children'));
}

// Add all sub-routes to the secondary route
function addToChildren(routes: RouteRecordNormalized[], children: AppRouteRecordRaw[], routeModule: AppRouteModule) {
  /**
   * 1.详细解释下面的代码：
   * 要理解该方法 要首先理解AppRouteModule是什么？ 我们通过 const modules = import.meta.glob('./modules/ ** / *.ts', { eager: true });
   * 得到了modules目录下的每一个ts export default 配置的路由（比如ShProduct.ts）,就是这个AppRouteModule.
   * 参数routes 是 使用AppRouteModule 进行了createRouter().getRoutes（）得到的路由对象数组
   *
   * addToChildren方法在promoteRouteLevel 方法中被首先调用，
   * 此时第二个参数 children 表示 ShProduct.ts export default的路由配置对象的children属性。 而且你会发现每一个 modules目录下的路由配置文件，
   * export default 导出的都是一个对象，而不是一个数组，对象上有一个children属性。 以往我们常见的是给router传递一个路由配置数组。
   *
   * routeModule：我们可以看作是一级路由对象。
   * routeModule.children 我们可以看作是二级路由对象
   *
   * route.module.children[0].children:就是三级路由对象数组了。 对每一个三级路由对象 我们都将他放入到 routeModule.Children数组中，
   * 也就是将深层次的路由进行提升。
   *
   *
   * 2.在buildRouteAction中，会根据permissionMode 为role,ROUTE_MAPPING,,BACK三种模式进行路由的构建，
   * 不管是那种模式都会进行 将多级路由转换为二级路由的操作。但是在back模式下，在flat之前会先进行transformObjToRoute
   * transformObjToRoute 方法中会 将每一个 AppRouteModule对象先deepClone一份，
   * 然后 appRouteModule.children = [cloneDeep(appRouteModule)];同时设置appRouteModule.component = LAYOUT;appRouteModule.name= `${appRouteModule.name}Parent`;
   * 也就是将原来的appRouteModule一级路由对象 变成了appRouteModule.children二级路由对象了。
   * 举例来说 ShProduct.ts 中export default的 '/shproduct' 本身是一级路由，但是经过transformObjToRoute方法后，就变成了二级路由了。
   * {
   *     name:"ShProductParent",
   *     children:[
   *         {
   *             name:"ShProduct",
   *             children:[
   *                 ..///原来的ShProduct.ts中的二级路由变成了三级路由
   *             ]
   *         }
   *     ]
   * }
   * 因此这种情况下对上面的 ShProductParent 进行flat 会导致 shProduct的所有子路由都变成你 和shProduct同级的路由了。
   *
   *
   */
  for (let index = 0; index < children.length; index++) {
    const child = children[index];
    const route = routes.find((item) => item.name === child.name);
    if (!route) {
      continue;
    }
    routeModule.children = routeModule.children || [];
    /**
     * 判断当前处理的路由对象item 是否已经位于 routeModule.children的二级路由中了。如果没有则push到二级路由
     */
    if (!routeModule.children.find((item) => item.name === route.name)) {
      routeModule.children?.push(route as unknown as AppRouteModule);
    }
    if (child.children?.length) {
      //处理更深层次的子路由，将他们放入到二级路由中。
      addToChildren(routes, child.children, routeModule);
    }
  }
}

// Determine whether the level exceeds 2 levels
function isMultipleRoute(routeModule: AppRouteModule) {
  /**
   * 解读下面的代码：
   * 1.如果routeModule是undefined或者routeModule没有children属性，那么就返回false
   */
  if (!routeModule || !Reflect.has(routeModule, 'children') || !routeModule.children?.length) {
    return false;
  }

  const children = routeModule.children;

  let flag = false;
  for (let index = 0; index < children.length; index++) {
    const child = children[index];
    /**
         * 如果child.children有值，且长度lenth不是0，那么就返回true，表示存在 多级路由
         * {
         *     path:'',
         *     name:'A
         *     children:[
         *         {
         *         name:"A1",
         *         children:[
         *             {
         *             name:'A11'//----->多级路由
         *             }
         *             {
         *             name:'A12'//----->多级路由
         *             }
         *         ]
         *
         *         },
         *         {
         *         name:'A2',

         *         }
         *     ]
         * }
         * 也就是只能有两级路由， 三级路由就是多级路由了
         */
    if (child.children?.length) {
      flag = true;
      break;
    }
  }
  return flag;
}

/**
 * 组件地址前加斜杠处理
 * @updateBy:lsq
 * @updateDate:2021-09-08
 */
export function addSlashToRouteComponent(routeList: AppRouteRecordRaw[]) {
  routeList.forEach((route) => {
    const component = route.component as string;
    if (component) {
      const layoutFound = LayoutMap.get(component);
      /**
       * 如果get的值为空，则设置component属性以/开头
       */
      if (!layoutFound) {
        route.component = component.startsWith('/') ? component : `/${component}`;
      }
    }
    route.children && addSlashToRouteComponent(route.children);
  });
  return routeList;
}
