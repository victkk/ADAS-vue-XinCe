<script setup lang="ts">
import {reactive, ref} from 'vue'
import type {FormInstance, FormRules} from 'element-plus'
import {useRouter} from 'vue-router'
import {ElMessage} from 'element-plus'
import {HttpSend} from "@/request/httpsend";

const router = useRouter()

const ruleFormRef = ref<FormInstance>()

const registerForm = reactive({
  userName: '',
  password: '',
  email: '',
  role: null,
})

const options = [
  {label: '学生', value: 1},
  {label: '教师', value: 0}
]

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      let res = await HttpSend(
          JSON.stringify({
            username: registerForm.userName,
            password: registerForm.password,
            email: registerForm.email,
            role: registerForm.role
          }),
          "user/register",
          "POST"
      );

      if (res.success) {
        ElMessage.success('注册成功')
        await router.push('/');
      } else {
        ElMessage.error('注册失败请重新输入')
      }
    } else {
      ElMessage.error('注册失败请重新输入')
      return false
    }
  })
}

function jumpToLogin() {
  router.push('/')
}

</script>

<template>
  <el-form
      ref="ruleFormRef"
      :model="registerForm"
      style="max-width: 600px"
      label-width="auto"
      class="demo-ruleForm"
  >

    <el-form-item label="用户名" prop="userName">
      <el-input v-model="registerForm.userName" type="text" autocomplete="off"/>
    </el-form-item>

    <el-form-item label="密码" prop="password">
      <el-input v-model="registerForm.password" type="password" autocomplete="off"/>
    </el-form-item>

    <el-form-item label="邮箱" prop="email">
      <el-input v-model="registerForm.email" type="text" autocomplete="off"/>
    </el-form-item>

    <el-form-item label="身份" prop="role">
      <el-select
          v-model="registerForm.role"
          placeholder="请选择角色"
          size="large"
          style="width: 240px"
      >
        <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item>
      <el-button type="success" @click="submitForm(ruleFormRef)"
      >注册
      </el-button
      >
      <el-button type="primary"
      >登录
      </el-button
      >
    </el-form-item>

  </el-form>
</template>

<style scoped>
/* scoped 表示样式仅应用于当前组件 */
label {
  display: block;
  margin: 20px 0 5px;
}

input[type="text"],
input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 8px;
  box-sizing: border-box; /* 定义尺寸计算方式 */
}

button {
  background-color: #3f3010;
  color: red;
  border: blue;
  padding: 10px 20px;
  cursor: pointer;
}

button:hover {
  background-color: #36976b;
}
</style>