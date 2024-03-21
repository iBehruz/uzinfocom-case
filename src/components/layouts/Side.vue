<template>
  <el-aside style="border: solid 1px var(--ep-menu-border-color)">
    <el-button
      text
      :bg="false"
      w="100%"
      style="
        height: 60px;
        border-radius: 0;
        border-bottom: solid 1px var(--ep-menu-border-color);
      "
    >
      DeviceShopMaster
    </el-button>

    <el-menu
      style="border: 0px"
      default-active="1"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      @open="handleOpen"
      @close="handleClose"
    >
      <el-menu-item index="1">
        <el-icon><icon-menu /></el-icon>
        <template #title>Список</template>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script lang="ts" setup>
import { toggleDark } from "~/composables";
import { ref } from "vue";
import {
  Location,
  Document,
  Menu as IconMenu,
  Setting,
} from "@element-plus/icons-vue";

const isCollapse = ref(false);
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
</script>
