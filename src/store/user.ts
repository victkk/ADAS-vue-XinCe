import { defineStore } from "pinia";

export const useUserstore = defineStore("user", {
  state: () => ({
    creatorId: 1, //默认为0
    creator: "",
    role: "student", // 默认角色为学生
  }),
  getters: {
    // 定义获取器，如果需要
  },
  actions: {
    // 设置用户角色
    setUserRole(newRole: string) {
      this.role = newRole;
    },
    // 设置用户名
    setUserID(newId: number) {
      this.creatorId = newId;
    },
    setUserName(newName: string) {
      this.creator = newName;
    },
  },
}); //没有分号

//后续使用：
// import { useUserstore } from "@/store/user";
// const userStore = useUserstore();
// const userId = userStore.creatorId;
// const userRole = userStore.role;
