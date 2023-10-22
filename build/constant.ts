/**
 * The name of the configuration file entered in the production environment
 *
 * 1.当执行yarn build构建项目之后，会自动生成 _app.config.js 文件并插入 index.html。
 * 2.以 VITE_GLOB_* 开头的的变量，在打包的时候，会被加入_app.config.js配置文件当中.
 * 3._app.config.js 用于项目在打包后，需要动态修改配置的需求，如接口地址。不用重新进行打包，可在打包后修
 * 改 /dist/_app.config.js 内的变量，刷新即可更新代码内的局部变量。
 */
export const GLOB_CONFIG_FILE_NAME = '_app.config.js';

export const OUTPUT_DIR = 'dist';
