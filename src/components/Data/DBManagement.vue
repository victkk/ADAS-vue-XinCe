<template>
  <div class="train-main">
    <div class="train-container">
      <div>
        <el-button round @click="newDB()">创建数据集</el-button>
      </div>
      <div style="display:flex;flex-direction:row; justify-content: space-between;">
      <div>
        <el-input
            v-model="input"
            style="width: 240px"
            placeholder="默认按照名称过滤、搜索"
            :icon="Search"
        />
        <!-- <el-button :icon="Search" class="inside-button" @click="search()"/>   -->
        <el-button
            :icon="RefreshRight"
            class="inside-button"
            @click="clearInput()"
        />
      </div>
        <el-button round @click="refresh()" style="width:60px;margin-right:10px">刷新</el-button>
      </div>

      <el-table
          :data="filteredDB"
          :default-sort="{ prop: 'datasetId', order: 'descending' }"
          style="width: 100%"
          class="form-container"
      >
        <el-table-column
            prop="datasetId"
            label="数据集编号"
            sortable
            width="200"
        />
        <el-table-column prop="datasetName" label="数据集名称" width="200"/>
        <el-table-column
            prop="updateTime"
            label="更新时间"
            sortable
            width="200"
        />
        <el-table-column
            prop="pictureCount"
            label="图片总数"
            sortable
            width="200"
        />
        <el-table-column prop="description" label="描述" width="250"/>
        <el-table-column fixed="right" label="操作" width="100">
          <template #default="scope">
            <el-button
                link
                type="primary"
                size="small"
                @click="viewOneDataset(scope.row)"
            >
              查看
            </el-button>
            <!-- <el-button link type="primary" size="small">Edit</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>

</template>

<script setup lang="ts">
const handleClick = () => {
  console.log("click");
};

import {computed, onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {RefreshRight, Search} from "@element-plus/icons-vue";
import * as Interfaces from "@/request/interface/dataset";
import {GetDatasets} from "@/request/interface/dataset";
import {useUserstore} from "@/store/user";
import {ElMessage, ElMessageBox, ElButton} from "element-plus";

const userStore = useUserstore();
// const userId = userStore.creatorId;
const userId =1;

const router = useRouter();
const input = ref("");

const db = ref<Interfaces.DataSet[]>([]);

const fetchData = async () => {
  try {
    ElMessage.info("列表加载中")
    let res = await GetDatasets({creatorId: userId});
    if (!Array.isArray(res.message)) {
      throw new Error("Invalid response structure");
    }
    res.message.forEach((item) => {
      // if (!item.datasetId) {
      //   console.error("No model fetched", item);
      //   return;
      // }
      db.value.push({
        datasetName: item.datasetName,
        datasetId: item.datasetId,
        updateTime: item.updateTime,
        description: item.description,
        pictureCount: item.pictureCount,
        creatorId: item.creatorId,
        filePath: item.filePath,
        isProcessing: item.isProcessing,
      });
    });
    console.log("Dataset list fetched");
  } catch (error) {
    console.error("Error fetching dataset list:", error);
  }
};

onMounted(() => {
  console.log("Enter DBManagement.");
  fetchData();
});

// 计算属性，用于过滤
const filteredDB = computed(() => {
  return db.value.filter((db) => db.datasetId.toString().includes(input.value));
});


function clearInput() {
  input.value = "";
}

function viewOneDataset(oneDataset: Interfaces.DataSet) {
  console.log("dd+",oneDataset.datasetId)
  router.push({
    path: `/index/DBViewOne/${oneDataset.datasetId}`,
    query: oneDataset,
  });
}


async function refresh(){
  try {
    db.value = [];  // 将 models 清空
    await fetchData();
    ElMessage.success("列表已刷新")
  }
  catch(error){
    ElMessage.error(error.message);
  }
}

function newDB() {
  ElMessageBox.alert(
      `
    <div class="flex__container" style="padding:5px 10px;display:flex;gap:10px;">
      <el-button class="flex__item" onclick="window.induct()"
       onmouseover="this.style.color='#409eff'"
              onmouseout="this.style.color=''" style="cursor: pointer;font-size:16px">导入</el-button>
      <el-button class="flex__item" onclick="window.collect()" onmouseover="this.style.color='#409eff'"
              onmouseout="this.style.color=''"  style="cursor: pointer;font-size:16px">采集</el-button>
      <el-button class="flex__item" onclick="window.clone()" onmouseover="this.style.color='#409eff'"
              onmouseout="this.style.color=''"  style="cursor: pointer;font-size:16px">克隆</el-button>
    </div>
    `,
      '选择创建数据集的方式：',
      {
        dangerouslyUseHTMLString: true,
        showClose: true,
        confirmButtonText: '取消',
        callback: (action: string) => {
          if (action === 'confirm') {
            ElMessage({
              type: 'info',
              message: '已取消创建'
            });
          }
        },
      }
  );
}

// 使按钮的点击事件可用
window.induct = () => {
  ElMessageBox.close();
  router.push("/newDataset/induct");
}

window.collect = () => {
  ElMessageBox.close();
  router.push("/newDataset/collect");
}

window.clone = () => {
  ElMessageBox.close();
  router.push("/newDataset/clone");
}

</script>

<style scoped>
.train-main {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  padding: 20px;
  gap: 20px;
  overflow-x: hidden;
}

.train-container {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  gap: 10px;
  background-color: #ffffff;
  border-radius: 10px;
  padding: 20px;
}

.inside-button {
  width: 5px;
  margin: 0;
}


</style>
