<template>
  <div>
    <p>this is ShBasicTable.vue</p>
    <p> $slots:{{ $slots }}</p>
    <p>Object.keys($slots) :{{ Object.keys($slots) }}</p>
    <!--v-bind绑定一个对象，将对象的属性绑定到组件的props上--->
    <a-table v-bind="$props">
      <template v-for="item in Object.keys($slots)" :key="item" #[item]="data">
        <slot :name="item" v-bind="data || {}"></slot>
      </template>
      <!--
      上面的这段代码是什么意思呢？
      首先a-table这个antd组件中定义了几个命名插槽 headerCell ,bodyCell
      a-table.vue
      <template>
         <div>
           <slot name='headerCell'  v-bind:user="user,user是e-table的响应式属性"></slot>
            <slot name='bodyCell'></slot>
         </div>
      </template>


      所以我们可以在 <a-table>的标签中使用这些插槽，比如
      <a-table>
         <template  #headerCell>
           <div>这是headerCell插槽</div>
         </template>
          <template  #bodyCell>
            <div>这是bodyCell插槽</div>
           </template>
      </a-table>

      因为#headerCell的 <slot>中  v-bind:user="user“，将a-table的user属性作为 <slot> 元素的一个 user attribute绑定上去:
      这样我们可以在 <a-table>所在的父级元素中的插槽中使用这个user属性，比如
       <template  #headerCell=”slotProps">
           <div>这是headerCell插槽-------${{slotProps.user}}</div>
        </template>

        但是在当前的ShBasicTable组件中<template>标签内又是一个<slot>，这也就是说ShBasicTable组件中也定义了同样的插槽。
        所以在使用<ShBasicTable>标签的时候，可以在该标签内部 定义具体的插槽内容。 这些内容会被传递给ShBasicTable组件中的<slot>标签。
        继而又传递到a-table组件中的<slot>标签中。
      -->
    </a-table>
  </div>
</template>
<script setup lang="ts">
  import { useSlots } from 'vue';
  import { tableProps } from 'ant-design-vue/es/table';

  console.log('useSlots', useSlots());
  const tablePropperties = tableProps();
  /**
   * 定义ShBasicTable具有的props，这些props会被传递给a-table组件。
   * 还有一种更为快捷的方式： 使用tableProps方法获取a-table的所有的props的定义，将这些定义扩展到当前的ShBasicTable组件上。
   *
   */
  const props = defineProps(['columns', 'dataSource', 'loading']);
  // const props=defineProps({...tableProps()});
  console.log('tablePropperties', tablePropperties);
</script>

<style scoped lang="less"></style>
