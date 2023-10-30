/**
 * 生成外部配置文件，用于生产发布后配置，无需重新打包
 */
import { GLOB_CONFIG_FILE_NAME, OUTPUT_DIR } from '../constant';
import fs, { writeFileSync } from 'fs-extra';
import colors from 'picocolors';

import { getEnvConfig, getRootPath } from '../utils';
import { getConfigFileName } from '../getConfigFileName';

import pkg from '../../package.json';

interface CreateConfigParams {
  configName: string;
  config: any;
  configFileName?: string;
}

function createConfig(params: CreateConfigParams) {
  const { configName, config, configFileName } = params;
  try {
    const windowConf = `window.${configName}`;
    // Ensure that the variable will not be modified
    let configStr = `${windowConf}=${JSON.stringify(config)};`;
    configStr += `
      Object.freeze(${windowConf});
      Object.defineProperty(window, "${configName}", {
        configurable: false,
        writable: false,
      });
    `.replace(/\s/g, '');

    fs.mkdirp(getRootPath(OUTPUT_DIR));
    writeFileSync(getRootPath(`${OUTPUT_DIR}/${configFileName}`), configStr);

    console.log(colors.cyan(`✨ [${pkg.name}]`) + ` - configuration file is build successfully:`);
    console.log(colors.gray(OUTPUT_DIR + '/' + colors.green(configFileName)) + '\n');
  } catch (error) {
    console.log(colors.red('configuration file configuration file failed to package:\n' + error));
  }
}

export function runBuildConfig() {
  const config = getEnvConfig();
  /**
   * configFileName不是配置文件的名称，而是window对象的属性名称。
   * configFileName= __PRODUCTION__JEECGBOOTADMIN__CONF__
   * GLOB_CONFIG_FILE_NAME=_app.config.js
   * 这里主要是生成_app.config.js文件，该文件的内容如下：
   * #window.__PRODUCTION__VUE_VBEN_ADMIN__CONF__ = {
   * #  VITE_GLOB_APP_TITLE: 'vben admin',
   * #  VITE_GLOB_APP_SHORT_NAME: 'vue_vben_admin',
   * #  VITE_GLOB_API_URL: '/app',
   * #  VITE_GLOB_API_URL_PREFIX: '/',
   * #  VITE_GLOB_UPLOAD_URL: '/upload',
   * #};
   *
   */
  const configFileName = getConfigFileName(config);
  createConfig({ config, configName: configFileName, configFileName: GLOB_CONFIG_FILE_NAME });
}
