<script lang="ts">
  import { defineComponent } from 'vue';

  import { getSlot } from '@/utils/helper/ShTsxHelper';

  export default defineComponent({
    name: 'ShAuthority',
    props: {
      value: {
        type: String,
        required: true,
        default: '',
      },
    },
    setup(props, context) {
      function hasPermission(value) {
        let permissionList = ['add', 'edit', 'delete'];
        return permissionList.includes(value);
      }
      function renderAuth() {
        const { value } = props;
        if (!value) {
          return getSlot(context.slots);
        }
        return hasPermission(value) ? getSlot(context.slots) : null;
      }
      return () => renderAuth();
    },
  });
</script>

<template></template>

<style scoped lang="less"></style>
