<template>
  <div>
    <!-- 原始图片显示和裁剪区域 -->
    <div v-if="!editing">
      <button @click="startEditing">裁切</button>
    </div>

    <!-- 编辑模式：左侧显示原始图片，右侧显示裁剪编辑区域 -->
    <div v-else class="editor-container">
      <div class="editor-left">
        <div class="crop-container" ref="cropContainer" @mousedown="startCrop">
          <img :src="imageUrl" alt="裁剪图片" class="image" />
          <!-- 裁剪框 -->
          <div
            class="crop-box"
            :style="cropBoxStyle"
            @mousedown.stop.prevent="startDragging"
          ></div>
        </div>
        <button @click="saveChanges">保存更改</button>
        <button @click="cancelEditing">取消</button>
      </div>
      <div class="editor-right">
        <img :src="imageUrl" alt="原始图片" class="image" />
      </div>
    </div>

    <!-- 保存裁剪后显示预览 -->
    <div v-if="croppedUrl">
      <div>
        <h3>原始图片</h3>
        <img :src="imageUrl" alt="原始图片" class="image" />
      </div>
      <div>
        <h3>裁剪后的图片</h3>
        <img :src="croppedUrl" alt="裁剪后的图片" class="image" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";

// 图片 URL
const imageUrl = new URL("@/assets/images/3.png", import.meta.url).href;

// 编辑状态控制
const editing = ref(false);

// 裁剪框的状态
const cropState = reactive({
  startX: 0,
  startY: 0,
  endX: 0,
  endY: 0,
  isDragging: false,
});

// 裁剪后的图片 URL
const croppedUrl = ref<string | null>(null);

// 开始编辑
const startEditing = () => {
  editing.value = true;
};

// 取消编辑
const cancelEditing = () => {
  editing.value = false;
  resetCropState();
};

// 重置裁剪状态
const resetCropState = () => {
  cropState.startX = 0;
  cropState.startY = 0;
  cropState.endX = 100; // 初始化宽度和高度
  cropState.endY = 100;
  cropState.isDragging = false;
};

// 获取裁剪框样式
const cropBoxStyle = reactive({
  top: "0px",
  left: "0px",
  width: "100px",
  height: "100px",
});

// 计算裁剪框样式
const updateCropBoxStyle = () => {
  cropBoxStyle.top = `${cropState.startY}px`;
  cropBoxStyle.left = `${cropState.startX}px`;
  cropBoxStyle.width = `${cropState.endX - cropState.startX}px`;
  cropBoxStyle.height = `${cropState.endY - cropState.startY}px`;
};

// 开始裁剪
const startCrop = (event: MouseEvent) => {
  // 获取鼠标点击位置的 x 和 y 坐标
  const x = event.clientX;
  const y = event.clientY;
  // 使用 elementFromPoint 获取鼠标位置下的 DOM 元素并赋值给裁剪容器引用
  cropContainerRef.value = document.elementFromPoint(x, y) as HTMLElement;

  if (!cropContainerRef.value) return; // 确保裁剪容器已初始化

  const rect = cropContainerRef.value.getBoundingClientRect(); // 获取裁剪容器的尺寸和位置

  cropState.startX = event.clientX - rect.left;
  cropState.startY = event.clientY - rect.top;
  console.log("111", cropState.startX, cropState.startY);

  cropState.endX = cropState.startX; // 初始化裁剪区域的结束坐标
  cropState.endY = cropState.startY;

  cropState.isDragging = true;

  // 在第一次 mousedown 时开始监听 mousemove 和 mouseup 事件
  document.addEventListener("mousemove", crop);
  document.addEventListener("mouseup", endCrop);
};

// 裁剪移动
const crop = (event: MouseEvent) => {
  if (!cropState.isDragging || !cropContainerRef.value) return;

  const rect = cropContainerRef.value.getBoundingClientRect();
  cropState.endX = Math.min(rect.width, event.clientX - rect.left);
  cropState.endY = Math.min(rect.height, event.clientY - rect.top);
  updateCropBoxStyle();
};

// 结束裁剪
const endCrop = () => {
  cropState.isDragging = false;
  document.removeEventListener("mousemove", crop);
  document.removeEventListener("mouseup", endCrop);
};

// 开始拖动裁剪框
const startDragging = (event: MouseEvent) => {
  event.preventDefault(); // 防止浏览器的默认行为
  event.stopPropagation(); // 阻止事件冒泡到图片

  const initialX = event.clientX;
  const initialY = event.clientY;
  const initialStartX = cropState.startX;
  const initialStartY = cropState.startY;

  const drag = (e: MouseEvent) => {
    const deltaX = e.clientX - initialX;
    const deltaY = e.clientY - initialY;
    cropState.startX = Math.max(
      0,
      Math.min(
        initialStartX + deltaX,
        (cropContainerRef.value as HTMLElement).offsetWidth -
          parseInt(cropBoxStyle.width)
      )
    );
    cropState.startY = Math.max(
      0,
      Math.min(
        initialStartY + deltaY,
        (cropContainerRef.value as HTMLElement).offsetHeight -
          parseInt(cropBoxStyle.height)
      )
    );
    updateCropBoxStyle();
  };

  const stopDragging = () => {
    document.removeEventListener("mousemove", drag);
    document.removeEventListener("mouseup", stopDragging);
  };

  document.addEventListener("mousemove", drag);
  document.addEventListener("mouseup", stopDragging);
};

// 保存裁剪更改
const saveChanges = () => {
  const cropContainer = cropContainerRef.value as HTMLElement;
  const image = cropContainer.querySelector("img") as HTMLImageElement;
  const scaleX = image.naturalWidth / cropContainer.offsetWidth;
  const scaleY = image.naturalHeight / cropContainer.offsetHeight;

  const cropCanvas = document.createElement("canvas");
  cropCanvas.width = (cropState.endX - cropState.startX) * scaleX;
  cropCanvas.height = (cropState.endY - cropState.startY) * scaleY;

  const ctx = cropCanvas.getContext("2d");
  if (ctx) {
    ctx.drawImage(
      image,
      cropState.startX * scaleX,
      cropState.startY * scaleY,
      (cropState.endX - cropState.startX) * scaleX,
      (cropState.endY - cropState.startY) * scaleY,
      0,
      0,
      cropCanvas.width,
      cropCanvas.height
    );

    croppedUrl.value = cropCanvas.toDataURL("image/png");
  }

  editing.value = false;
};

// 裁剪容器引用
const cropContainerRef = ref<HTMLElement | null>(null);

onMounted(() => {
  resetCropState();
  // 确保 cropContainerRef 已初始化
  if (!cropContainerRef.value) {
    console.warn("裁剪容器未初始化");
  }
});
</script>

<style scoped>
.image {
  max-width: 100%;
  display: block;
  margin: 20px 0;
  user-select: none; /* 禁用用户选择 */
  pointer-events: none; /* 禁用图片的鼠标事件 */
}

.editor-container {
  display: flex;
  pointer-events: all;
}

.editor-left,
.editor-right {
  flex: 1;
  padding: 10px;
  pointer-events: all;
}

.crop-container {
  position: relative;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  border: 1px solid #ddd;
  overflow: hidden;
  user-select: none;
}

.crop-box {
  position: absolute;
  border: 2px dashed #409eff;
  cursor: move;
}

.crop-box::before,
.crop-box::after {
  content: "";
  position: absolute;
  width: 10px;
  height: 10px;
  background: #409eff;
}

.crop-box::before {
  top: -5px;
  left: -5px;
  cursor: nwse-resize;
}

.crop-box::after {
  bottom: -5px;
  right: -5px;
  cursor: nwse-resize;
}

.test-button {
  margin-top: 20px;
}

.button {
  padding: 10px 20px;
  background-color: #409eff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  margin-right: 10px;
}
</style>
