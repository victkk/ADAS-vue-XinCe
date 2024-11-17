<template>
  <div class="train-container">
    <div>
      <el-button round @click="modelMarket()"
        >前往模型市场订阅更多模型</el-button
      >
    </div>
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

    <el-table
      :data="filteredmodels"
      :default-sort="{ prop: 'date', order: 'descending' }"
      style="width: 100%"
      class="form-container"
    >
      <el-table-column prop="modelName" label="名称" width="150" />
      <el-table-column prop="modelID" label="模型号" sortable width="150" />
      <el-table-column prop="modelVersion" label="版本" width="150" />
      <el-table-column prop="latestVersion" label="最新版本" width="150" />
      <el-table-column
        prop="creationTime"
        label="创建时间"
        sortable
        width="150"
      />
      <el-table-column prop="description" label="描述" width="200" />
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button size="small" @click="handleDetail(row)">详情</el-button>
          <el-button size="small" @click="handleEdit(row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
//我的模型
import { ref, computed, onMounted } from "vue";
import { Search, RefreshRight } from "@element-plus/icons-vue";
import { ViewPrivate } from "@/request/api";
import { useRouter } from "vue-router";
import { useUserstore } from "@/store/user";

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
    const res = await ViewPrivate({ creatorId: userId });
    res.result.forEach((item) => {
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

function clearInput() {
  input.value = "";
}

function modelMarket() {
  router.push("/index/modelMarket");
}
</script>

<style scoped>
.train-container {
  display: flex;
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
