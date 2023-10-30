/**
 * Mock plugin for development and production.
 * https://github.com/anncwb/vite-plugin-mock
 */
import { viteMockServe } from 'vite-plugin-mock';

/**
 * 启用mock 功能需要通过 vite-plugin-mock插件配置。
 * mockPath: './mock', // mock文件所在文件夹，该目录下的文件export的MockMethod会被自动注册,结果 mock 是和 src 平级的
 * localEnabled: !isBuild, // 本地mock是否启用  build是指npm run build 还是npm run dev
 * localEnabled: true, // 是否应用于本地
 * prodEnabled: false, // 是否应用于生产
 *
 * question: 如何才能访问到mock接口？localEnable为true的时候就会走mock接口吗？_utils.ts中export const baseUrl = '/jeecgboot/mock'; 有什么用？
 * createProxy中是创建了针对 VITE_PROXY = [["/jeecgboot","http://localhost:8080/jeecg-boot"],["/upload","http://localhost:3300/upload"]]
 * /jeectboot会被代理到http://localhost:8080/jeecg-boot，那么mock接口是如何才能被访问到？
 *
 * @param isBuild
 */
export function configMockPlugin(isBuild: boolean) {
  return viteMockServe({
    ignore: /^\_/,
    mockPath: 'mock',
    localEnabled: !isBuild,
    prodEnabled: isBuild,
    /**
     * 为什么通过插件注入代码而不是直接在 main.ts 内插入
     *
     * 在插件内通过 injectCode 插入代码，方便控制 mockjs 是否被打包到最终代码内。如果在 main.t
     * s 内判断，如果关闭了 mock 功能，mockjs 也会打包到构建文件内，这样会增加打包体积
     */
    injectCode: `
      import { setupProdMockServer } from '../mock/_createProductionServer';

      setupProdMockServer();
      `,
  });
}
