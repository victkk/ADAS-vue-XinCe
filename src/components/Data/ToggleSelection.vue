<template>
  <div class="picGallery" ref="galleryRef">
    <div
        class="selection-box"
        v-show="isSelecting"
        :style="selectionBoxStyle"
    ></div>
    <slot name="lazyLoaderSlot"></slot>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, reactive, onMounted, onBeforeUnmount,defineProps} from 'vue';

const props = defineProps({
  selectionMode: {
    type: Boolean,
    required: true,
  },
  editList:{
    type: Array as () => number[],
    required: true,
  }
});

const isSelecting = ref(false); // 是否处于拖动选择状态
const selectionStart = reactive({x: 0, y: 0}); // 选择框起始位置
const selectionBoxStyle = reactive({top: '0px', left: '0px', width: '0px', height: '0px'});
const galleryRef = ref(null); // 图片容器引用

// 处理鼠标按下事件，开始拖动选择
const handleMouseDown = (event) => {
  console.log('mousedown', event);
  console.table("editList",editList)
  if (!selectionMode) return; // 仅在多选模式下启用

  isSelecting.value = true;
  selectionStart.x = event.clientX;
  selectionStart.y = event.clientY;

  // 初始化选择框样式
  selectionBoxStyle.top = `${selectionStart.y}px`;
  selectionBoxStyle.left = `${selectionStart.x}px`;
  selectionBoxStyle.width = '0px';
  selectionBoxStyle.height = '0px';

  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
};

// 处理鼠标移动事件，更新选择框
const handleMouseMove = (event) => {
  console.log('mousemove', event);
  if (!isSelecting.value) return;

  const currentX = event.clientX;
  const currentY = event.clientY;

  // 计算选择框的宽高和位置
  selectionBoxStyle.top = `${Math.min(selectionStart.y, currentY)}px`;
  selectionBoxStyle.left = `${Math.min(selectionStart.x, currentX)}px`;
  selectionBoxStyle.width = `${Math.abs(currentX - selectionStart.x)}px`;
  selectionBoxStyle.height = `${Math.abs(currentY - selectionStart.y)}px`;

  // 检查哪些图片在选择框内
  checkImagesInSelection();
  console.table("editList",editList)

};

// 处理鼠标松开事件，结束选择
const handleMouseUp = () => {
  console.log('mouseup');
  isSelecting.value = false;
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
};

// 检查哪些图片位于选择框内
const checkImagesInSelection = () => {
  const selectionBox = galleryRef.value.getBoundingClientRect();

  toggleEditList.value = picList.value.filter((image, index) => {
    const imageElement = galleryRef.value.querySelectorAll('.image-container')[index];
    const imageRect = imageElement.getBoundingClientRect();

    return (
        imageRect.left < selectionBox.right &&
        imageRect.right > selectionBox.left &&
        imageRect.top < selectionBox.bottom &&
        imageRect.bottom > selectionBox.top
    );
  }).map(image => image.pictureId);
  console.log("101010+editList: ",editList.value);
};

// 在组件挂载后添加事件监听
onMounted(() => {
  galleryRef.value.addEventListener('mousedown', handleMouseDown);
});

// 在组件卸载前移除事件监听
onBeforeUnmount(() => {
  galleryRef.value.removeEventListener('mousedown', handleMouseDown);
});
</script>

<style scoped>
.selection-box {
  position: absolute;
  border: 2px dashed #409eff;
  background-color: rgba(64, 158, 255, 0.2);
  pointer-events: none; /* 防止选择框干扰鼠标事件 */
  z-index: 100; /* 确保选择框在所有图片之上 */
}

.picGallery {
  display: flex;
  flex-wrap: wrap; /* 使图片换行显示 */
  gap: 20px; /* 图片之间的间距 */
  justify-content: flex-start; /* 开始对齐 */
  width: 100%;
  position: relative;
  /*  transition: width 0.3s ease; */

}


img{
  pointer-events: none;
}
</style>