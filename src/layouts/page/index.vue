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

  7.为什么嵌套路由要转为二级路由？
     当permissionMode=ROUTE_MAPPING的时候，会加载项目的routes/module下配置的路由信息，每个ts文件中可以配置嵌套路由，子路由有自己的name名称，
     子路由通过component属性指定对应的组件。 当访问到这个路由的时候， 假设当前为/pageA,toRoute=/pageB,在进入pageB之前会将pageB的路由信息保存到Set中。
     当pageB离开的时候，会通过getCache返回的要缓存的组件信息来决定 要不要销毁pageB对应的组件。route_mapping模式下，getCache会返回路由的name属性作为
     要缓存组件的组件名称。 因此这个时候要求路由的name属性和组件的name属性必须一致。

     当使用后台back模式的时候，路由信息全部来自 后端接口返回的菜单信息，我们需要在菜单管理中配置 访问url， 前端组件（vue文件路径），不会使用routes/module本地
     项目配置的路由信息。
     对于菜单配置新系生成路由信息，我们会将访问url 替换/为-作为路由的name，如果对应的组件需要被缓存，那么就要求 vue组件需要使用该路径作为name属性。
     比如：部门管理的菜单配置的url为：/system/depart，那么对应的路由的name为system-depart，对应的组
     件的name属性也要为system-depart。<script lang="ts" setup name="system-depart">或者defineOptions({name: 'system-depart'})
     接口返回的菜单信息是一个嵌套层次树形解构的， 一个菜单可以有子菜单，子菜单的访问url 可以是以/开头，也可以是不以/开头，不以/开头的情况下表示会拼接
     父菜单的url

     根据菜单构建路由，我们想用每一个菜单的完整路径url作为路由的name。菜单有了完整的访问url，一个菜单对应一个组件，从逻辑上将，每一个菜单都是一个一级路由
     在实现上还是会有一点变化就是，他们没有变成一级路由，而是都变成了二级路由。
     假设a.ts中 配置了一个路由对象，path=/a, children=[{path: 'a-1'},{path: 'a-2'}]，三个路由都变成独立的路由，path分别为/a,/a/a-1,/a/a-2
     b.ts中 配置了一个路由对象，path=/b, children=[{path: 'b-1'},{path: 'b-2'}]，三个路由都变成独立的路由，path分别为/b,/b/b-1,/b/b-2
     我们分别为a.ts和b.ts创建一个路由对象，叫做他们的父路由对象， 而a.ts的所有路由都变成parentRoute的子路由，parentRoute的path为空，所以parent路由
     不影响子路由的路径。因此所有的路由都变成了二级路由。 每一路由都有完整的路径url，我们将path中的/替换为- 作为路由的name，

     除此之外后台模式下 配置菜单的时候菜单有一个选项控制是否针对该菜单开启缓存。 另外就是组件开启缓存后不会再次执行onMounted，所以onMounted
     中加载数据只会加载一次。

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
