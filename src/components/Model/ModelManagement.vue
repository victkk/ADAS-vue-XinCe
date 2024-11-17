<template>
  <div class="data-table">
    <!-- Tabs for switching between different tables -->
    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
      <el-tab-pane label="我的模型" name="models">我的模型</el-tab-pane>
      <!-- <el-tab-pane label="我的订阅" name="subscriptions">我的订阅</el-tab-pane> -->
    </el-tabs>

    <!-- Conditional rendering based on selected tab -->
    <div v-if="activeTab === 'models'">
      <!-- Models Table -->
      <models-table></models-table>
    </div>

    <!-- Subscriptions Table -->
    <!-- <div v-else-if="activeTab === 'subscriptions'">
      <subscriptions-table></subscriptions-table>
    </div> -->
  </div>
</template>

<script setup>
import { ref } from "vue";
import ModelsTable from "@/components/Model/ModelsTable.vue";
// import SubscriptionsTable from "@/components/Model/SubscriptionsTable.vue";

const activeTab = ref("models"); // This ref keeps track of which tab is active

function handleTabClick(tab) {
  console.log("Switched to tab:", tab.name);
}
</script>

<style scoped>
.data-table {
  flex: 1; /* 占用剩余空间 */
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 20px;
  width: 100%;
  overflow-x: hidden;
}
</style>
