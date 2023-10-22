<template>
  <div style="margin-left: 20px">
    <div>这里是MyInput.vue Form组件类型</div>
    <input type="text" :value="value" @input="onInput" />
  </div>
</template>
<script setup lang="ts" name="MyInput">
  import { defineComponent, ref, reactive } from 'vue';
  import useMyHook from '@/hooks/sachin/useMyHook';
  // defineComponent({
  //   name: 'MyInput',
  //   props: ['value'],
  // });
  const props = defineProps(['value']);
  const emits = defineEmits(['input']);

  // function onInput(event) {
  //   emits('input', event.target.value);
  //   console.log('event', event);
  // }
  const { onInput } = useMyHook(props, emits);
</script>

<style scoped lang="less"></style>
