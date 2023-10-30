/**
 * 针对类型的导入到处语法
 */
import type { UserConfig, ConfigEnv } from 'vite';
import pkg from './package.json';
import dayjs from 'dayjs';

import { loadEnv } from 'vite';
import { resolve } from 'path';
import { generateModifyVars } from './build/generate/generateModifyVars';
import { createProxy } from './build/vite/proxy';
import { wrapperEnv } from './build/utils';
import { createVitePlugins } from './build/vite/plugin';
import { OUTPUT_DIR } from './build/constant';

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir);
}

const { dependencies, devDependencies, name, version } = pkg;
const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
};
/**
 * vite.config.js 中的配置可以是几种形式
 * 1.导出对象  export default {}
 * 2.工具函数接收对象配置
 * export default defineConfig({})
 * 3.工具函数接收函数作为参数
 * export default defineConfig(()=>{})
 * 4.导出一个函数，该函数的返回值类型是UserConfig , let a=():object=>{return {}}
 *
 * @param command
 * @param mode
 */
export default ({ command, mode }: ConfigEnv): UserConfig => {
  const root = process.cwd();

  /**
   * 在配置中使用环境变量
   * 环境变量通常可以从 process.env获得。
   * 注意Vite默认是不加载.env文件的，因为这些文件需要在执行完 Vite配置后才能确定加载哪一个，举个例子，
   * root和envDir选项会影响加载行为。不过当你的确需要时，你可以使用loadEnv函数来加载指定的.env文件。
   */
  const env = loadEnv(mode, root);

  // The boolean type read by loadEnv is a string. This function can be converted to boolean type
  const viteEnv = wrapperEnv(env);

  const { VITE_PORT, VITE_PUBLIC_PATH, VITE_PROXY } = viteEnv;

  const isBuild = command === 'build';

  return {
    base: VITE_PUBLIC_PATH,
    root,
    resolve: {
      alias: [
        {
          find: 'vue-i18n',
          replacement: 'vue-i18n/dist/vue-i18n.cjs.js',
        },
        // /@/xxxx => src/xxxx
        {
          find: /\/@\//,
          replacement: pathResolve('src') + '/',
        },
        // /#/xxxx => types/xxxx
        {
          find: /\/#\//,
          replacement: pathResolve('types') + '/',
        },
        //配置 针对 /@/和@/都做替换
        // /\/@\//  和  /@\//的区别
        // /\/@\//： 这是一个正则表达式，用来匹配字符串中的 /@/。由于斜杠 / 在正则表达式中是特殊字符，因此在正则表达式中匹配斜杠本身时，
        // 需要使用反斜杠进行转义。所以，\/ 表示匹配一个斜杠字符。此正则表达式可以匹配字符串中的 /@/，例如 /@/。
        //
        // /@\//： 这是一个正则表达式，用来匹配字符串中的 @/。在这个正则表达式中，斜杠 / 不需要转义，因为它没有特殊含义。这个正则表达式会匹配字符串中的 @/，例如 @/。
        //
        // 所以，区别在于第一个正则表达式需要转义斜杠，而第二个正则表达式中的斜杠不需要转义。根据你的需求，选择合适的正则表达式来匹配字符串
        {
          find: /@\//,
          replacement: pathResolve('src') + '/',
        },
        // /#/xxxx => types/xxxx
        {
          find: /#\//,
          replacement: pathResolve('types') + '/',
        },
      ],
    },
    server: {
      // Listening on all local IPs
      host: true,
      https: false,
      port: VITE_PORT,
      // Load proxy configuration from .env
      proxy: createProxy(VITE_PROXY),
    },
    build: {
      minify: 'esbuild',
      target: 'es2015',
      cssTarget: 'chrome80',
      outDir: OUTPUT_DIR,
      rollupOptions: {
        output: {
          chunkFileNames: 'js/[name]-[hash].js', // 引入文件名的名称
          entryFileNames: 'js/[name]-[hash].js', // 包的入口文件名称
          // manualChunks配置 (依赖包从大到小排列)
          manualChunks: {
            'tinymce-vendor': ['tinymce'],
            'echarts-vendor': ['echarts'],
            'antd-vue-vendor': ['ant-design-vue', '@ant-design/icons-vue', '@ant-design/colors'],
            'vxe-table-vendor': ['vxe-table', 'vxe-table-plugin-antd', 'xe-utils'],
            'codemirror-vendor': ['codemirror'],
            //'emoji-mart-vue-fast': ['emoji-mart-vue-fast'],
            'jeecg-online-vendor': ['@jeecg/online'],
            // 将 Lodash 库的代码单独打包
            'lodash-es-vendor': ['lodash-es'],
            'html2canvas-vendor': ['html2canvas'],
            // vue vue-router合并打包
            vue: ['vue', 'vue-router'],
            'cron-parser-vendor': ['cron-parser'],
          },
        },
      },
      // 关闭brotliSize显示可以稍微减少打包时间
      reportCompressedSize: false,
      // 提高超大静态资源警告大小
      chunkSizeWarningLimit: 2000,
    },
    esbuild: {
      //清除全局的console.log和debug
      drop: isBuild ? ['console', 'debugger'] : [],
    },
    /**
     * 1.关于define:
     */
    define: {
      // setting vue-i18-next
      // Suppress warning
      __INTLIFY_PROD_DEVTOOLS__: false,
      /**
       * question: 这里的__app_info 和global.d.ts中的__APP_INFO__有什么区别？
       * 我们想要做的目的是 用vite声明一个全局变量。这个全局变量就是这里的__APP__INFO__对象。
       * 首先__APP_INFO__这个对象是vite 这个NodeJS进程创建的对象。
       * 在这里我们通过vite的配置对象的define属性来 声明全局变量， 这个全局变量的名称就是下面的key __APP__INFO
       * 这个全局变量的值就是JSON.stringify(__APP_INFO__)
       * 声明了全局变量之后如何使用这个全局变量呢？ 这涉及define的工作原理，这里的变量会被挂载到全局对象window上。
       * 所以我们可以直接用window.__APP_INFO__来访问
       *
       * 但是在ts中 window并没有__app__INfo__属性，所以直接书写window.__APP_INFO__会报红，那么我们可以在declare global中声明全局会存在一个
       * __APP__INFO_变量。
       *
       *
       */
      __APP_INFO__: JSON.stringify(__APP_INFO__),
      /**
       *1.自定义个测试变量,如何访问呢？全局对象 windows.Sachin_demo_test
       * E:\programme\Vite\博文\第四十章-Vite配置-define - Fidel Yiu I 前端技术博客.pdf
       *
       * 2.直接访问window.Sachin_Demo_Test会报红提示window没有这个属性，可以在declare global中声明.
       * 又或者你直接在declare global中声明一个全局 变量Sachin_Demo_Test，然后项目中就可以直接使用了，这样项目ts会认为存在全局变量。
       * 实际上在window对象上确实存在Sachin_Demo_Test属性。两种方式的区别一个声明在window上有属性，一个声明是在全局有属性
       */
      Sachin_Demo_Test: JSON.stringify('Sachin_Demo_Test'),
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: generateModifyVars(),
          javascriptEnabled: true,
        },
      },
    },

    // The vite plugin used by the project. The quantity is large, so it is separately extracted and managed
    plugins: createVitePlugins(viteEnv, isBuild),
    // 预加载构建配置（首屏性能)
    optimizeDeps: {
      esbuildOptions: {
        target: 'es2020',
      },
      exclude: [
        //升级vite4后，需要排除online依赖
        '@jeecg/online',
      ],
      // 提前预加载依赖，缩短首屏访问时间
      include: [
        '@vue/runtime-core',
        '@vue/shared',
        '@iconify/iconify',
        'ant-design-vue/es/locale/zh_CN',
        'ant-design-vue/es/locale/en_US',
        '@ant-design/colors',
        '@ant-design/icons-vue',
        '@vueuse/core',
        '@vueuse/shared',
        '@zxcvbn-ts/core',
        'ant-design-vue',
        'axios',
        'china-area-data',
        'clipboard',
        'codemirror',
        'codemirror/addon/fold/brace-fold.js',
        'codemirror/addon/fold/comment-fold.js',
        'codemirror/addon/fold/foldcode.js',
        'codemirror/addon/fold/foldgutter.js',
        'codemirror/addon/fold/indent-fold.js',
        'codemirror/addon/hint/anyword-hint.js',
        'codemirror/addon/hint/show-hint.js',
        'codemirror/addon/selection/active-line.js',
        'codemirror/mode/clike/clike.js',
        'codemirror/mode/css/css.js',
        'codemirror/mode/javascript/javascript.js',
        'codemirror/mode/markdown/markdown.js',
        'codemirror/mode/python/python.js',
        'codemirror/mode/r/r.js',
        'codemirror/mode/shell/shell.js',
        'codemirror/mode/sql/sql.js',
        'codemirror/mode/swift/swift.js',
        'codemirror/mode/vue/vue.js',
        'codemirror/mode/xml/xml.js',
        'cron-parser',
        'cropperjs',
        'crypto-js/aes',
        'crypto-js/enc-base64',
        'crypto-js/enc-utf8',
        'crypto-js/md5',
        'crypto-js/mode-ecb',
        'crypto-js/pad-pkcs7',
        'dom-align',
        'echarts',
        'echarts/charts',
        'echarts/components',
        'echarts/core',
        'echarts/renderers',
        'emoji-mart-vue-fast/src',
        'intro.js',
        'lodash-es',
        'md5',
        'nprogress',
        'path-to-regexp',
        'pinia',
        'print-js',
        'qrcode',
        'qs',
        'resize-observer-polyfill',
        'showdown',
        'sortablejs',
        'tinymce/icons/default/icons',
        'tinymce/plugins/advlist',
        'tinymce/plugins/anchor',
        'tinymce/plugins/autolink',
        'tinymce/plugins/autosave',
        'tinymce/plugins/code',
        'tinymce/plugins/codesample',
        'tinymce/plugins/contextmenu',
        'tinymce/plugins/directionality',
        'tinymce/plugins/fullscreen',
        'tinymce/plugins/hr',
        'tinymce/plugins/image',
        'tinymce/plugins/insertdatetime',
        'tinymce/plugins/link',
        'tinymce/plugins/lists',
        'tinymce/plugins/media',
        'tinymce/plugins/nonbreaking',
        'tinymce/plugins/noneditable',
        'tinymce/plugins/pagebreak',
        'tinymce/plugins/paste',
        'tinymce/plugins/preview',
        'tinymce/plugins/print',
        'tinymce/plugins/save',
        'tinymce/plugins/searchreplace',
        'tinymce/plugins/spellchecker',
        'tinymce/plugins/tabfocus',
        'tinymce/plugins/table',
        'tinymce/plugins/template',
        'tinymce/plugins/textcolor',
        'tinymce/plugins/textpattern',
        'tinymce/plugins/visualblocks',
        'tinymce/plugins/visualchars',
        'tinymce/plugins/wordcount',
        'tinymce/themes/silver',
        'tinymce/tinymce',
        'vditor',
        'vue',
        'vue-i18n',
        'vue-print-nb-jeecg/src/printarea',
        'vue-router',
        'vue-types',
        'vxe-table',
        'vxe-table-plugin-antd',
        'xe-utils',
        'xss',
      ],
    },
  };
};

  function viteConfigFn(){
    /**
     * 开发服务器控制台输出 // process.node_env development
     * vite本身是一个NodeJs进程，启动的命令是 vite --config vite.config.js,因此可以使用NodeJs的process对象
     */
    console.log("process.node_env",process.env.NODE_ENV)
    /**
     * 错误写法 vite.config.js中无法使用import.meta.env
     * E:\programme\Vite\博文\为什么vite.config.js中无法使用import.meta.env的环境变量 .pdf
     * "import.meta" is not available with the "cjs" output format and will be empty [empty-import-meta]
     */
    // console.log("import.meta.env.mode",import.meta.env.mode)
  }

  viteConfigFn();