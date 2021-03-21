export interface GeneralResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}
export interface UserRegisterData {
  userID: number;
  name: string;
  token: string;
}
export interface UserLoginData {
  userID: number;
  name: string;
  token: string;
}
export interface SystemInfoData {
  launchTime: string;
}
export interface VerifyTokenData {
  userID: number;
  token: string;
}
