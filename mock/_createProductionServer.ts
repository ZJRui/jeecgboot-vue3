import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer';

/**
 * 加载当前路径及子路径下的所有ts文件，然后将他们的默认导出MockMethod[]合并到一起
 */
const modules = import.meta.glob('./**/*.ts', { eager: true });

const mockModules: any[] = [];

Object.keys(modules).forEach((key) => {
  /**
   * 以/_开头的文件不会被认为是mockMethod的配置文件
   */
  if (key.includes('/_')) {
    return;
  }
  mockModules.push(...(modules as Recordable)[key].default);
});

/**
 * Used in a production environment. Need to manually import all modules
 */
export function setupProdMockServer() {
  createProdMockServer(mockModules);
}
