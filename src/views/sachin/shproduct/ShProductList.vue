<template>
  <div>this is ShProductList.vuew
    <div>
      <SvgIcon name="test" />
      <StepBackwardOutlined />
    </div>
    <basic-table @register="registerTable"></basic-table>
  </div>
</template>
<script setup lang="ts">
import {onMounted, onDeactivated, onActivated, onBeforeUpdate, onUpdated,onUnmounted} from 'vue';
import {getProductList} from '@/api/sachin/shproduct';

import {doSomethingBetter} from '@/views/sachin/shproduct/bar';

import BasicTable from "@/components/Table/src/BasicTable.vue";
import {BasicColumn, useTable} from "@/components/Table";
import {useRoute} from "vue-router";
import {PersonInterface} from "#/sh-demo";
import { SvgIcon } from '/@/components/Icon';
import {StepBackwardOutlined} from "@ant-design/icons-vue";

defineOptions({
  //设置组件的名称，匹配路由名称，以便缓存改组件
  name:"innerRouteA"
})

const route = useRoute();
console.log("useRoute", route)

let p: Record<string, any>;
let s: Record<string, number>;
const columns: BasicColumn[] = [
  {
    title: '名称',
    dataIndex: 'name',
    // auth: 'test', // 根据权限控制是否显示: 无权限，不显示
  },
  {
    title: '价格',
    dataIndex: 'price',
    // auth: 'super', // 同时根据权限控制是否显示
    ifShow: (_column) => {
      return true; // 根据业务控制是否显示
    },
  },
];

const useTableRet = useTable({

  title: '商品表格',
  columns: columns,
  api: getProductList,
  beforeFetch: (params) => {
    console.log("params", params)
    //设置参数
    params.id = 124;
    params.name = '手机'
    return;
  }
})
console.log("useTableRet", useTableRet)
//数组的解构： 完全是按照位置来的，对象的解构是按照属性名称
//。数组的元素是按次序排列的，变量的取值是由它的位置决定的：而对象的属性没有次序，变量必须与属性同名才能取到正确的值。
const [registerTable] = useTableRet;

onMounted(async () => {
  //发送请求
  const res = await getProductList({});
  console.log('prouct list res', res);
  console.log("ShProductList.vue onMounted")

});
onActivated(async () => {
  console.log("ShProductList.vue onActivated")
});
onDeactivated(async () => {
  console.log("ShProductList.vue onDeactivated")
});

onUpdated(async () => {
  console.log("ShProductList.vue onUpdated")
});
onUnmounted(async () => {
  console.log("ShProductList.vue onUnmounted")
});

// console.log("访问process.env.NODE_ENV属性",process.env.NODE_ENV)//yes
// console.log("访问process.env的属性",process.env)
// console.log("访问process属性",process)
//直接访问window.Sachin_Demo_Test会报红提示window没有这个属性，可以在declare global中声明
console.log("访问window的属性", window.Sachin_Demo_Test)
// console.log("访问import.meta配置的属性",import.meta.Sachin_Demo_Test)
// console.log("访问process置的属性",process.env.Sachin_Demo_Test)


let testA:PersonInterface={
  funA:(name, age)=>{
    return {
      name:name,
      age:age
    }
  },

}

</script>

<style scoped lang="less"></style>
