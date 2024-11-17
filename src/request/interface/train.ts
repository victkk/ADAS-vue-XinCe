//训练信息
import instance from "@/request/http";

export interface TrainingInfo {
    trainName: string;
    trainId: number;
    trainStatus: number;
    runTime: number;
    creationTime: string;
    modelName: string;
    modelDescription: string;
    creatorId: number;
    creatorName: string;
}

export interface HyperParameter {
    learningRate: number;
    epoch: number;
}

export interface NewTrainJob {
    config: TrainConfig;
    creatorId: number;
    datasetId: number;
    hyperParameter: HyperParameter;
    modelId: number;
    trainName: string;
    [property: string]: any;
}

export interface TrainConfig {
    convLayers: ConvLayer[];
    fcLayers: FcLayer[];
    flattenSize: number;
    [property: string]: any;
}

export interface ConvLayer {
    inChannels?: number;
    kernelSize?: number;
    outChannels?: number;
    stride?: number;
    [property: string]: any;
}

export interface FcLayer {
    outFeatures?: number;
    [property: string]: any;
}
export const GetMyTrain = (params: { creatorId: number }): Promise<any> =>
    instance.get("/api/train/getMyJob", {params});


export const GetTaskStatus = (params: { trainId: number }): Promise<any> =>
    instance.get("/api/train/query", {params});

export const PostNewTrainJob =(trainJob:NewTrainJob): Promise<any> =>
    instance.post("/api/train/createNew", trainJob);