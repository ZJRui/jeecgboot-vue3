<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'Keepalivecomp',
    data() {
      console.log('this is keepalivecomp data ')
      return {};
    },
    created() {
      console.log('this is keepalivecomp created ');
    },
    mounted() {
      console.log('this is keepalivecomp mounted ');
    },
    activated() {
      console.log('this is keepalivecomp activated ');
    },
    deactivated() {
      console.log('this is keepalivecomp deactivated ');
    },
  });
</script>

<template>
  <div>this is keepalivecomp </div>
</template>

<style scoped lang="less"></style>
