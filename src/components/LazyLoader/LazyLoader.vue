<template>
  <slot v-if="load"></slot>
  <div v-else ref="box" :style="{ height: h, width: w }"></div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { initLazyIntersectionObserver } from "@/utils/initLazy.js";

const props = defineProps({
  w: {
    type: String,
    default: "100%",
  },
  h: {
    type: String,
    default: "100%",
  },
});

const load = ref(false);

const box = ref();
let observer; // 定义在外部，以便在其他函数中使用

onMounted(() => {
  observer = initLazyIntersectionObserver((entry) => {
    if (entry.isIntersecting) {
      // 当内容可见
      load.value = true;
      observer.unobserve(box.value);
      observer = null;
    }
  });
  observer.observe(box.value); // 观察
});

onBeforeUnmount(() => observer && observer.unobserve(box.value)); // 不观察了
// onBeforeUnmount(() => {
//   if (observer && box.value) {
//     observer.unobserve(box.value);
//   }
//   observer = null;
// });
</script>
