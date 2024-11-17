<template>
  <div class="data-table">
    <div class="train-container">

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
        <el-table-column fixed="right" label="操作" width="120">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="handleSelect(scope.row)">
              订阅
            </el-button>

          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
//我的模型
import {ref, computed, onMounted} from "vue";
import {Search, RefreshRight} from "@element-plus/icons-vue";
import {ModelPossession, SubscribeModel, SubscribePublicModel, ViewModelMarket} from "@/request/interface/model";
import {useRouter} from "vue-router";
import {HttpSend} from "@/request/httpsend";
import {useUserstore} from "@/store/user";
import {ElMessage} from "element-plus";

const userStore = useUserstore();
const userId = userStore.creatorId;
const router = useRouter();

const input = ref("");
let subscibeModelInfo = ref<SubscribeModel>({
  modelId:-1,
  creatorId:1,
});


// interface ModelPossession {
//   modelName: string;
//   modelAlgorithm: string;
//   creationTime: string;
//   description: string;
//   modelId: number;
//   modelType: number;
//   status: number;
// }

const modelList = ref<ModelPossession[]>([
//测试数据
  {
    modelName: 'Model A',
    modelAlgorithm:'Alg 1',
    creationTime: '20',
    description: 'test',
    modelId: 19823,
    modelType: 1,
    status:0,
  },
]);



const getMarketModels = async () => {
  try {
    // let res_getMarketModels = await HttpSend(
    //     null,
    //     "model/getPublicModels",
    //     "GET"
    // );
    let res_getMarketModels = await ViewModelMarket();
    // if (!Array.isArray(res_getMarketModels)) {
    //   throw new Error("Invalid response structure");
    // }
    res_getMarketModels.message.forEach((item) => {
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
    console.log("Models in market fetched");
  } catch (error) {
    console.error("Error fetching models in market:", error);
  }
};

onMounted(getMarketModels);




// 计算属性，用于过滤训练作业
const filteredmodels = computed(() => {
  return modelList.value.filter((model) =>
      model.modelName.includes(input.value)
  );
});

async function handleSelect(oneModel: ModelPossession) {
  console.log("Select this model: ", oneModel);
  subscibeModelInfo.value.modelId = oneModel.modelId;
  subscibeModelInfo.value.creatorId = userId;
  try {
    let res = await SubscribePublicModel(subscibeModelInfo);

    if (res) {
      ElMessage({
        message: '模型订阅成功',
        type: 'success',
      });
    } else {
      ElMessage({
        message: '模型订阅失败',
        type: 'warning',
      });
    }
  } catch (error) {
    ElMessage({
      message: '请求失败，请重试',
      type: 'error',
    });
    console.error("Error during model subscription:", error);
  }
}


function newEntry() {
  router.push("/newTrain");
}

function clearInput() {
  input.value = "";
}
</script>

<style scoped>
.data-table {
  flex: 1; /* 占用剩余空间 */
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 20px;
  width: 100%;
  overflow-x: hidden;
}

.train-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 10px;
  background-color: #ffffff;
  border-radius: 10px;
  padding: 20px;
}


.inside-button {
  width: 5px;
  margin: 0;
}

/*
.form-container {
  display: flex;
  flex-grow: 1;
  overflow-x: auto;
  width: 100%;
  table-layout: fixed;
}
 */
</style>
