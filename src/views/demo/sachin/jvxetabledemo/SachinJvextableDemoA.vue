<template>
  <div>
    <JVxeTable ref="testDemoJVxeTable" :columns="columns" :data-source="dataSource" toolbar rowNumber rowExpand clickSelectRow />
    <a-button @click="onDelSel"> 删除选中数据</a-button>
    <a-button @click="doTableValidate">手动触发table校验规则</a-button>
  </div>
</template>

<script lang="ts" setup>
  import { onActivated, onBeforeMount, onDeactivated, onMounted, onUnmounted, ref } from 'vue';
  import { JVxeTypes, JVxeColumn, JVxeTableInstance } from '@/components/jeecg/JVxeTable/types';

  defineOptions({
    name: 'DemoTestSachinJvextableDemoAxxxx',
  });

  const tableRef = ref<JVxeTableInstance>();
  const testDemoJVxeTable = ref();
  const dataSource = ref<any[]>([]);

  const columns = ref<JVxeColumn[]>([
    {
      title: 'ID',
      key: 'id',
      type: JVxeTypes.hidden,
    },
    {
      title: '不可编辑',
      key: 'noEdit',
      type: JVxeTypes.normal,
      widht: 180,
      defaultValue: 'noEdit-new',
    },
    {
      title: '单行文本',
      key: 'input',
      type: JVxeTypes.input,
      width: 100,
      defaultValue: '',
      placeholder: '请输入${title}',
      validateRules: [
        {
          required: true,
          message: '请输入${title}',
        },
        {
          pattern: /^[a-z|A-Z][a-z|A-Z\d_-]*$/, // 正则
          message: '必须以字母开头，可包含数字、下划线、横杠',
        },
        {
          handler({ cellValue, row, column }, callback, target) {
            if (cellValue === 'abc') {
              callback(false, '${title}不能是abc');
            } else {
              callback(true);
            }
          },
          message: '${title}默认提示',
        },
      ],
    },
  ]);



  function onDelSel() {
    const xTable = tableRef.value!.getXTable();
    console.log('xTable', xTable);
  }

  async function doTableValidate() {
    const jvexTable = testDemoJVxeTable.value;
    const res = await jvexTable.validateTable();
    if (res === null) {
      var tableData = jvexTable.getTableData();
      console.log('校验通过,tableData', tableData);
    } else {
      console.log('校验失败', res);
    }
  }

  console.log('SachinJvextableDemoA Setup');
  onMounted(() => {
    console.log('SachinJvextableDemoA onMounted,组件this:', this);
  });
  onBeforeMount(() => {
    console.log('SachinJvextableDemoA onBeforeMount');
  });
  onUnmounted(() => {
    console.log('SachinJvextableDemoA onUnmounted');
  });
  onActivated(() => {
    console.log('组件实例是keepalived缓存树的一部分，当组件被插入到dom中时被调用,SachinJvextableDemoA activated');
  });
  onDeactivated(() => {
    console.log('组件实例是keepalived缓存树的一部分，当组件从dom中移除时被调用，SachinJvextableDemoA deactivated');
  });
</script>
