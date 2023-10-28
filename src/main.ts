import 'uno.css';
import '/@/design/index.less';
// 注册图标
import 'virtual:svg-icons-register';
import App from './App.vue';
import { createApp } from 'vue';
import { initAppConfigStore } from '/@/logics/initAppConfig';
import { setupErrorHandle } from '/@/logics/error-handle';
import { router, setupRouter } from '/@/router';
import { setupRouterGuard } from '/@/router/guard';
import { setupStore } from '/@/store';
import { setupGlobDirectives } from '/@/directives';
import { setupI18n } from '/@/locales/setupI18n';
import { registerGlobComp } from '/@/components/registerGlobComp';
import { registerThirdComp } from '/@/settings/registerThirdComp';
import { useSso } from '/@/hooks/web/useSso';
// 注册online模块lib
import { registerPackages } from '/@/utils/monorepo/registerPackages';


/**
 * Vite在一个特殊的import.meta.env对象上暴露环境变量，这里有一些在所有情况下都可以使用的内建变量
 * 1.import.meta.env.MODE: 当前构建模式
 * 2.import.meta.env.BASE_URL: {string}  部署应用时的基本  URL。他由  配置项 决定。  i mport.meta.env.BASE_URL  base
 * 3.import.meta.env.PROD: {boolean}  当前是否为生产模式 import.meta.env.DEV: {boolean}
 * 当前是否为开发模式 import.meta.env.SSR:{boolean}  应用是否运行在  server  上。
 *
 * 2. Vite使用dotEnv来管理环境变量，加载.env文件，为了防止意外地将一些环境变量泄漏到客户端，只有以VITE为前缀的变量才会暴露给经过Vite处理的代码。
 *
 */
// 在本地开发中引入的,以提高浏览器响应速度
if (import.meta.env.DEV) {
  /**
   * 1. import的返回值是Promise，promise的最终值是Module对象
   *   console.log(import('./app.vue').then((res) => console.log(res)));
   *  输出： Module{Symbol(Symbol.toStringTag): 'Module'}
   *2. question:import导入vue组件的时候 路径是 @/component/xx.vue，这里的这个路径是如何解析的？
   *  node_modules/.pnpm/ant-design-vue@3.2.20_vue@3.3.4/node_modules/ant-design-vue/dist/antd.less
   *
   * JavaScript 引擎并不直接负责查找 node_modules 目录中的模块。实际上，模块的查找和加载是由 Node.js（在后端）或构建工具（在前端，例如 Webpack、Rollup、Vite 等）来处理的，这些工具提供了模块解析的功能。
   *
   * 在 Node.js 环境中，模块的查找遵循 CommonJS 规范，它会从当前模块的目录开始，逐级向上查找 node_modules 目录，直到找到指定的模块或者根目录。Node.js 提供了一种叫做模块解析器（Module Resolver）的机制，负责解析模块的路径和加载模块的内容。这个解析过程允许开发者使用简短的模块名来引入模块，而不用担心模块的具体物理路径。
   *
   * 在前端开发中，构建工具（例如 Webpack、Rollup、Vite 等）同样负责模块的解析和加载。它们会根据配置文件中的规则，包括 node_modules 的位置，来查找并加载模块。在这些工具中，你可以配置模块的解析方式，包括查找路径、别名等，以便自定义模块的引入方式。
   *
   * 因此，JavaScript 引擎并不直接负责查找 node_modules 目录中的模块，而是依赖于运行环境或构建工具来处理模块的解析和加载。
   */
  import('ant-design-vue/dist/antd.less');
}

async function bootstrap() {
  // 创建应用实例
  const app = createApp(App);

  // 多语言配置,异步情况:语言文件可以从服务器端获得
  await setupI18n(app);

  // 配置存储
  setupStore(app);

  // 初始化内部系统配置
  initAppConfigStore();

  // 注册外部模块路由(注册online模块lib)
  registerPackages(app);

  // 注册全局组件
  registerGlobComp(app);

  //CAS单点登录
  await useSso().ssoLogin();

  // 配置路由
  setupRouter(app);

  /**
   * 路由保护
   * setupRouterGuard--》createPermissionGuard--》router.beforeEach(()=>{
   *    await permissionStore.buildRoutesAction();//根据权限动态构建路由
   * })
   */
  setupRouterGuard(router);

  // 注册全局指令
  setupGlobDirectives(app);

  // 配置全局错误处理
  setupErrorHandle(app);

  // 注册第三方组件
  await registerThirdComp(app);

  // 当路由准备好时再执行挂载( https://next.router.vuejs.org/api/#isready)
  await router.isReady();

  // 挂载应用
  app.mount('#app', true);
}

bootstrap();


