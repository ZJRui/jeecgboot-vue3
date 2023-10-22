<template>
  <div class="p-2" v-my-color="'abc'">
    <BasicTable @register="registerTable">
      <template #tableTitle>
        <a-button type="primary" preIcon="an-design:plus" @click="onAddClick">新增</a-button>
      </template>
      <template #action="{ record }">
        <TableAction :actions="getTableActions(record)" />
      </template>
    </BasicTable>
    <RoleModal @register="registerModal" @success="onSuccess" />
  </div>
</template>
<script setup lang="ts">
  import { BasicTable, TableAction } from '@/components/Table';
  import { useListPage } from '@/hooks/system/useListPage';
  import RoleModal from '@/views/demo/sachin/myRole/RoleModal.vue';
  import { useModal } from '@/components/Modal';
  import type { ActionItem } from '@/components/Table';
  import { list } from './role.api';


  const { tableContext } = useListPage({
    tableProps: {
      // api: () => {
      //   return new Promise<any>((resolve, reject) => {
      //     resolve([
      //       {
      //         roleName: '管理员',
      //         roleCode: 'admin',
      //       },
      //       {
      //         roleName: '普通用户',
      //         roleCode: 'commonUser',
      //       },
      //     ]);
      //   });
      // },
      api: list,
      columns: [
        {
          title: '角色名',
          dataIndex: 'roleName',
        },
        {
          title: '角色编码',
          dataIndex: 'roleCode',
        },
      ],
    },
  });

  const [registerTable, { reload }] = tableContext;
  const [registerModal, { openModal }] = useModal();
  function onAddClick() {
    openModal(true, { isUpdate: false });
  }

  function onEditClick(record) {
    openModal(true, { isUpdate: true, record: record });
  }

  function onSuccess() {
    reload();
  }
  function getTableActions(record): ActionItem[] {
    return [
      {
        label: '编辑',
        onClick() {
          console.log('record', record);
          onEditClick(record);
        },
      },
    ];
  }
</script>

<style scoped lang="less"></style>
