import instance from "@/request/http";

interface creatorInfo {
  creatorId: number;
}

// Res是返回的参数，T是泛型，需要自己定义，返回对数统一管理***
type Res<T> = Promise<ItypeAPI<T>>;
// 一般情况下响应数据返回的这三个参数，
// 但不排除后端返回其它的可能性，
export interface ItypeAPI<T> {
  //命名导出
  status: number | null; // 返回状态码的信息，如请求成功等
  message: string;
  result: T; //请求的数据，用泛型
  // modelsList: Array<Interfaces.ModelPossession>;
}

// 使用实例发送 POST 请求
//测试hello api
export const TestHello = (): Res<null> => instance.get("/api/hello");

//登录 api
export const LoginApi = (data: Interfaces.UserLogin): Res<Interfaces.User> =>
  instance.post<Interfaces.User>("/api/user/login", data);

//注册 api
export const RegisterApi = (data: Interfaces.UserRegister): Res<null> =>
  instance.post("/api/user/register", data);

//登出 api
export const LogoutApi = (): Res<null> => instance.get("/api/logout");

//根据username查询用户信息api  get
// export const GetUserInfoByUserName = (params: { userName: string }): Res<null> =>
//     instance.ge/api/find/${params.userName}`, {params});

// //根据pageNumber查询用户信息api  get
// export const GetUserInfoByPageNum = (params: { pageNumber: number }): Res<null> =>
//     instance.get(`/api/users/list/${params.pageNumber}`, {params});

////////////////////////////////////////////////////////////////////////////////////

export const ViewModelMarket = (): Res<null> =>
  instance.get("api/model/getPublicModels");

export const CreateNewTrain = (data: Interfaces.NewTrainJob): Res<null> =>
  instance.post("/api/train/createNew", data);

export const SubscribePrivateModel = (data: NewModel): Res<null> =>
  instance.post("/api/model/createPrivate", data);

export const ViewPublic = (params: {
  creatorId: number;
}): Res<Interfaces.Model> =>
  apiService.post<Interfaces.Model>(`/api/model/myPublic/${params.creatorId}`, {
    params,
  });

// export const GetDataset = (params: { creatorId: number }): Res<null> =>
//   instance.get(`api/dataset/getDatasets/${params.creatorId}`, { params });

// export const ViewPrivate = (params: {
//   creatorId: number;
// }): Res<Interfaces.ModelPossession> =>
//   apiService.post<Interfaces.ModelPossession>(
//     `/api/model/myPrivate/${params.creatorId}`,
//     {
//       params,
//     }
//   );
export const ViewPrivate = (
  data: creatorInfo
): Res<Interfaces.ModelPossession[]> =>
  instance.post("/api/model/myPrivate", data);

// //以下是模板:
// // post请求 ，没参数
// export const LogoutAPI = (): Res<null> =>
//     instance.post("/admin/logout");

// // post请求，有参数,如传用户名和密码
// export const loginAPI = (data: ReqLogin): Res<string> =>
//     instance.post("/admin/login", data);

// // post请求 ，没参数，但要路径传参
// export const StatusAPI = (data: ReqStatus): Res<null> =>
//     instance.post(`/productCategory?ids=${data.id}&navStatus=${data.navStatus}`);

// //  get请求，没参数，
// export const FlashSessionListApi = (): Res<null> =>
//     instance.get("/flashSession/list");

// // get请求，有参数，路径也要传参  (也可能直接在这写类型，不过不建议,大点的项目会维护一麻烦)
// export const ProductCategoryApi = (params: { parentId: number }): any =>
//     instance.get(`/productCategory/list/${params.parentId}`, {params});

// // get请求，有参数，(如果你不会写类型也可以使用any,不过不建议,因为用了之后 和没写TS一样)
// export const AdminListAPI = (params: any): any =>
//     instance.get("/admin/list", {params});
