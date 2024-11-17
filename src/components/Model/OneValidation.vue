<template>
  <div class="outer-container">
    <div class="valid-main">
      <div class="valid-header">验证编号:{{ productId }}
        <div>
          <el-button @click="stopV()" style="width:100px">停止验证</el-button>
          <el-button @click="returnUpper()" style="width:50px">返回</el-button>
        </div>
      </div>
      <div class="video-space">验证视频</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {StopValidation} from "@/request/interface/validation";
import {ElMessage} from "element-plus";

const route = useRoute();
const router = useRouter();

const productId = route.params.productId;

async function stopV() {
  ElMessage.info("操作：停止验证")
  let res = await StopValidation(productId);
  if (res.status !== 0) {
    ElMessage.error(res.message)
  }
}

function returnUpper() {
  router.push("/index/ModelVerification")
}
</script>

<style scoped>
.outer-container {
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  width: 100%;
}

.valid-main {
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 20px;
}

.video-space {
  display: flex;
  width: 100%;
  height: auto;
  justify-content: center;
}

.valid-header {
  display: flex;
  justify-content: space-between;
}
</style>