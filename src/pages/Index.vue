<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="250px">
        <AsideNavBar class="SideBar"></AsideNavBar>
      </el-aside>
      <el-container>
        <el-header>
          <Header class="header">
            <el-breadcrumb :separator-icon="ArrowRight">
              <el-breadcrumb-item
                v-for="breadcrumb in breadcrumbs"
                :key="breadcrumb.text"
                :to="breadcrumb.to"
                :replace="breadcrumb.replace"
              >
                {{ breadcrumb.text }}
              </el-breadcrumb-item>
            </el-breadcrumb>
          </Header>
        </el-header>
        <el-main>
          <RouterView></RouterView>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import AsideNavBar from "@/components/SideBar/AsideNavBar.vue";
import Header from "@/components/Header.vue";
import { ref, watch, computed } from "vue";
import { useRoute } from "vue-router";
import { ArrowRight } from "@element-plus/icons-vue";

const moduleName = ref("总览");
const breadcrumbs = ref<{ text: string; to?: any; replace?: boolean }[]>([]);
const route = useRoute();

const currentPath = computed(() => route.path);

watch(
  currentPath,
  (newPath) => {
    switch (true) {
      case /^\/index\/DBManagement$/.test(newPath):
        breadcrumbs.value = [{ text: "数据集管理" }];
        break;
      case /^\/index\/DBViewOne\/\d+$/.test(newPath):
        breadcrumbs.value = [
          {
            text: "数据集管理",
            to: { path: "/index/DBManagement" },
            replace: true,
          },
          { text: "查看数据集" },
        ];
        break;
      case "/newDataset/induct" === newPath:
        breadcrumbs.value = [{
          text: "数据集管理",
          to: { path: "/index/DBManagement" },
          replace: true,
        },
          { text: "创建新的数据集" },];
        break;
      case "/newDataset/collect" === newPath:
        breadcrumbs.value = [{
          text: "数据集管理",
          to: { path: "/index/DBManagement" },
          replace: true,
        },
          { text: "创建新的数据集" },];
        break;
      case "/newDataset/clone" === newPath:
        breadcrumbs.value = [{
          text: "数据集管理",
          to: { path: "/index/DBManagement" },
          replace: true,
        },
          { text: "创建新的数据集" },];
        break;
      case "/index/ModelManagement" === newPath:
        breadcrumbs.value = [{ text: "模型管理" }];
        break;
      case "/newModel" === newPath:
        breadcrumbs.value = [{
          text: "模型管理",
          to: { path: "/index/ModelManagement" },
          replace: true,
        },
          { text: "创建新的模型" },];
        break;
      case "/index/ModelTrain" === newPath:
        breadcrumbs.value = [{ text: "模型训练" }];
        break;
      case "/newTrain" === newPath:
        breadcrumbs.value = [
          {
            text: "模型训练",
            to: { path: "/index/ModelTrain" },
            replace: true,
          },
          { text: "创建训练作业" },
        ];
        break;
      case "/index/ModelVerification" === newPath:
        breadcrumbs.value = [{ text: "模型验证" }];
        break;
      case /^\/index\/ModelVerification$/.test(newPath):
        breadcrumbs.value = [{ text: "模型验证" }];
        break;
      case "/index/ModelMarket" === newPath:
        breadcrumbs.value = [{ text: "模型市场" }];
        break;
      case "/index/dashboard" === newPath:
        breadcrumbs.value = [{ text: "总览" }];
        break;
    }
  },
  { immediate: true } // 立即执行一次，以确保初始路径也能正确设置模块名
);
</script>

<style scoped>
.common-layout {
  display: flex;
  flex-direction: column; /* 垂直布局 */
  width: 100vw; /* 视口宽度 */
  height: 100vh; /* 视口高度 */
  margin: 0;
  padding: 0;
}

.el-header {
  background-color: #eeebe5d0;
  height: 60px;
  display: flex;
  align-items: center; /* 垂直居中 */
  padding: 0 20px; /* 增加内边距 */
}
.el-breadcrumb {
  margin-left: 20px; /* 添加一些左边距 */
}

.el-aside {
  flex-grow: 1;
  height: 100%;
  width: 250px; /* 侧边栏宽度 */
  position: fixed; /* 固定位置，不随滚动条滚动 */
  background-color: #17181a;
  left: 0; /* 在屏幕最左侧 */
  overflow-y: auto; /* 内容超出高度时可滚动 */
}

.el-main {
  display: flex;
  flex-grow: 1;
  margin-left: 250px;
  padding-top: 50px;
  background-color: #eeebe5d0;
}

.header {
  margin-left: 250px;
}

.el-breadcrumb {
  font-size: 18px;
}
</style>
