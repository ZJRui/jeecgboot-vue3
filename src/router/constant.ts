export const REDIRECT_NAME = 'Redirect';

export const PARENT_LAYOUT_NAME = 'ParentLayout';

export const PAGE_NOT_FOUND_NAME = 'PageNotFound';

/**
 * note: 路径以/@开头，vite.config.js中做了配置。 也可以以@/开头
 * @constructor
 */
export const EXCEPTION_COMPONENT = () => import('/@/views/sys/exception/Exception.vue');

/**
 * @description: default layout
 */
export const LAYOUT = () => import('/@/layouts/default/index.vue');

/**
 * @description: parent-layout
 */
export const getParentLayout = (_name?: string) => {
  return () =>
    new Promise((resolve) => {
      resolve({
        name: PARENT_LAYOUT_NAME,
      });
    });
};
