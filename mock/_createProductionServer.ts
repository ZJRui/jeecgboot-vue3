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
 *
 * 本项目使用 vite-plugin-mock 来进行 mock 数据处理。项目内 mock 服务分本地和线上。
 *
 * #本地 Mock
 * 本地 mock 采用 Node.js 中间件进行参数拦截（不采用 mock.js 的原因是本地开发看不到请求参数和响应结果）。
 *
 * 线上 mock
 * 由于该项目是一个展示类项目，线上也是用 mock 数据，所以在打包后同时也集成了 mock。通常项目线上一般为正式接口。
 * 项目线上 mock 采用的是 mockjs 进行 mock 数据模拟。
 *
 * 关于mockjs: mockjs只是拦截地址，直接返回mock数据，并不会发送真实请求，所以你看
 * 不见network的请求 E:\临时文件\1029\前后端真正分离，网线被拔，也能请求数据（mock.js） - 掘金.pdf
 */
export function setupProdMockServer() {
  createProdMockServer(mockModules);
}
