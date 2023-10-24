<template>
  <div>
    <div>this is componentA.vue</div>
    <div>$attrs:{{ $attrs }} $props: {{ $props }}</div>
    <hr />
  </div>
</template>
<script setup lang="ts">
  const props = defineProps(['name', 'age']);
</script>

<style scoped lang="less"></style>
