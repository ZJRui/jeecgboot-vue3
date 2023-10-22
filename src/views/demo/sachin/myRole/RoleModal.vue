<template>
  <div >
    <BasicModal @register="registerModal" :title="title" @ok="onSubmit">
      <BasicForm @register="registerForm" />
    </BasicModal>
  </div>
</template>
<script setup lang="ts">
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { BasicForm, useForm } from '@/components/Form';
  import { add, update } from './role.api';
  import { ref, computed } from 'vue';
  import { usePermission } from '@/hooks/web/usePermission';

  const { hasPermission, isDisabledAuth } = usePermission();

  const emits = defineEmits(['register', 'success']);
  const [registerForm, { validate, resetFields, setFieldsValue }] = useForm({
    schemas: [
      {
        label: '角色名称',
        field: 'roleName',
        component: 'Input',
        dynamicDisabled: () => isDisabledAuth(['MyRole:name']),
      },
      {
        label: '角色编码',
        field: 'roleCode',
        component: 'Input',
        ifShow: () => hasPermission(['MyRole:code']),
      },
      {
        label: '备注',
        field: 'description',
        component: 'InputTextArea',
      },
      {
        label: '测试自定义组件类型',
        field: 'myCompType',
        component: 'MyInput',
      },
    ],
    showActionButtonGroup: false,
  });
  let model = {};
  const [registerModal, { closeModal }] = useModalInner(async (data) => {
    alert(data);
    isUpdate.value = data.isUpdate;
    await resetFields();
    if (isUpdate.value) {
      await setFieldsValue(data.record);
      model = data.record;
    }
  });
  const isUpdate = ref<Boolean>(false);

  const title = computed<String>(() => {
    return isUpdate.value ? '编辑' : '新增';
  });

  async function onSubmit() {
    const values = await validate();

    console.log('value', values);

    if (isUpdate.value) {
      await update(Object.assign(model, values));
    } else {
      await add(values);
    }
    closeModal();
    emits('success');
  }
</script>

<style scoped lang="less"></style>
