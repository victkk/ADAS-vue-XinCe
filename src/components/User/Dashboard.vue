<script setup lang="ts">
import {GetDatasets} from "@/request/interface/dataset";
import {useUserstore} from "@/store/user";
import {MySubscription} from "@/request/interface/model";
import {ref, onMounted} from "vue"

const userStore = useUserstore();
// const userId = userStore.creatorId;
const userId = 1;

let datasetCnt = ref(0)
let algCnt = ref(0)
let modelCnt = ref(0)

const fetchDatasetCnt = async () => {
  try {
    let res = await GetDatasets({creatorId: userId});
    if (!Array.isArray(res.message)) {
      throw new Error("Invalid response structure");
    }
    res.message.forEach((item) => {
          if (!item.datasetId) {
            console.error("No dataset fetched", item);
            return;
          }
          datasetCnt++;
        }
    );
    console.log("In Overview-- Dataset list CNT fetched");
  } catch (error) {
    console.error("In Overview-- Error fetching dataset list CNT:", error);
  }
};

const fetchModelCnt = async () => {
  try {
    let res = await MySubscription({creatorId: userId});
    if (!Array.isArray(res.message)) {
      throw new Error("Invalid response structure");
    }
    res.message.forEach((item) => {
      if (!item.modelId) {
        console.error("No model fetched", item);
        return;
      }
      modelCnt++;
    });
    console.log("In Overview-- Private Model list CNT fetched");
  } catch (error) {
    console.error("In Overview-- Error fetching private model list CNT:", error);
  }
};

onMounted(() => {
  console.log("Enter DBManagement.");
  fetchDatasetCnt();
});

</script>

<template>
  <div class="dashboardPage">
  <div class="dashboard">
    <div class="header" style="font-size:20px;color:#2f2f2f;">项目统计</div>
    <div class="block">
      <div class="block-item">
        <div class="blockinfo">{{ datasetCnt }}</div>
        <div class="blockname">数据集数量</div>

      </div>
      <div class="block-item">
        <div class="blockinfo">{{ algCnt }}</div>
        <div class="blockname">算法数量</div>

      </div>
      <div class="block-item">
        <div class="blockinfo">{{ modelCnt }}</div>
        <div class="blockname">模型数量</div>

      </div>
    </div>
  </div>
  <div class="dashboard">
    <div class="header" style="font-size:20px;color:#2f2f2f;">最近训练结果</div>
    <div class="block">
      <div class="block-item">


      </div>
    </div>
  </div>
  </div>
</template>

<style scoped>
.dashboardPage{
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  flex-grow: 1;
}
.dashboard {
  border: 1.5px solid #60626633;
  border-radius: 10px;
  margin: 20px;
  padding: 20px;
  height: fit-content;
}

.block {
  margin-top: 30px;
  display: flex;
  flex-direction: row;
}

.block-item {
  margin-right: 200px;
  display: flex;
  flex-direction: column;
  gap: 10px;

}
.blockinfo{
  font-size:32px;
  color:#2f2f2f;
}
.blockname{
  color:#606266;
}
</style>