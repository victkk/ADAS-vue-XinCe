import { createRouter, createWebHistory } from "vue-router";
import { useUserstore } from "@/store/user"; // 导入你的 Pinia 用户 store

import Index from "@/pages/Index.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // {
    //   path: "/",
    //   name: "Login",
    //   component: () =>import ("@/pages/Login.vue"),

    // },
    // {
    //   path: "/register",
    //   name: "Register",
    //   component: () =>import ("@/pages/Register.vue"),
    // },
    {
      path: "/", // 根路径
      redirect: "/index", // 重定向到 /index/dashboard
    },

    {
      path: "/index",
      redirect: "/index/dashboard",
      name: "Index",
      component: Index,
      //     requireAuth:false, //表示该路由需要用户登录才能访问
      //     roles: ['teacher', 'student']
      // },
      children: [
        {
          path: "PersonPage",
          name: "PersonPage",
          component: () => import("@/components/User/PersonPage.vue"),
          // meta: {
          //     requireAuth:false, //表示该路由需要用户登录才能访问
          //     roles: ['teacher', 'student']
          // },
        },
        {
          path: "Dashboard",
          name: "Dashboard",
          component: () => import("@/components/User/Dashboard.vue"),
          // meta: {
          //     requireAuth:false, //表示该路由需要用户登录才能访问
          //     roles: ['teacher', 'student']
          // },
        },
        {
          path: "DBManagement",
          name: "DBManagement",
          component: () => import("@/components/Data/DBManagement.vue"),
          // meta: {
          //     requireAuth:true, //表示该路由需要用户登录才能访问
          //     roles: ['teacher', 'student']
          // },
        },
        {
          path: "DBViewOne/:datasetId",
          name: "DBViewOne",
          component: () => import("@/components/Data/DBViewOne.vue"),
          props:true,
          // meta: {
          //     requireAuth:true, //表示该路由需要用户登录才能访问
          //     roles: ['teacher', 'student']
          // },
        },
        {
          path: "/newDataset/collect",
          name: "Collect",
          component: () => import("@/pages/NewDataset/Collect.vue"),
        },
        {
          path: "/newDataset/induct",
          name: "Induct",
          component: () => import("@/pages/NewDataset/Induct.vue"),
        },
        {
          path: "/newDataset/clone",
          name: "Clone",
          component: () => import("@/pages/NewDataset/Clone.vue"),
        },

        {
          path: "ModelManagement",
          name: "ModelManagement",
          component: () => import("@/components/Model/ModelManagement.vue"),
          // meta: {
          //     requireAuth:true,
          //     roles: ['teacher', 'student']
          // },
        },
        {
          path: "/newModel",
          name: "NewModel",
          component: () => import("@/components/Model/NewModel.vue"),
        },
        {
          path: "ModelTrain",
          name: "ModelTrain",
          component: () => import("@/components/Model/ModelTrain.vue"),
          // meta: {
          //     requireAuth:true,
          //     roles: ['teacher', 'student']
          // },
        },
        {
          path: "/newTrain",
          name: "newTrain",
          component: () => import("@/pages/NewTrain.vue"),
        },
        {
          path: "ModelVerification",
          name: "ModelVerification",
          component: () => import("@/components/Model/ModelVerification.vue"),
          // meta: {
          //     requireAuth:true,
          //     roles: ['teacher', 'student']
          // },
        },
        {
          path: "ModelVerification/:productId",
          name: "OneVerification",
          component: () => import("@/components/Model/OneValidation.vue"),
          props:true,
          // meta: {
          //     requireAuth:true,
          //     roles: ['teacher', 'student']
          // },
        },
        {
          path: "ModelMarket",
          name: "ModelMarket",
          component: () => import("@/components/Model/ModelMarket.vue"),
          // meta: {
          //   requireAuth: true,
          //   roles: ["teacher", "student"],
          // },
        },
      ],
    },
    {
      path: "/404",
      component: () => import("@/pages/error/404.vue"),
    },
    {
      path: "/test",
      component: () => import("@/pages/Test.vue"),
    },
    {
      path: "/test2",
      component: () => import("@/pages/Test2.vue"),
    },
    {
      path: "/test3",
      component: () => import("@/components/User/Dashboard.vue"),
    },
    {
      path: "/testUpload",
      component: () => import("@/pages/TestUpload.vue"),
    },
  ],
});

// 路由守卫，检查用户访问权限
router.beforeEach((to, from, next) => {
  const userStore = useUserstore(); // 使用 Pinia store

  if (
    to.matched.some((record) => record.meta.requireAuth && !userStore.creator)
  ) {
    next({ path: "/" }); // 如果需要认证且用户未登录，重定向到登录页面
  } else if (
    to.matched.some(
      (record) =>
        record.meta.roles && !record.meta.roles.includes(userStore.role)
    )
  ) {
    next({ path: "/forbidden" }); // 如果用户角色不符，重定向到禁止访问页面
  } else {
    next(); // 允许访问
  }
});

export default router;
