<template>
  <img :src="imgUrl" alt="预览图片" style="width: 300px" />
  <img :src="imgUrl2" alt="预览图片" style="width: 300px" />

  <el-button @click="switch11">换url</el-button>
</template>

<script setup lang="ts">
import { ref } from "vue";
const imgUrl2 = ref();
let imgUrl = new URL("@/assets/images/3.png", import.meta.url).href;
imgUrl2.value = new URL("@/assets/images/3.png", import.meta.url).href;

const switch11 = () => {
  imgUrl2.value = "";
  console.log("111");
  imgUrl2.value = new URL("@/assets/images/30.png", import.meta.url).href;
  console.log("222,", imgUrl2.value);

  imgUrl2.value = new URL("@/assets/images/3.png", import.meta.url).href;
};
</script>

<style scoped>
/* 添加样式 */
* {
  margin: 0;
  padding: 0;
}
.cut {
  width: 500px;
  height: 500px;
  margin: 30px auto;
}
.model {
  position: fixed;
  z-index: 10;
  width: 100vw;
  height: 100vh;
  overflow: auto;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.8);
}
.model-show {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
}
.model img {
  display: block;
  margin: auto;
  max-width: 80%;
  user-select: none;
  background-position: 0px 0px, 10px 10px;
  background-size: 20px 20px;
  background-image: linear-gradient(
      45deg,
      #eee 25%,
      transparent 25%,
      transparent 75%,
      #eee 75%,
      #eee 100%
    ),
    linear-gradient(45deg, #eee 25%, white 25%, white 75%, #eee 75%, #eee 100%);
}
.test-button {
  display: flex;
  justify-content: center;
  gap: 10px;
}
.btn {
  padding: 10px 20px;
  background-color: #409eff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}
</style>
