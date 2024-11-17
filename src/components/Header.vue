<template>
  <header class="header">
    <div class="header-content">
      <slot></slot>
    </div>
    <div class="push">
      <div class="rightitems">
        <el-dropdown>
          <span class="el-dropdown-link">
            <el-avatar
              src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
              @click="toPersonPage"
            />
            <el-icon class="el-icon--right"><arrow-down /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item :icon="Plus">Action 1</el-dropdown-item>
              <el-dropdown-item :icon="CirclePlusFilled">
                Action 2
              </el-dropdown-item>
              <el-dropdown-item :icon="CirclePlus">Action 3</el-dropdown-item>
              <el-dropdown-item :icon="Check">Action 4</el-dropdown-item>
              <el-dropdown-item :icon="CircleCheck">Action 5</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <el-button type="info" plain class="sign-out" @click="logout"
          >登出</el-button
        >
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { UserFilled } from "@element-plus/icons-vue";
import { ElMessage, ElNotification as notify } from "element-plus";
import {
  ArrowDown,
  Check,
  CircleCheck,
  CirclePlus,
  CirclePlusFilled,
  Plus,
} from "@element-plus/icons-vue";
import { LogoutApi } from "@/request/api";
import { useRouter } from "vue-router";
import { defineProps } from "vue";

const props = defineProps({
  moduleName: {
    type: String,
    default: "总览",
  },
});
const router = useRouter();
let showDropdown = false;

async function logout() {
  let res = await LogoutApi();
  if (res.success) {
    ElMessage.success("登出成功");
    await router.push("/");
  } else {
    ElMessage("登出失败");
  }
  console.log(res);
}

function toPersonPage() {
  router.push("/index/PersonPage");
}
</script>

<style scoped>
.header {
  display: flex;
  width: 100%;
  height: 100%;
  gap: 20px;
  justify-content: space-between;
  padding-top: 20px;
}
.push {
  float: right;
}
.header-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}
.rightitems {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.user-menu img {
  cursor: pointer;
}
.dropdown-menu {
  display: none;
  position: absolute;
  right: 0;
  background-color: #ffffff;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
}
.dropdown-menu a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}
.dropdown-menu a:hover {
  background-color: #f1f1f1;
}
.sign-out {
  padding: 8px 16px;
  text-decoration: none;
  border: none;
  cursor: pointer;
}
</style>
