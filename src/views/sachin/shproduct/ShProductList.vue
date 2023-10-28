<template>
  <div>this is ShProductList.vuew

    <basic-table @register="registerTable"></basic-table>
  </div>
</template>
<script setup lang="ts">
import {onMounted} from 'vue';
import {getProductList} from '@/api/sachin/shproduct';

import {doSomethingBetter} from '@/views/sachin/shproduct/bar';
import BasicTable from "@/components/Table/src/BasicTable.vue";
import {BasicColumn, useTable} from "@/components/Table";

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
  api:getProductList,
  beforeFetch: (params) => {
    console.log("params", params)
    //设置参数
    params.id = 124;
    params.name = '手机'
    return;
  }
})
console.log("useTableRet",useTableRet)
//数组的解构： 完全是按照位置来的，对象的解构是按照属性名称
//。数组的元素是按次序排列的，变量的取值是由它的位置决定的：而对象的属性没有次序，变量必须与属性同名才能取到正确的值。
const [registerTable]=useTableRet;

onMounted(async () => {
  //发送请求
  const res = await getProductList({});
  console.log('prouct list res', res);
});


</script>

<style scoped lang="less"></style>
