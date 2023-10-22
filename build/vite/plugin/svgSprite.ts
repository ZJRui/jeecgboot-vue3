/**
 *  Vite Plugin for fast creating SVG sprites.
 * https://github.com/anncwb/vite-plugin-svg-icons
 */

import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import path from 'path';

/**
 * 1.通过 vite-plugin-svg-icons 插件封装SvgIcon组件
 *
 * @param isBuild
 */
export function configSvgIconsPlugin(isBuild: boolean) {
  const svgIconsPlugin = createSvgIconsPlugin({
    iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
    svgoOptions: isBuild,
    // default
    symbolId: 'icon-[dir]-[name]',
  });
  return svgIconsPlugin;
}
