<template>
  <div class="train-container">
    <div>
      <el-button round @click="newEntry()">创建</el-button>
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

    <!-- <el-row class="filter-container">
          <el-col :span="8">
            <el-input
              placeholder="过滤条件：如名称或版本"
              v-model="filterText"
              clearable
            />
          </el-col>
          <el-col :span="4" offset="1">
            <el-button type="primary" @click="searchData">搜索</el-button>
          </el-col>
          <el-col :span="4" offset="1">
          </el-col>
        </el-row> -->

    <el-table
        :data="filteredmodels"
        :default-sort="{ prop: 'date', order: 'descending' }"
        style="width: 100%"
        class="form-container"
    >
      <el-table-column prop="modelName" label="模型名" width="150"/>
      <el-table-column prop="modelId" label="模型号" sortable width="150"/>
      <el-table-column
          prop="creationTime"
          label="创建时间"
          sortable
          width="200"
      />
      <el-table-column prop="modelType" label="模型分类" width="150"/>
      <el-table-column prop="modelAlgorithm" label="算法名" width="150"/>
      <el-table-column prop="status" label="状态" width="150"/>

      <el-table-column prop="description" label="描述" width="400"/>
      <el-table-column label="操作" width="120"></el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
//我的模型
import {ref, computed, onMounted} from "vue";
import {Search, RefreshRight} from "@element-plus/icons-vue";
import {MySubscription} from "@/request/interface/model";
import {useRouter} from "vue-router";
import {useUserstore} from "@/store/user";
import {ElMessage} from "element-plus";

const router = useRouter();
const input = ref("");

interface ModelPossession {
  modelName: string;
  modelAlgorithm: string;
  creationTime: string;
  description: string;
  modelId: number;
  modelType: number;
  status: number;
}

const modelList = ref<ModelPossession[]>([]);

const userStore = useUserstore();
const userId = userStore.creatorId;

const viewPrivate = async () => {
  try {
    ElMessage.info("列表加载中")
    let res = await MySubscription({creatorId: userId});
    if (!Array.isArray(res.message)) {
      throw new Error("Invalid response structure");
    }
    res.message.forEach((item) => {
      if (!item.modelId) {
        console.error("No model fetched", item);
        return;
      }
      modelList.value.push({
        modelName: item.modelName,
        modelAlgorithm: item.modelAlgorithm,
        creationTime: item.creationTime,
        description: item.description,
        modelId: item.modelId,
        modelType: item.modelType,
        status: item.status,
      });
    });
    console.log("Private models fetched");
  } catch (error) {
    console.error("Error fetching private models:", error);
  }
};

onMounted(viewPrivate);


async function refresh() {
  try {
    modelList.value = [];  // 将 models 清空
    await viewPrivate();
    ElMessage.success("列表已刷新")
  } catch (error) {
    ElMessage.error(error.message);
  }
}

// 测试数据
// const models = ref([
//   {
//     modelName: 'Model A',
//     modelVersion: 'v1.2',
//     modelType: 1,
//     creator: 'Alice',
//     updateTime: '20',
//   description: 'test',
//   modelPath: 'xxxxx',
//   modelID: 19823,
// },
// {
//     modelName: 'Model B',
//     modelVersion: 'v2.2',
//     modelType: 1,
//     creator: 'Alice',
//     updateTime: '20',
//   description: 'test',
//   modelPath: 'xxxxx',
//   modelID: 26677,
// }]);

// 计算属性，用于过滤训练作业
const filteredmodels = computed(() => {
  return modelList.value.filter((model) =>
      model.modelName.includes(input.value)
  );
});

function handleDetail(oneModel: ModelPossession) {
  console.log("Look for details", oneModel);
}

function handleEdit(oneModel: ModelPossession) {
  console.log("Edit one model", oneModel);
}

function newEntry() {
  router.push("/newModel");
}

function clearInput() {
  input.value = "";
}
</script>

<style scoped>
.train-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
  gap: 10px;
  background-color: #ffffff;
  border-radius: 10px;
  padding: 20px;
}

.form-container {
  display: flex;
  flex-grow: 1;
  overflow: auto; /* 如果内容超出，显示滚动条 */
  width: 100%;
  table-layout: fixed; /* 表格列宽均匀分布 */
}

.inside-button {
  width: 5px;
  margin: 0;
}
</style>
