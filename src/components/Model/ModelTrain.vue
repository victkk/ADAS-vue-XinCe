<template>
  <div class="train-main">
    <div class="train-container">
      <div>
        <el-button round @click="newTrain()">创建训练作业</el-button>
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
          :data="filteredmodels"
          :default-sort="{ prop: 'date', order: 'descending' }"
          style="width: 100%"
          class="form-container"
      >
        <el-table-column prop="trainId" label="作业编号" width="150"/>
        <el-table-column prop="trainName" label="作业名称" width="150"/>
        <el-table-column prop="trainStatus" label="作业状态" width="150"/>
        <el-table-column
            prop="runTime"
            label="运行时长(hh:mm:ss)"
            width="180"
        >
          <template #default="scope">
            {{ formatRunTime(scope.row.runTime) }}
          </template>
        </el-table-column>
        <el-table-column
            prop="creationTime"
            label="创建时间"
            sortable
            width="150"
        />
        <el-table-column prop="creatorName" label="创建者" width="150"/>
        <el-table-column prop="modelName" label="模型名称" width="150"/>
        <el-table-column prop="modelDescription" label="模型描述" width="250"/>

        <el-table-column fixed="right" label="操作" width="120">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="trainOne(scope.row)">
              训练
            </el-button>
            <!--            <el-button link type="primary" size="small">Edit</el-button>-->
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref, computed, onBeforeMount} from "vue";
import {useRouter} from "vue-router";
import {Search, RefreshRight} from "@element-plus/icons-vue";
import {GetMyTrain, GetTaskStatus, TrainingInfo} from "@/request/interface/train";
import {useUserstore} from "@/store/user";
import {ElMessage} from "element-plus";
import {GetDatasets} from "@/request/interface/dataset";

const userStore = useUserstore();
const userId = userStore.creatorId;
//const userId = 1;
const userRole = userStore.role;
const userName = userStore.creator;

const handleClick = () => {
  console.log("click");
};

const router = useRouter();
const input = ref("");

const models = ref<TrainingInfo[]>([{
  //测试数据
  trainName: "test",
  trainId: 98,
  trainStatus: 1,
  runTime: 11111111,
  creationTime: "testCreationTime",
  modelName: "test modelName",
  modelDescription: "test modelDescription",
  creatorName: "me",
}]);

onBeforeMount(async () => {
  ElMessage.info("列表加载中")
  let res = await GetMyTrain({
    creatorId: userId,
  });
  res.message.forEach((item) => {
    models.value.push({
      trainName: item.trainName,
      trainId: item.trainId,
      trainStatus: item.trainStatus,
      runTime: item.runTime,
      creationTime: item.creationTime,
      modelName: item.modelName,
      modelDescription: item.modelDescription,
      creatorName: item.creatorName,
    });
  });
  console.log("trainingInfo fetched");
});

//   // 定义 fetchData 方法
// const fetchData = async () => {
//     try {
//         let res = await GetMyTrain({ creatorId: userId });
//         res.trainingInfos.forEach(item => {
//             models.value.push({
//                 trainName: item.trainName,
//                 trainId: item.trainId,
//                 trainType: item.trainType,
//                 trainStatus: item.trainStatus,
//                 runTime: item.runTime,
//                 creationTime: item.creationTime,
//                 modelName: item.modelName,
//                 modelScale: item.modelScale,
//                 modelDescription: item.modelDescription,
//                 creatorId: userId.toString(),
//                 creatorName: userName
//             });
//         });
//         console.log('trainingInfo fetched');
//     } catch (error) {
//         console.error('Error fetching training data:', error);
//     }
// };

// // 使用 onMounted 生命周期钩子
// onMounted(() => {
//     fetchData();
// });

// 计算属性，用于过滤训练作业
const filteredmodels = computed(() => {
  return models.value.filter((model) => model.trainName.includes(input.value));
});

function clearInput() {
  input.value = "";
}

function search() {
  // 过滤操作由计算属性处理，这里无需实际执行搜索
}

function newTrain() {
  router.push("/newTrain");
}

// async function trainOne(trainTask: TrainingInfo) {
//   try {
//     let res = await GetTaskStatus({trainId: trainTask.trainId});
//     if (res && res.message) {
//       trainTask.trainStatus = res.message.trainStatus;
//       trainTask.runTime = res.message.runTime;
//     } else {
//       console.error('Invalid response from GetTaskStatus:', res);
//     }
//   } catch (error) {
//     console.error('Error fetching task status:', error);
//   }
// }

async function trainOne(trainTask: TrainingInfo) {
  try {
    // 假设这个函数是发送训练任务的请求
    let startResponse = await GetTaskStatus({trainId: trainTask.trainId});

    if (startResponse && startResponse.status) {
      // 任务启动成功后开始轮询任务状态
      const pollingInterval = 10000; // 每10s轮询一次
      const maxAttempts = 120; // 最大轮询次数: =20min
      let attempt = 0;
      const intervalId = setInterval(async () => {
        attempt++;

        // 获取任务状态
        let res = await GetTaskStatus({ trainId: trainTask.trainId });
        if (res && res.message) {
          trainTask.trainStatus = res.message.trainStatus;
          trainTask.runTime = res.message.runTime;

          console.log(`轮询次数: ${attempt}, 当前状态: ${trainTask.trainStatus}`);

          // 假设状态为 2 表示训练完成
          if (trainTask.trainStatus === 3 || attempt >= maxAttempts) {
            clearInterval(intervalId); // 停止轮询
            if (trainTask.trainStatus === 3) {
              console.log('训练完成');
              ElMessage.success('训练任务已完成');
            } else if (trainTask.trainStatus === 2) {
              console.log('训练失败：训练时抛出异常');
              ElMessage.error('训练失败');
            }
            else {
              console.log('轮询达到最大次数，停止轮询');
              ElMessage.warning('训练任务超时未完成');
            }
          }
        } else {
          console.error('获取任务状态时出错:', res);
          clearInterval(intervalId); // 停止轮询
          ElMessage.error('任务状态获取失败');
        }
      }, pollingInterval);
    } else {
      console.error('任务启动失败:', startResponse);
      ElMessage.error('任务启动失败');
    }
  } catch (error) {
    console.error('任务操作失败:', error);
    ElMessage.error('任务操作失败');
  }
}



function formatRunTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}


async function refresh(){
  try {
    ElMessage.info("列表加载中")
    models.value = [];  // 将 models 清空
    let res = await GetMyTrain({
      creatorId: userId,
    });
    res.message.forEach((item) => {
      models.value.push({
        trainName: item.trainName,
        trainId: item.trainId,
        trainStatus: item.trainStatus,
        runTime: item.runTime,
        creationTime: item.creationTime,
        modelName: item.modelName,
        modelDescription: item.modelDescription,
        creatorName: item.creatorName,
      });
    });
    console.log("trainingInfo fetched");
    ElMessage.success("列表已刷新")
  }
  catch(error){
    ElMessage.error(error.message);
  }
}
</script>

<style scoped>
.train-main {
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 20px;
  overflow-x: hidden;
  width: 100%;
}

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
