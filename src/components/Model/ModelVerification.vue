<template>
  <div class="outer-container">
    <div class="valid-main">
      <h3>1. 检查模型车状态，并选择空闲的模型车使用</h3>
      <div class="valid-container">

        <el-button round @click="getCar()" style="width:180px">获取当前可用模型车</el-button>
        <div style="display:flex;flex-direction:row; margin-top:5px">
          <!--          <h5>当前可用：</h5>-->
          <!--          <div class="car-list">-->

          <!--      <span v-for="(car, index) in availableCars" :key="index" class="car-item">-->
          <!--        {{ car }}-->
          <!--      </span>-->

          <!--          </div>-->
          <el-table
              :data="availableCars"
              style="width: auto; height:200px;overflow-y:auto"
              class="form-container"
          >
            <el-table-column prop="carId" label="模型车编号" width="150"/>
            <el-table-column prop="statusName" label="模型车状态" width="150"/>
            <el-table-column fixed="right" label="操作" width="120">
              <template #default="scope">
                <el-button link type="primary" size="small" @click="chooseCarId(scope.row)">
                  选择
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div style="display: flex;flex-direction: row;" v-if="showChosenCarId">
          <p>
            选择的模型车编号 : {{ carId }}
          </p>
        </div>
      </div>
    </div>

    <div class="valid-main">
      <h3>2. 选择一个训练任务，点击“验证”</h3>
      <div class="valid-container">
        <div style="display:flex;flex-direction:row; justify-content: space-between;">
          <h4>可验证的训练任务</h4>
          <el-button round @click="refresh()" style="width:60px;margin-right:10px">刷新</el-button>
        </div>
        <el-table
            :data="models"
            :default-sort="{ prop: 'date', order: 'descending' }"
            style="width: 100%"
            class="form-container"
        >
          <el-table-column prop="trainId" label="作业编号" width="150"/>
          <el-table-column prop="trainName" label="作业名称" width="150"/>
          <el-table-column prop="trainStatus" label="作业状态" width="150"/>
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
              <el-button link type="primary" size="small" @click="Validate(scope.row)">
                验证
              </el-button>
              <el-button link type="primary" size="small" v-if="AbleToEnter(scope.row)"
                         @click="EnterValidation(scope.row)">进入验证
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="productId" fixed="right" label="验证编号" width="120"/>
          <el-table-column prop="carId" fixed="right" label="模型车" width="80"/>
          <el-table-column label="场地状态" width="120" fixed="right">
            <template #default="scope">
              <span v-if="scope.row.status === 0">可以进入</span>
              <span v-else-if="scope.row.status === 1">等待场地</span>
              <span v-else-if="scope.row.status === 2">服务器异常</span>
            </template>
          </el-table-column>
        </el-table>

      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {onBeforeMount, ref, computed, onMounted} from "vue";
import {getAvailableCar, getProduct, StartValidation} from "@/request/interface/validation.ts";
import {GetMyTrain, TrainingInfo} from "@/request/interface/train";

import {useUserstore} from "@/store/user";
import {useRouter} from "vue-router";
import {ElMessage, ElNotification} from "element-plus";

const userStore = useUserstore();
const userId = userStore.creatorId;

interface TVInfo {
  trainName: string;
  trainId: number;
  trainStatus: number;
  runTime: number;
  creationTime: string;
  modelName: string;
  modelDescription: string;
  creatorId: number;
  creatorName: string;
  productId: string;
  status: number;
  carId: number;
}

interface CarStatus {
  modelId: number;
  carId: number;
  status: number;
  statusName: string;
}

const models = ref<TVInfo[]>([{}]);

let availableCars = ref<CarStatus[]>([])
let carId = ref(-1)
let showChosenCarId = ref<boolean>(false);


const statusMap: { [key: number]: string } = {
  0: "掉线",
  1: "空闲",
  2: "被占用",
};

async function getCar() {
  ElMessage.info("正在获取模型车");
  let res = await getAvailableCar();
  if (!Array.isArray(res.message)) {
    throw new Error("Invalid response structure");
  } else {
    availableCars.value = []
    res.message.forEach((item) => {
      availableCars.value.push({
        modelId: item.modelId,
        carId: item.carId,
        status: item.status,
        statusName: statusMap[item.status],
      });
    });
    ElMessage.success("模型车列表已刷新");
  }
}


onBeforeMount(
    async () => {
      await getCar();
      let res = await GetMyTrain({
        creatorId: userId,
      });
      for (const item of res.message) {
        // 创建一个初始的 TVInfo 对象，将 API 返回的基础信息放入
        const modelData: TVInfo = {
          trainName: item.trainName,
          trainId: item.trainId,
          trainStatus: item.trainStatus,
          runTime: item.runTime,
          creationTime: item.creationTime,
          modelName: item.modelName,
          modelDescription: item.modelDescription,
          creatorName: item.creatorName,
          productId: null, // 初始化为默认值
          status: null, // 初始化为默认值
          carId: null, // 初始化为默认值
        };


        const resV = await getProduct({ trainId: item.trainId });
        if (resV) {
          modelData.productId = resV.productId;
          modelData.status = resV.status;
          modelData.carId = resV.carId;
        }

        models.value.push(modelData);
      }

      console.log("trainedModelsInfo fetched");
      ElMessage.success("训练任务列表加载成功");
      //
    });


function chooseCarId(oneCarChosen: CarStatus) {
  if (oneCarChosen.status !== 1) {
    ElNotification({
      title: '重新选择模型车',
      message: '当前车辆不可用',
      type: 'error',
    })
    return 2;
  }
  carId.value = oneCarChosen.carId;
  showChosenCarId.value = true;
  return 1;
}

onMounted(() => {
  console.log("ccc", carId.value)
});

async function Validate(oneToValidate: TVInfo) {
  try {
    if (carId.value !== -1) {
      console.log("CarId chosen: ", carId.value);
      const infoV = {
        trainId: oneToValidate.trainId,
        creatorId: userId,
        carId: carId.value,
      }
      ElMessage.success("正在处理验证请求");
      let res = await StartValidation(infoV);
      console.log(res.message);
      oneToValidate.productId = res.message;
      oneToValidate.status = res.status;
      oneToValidate.carId = carId.value;
      console.log(oneToValidate);

    } else {
      ElNotification({
        title: '请选择模型车',
        message: '您未选择模型车',
        type: 'error',
      })
    }
  } catch (error) {
    console.error("验证处理失败：", error);
    ElMessage.error("验证处理失败");
  }
}

function AbleToEnter(oneToValidate: TVInfo) {
  if (oneToValidate.status == 0 && oneToValidate.productId) {
    return true;
  }
}


const router = useRouter();

function EnterValidation(oneValid: TVInfo) {
  router.push({
    path: `/index/ModelVerification/${oneValid.productId}`,
  });
}

async function refresh() {
  try {
    ElMessage.info("列表刷新中")
    models.value = [];
    let res = await GetMyTrain({
      creatorId: userId,
    });
    for (const item of res.message) {
      const modelData: TVInfo = {
        trainName: item.trainName,
        trainId: item.trainId,
        trainStatus: item.trainStatus,
        runTime: item.runTime,
        creationTime: item.creationTime,
        modelName: item.modelName,
        modelDescription: item.modelDescription,
        creatorName: item.creatorName,
        productId: null,
        status: null,
        carId: null,
      };

      // 暂时
      const resV = await getProduct({ trainId: item.trainId });
      if (resV) {
        modelData.productId = resV.productId;
        modelData.status = resV.status;
        modelData.carId = resV.carId;
      }

      models.value.push(modelData);
    }
    console.log("trainedModelsInfo fetched");
    ElMessage.success("列表已刷新")
  } catch (error) {
    ElMessage.error(error.message);
  }
}
</script>

<style>
.outer-container {
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  width: 100%;
}

.valid-main {
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 20px;

}

.valid-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #ffffff;
  border-radius: 10px;
  padding: 20px;
}
</style>

