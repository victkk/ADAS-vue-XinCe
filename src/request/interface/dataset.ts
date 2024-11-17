import instance from "@/request/http";
import axios from 'axios';

export interface DataSet {
    description: string;
    pictureCount: string;
    updateTime: string;
    datasetName: string;
    datasetId: number;
    creatorId: number;
    filePath: string;
    isProcessing: boolean;
}

export interface UploadFile {
    file: File;
}

export interface DatasetInfo4Creation {
    description: string;
    datasetName: string;
    creatorId: number;
    filePath: string;
}

//获取一个特定数据集：是DatasetOnePic[]
export interface DatasetOnePic {
    pictureId: number;
    datasetId: number;
    x: number;
    y: number;
    throttle: number;
    steering: number;
    face: number;
    picturePath: string;
    pictureMinimapPath: string;
    fishEyePath: string | null;
}

//处理图片
export interface Picture {
    pictureId: number;
    datasetId: number;
    x: number;
    y: number;
    face: number;
}

export interface ClipInfo {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface PicOps {
    pictureId: number;
    operation: number;
    detail: SharpenDetail | CropDetail;
}

// 定义图片锐化参数
export interface SharpenDetail {
    strength: number; // 锐化的强度
}

// 定义图片裁切参数
export interface CropDetail {
    x: number;       // 裁切框的x坐标
    y: number;       // 裁切框的y坐标
    width: number;   // 裁切框的宽度
    height: number;  // 裁切框的高度
}

export interface PicSharpen {
    strength: number;
}

export const GetDatasets = (params: {
    creatorId: number;
}): Promise<Array<DataSet>> => {
    return instance.get('/api/dataset/getDatasets', {
        params,
    });
};

export const CreateDataset = (data: DatasetInfo4Creation): Promise<null> =>
    instance.post("/api/upload", data);

export const GetOneDataset = (params: {
    datasetId: number;
}): Promise<Array<DatasetOnePic>> => {
    return instance.get("/api/dataset/getDataset", {
        params,
    });
};

export const UploadInduct = (data: UploadFile): Promise<any> => {
    const formData = new FormData();
    formData.append('file', data.file);
    console.log("222+", formData);

    return instance.post('/api/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }).then(response => {
        if (response.status) {
            console.log('上传成功:', response.message);
            return response.message;
        } else {
            throw new Error(`上传失败，状态码: ${response.status}`);
        }
    }).catch(error => {
        console.error('上传失败:', error);
        throw error;
    });
};

// export const PicPreview = (
//     data: PicOps
// ): Promise<any> => instance.post("/api/dataset/preview", data);

//
// export const PicPreview = async (data: PicOps): Promise<any> => {
//     try {
//         const response = await instance.post("/api/dataset/preview", data, {
//             responseType: 'blob',
//         });
//
//         // 确保 response 和 response.headers 都是定义的
//         if (response && response.headers) {
//             // Check if the response is of type image/jpeg
//             if (1) {
//                 // response.headers['Content-Type'] === 'image/jpeg'
//                 const blob = new Blob([response.data], { type: 'image/jpeg' });
//                 const imageUrl = URL.createObjectURL(blob);
//
//                 const imgElement = document.createElement('img');
//                 imgElement.src = imageUrl;
//                 document.body.appendChild(imgElement);
//             } else {
//                 console.error("Unexpected Content-Type:", response.headers['Content-Type']);
//             }
//         } else {
//             console.log(response);
//             console.error("Invalid response structure", response);
//         }
//     } catch (error) {
//         // 处理网络错误
//         if (error.response) {
//             console.error("Server responded with status:", error.response.status);
//         } else {
//             console.error("Error fetching the image preview:", error.message);
//         }
//     }
// };

export const PicPreview = async (data: PicOps): Promise<string | null> => {
    try {
        // 发送 POST 请求并指定响应类型为 blob
        const response = await instance.post("/api/dataset/preview", data, {
            responseType: 'blob', // 确保响应是二进制数据
        });

        // 确保 response 和 response.headers 都是定义的
        if (1) {
            // 检查响应的 Content-Type 是否为 image/jpeg
            if (1) {
                // 创建一个 Blob 对象
                const blob = new Blob([response.data], { type: 'image/jpeg' });
                console.log("Blob size:", blob.size);


                //let imgUrl =URL.createObjectURL(blob);
                let imgUrl = window.URL.createObjectURL(blob); // 生成 URL
                console.log("New imgUrl-- ",imgUrl);
                if (imgUrl) {
                    const imgElement = new Image();
                    imgElement.src = imgUrl;
                    imgElement.onload = () => {
                        console.log("Image loaded successfully.");
                    };
                    imgElement.onerror = () => {
                        console.error("Image failed to load.");
                    };
                }

                const reader = new FileReader();
                reader.onload = () => {
                    console.log("Base64 Image Data:", reader.result);
                };
                reader.onerror = () => {
                    console.error("Error reading Blob data");
                };
                reader.readAsDataURL(blob);


                // 返回处理后的图片 URL
                return imgUrl;
            } else {
                console.error("Unexpected Content-Type:", response.headers['Content-Type']);
                return null; // 返回 null 表示出错
            }
        } else {
            console.error("Invalid response structure", response);
            return null; // 返回 null 表示出错
        }
    } catch (error) {
        // 处理网络错误
        if (error.response) {
            console.error("Server responded with status:", error.response.status);
        } else {
            console.error("Error fetching the image preview:", error.message);
        }
        return null; // 返回 null 表示出错
    }
};



//http://adasremote.natapp1.cc

export const PicProcess = (data: PicOps[]): Promise<any> =>
    instance.post("/api/dataset/processData", data);
// export const picPreview = (
//     queryParams: { pictureId: number; operation: number; x:number; y:number; width:number;height:number;strength:number;},  // query 参数
//     bodyData: { detail: object } // body 参数
// ): Promise<any> => {
//   return axios.post(
//       "/api/preview",   // 请求的 API 地址
//       bodyData,         // 第二个参数是 body 数据
//       {
//         params: queryParams,  // 第三个参数里通过 params 传递 query 参数
//       }
//   );
// };