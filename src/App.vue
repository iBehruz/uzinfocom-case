

<template>
  <el-config-provider namespace="ep">

    <div class="flex main-container">
      <Side />
      <div w="full" pt="0" py="4">
        <Header />
        <Main msg="Hello Vue 3 + Element Plus + Vite" />
      </div>
    </div>
  </el-config-provider>
</template>

<script setup lang="ts">
import Main from './views/Main.vue';

</script>
<style>
#app {
  text-align: center;
  color: var(--ep-text-color-primary);
}

.main-container {
  /* calc(100vh - var(--ep-menu-item-height) - 3px) */
  height: 100vh;
}
</style>
