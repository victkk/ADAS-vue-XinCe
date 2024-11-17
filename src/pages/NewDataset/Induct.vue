<template>
  <div class="create-database">
    <span>通过导入创建数据集</span>
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="数据库名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="数据库描述">
        <el-input type="textarea" v-model="form.description"></el-input>
      </el-form-item>

      <el-upload
        v-model:file-list="fileList"
        :data="uploadFiles"
        class="upload-demo"
        action="http://adasremote.natapp1.cc/dataset/upload"
        multiple
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :auto-upload="false"
        :limit="3"
        :on-exceed="handleExceed"
      >
        <el-button type="primary">Click to upload</el-button>
        <template #tip>
          <div class="el-upload__tip">请上传压缩包（.zip/.rar格式）</div>
        </template>
      </el-upload>

      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import { descriptionProps, ElMessage, ElMessageBox } from "element-plus";
import type { UploadProps, UploadUserFile } from "element-plus";
import { CreateDataset } from "@/request/interface/dataset";
import {UploadInduct} from "@/request/interface/dataset";
// import { HttpSend, HttpSendFormData } from "@/request/httpsend";
import axios from "axios";
import { useUserstore } from "@/store/user";
const userStore = useUserstore();
const userId = userStore.creatorId;

let uploadFiles = ref();

interface DatasetInfo4Creation {
  description: string;
  datasetName: string;
  creatorId: number;
  filePath: string;
}

const form = ref({
  name: "",
  description: "",
});
const formData = new FormData();
const fileList = ref<UploadUserFile[]>([]);
let submitFormData = ref<DatasetInfo4Creation>({
  description: form.value.description,
  datasetName: form.value.name,
  creatorId: userId,
  filePath: "null",
});

const handleRemove: UploadProps["onRemove"] = (file, uploadFiles) => {
  console.log(file, uploadFiles);
};

const handlePreview: UploadProps["onPreview"] = (uploadFile) => {
  console.log(uploadFile);
};

const handleExceed: UploadProps["onExceed"] = (files, uploadFiles) => {
  ElMessage.warning(
    `The limit is 3, you selected ${files.length} files this time, add up to ${
      files.length + uploadFiles.length
    } totally`
  );
};

//删除文件之前的钩子,若返回 false 或者返回 Promise 且被 reject，则停止删除停止执行handleRemove事件
const beforeRemove: UploadProps["beforeRemove"] = (uploadFile, uploadFiles) => {
  return ElMessageBox.confirm(`取消文件${uploadFile.name} ?的上传`).then(
    () => true,
    () => false
  );
};

async function submitForm() {
  // 上传文件 : zip 压缩包
  //不会写
  let res_submit_files = await UploadInduct(fileList);
  console.log("1111+",res_submit_files);
  if (res_submit_files) {
    submitFormData.value.filePath = res_submit_files;
  }

  console.log(
    "upload filePath (received from axios)-- ",
    submitFormData.value.filePath
  );

  //提交表单
  if (1) {
    let res_submit = await HttpSend(
      JSON.stringify(submitFormData),
      "dataset/new",
      "POST"
    );
    if (res_submit) {
      console.log("上传文件成功。新建数据库成功。");
    }
  }
}

function resetForm() {
  form.value.name = "";
  form.value.description = "";
}
</script>

<style scoped>
.create-database {
  width: 80%;
  margin: 50px auto;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  display:flex;
  flex-direction: column;
  gap:20px;
  border-radius: 5px;

}
</style>
