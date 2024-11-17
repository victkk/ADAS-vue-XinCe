export interface UserLogin {
  creatorId: number;
  password: string;
  role: number;
}
export interface UserRegister {
  username: string;
  password: string;
  email: string;
  role: number;
}
export interface User {
  username: string;
  creatorId: number;
  email: string;
  role: number; //教师为0,学生为1
  isActive: boolean;
}

export interface Response {
  status: number | null; // 返回状态码的信息，如请求成功等
  message: string;
}
