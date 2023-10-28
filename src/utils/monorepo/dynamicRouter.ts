export type DynamicViewsRecord = Record<string, () => Promise<Recordable>>;

/** 已注册模块的动态页面 */
export const packageViews: DynamicViewsRecord = {};

/**
 * 注册动态路由页面
 * @param getViews 获取该模块下所有页面的方法
 */
export function registerDynamicRouter(getViews: () => DynamicViewsRecord) {
  /**
   * main.ts中registerPackages--》use-->registerDynamicRouter
   */
  if (typeof getViews === 'function') {
    /**
     * getViews是模块 @jeecg/online 的默认导出对象身上的属性，该方法返回一个对象，对象的属性是动态页面的路径，值是动态导入函数
     * {
     *             "./src/views/super/online/cgform/auto/comp/JOnlineSearchSelect.vue": ()=>import("/node_modules/.pnpm/@jeecg+online@3.5.3-vite4/node_modules/@jeecg/online/JOnlineSearchSelect-5608a5cf.mjs?v=5bf0c8c0"),
     *
     *             "./src/views/super/online/cgform/CgformCopyList.vue": ()=>import("/node_modules/.pnpm/@jeecg+online@3.5.3-vite4/node_modules/@jeecg/online/CgformCopyList-3adab58f.mjs?v=5bf0c8c0"),
     *
     *             "./src/views/super/online/cgform/index.vue": ()=>import("/node_modules/.pnpm/@jeecg+online@3.5.3-vite4/node_modules/@jeecg/online/index-9d32ae88.mjs?t=1698134034276&v=5bf0c8c0"),
     *
     *             "./src/views/super/online/cgreport/demo/ModalFormDemo.vue": ()=>import("/node_modules/.pnpm/@jeecg+online@3.5.3-vite4/node_modules/@jeecg/online/ModalFormDemo-0eeea994.mjs?v=5bf0c8c0"),
     *
     *             "./src/views/super/online/cgreport/index.vue": ()=>import("/node_modules/.pnpm/@jeecg+online@3.5.3-vite4/node_modules/@jeecg/online/index-074b92e5.mjs?v=5bf0c8c0")
     * }
     *
     */
    const dynamicViews = getViews();
    Object.keys(dynamicViews).forEach((key) => {
      /**
       * 1.处理动态页面的key，使其可以让路由识别
       *
       * 2.@jeect/online模块中getViews()方法返回的是："./src/views/super/online/cgform/auto/default/OnlineDetailModal.vue"--->
       *  "../../views/super/online/cgform/auto/erp/OnlCgformErpList.vue"
       *
       */
      const newKey = key.replace('./src/views', '../../views');
      packageViews[newKey] = dynamicViews[key];
    });
  }
}
