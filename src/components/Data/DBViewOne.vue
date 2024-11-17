<template>
  <div class="datasetViewOneContainer">
    <div style="display: flex; justify-content: space-between;position:relative;top: -50px">
      <h3>查看的数据集信息</h3>
      <el-button @click="handleUnload">返回数据集管理</el-button>
    </div>
    <div class="datasetInfo" style="display: flex;flex-direction:column;gap:5px;position:relative;top: -40px">
      <p>名称：{{ route.query.datasetName }}</p>
      <p>编号：{{ route.query.datasetId }}</p>
      <p>更新时间：{{ route.query.updateTime }}</p>
      <p>描述：{{ route.query.description }}</p>
      <p>图片总数：{{ route.query.pictureCount }}</p>
    </div>

    <div class="header" style="width:100%;display: flex; justify-content: space-between;">
      <h3>图片列表</h3>

      <div class="action-buttons">

        <button class="quickselect" v-if="selectionMode" @click="selectAllPic">
          全选
        </button>
        <button
            class="quickselect"
            v-if="selectionMode"
            @click="deselectAllPic"
        >
          全不选
        </button>

        <el-button v-if="!selectionMode" @click="toggleSelectionMode"
        >多选
        </el-button
        >
        <el-button v-else @click="toggleSelectionMode">取消多选</el-button>
        <el-button
            @click="sharpenDialogVisible = true"
            :disabled="!editList.length"
        >
          锐化
        </el-button>
        <el-button
            @click="cropDialogVisible = true"
            :disabled="!editList.length"
        >裁切
        </el-button
        >
      </div>
    </div>

    <div class="container" :class="{ 'editing-mode': selectedImage }">
      <div class="picGallery">
        <LazyLoader
            v-for="(image, index) in picList"
            :key="index"
            w="25%"
            h="500px"
        >
          <div class="image-container">
            <img
                :src="image.pictureMinimapPath"
                alt="Lazy loaded image"
                class="lazy-image"
                @click="selectImage(image)"
            />
            <input
                v-if="selectionMode"
                type="checkbox"
                class="select-checkbox"
                :value="image.pictureId"
                v-model="editList"
            />
          </div>
        </LazyLoader>
      </div>
      <div v-if="ShowEditOneRightColumn" class="EditOneWorkshop">
        <div style="display: flex; justify-content: space-between">
          <h1>图片处理</h1>
          <div>
            <el-popover
                placement="bottom"
                title="格式刷"
                width="200"
                trigger="hover"
            >
              <div v-for="line in formatPainterContent.split('\n')" :key="line">
                {{ line }}
              </div>

              <template #reference>
                <el-button style="width: 32px; height: 32px" @click="formatPainter">
                  <el-icon class="my-icon">
                    <Brush/>
                  </el-icon>
                </el-button>
              </template>
            </el-popover>

            <el-popover
                placement="bottom"
                title="退出图片处理"
                width="50"
                trigger="hover"
            >
              <template #reference>
                <el-button style="width: 32px; height: 32px" @click="exitViewOne">
                  <el-icon class="my-icon">
                    <CloseBold/>
                  </el-icon>
                </el-button>
              </template>
            </el-popover>
          </div>
        </div>

        <span
        >可选操作：
          <el-button @click="ChopOne">裁切</el-button>
          <el-button @click="SharpenOne">锐化</el-button>
        </span>

        <div v-if="isCrop" class="editor-container">
          <div style="display: flex; justify-content: space-between">
            <h3>裁切：</h3>
            <el-button v-if="isCrop" @click="cancelEditing">退出裁切</el-button>
          </div>
          <h3 style="margin-left: 20px">原始图片:</h3>

          <div class="originalpic">
            <div
                class="crop-container"
                ref="cropContainer"
                @mousedown="startCrop"
            >
              <img :src="imageUrl" alt="裁切图片" class="image"/>
              <!-- 裁切框 -->
              <div
                  class="crop-box"
                  :style="cropBoxStyle"
                  @mousedown.stop.prevent="startDragging"
              ></div>
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end">
            <el-button @click="saveChanges">确认裁切</el-button>
          </div>

          <div class="CropParamsView">
            <h4>裁切参数确认：</h4>
            <p>x: {{ cropParams.x }}</p>
            <p>y: {{ cropParams.y }}</p>
            <p>width: {{ cropParams.width }}</p>
            <p>height: {{ cropParams.height }}</p>
          </div>

          <h3 style="margin-left: 20px">裁切后的图片:</h3>
          <div class="editedpic">
            <img :src="editedUrl" alt="裁切后的图片" class="image"/>
          </div>

          <el-button v-if="isCrop" @click="saveChanges">保存更改</el-button>
          <el-button v-if="isCrop" @click="cancelEditing">退出裁切</el-button>
        </div>

        <div v-if="isSharpen" class="editor-container">
          <div style="display: flex; justify-content: space-between">
            <h3>锐化：</h3>
            <el-button v-if="isSharpen" @click="cancelEditing"
            >退出锐化
            </el-button
            >
          </div>
          <h3 style="margin-left: 20px">原始图片:</h3>

          <div class="originalpic">
            <img :src="imageUrl" alt="锐化图片" class="image"/>
          </div>

          <div class="CropParamsView">
            <h4>锐化参数：</h4>
            <p>
              强度:
              <el-input
                  v-model="sharpenStrength"
                  style="width: 60%; height: 1.8em"
                  placeholder="可选择区间: [0,1]"
              />
            </p>
          </div>
          <el-button v-if="isSharpen" @click="saveChangesSharpen"
          >查看效果
          </el-button
          >

          <h3 style="margin-left: 20px" >锐化后的图片:</h3>
          <div class="editedpic">
            <img :src="editedUrl" alt="锐化后的图片" class="image"/>
          </div>

          <el-button v-if="isSharpen" @click="cancelEditing"
          >退出锐化
          </el-button
          >
        </div>

        <img
            v-if="!isCrop && !isSharpen"
            :src="originalUrl"
            alt="原图"
            style="width: 90%; margin: 10px auto"
        />
      </div>
    </div>

    <!-- 锐化确认对话框 -->
    <el-dialog
        title="确认锐化"
        v-model="sharpenDialogVisible"
        :draggable="true"
    >
      <!-- <p>需要操作的图片的编号 : {{ selectedImageIds }}</p> -->
      <p>图片数量 : {{ editList.length }}</p>
      <p>
        锐化程度 :
        <el-input
            v-model="sharpenStrength"
            style="width: 60%; height: 1.8em"
            placeholder="可选择区间: [0,1]"
        />
      </p>

      <span slot="footer" class="dialog-footer">
        <el-button @click="sharpenDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmSharpen">确认</el-button>
      </span>
    </el-dialog>

    <!-- 裁切确认对话框 -->
    <el-dialog title="确认裁切" v-model="cropDialogVisible">
      <!-- <p>需要操作的图片的编号 : {{ selectedImageIds }}</p> -->
      <p>图片数量 : {{ editList.length }}</p>
      <p>
        裁切框左上角的位置 :
        <el-input v-model="cropParams.x" label="裁切x位置"/>
      </p>

      <el-input-number
          v-model="cropParams.y"
          label="裁切y位置"
          :min="0"
      ></el-input-number>
      <el-input-number
          v-model="cropParams.width"
          label="裁切宽度"
          :min="1"
      ></el-input-number>
      <el-input-number
          v-model="cropParams.height"
          label="裁切高度"
          :min="1"
      ></el-input-number>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cropDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmCrop">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {GetOneDataset, PicPreview, PicProcess} from "@/request/interface/dataset";
import LazyLoader from "@/components/LazyLoader/LazyLoader.vue";
import {ref, onMounted, onBeforeUnmount, computed, reactive} from "vue";
import {ElMessage} from "element-plus";


import {useRoute} from "vue-router";
import {useUserstore} from "@/store/user";
const userStore = useUserstore();
//const creatorId = userStore.creatorId;
const creatorId = 1;

const route = useRoute();
import {useRouter} from "vue-router";
import {CloseBold} from "@element-plus/icons-vue";

const router = useRouter();
const thisDatasetId = Number(route.query.datasetId);

interface DatasetOnePic {
  pictureId: number;
  datasetId: number;
  x: number;
  y: number;
  throttle: number;
  steering: number;
  face: number;
  picturePath: string;
  pictureMinimapPath: string;
}

const picList = ref<DatasetOnePic[]>([]);

const selectionMode = ref(false); // 是否处于多选模式
const editList = ref<number[]>([]); // 存储选中的图片ID
const sharpenDialogVisible = ref(false); // 锐化对话框显示状态
const sharpenStrength = ref<number>(); // 锐化程度，默认1
const cropDialogVisible = ref(false); // 裁切对话框显示状态
const cropParams = ref({x: 0, y: 0, width: 0, height: 0}); // 裁切参数
const selectedImageIds = computed(() => editList.value.join(", ")); // 选中的图片ID列表
const operation = ref<string>();
const inFormat = ref(false);

const formatPainterContent = computed(() => {
  if (operation.value === "crop") {
    inFormat.value = true;
    return `操作：裁切；\n参数：x: ${cropParams.value.x}, y: ${cropParams.value.y}, \n width: ${cropParams.value.width}, height: ${cropParams.value.height}`;
  } else if (operation.value === "sharpen") {
    inFormat.value = true;
    return `操作：锐化；\n锐化程度：${sharpenStrength.value}`;
  }
  return "目前无样式";
});


const formatPainter = async () => {
  if (editList.value.length >= 1 && inFormat.value === true) {
    await processImages;
  } else if (editList.value.length === 0) {
    ElMessage.error("请至少选择一张图片");
  } else if (!inFormat.value) {
    ElMessage.error("当前格式刷无样式");
  }
}

const exitViewOne = () => {
  ShowEditOneRightColumn.value = false;
  selectedImage.value = null;
  editing.value = false;
}


const listAll = async () => {
  try {
    let res_picListRaw = await GetOneDataset({datasetId: thisDatasetId});
    let picListRaw = res_picListRaw.message;
    if (!Array.isArray(picListRaw)) {
      throw new Error("Invalid response structure");
    }
    console.log("DBViewOne fetch ORIGINAL picListRaw succeeds: ", picListRaw);
    picList.value = picListRaw.map((image) => {
      return {
        ...image,
        picturePath: `http://adasremote.natapp1.cc/pictures/${image.picturePath}`,
        pictureMinimapPath: `http://adasremote.natapp1.cc/pictures/${image.pictureMinimapPath}`
      };
    });
    console.table("121212+", picList.value)
    console.log("DBViewOne fetch MODIFIED picList succeeds: ", picList);

    // picList.forEach((onePic) => {
    //   if (!item.pictureId) {
    //     console.error("No pic fetched", item);
    //     return;
    //   }
    //   picList.value.push({
    //     modelName: item.modelName,
    //     modelAlgorithm: item.modelAlgorithm,
    //     creationTime: item.creationTime,
    //     description: item.description,
    //     modelId: item.modelId,
    //     modelType: item.modelType,
    //     status: item.status,
    //   });
    // });
  } catch (error) {
    console.error("Error fetching pictureList:", error);
  }
};

// 切换多选模式
const toggleSelectionMode = () => {
  selectionMode.value = !selectionMode.value;
  if (!selectionMode.value) {
    editList.value = []; // 退出多选模式时清空选择
  }
};
const selectAllPic = () => {
  editList.value = picList.value.map((image) => image.pictureId);
};

const deselectAllPic = () => {
  editList.value = [];
};

const confirmSharpen = async () => {
  sharpenDialogVisible.value = false;
  operation.value = "sharpen";
  await processImages();
};

const confirmCrop = async () => {
  cropDialogVisible.value = false;
  operation.value = "crop";
  await processImages();
};

// 处理图片操作的通用函数
const processImages = async () => {
  try {
    console.log("10101+", editList.value);
    const requestBody = editList.value.map((id) => ({
      pictureId: id,
      operation: operation.value === "sharpen" ? 2 : 1, // 锐化为2，裁切为1
      detail:
          operation.value === "sharpen"
              ? {strength: sharpenStrength.value}
              : {...cropParams.value},
    })); // 一个 JSON 对象的数组
    console.table(requestBody);

    const response = await PicProcess(requestBody);

    if (response.status) {
      ElMessage.success("处理成功");
      selectionMode.value = false; // 处理完成后退出多选模式
      editList.value = []; // 清空选择
      await listAll(); // 重新获取图片数据
    }
  } catch (error) {
    console.error("处理失败：", error);
    ElMessage.error("处理失败");
  }
};

const processOneImage = async () => {
  try {
    // 假设你想要处理的是editList.value数组中的第一张图片
    const id = editList.value[0]; // 获取第一张图片的ID
    const requestBody = {
      pictureId: id,
      operation: operation.value === "sharpen" ? 2 : 1, // 锐化为2，裁切为1
      detail:
          operation.value === "sharpen"
              ? {strength: sharpenStrength.value}
              : {...cropParams.value},
    }; // 一个 JSON 对象

    console.table(requestBody);
    console.log("Before ProcessOneImage", editList.value);

    editedUrl.value = await PicPreview(requestBody);
    console.log("ProcessOneImage", editList.value);
    if (editedUrl.value) {
      ElMessage.success("处理成功");
      await listAll(); // 重新获取图片数据
    }
  } catch (error) {
    console.error("处理失败：", error);
    ElMessage.error("处理失败");
  }
};

let isCrop = ref(false);
let isSharpen = ref(false);
let ShowEditOneRightColumn = ref(false);
const selectedImage = ref<DatasetOnePic>();
let originalUrl = ref();
let editedUrl = ref("");
const cropContainerRef = ref<HTMLElement | null>(null);
const editing = ref(false); // 编辑状态控制
let imageUrl = ref();

const ChopOne = () => {
  isCrop.value = true;
  isSharpen.value = false;
  editing.value = true;
  console.log("111chop+", imageUrl.value);
  resetCropState();
};

const SharpenOne = () => {
  isSharpen.value = true;
  isCrop.value = false;
  editing.value = true;
  console.log("111sharpen+", imageUrl.value);
  resetCropState();
};

// 裁切框的状态
const cropState = reactive({
  startX: 0,
  startY: 0,
  endX: 0,
  endY: 0,
  isDragging: false,
});
// 重置裁切状态
const resetCropState = () => {
  cropState.startX = 0;
  cropState.startY = 0;
  cropState.endX = 50; // 初始化宽度和高度
  cropState.endY = 50;
  cropState.isDragging = false;
};

// 获取裁切框样式
const cropBoxStyle = reactive({
  top: "0px",
  left: "0px",
  width: "0px",
  height: "0px",
});

const selectImage = (image: DatasetOnePic) => {
  ShowEditOneRightColumn.value = true;
  selectedImage.value = image;
  console.log("00000+ selectedImage:", selectedImage.value);
  originalUrl.value = image.picturePath;
  console.log(originalUrl.value);
  imageUrl.value = image.picturePath;
};

// 计算裁切框样式
const updateCropBoxStyle = () => {
  cropBoxStyle.top = `${cropState.startY}px`;
  cropBoxStyle.left = `${cropState.startX}px`;
  cropBoxStyle.width = `${cropState.endX - cropState.startX}px`;
  cropBoxStyle.height = `${cropState.endY - cropState.startY}px`;
  console.log(
      "444+ 裁切框样式：top, left, width, heigth",
      cropBoxStyle.top,
      cropBoxStyle.left,
      cropBoxStyle.width,
      cropBoxStyle.height
  );
};

// 开始裁切
const startCrop = (event: MouseEvent) => {
  // 获取鼠标点击位置的 x 和 y 坐标
  const x = event.clientX;
  const y = event.clientY;
  // 使用 elementFromPoint 获取鼠标位置下的 DOM 元素并赋值给裁切容器引用
  cropContainerRef.value = document.elementFromPoint(x, y) as HTMLElement;

  if (!cropContainerRef.value) return; // 确保裁切容器已初始化

  const rect = cropContainerRef.value.getBoundingClientRect(); // 获取裁切容器的尺寸和位置
  // console.log("222", rect);
  cropState.startX = event.clientX - rect.left;
  cropState.startY = event.clientY - rect.top;
  console.log("333+ startX,startY:", cropState.startX, cropState.startY);

  cropState.endX = cropState.startX; // 初始化裁切区域的结束坐标
  cropState.endY = cropState.startY;

  cropState.isDragging = true;

  // 在第一次 mousedown 时开始监听 mousemove 和 mouseup 事件
  document.addEventListener("mousemove", crop);
  document.addEventListener("mouseup", endCrop);
};

// 裁切移动
const crop = (event: MouseEvent) => {
  if (!cropState.isDragging || !cropContainerRef.value) return;

  const rect = cropContainerRef.value.getBoundingClientRect();
  cropState.endX = Math.min(rect.width, event.clientX - rect.left);
  cropState.endY = Math.min(rect.height, event.clientY - rect.top);
  updateCropBoxStyle();
};

// 结束裁切
const endCrop = () => {
  cropState.isDragging = false;
  document.removeEventListener("mousemove", crop);
  document.removeEventListener("mouseup", endCrop);
};

// 开始拖动裁切框
const startDragging = (event: MouseEvent) => {
  event.preventDefault(); // 防止浏览器的默认行为
  event.stopPropagation(); // 阻止事件冒泡到图片

  const initialX = event.clientX;
  const initialY = event.clientY;
  const initialStartX = cropState.startX;
  const initialStartY = cropState.startY;
  // 获取当前裁切框的宽度和高度
  const cropWidth = cropState.endX - cropState.startX;
  const cropHeight = cropState.endY - cropState.startY;

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
    // 重新计算 endX 和 endY
    cropState.endX = cropState.startX + cropWidth;
    cropState.endY = cropState.startY + cropHeight;

    updateCropBoxStyle();
  };

  const stopDragging = () => {
    document.removeEventListener("mousemove", drag);
    document.removeEventListener("mouseup", stopDragging);
  };

  document.addEventListener("mousemove", drag);
  document.addEventListener("mouseup", stopDragging);
};

// 保存裁切更改
const saveChanges = async () => {
  const cropContainer = cropContainerRef.value as HTMLElement;
  const image = cropContainer.querySelector("img") as HTMLImageElement;
  console.log("555+", image.naturalWidth);
  console.log("666+", cropContainer.offsetWidth);

  const scaleX = image.naturalWidth / cropContainer.offsetWidth;
  const scaleY = image.naturalHeight / cropContainer.offsetHeight;
  console.log("scaleX:", scaleX, "scaleY", scaleY);

  const cropCanvas = document.createElement("canvas");
  cropCanvas.width = (cropState.endX - cropState.startX) * scaleX;
  cropCanvas.height = (cropState.endY - cropState.startY) * scaleY;

  const ctx = cropCanvas.getContext("2d");
  if (ctx) {
    ctx.drawImage(
        image,
        Math.floor(cropState.startX * scaleX),
        Math.floor(cropState.startY * scaleY),
        Math.floor((cropState.endX - cropState.startX) * scaleX),
        Math.floor((cropState.endY - cropState.startY) * scaleY),
        0,
        0,
        cropCanvas.width,
        cropCanvas.height
    );
    cropParams.value.x = Math.floor(cropState.startX * scaleX);
    cropParams.value.y = Math.floor(cropState.startY * scaleY);
    cropParams.value.width = Math.floor(
        (cropState.endX - cropState.startX) * scaleX
    );
    cropParams.value.height = Math.floor(
        (cropState.endY - cropState.startY) * scaleY
    );
    // editedUrl.value = cropCanvas.toDataURL("image/png");

    if (selectedImage.value) {
      editList.value = [selectedImage.value.pictureId];
    }

    operation.value = "crop";
    await processOneImage();
    console.log("processOneImage FINISHED");

    if (selectedImage.value?.picturePath) {
      editedUrl.value = "";
      editedUrl.value = selectedImage.value.picturePath;
    }
    //手动刷新图片
    const imgElement = new Image();
    imgElement.src = editedUrl.value;
    imgElement.onload = () => {
      console.log("Image reloaded successfully.");
    };

    // const downloadLink = document.createElement("a");
    // downloadLink.href = editedUrl.value;
    // downloadLink.download = "cropped-image.png";
    // downloadLink.click();
  }

  editing.value = false;
};

const saveChangesSharpen = async () => {
  if (selectedImage.value) {
    editList.value = [selectedImage.value.pictureId];
  }
  operation.value = "sharpen";
  await processOneImage();
  if (selectedImage.value?.picturePath) {
    editedUrl.value = "";
    editedUrl.value = selectedImage.value.picturePath;
  }
  editing.value = false;
};

// 取消编辑
const cancelEditing = () => {
  isCrop.value = false;
  isSharpen.value = false;
  resetCropState();
};

onMounted(() => {
  console.log("Enter DBViewOne.");
  listAll();
});

onBeforeUnmount(() => {
  console.log("leave DBViewOne.");
  // 在组件手动卸载之前清理数据或执行其他操作
  console.log("Component will be unmounted.");
  // 例如，清空图片列表
  picList.value = [];
});

// 手动卸载函数
const handleUnload = () => {
  // 在手动卸载之前执行任何需要的清理操作
  console.log("Manual unload triggered.");
  picList.value = []; // 清理数据
  router.push("/index/DBManagement"); // 编程式导航到数据集管理页面
};
</script>

<style scoped>
.datasetViewOneContainer {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 50px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.datasetViewOneContainer :deep(.el-button) {
  margin-left: 10px;
}

.container {
  display: flex;

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

.editing-mode .picGallery {
  width: 50%;
}

.EditOneWorkshop {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: flex-start; /* 开始对齐 */
  width: 50%;
  padding: 20px;
  background-color: #efefef;

}

.originalUrl {
  height: 40%;
}

.image-container {
  width: 260px;
  height: 240px;
}

.lazy-image {
  width: 240px; /* 图片宽度自适应容器宽度 */
  height: 240px; /* 图片高度自适应容器高度 */
  object-fit: cover; /* 保持图片的纵横比，填充整个容器 */
  background-color: #e0e0e0;
}

.select-checkbox {
  position: relative;
  bottom: 5px;
  right: 20px;
  transform: scale(1.5);
}

.datasetViewOneContainer :deep(.el-dialog) {
  width: 300px;
  height: 250px;
  gap: 20px;
}

.datasetViewOneContainer :deep(.el-dialog p) {
  margin-top: 5px;
  margin-bottom: 10px;
  font-size: 16px;
}

.dialog-footer {
  margin-top: 70px;
  float: right;
}

.datasetViewOneContainer :deep(.quickselect) {
  color: #606266;
}

.datasetViewOneContainer :deep(.quickselect:hover) {
  color: #409eff;
}

img {
  width: 100%;
  object-fit: contain;
}

.image {
  max-width: 100%;
  display: block;
  user-select: none; /* 禁用用户选择 */
  pointer-events: none; /* 禁用图片的鼠标事件 */
}

.editor-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  pointer-events: all;
}

.crop-container {
  position: relative;
  width: 100%;
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

.originalpic {
  width: 90%;
  margin: 5px auto 20px auto;
}

.editedpic {
  width: 90%;
  margin: 5px auto 20px auto;
}

.CropParamsView {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;
  gap: 5px;
}

.CropParamsView p {
  margin-left: 20px;
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

.my-icon {
}
</style>
