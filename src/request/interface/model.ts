import instance from "@/request/http";

//模型列表
export interface ModelPossession {
  modelName: string;
  modelAlgorithm: string;
  creationTime: string;
  description: string;
  modelId: number;
  modelType: number;
  /* 已停用1/未停用0 */
  status: number;
}

//模型（市场中创建时）
export interface Model {
  modelName: string;
  modelType: number;
  modelAlgorithm: string;
  creatorId: number;
  creationTime: string;
  description: string;
  modelPath: string;
  modelId: number;
}

interface NewModel {
  modelName: string;
  modelType: number;
  modelAlgorithm: string;
  creatorId: number;
  description: string;
  modelPath: string;
  modelId: number;
}
export interface SubscribeModel {
  modelId: number;
  creatorId: number;
}

export const CreatePublicModel = (data: NewModel): Promise<null> =>
  instance.post("/api/model/createPublic", data);


export const MySubscription = (params: {
  creatorId: number;
}): Promise<Array<ModelPossession>> => {
  return instance.get("/api/model/mySubscription", {
    params,
  });
};

export const ViewModelMarket = (): Promise<ModelPossession[]> =>
    instance.get("/api/model/getPublicModels");

export const SubscribePublicModel = (data:SubscribeModel): Promise<any> =>
    instance.get("/api/model/subscribe",data);

//Res<Array<Interfaces.ModelPossession>>
// `http://127.0.0.1:4523/m1/4445776-4091611-default/model/mySubscription?creatorId=1`
//get(`/api/model/mySubscription/${params.creatorId}`, {params,});
