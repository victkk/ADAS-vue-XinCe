<template>
  <el-form
      ref="trainFormRef"
      :model="trainForm"
      :rules="rules"
      label-width="120px"
      class="train-form"
      :size="formSize"
      status-icon
  >
    <!-- 基本信息 -->
    <el-card class="box-card">
      <div slot="header">
        <span>基本信息</span>
      </div>
      <el-form-item label="训练名称" prop="trainName">
        <el-input v-model="trainForm.trainName"/>
      </el-form-item>
<!--      <el-form-item label="创建者 ID" prop="creatorId">-->
<!--        <el-input v-model.number="trainForm.creatorId" type="number"/>-->
<!--      </el-form-item>-->
      <el-form-item label="模型 ID" prop="modelId">
        <el-input v-model.number="trainForm.modelId" type="number"/>
      </el-form-item>
      <el-form-item label="数据集 ID" prop="datasetId">
        <el-input v-model.number="trainForm.datasetId" type="number"/>
      </el-form-item>
    </el-card>

    <!-- 超参数设置 -->
    <el-card class="box-card">
      <div slot="header">
        <span>超参数设置</span>
      </div>
      <el-form-item label="Epoch" prop="hyperParameter.epoch">
        <el-input v-model.number="trainForm.hyperParameter.epoch" type="number"/>
      </el-form-item>
      <el-form-item label="学习率" prop="hyperParameter.learningRate">
        <el-input v-model.number="trainForm.hyperParameter.learningRate" type="number"/>
      </el-form-item>
    </el-card>

    <!-- 卷积层设置 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span >卷积层设置</span>
        <el-button type="primary"  @click="addConvLayer" style="float: right;">
          添加卷积层
        </el-button>
      </div>
      <div v-for="(layer, index) in trainForm.config.convLayers" :key="index" class="layer-card">
        <el-card shadow="never">
          <div slot="header" class="clearfix">
            <span>卷积层 {{ index + 1 }}</span>
            <el-icon  @click="removeConvLayer(index)" style="float: right;color:#409eff;"><Delete /></el-icon>

          </div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="输入通道数" :prop="'config.convLayers.' + index + '.inChannels'">
                <el-input v-model.number="layer.inChannels" type="number"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="输出通道数" :prop="'config.convLayers.' + index + '.outChannels'">
                <el-input v-model.number="layer.outChannels" type="number"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="卷积核大小" :prop="'config.convLayers.' + index + '.kernelSize'">
                <el-input v-model.number="layer.kernelSize" type="number"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="步长" :prop="'config.convLayers.' + index + '.stride'">
                <el-input v-model.number="layer.stride" type="number"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
      </div>
    </el-card>

    <!-- 全连接层设置 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>全连接层设置</span>
        <el-button type="primary"  @click="addFcLayer" style="float: right;">
          添加全连接层
        </el-button>
      </div>
      <div v-for="(layer, index) in trainForm.config.fcLayers" :key="index" class="layer-card">
        <el-card shadow="never">
          <div slot="header" class="clearfix">
            <span>全连接层 {{ index + 1 }}</span>
            <el-icon @click="removeFcLayer(index)" style="float: right;color:#409eff;"><Delete /></el-icon>
          </div>
          <el-form-item label="输出特征数" :prop="'config.fcLayers.' + index + '.outFeatures'">
            <el-input v-model.number="layer.outFeatures" type="number"/>
          </el-form-item>
        </el-card>
      </div>
    </el-card>

    <!-- 其他设置 -->
    <el-card class="box-card">
      <div slot="header">
        <span>其他设置</span>
      </div>
      <el-form-item label="Flatten Size" prop="config.flattenSize">
        <el-input v-model.number="trainForm.config.flattenSize" type="number"/>
      </el-form-item>
    </el-card>

    <!-- 提交与重置按钮 -->
    <div style="text-align: center;width:100%;display:flex;flex-direction: row;justify-content: center">
      <el-button type="primary" @click="submitForm(trainFormRef)">
        创建
      </el-button>
      <el-button @click="resetForm(trainFormRef)">重置</el-button>
      <el-button @click="exit">取消</el-button>
    </div>
  </el-form>
</template>

<script lang="ts" setup>

import {Delete} from '@element-plus/icons-vue';
import {reactive, ref} from 'vue';
import {type ComponentSize, ElMessage, type FormInstance, type FormRules} from 'element-plus';
import {NewTrainJob, PostNewTrainJob} from "@/request/interface/train";
import {useRouter} from "vue-router";

// Form size and data
const formSize = ref<ComponentSize>('default');
const trainFormRef = ref<FormInstance>();
const trainForm: NewTrainJob = reactive<NewTrainJob>({
  trainName: '',
  creatorId: 1,
  datasetId: 1,
  modelId: 1,
  hyperParameter: {
    epoch: 1,
    learningRate: 0.01
  },
  config: {
    convLayers: [
      {
        inChannels: 3,
        outChannels: 24,
        kernelSize: 5,
        stride: 1
      },
      {
        inChannels: 24,
        outChannels: 36,
        kernelSize: 5,
        stride: 1
      },
      {
        inChannels: 36,
        outChannels: 48,
        kernelSize: 5,
        stride: 1
      },
      {
        inChannels: 48,
        outChannels: 64,
        kernelSize: 5,
        stride: 1
      },
      {
        inChannels: 64,
        outChannels: 72,
        kernelSize: 5,
        stride: 1
      }
    ],
    flattenSize: 12672,
    fcLayers: [
      {
        outFeatures: 1200
      },
      {
        outFeatures: 90
      },
      {
        outFeatures: 3
      }
    ]
  }
});

const rules = reactive<FormRules<NewTrainJob>>({
  trainName: [{required: true, message: '请输入训练名称', trigger: 'blur'}],
  creatorId: [{required: true, message: '请输入创建者 ID', trigger: 'blur'}],
  datasetId: [{required: true, message: '请输入数据集 ID', trigger: 'blur'}],
  modelId: [{required: true, message: '请输入模型 ID', trigger: 'blur'}],
  'hyperParameter.epoch': [{required: true, message: '请输入 Epoch', trigger: 'blur'}],
  'hyperParameter.learningRate': [{required: true, message: '请输入学习率', trigger: 'blur'}],
  'config.flattenSize': [{required: true, message: '请输入 Flatten Size', trigger: 'blur'}],
});

// 添加卷积层
const addConvLayer = () => {
  trainForm.config.convLayers.push({
    inChannels: 0,
    kernelSize: 0,
    outChannels: 0,
    stride: 0
  });
};

// 删除卷积层
const removeConvLayer = (index: number) => {
  trainForm.config.convLayers.splice(index, 1);
};

// 添加全连接层
const addFcLayer = () => {
  trainForm.config.fcLayers.push({
    outFeatures: 0
  });
};

// 删除全连接层
const removeFcLayer = (index: number) => {
  trainForm.config.fcLayers.splice(index, 1);
};


const router = useRouter();


// Submit form
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;

  await formEl.validate((valid, fields) => {
    if (valid) {
      // 表单验证通过，将表单数据传递给 NewTrainJob 方法
      console.log(typeof trainForm.creatorId);
      PostNewTrainJob(trainForm)
          .then(response => {
            console.log('Train job created successfully:', response);
          })
          .catch(error => {
            console.error('Error creating train job:', error);
          });
      ElMessage.success("成功创建")
      router.push("/index/ModelTrain")
    } else {
      console.log('Error submit!', fields);
    }
  });
};

// 重置表单
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  trainForm.config.convLayers = [];
  trainForm.config.fcLayers = [];
};

const exit = ()=>{
  router.push("/index/ModelTrain");
}
</script>
<style scoped>
.train-form {
  width: 80%;
  margin: 0 auto;
}

.box-card {
  margin-bottom: 20px;
  border-radius: 5px;
  width:100%;
}

.layer-card {
  margin-top: 10px;
}
.clearfix{
  margin-bottom:20px;
  box-sizing: content-box;
  height:fit-content;
}

</style>