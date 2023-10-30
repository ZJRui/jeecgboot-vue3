/**
 * Get the configuration file variable name
 * @param env
 */
export const getConfigFileName = (env: Record<string, any>) => {
  /**
   * env.vite_glob_app_short_name = JeecgBootAdmin (在.env文件中配置)
   * __production__jeecgbootadmin__conf__//__PRODUCTION__JEECGBOOTADMIN__CONF__
   */
  return `__PRODUCTION__${env.VITE_GLOB_APP_SHORT_NAME || '__APP'}__CONF__`.toUpperCase().replace(/\s/g, '');
};
