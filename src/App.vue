<template>
  <ConfigProvider :locale="getAntdLocale">
    <AppProvider>
      <!--
      1.这里的routerview大部分情况下都会路由到Layout组件    export const LAYOUT = () => import('/@/layouts/default/index.vue');
        组件名称name=DefaultLayout。 在DefaultLayout中引入 <LayoutHeader  />、<LayoutSideBar> <LayoutContent />--》
         在LayoutContent中引入 <PageLayout />
         PageLayout中引入RouterView，该routerView控制 页面中心区域的显示内容。
      -->
      <RouterView />
    </AppProvider>
  </ConfigProvider>
</template>

<script lang="ts" setup>
  import { ConfigProvider } from 'ant-design-vue';
  import { AppProvider } from '/@/components/Application';
  import { useTitle } from '/@/hooks/web/useTitle';
  import { useLocale } from '/@/locales/useLocale';

  // 解决日期时间国际化问题
  import 'dayjs/locale/zh-cn';
  import LayoutContent from "@/layouts/default/content/index.vue";
  import PageLayout from "@/layouts/page/index.vue";
  import LayoutHeader from "@/layouts/default/header/index.vue";
  import LayoutSideBar from "@/layouts/default/sider/index.vue";
  // support Multi-language
  const { getAntdLocale } = useLocale();

  useTitle();
</script>
<style lang="less">
// update-begin--author:liaozhiyang---date:20230803---for：【QQYUN-5839】windi会影响到html2canvas绘制的图片样式
img{display:inline-block;}
// update-end--author:liaozhiyang---date:20230803---for：【QQYUN-5839】windi会影响到html2canvas绘制的图片样式
</style>
