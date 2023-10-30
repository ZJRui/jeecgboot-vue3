<template>
  <RouterView>

    <!--
    1.子组件内部使用 <slot>标签定义插槽 :<slot name=“hh”></slot>
    2.父组件使用<Left>子组件，用<template>标签包裹需要放到插槽的内容，并且用 v-slot的参数指定放置哪个插槽，可以简写为#：
    v-slot是一个指令， 指令有参数和值。
    <template v-slot:header="slotProps"></template>
    3.父组件使用子组件不一定传插槽内容，子组件可以在<slot name=“hh”>这里面写内容</slot>
    内容会默认展示，如果父组件传内容，就展示父组件的内容

    4. routerview组件内部有一个插槽 ，下面的代码是 直接在组件上使用v-slot指令，指定插槽的名字为default，
    组件内部的代码就是插槽的内容。
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component"></component>
      </transition>
    </router-view>

    上面的写法等价于
    <router-view>
      <template v-slot:default="{Component }">
         <component :is="Component"></component>
      <template>
    </router-view>
    两者的区别是 前者 将插槽的内容在组件的标签中定义，后者是插槽的内容在template标签中定义

    在上面，我们是想 解构出 router-view组件的 <slot name="default">这个插槽传递的属性，所以用v-slot="{ Component }"，
    如果不解构属性，更为简写的方式是：
    <SonComponent>
      <p>xxx </p>
    </SonComponent>
    子组件标签中的内容会被替换到 组件内部的默认插槽中。
    E:\programme\vue-router\博文\vue3 router-view v-slot-掘金.pdf
   5.动画效果  https://www.wubin.work/blog/articles/16

   6.keep-alive 生效的前提是：需要将路由的 name 属性及对应的页面组件的 name 设置成一样。因为： include - 字符串或正则表达式，只有名称匹配的组件会被缓存

     vueDoc:如果使用了keep-alive缓存状态的组件，则此组件必须有name这个属性,并且该属性的值还必须与<keep-alive></keep-alive>标签
     中include属性的值完全一致，包括大小写格式。
     因为vue文档要求include属性为 需要被缓存的组件的名称。而我们的项目在计算include数组的时候 使用的是路由的name作为include数组的值。
     因此我们要求路由的name属性和组件的name属性必须一致。
    -->
    <template #default="{ Component, route }">
      <!--      <transition-->
      <!--        :name="-->
      <!--          getTransitionName({-->
      <!--            route,-->
      <!--            openCache,-->
      <!--            enableTransition: getEnableTransition,-->
      <!--            cacheTabs: getCaches,-->
      <!--            def: getBasicTransition,-->
      <!--          })-->
      <!--        "-->
      <!--        mode="out-in"-->
      <!--        appear-->
      <!--      >-->
      <keep-alive v-if="openCache" :include="getCaches">
        <component :is="Component" :key="route.fullPath" />
      </keep-alive>
      <component v-else :is="Component" :key="route.fullPath" />
      <!--      </transition>-->
    </template>
  </RouterView>
  <FrameLayout v-if="getCanEmbedIFramePage" />
</template>

<script lang="ts">
  import { computed, defineComponent, unref } from 'vue';

  import FrameLayout from '/@/layouts/iframe/index.vue';

  import { useRootSetting } from '/@/hooks/setting/useRootSetting';

  import { useTransitionSetting } from '/@/hooks/setting/useTransitionSetting';
  import { useMultipleTabSetting } from '/@/hooks/setting/useMultipleTabSetting';
  import { getTransitionName } from './transition';

  import { useMultipleTabStore } from '/@/store/modules/multipleTab';

  export default defineComponent({
    name: 'PageLayout',
    components: { FrameLayout },
    setup() {
      const { getShowMultipleTab } = useMultipleTabSetting();
      const tabStore = useMultipleTabStore();

      const { getOpenKeepAlive, getCanEmbedIFramePage } = useRootSetting();

      const { getBasicTransition, getEnableTransition } = useTransitionSetting();

      const openCache = computed(() => unref(getOpenKeepAlive) && unref(getShowMultipleTab));

      /**
       * getCaches是依赖于 tabStore的一个计算属性。
       */
      const getCaches = computed((): string[] => {
        if (!unref(getOpenKeepAlive)) {
          return [];
        }
        return tabStore.getCachedTabList;
      });

      return {
        getTransitionName,
        openCache,
        getEnableTransition,
        getBasicTransition,
        getCaches,
        getCanEmbedIFramePage,
      };
    },
  });
</script>
