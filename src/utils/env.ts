import type { GlobEnvConfig } from '/#/config';

import pkg from '../../package.json';
import { getConfigFileName } from '../../build/getConfigFileName';

export function getCommonStoragePrefix() {
  const { VITE_GLOB_APP_SHORT_NAME } = getAppEnvConfig();
  return `${VITE_GLOB_APP_SHORT_NAME}__${getEnv()}`.toUpperCase();
}

// Generate cache key according to version
export function getStorageShortName() {
  return `${getCommonStoragePrefix()}${`__${pkg.version}`}__`.toUpperCase();
}

export function getAppEnvConfig() {
  /**
   * 1.在生产环境下env_name是__PRODUCTION__JEECGBOOTADMIN__CONF__，导致下面的env=window[__production_Jeecgbootadmin_confi__]
   * window对象上的这个属性是在build/script/buildConf.ts文件中生成的。
   *
   */
  const ENV_NAME = getConfigFileName(import.meta.env);

  const ENV = (import.meta.env.DEV
    ? // Get the global configuration (the configuration will be extracted independently when packaging)
      (import.meta.env as unknown as GlobEnvConfig)
    : window[ENV_NAME as any]) as unknown as GlobEnvConfig;

  /**
   * note: 在上文中为什么 使用env_name 访问window对象的属性要 as any?
   * 下面的两行代码会报错：Type Object cannot be used as an index type.
   *
   *  这个错误表明你在 TypeScript 中尝试使用一个对象类型作为索引类型，而这是不允许的。
   * 在 TypeScript 中，当你使用索引类型的时候，通常需要使用基本类型（如字符串、数字等）或者联合类型作为索引。例如，你可以有一个对象，它的键只能是字符串或者数字：
   * interface MyObject {
   *     [key: string]: any;
   *     // 或者 [key: number]: any;
   * }
   *
   */
  // let a=new Object();
  // let b= Window[a];// Type Object cannot be used as an index type.
//   function Bank(this: { name: string }, name: string) {
//     this.name = name;
//   }
//
//   let bank = new Bank("中国工商银行")
// //如果没有as any则会出现编译错误 TS2538: Type Object cannot be used as an index type.
//   bank[new Object() as any] = "中国工商银行";

  const {
    VITE_GLOB_APP_TITLE,
    VITE_GLOB_API_URL,
    VITE_USE_MOCK,
    VITE_GLOB_APP_SHORT_NAME,
    VITE_GLOB_API_URL_PREFIX,
    VITE_GLOB_APP_OPEN_SSO,
    VITE_GLOB_APP_OPEN_QIANKUN,
    VITE_GLOB_APP_CAS_BASE_URL,
    VITE_GLOB_DOMAIN_URL,
    VITE_GLOB_ONLINE_VIEW_URL,
  } = ENV;

  if (!/^[a-zA-Z\_]*$/.test(VITE_GLOB_APP_SHORT_NAME)) {
    // warn(
    //   `VITE_GLOB_APP_SHORT_NAME Variables can only be characters/underscores, please modify in the environment variables and re-running.`
    // );
  }

  return {
    VITE_GLOB_APP_TITLE,
    VITE_GLOB_API_URL,
    VITE_USE_MOCK,
    VITE_GLOB_APP_SHORT_NAME,
    VITE_GLOB_API_URL_PREFIX,
    VITE_GLOB_APP_OPEN_SSO,
    VITE_GLOB_APP_OPEN_QIANKUN,
    VITE_GLOB_APP_CAS_BASE_URL,
    VITE_GLOB_DOMAIN_URL,
    VITE_GLOB_ONLINE_VIEW_URL,
  };
}

/**
 * @description: Development mode
 */
export const devMode = 'development';

/**
 * @description: Production mode
 */
export const prodMode = 'production';

/**
 * @description: Get environment variables
 * @returns:
 * @example:
 */
export function getEnv(): string {
  return import.meta.env.MODE;
}

/**
 * @description: Is it a development mode
 * @returns:
 * @example:
 */
export function isDevMode(): boolean {
  return import.meta.env.DEV;
}

/**
 * @description: Is it a production mode
 * @returns:
 * @example:
 */
export function isProdMode(): boolean {
  return import.meta.env.PROD;
}
