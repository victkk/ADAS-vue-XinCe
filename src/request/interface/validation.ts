import instance from "@/request/http";

//验证
export interface Validation {
  trainId: number;
  creatorId: number;
  carId: number;
}

//排队信息
export interface QueueStatus {
  status: number;
  message: string;
}

export interface GetValidStatus {
  status: number;
  message: string;
}

export interface ValidationInfo {
    productId:string;
    trainId: number;
    creatorId: number;
    carId: number;
    status: number;
}

export const StartValidation = (data: Validation): Promise<GetValidStatus> =>
  instance.post("/api/validate/start", data);

export const StopValidation = (productId: string): Promise<QueueStatus> =>
    instance.post("/api/validate/stop",  null, {
      params: {
        productId: productId
      }
    });

export const getAvailableCar = (): Promise<any> =>
    instance.post("/api/validate/getCars");
//     request.post("api/validate/getCars");

export const getProduct = (params: { trainId: number }):Promise<ValidationInfo>=>
    instance.get("/api/validate/getProduct")