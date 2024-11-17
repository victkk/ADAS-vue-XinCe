<script setup lang="ts">
import {
  Document,
  Menu as IconMenu,
  Setting,
  Link,
  Position,
  Histogram, CircleCheck, Finished, Management, FolderOpened, TrendCharts, AddLocation,
} from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import MovingArrow from "@/components/SideBar/MovingArrow.vue";
import { ref, computed } from "vue";

const router = useRouter();
const activeIndex = ref(0);
const menuItemHeight = 48; // 每个菜单项的高度，根据实际CSS调整

const arrowPosition = computed(() => {
  return activeIndex.value * menuItemHeight;
});

function change(key: string, keyPath: string[]) {
  console.log(key);
  const indexMap = {
    "/index": 0,
    "/index/DBManagement": 1,
    "/index/ModelTrain": 2,
    "/index/ModelManagement": 3,
    "/index/ModelVerification": 4,
    "/index/ModelMarket": 5,
  };
  activeIndex.value = indexMap[key];
}
</script>

<template>
  <div class="SideBar">
    <div class="logo-container">
      <img
        src="@/assets/images/20240514152616.png"
        alt="Logo"
        style="height: 40px"
      />
      <span class="logo-text"
        ><span class="larger">T</span>HINK<span class="larger">D</span
        >rive</span
      >
    </div>
    <el-menu
      default-active="1"
      class="el-menu-vertical-demo"
      :router="true"
      @select="change"
    >
      <el-menu-item index="/index/dashboard">
        <el-icon>
          <icon-menu />
        </el-icon>
        <span class="text">总览</span>
      </el-menu-item>
      <el-menu-item index="/index/DBManagement">
        <el-icon>
          <FolderOpened />
        </el-icon>
        <span class="text">数据集管理</span>
      </el-menu-item>
      <el-menu-item index="/index/ModelManagement">
        <el-icon>
          <Memo />
        </el-icon>
        <span class="text">模型管理</span>
      </el-menu-item>
      <el-menu-item index="/index/ModelTrain">
        <el-icon>
          <AddLocation />
        </el-icon>
        <span class="text">模型训练</span>
      </el-menu-item>
      <el-menu-item index="/index/ModelVerification">
        <el-icon>
          <Finished />
        </el-icon>
        <span class="text">模型验证</span>
      </el-menu-item>
      <el-menu-item index="/index/ModelMarket">
        <el-icon>
          <Link />
        </el-icon>
        <span class="text">模型市场</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<style scoped>
.Side-Bar {
  width: 250px;
  display: flex;
}
.logo-container {
  height: 20px;
  width: 250px;
  display: flex;
  box-sizing: border-box;
  padding: 30px 30px 30px 30px;

  justify-content: space-between;
  align-items: center;
}
.logo-text {
  font-size: 24px;
  vertical-align: middle;
  margin-left: 10px;
  color: rgb(253, 253, 253);
}
.logo-text .larger {
  font-size: 120%;
}

.el-menu-vertical-demo {
  width: 250px;
  position: fixed; /* 固定位置，不随滚动条滚动 */
  background-color: transparent; /* 深蓝色背景 */
  overflow-y: auto; /* 内容超出高度时可滚动 */
  padding: 20px;
}

.text {
  vertical-align: middle; /* 文字垂直居中 */
  color: rgb(232, 234, 234); /* 字体颜色 */
  font-size: 1.05em;
}

.el-menu-item {
  transition: background-color 0.3s ease; /* 平滑背景色变化 */
  padding: 10px 0px;
}

.el-menu-item:hover {
  background-color: #34495e; /* 鼠标悬停时的背景色 */
}

.el-menu-item.is-active,
.el-menu-item.is-active .text {
  color: rgb(151, 195, 245);
}

.el-icon {
  vertical-align: middle; /* 图标垂直居中 */
  margin-right: 8px; /* 图标和文字之间的间隔 */
  color: rgb(232, 234, 234);
}
</style>
