export interface GeneralResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}
export interface UserInfoData {
  userID: number;
  name: string;
  token: string;
}
export interface SystemInfoData {
  launchTime: string;
}
export interface GameAccountData {
  userID: number;
  platform: number;
  account: string;
}
export interface GameInfoData {
  systemInfo: {
    isPause: boolean;
    nextAutoRunTime: string;
  };
  PlayerStatus?: {
    LongMenBi: number;
    YuanShi: { Android: number; iOS: number };
    UserName: string;
    Level: number;
    Exp: number;
    XinYong: number;
    LiZhi: number;
    LiZhiMax: number;
    XunFangTicket: number;
    ShiLianTicket: number;
    GongZhaoJuan: number;
    LizhiHuiFu: number[];
    TouXiang: string;
    YueKa: { Has: boolean; Start: number; End: number };
    Mishu: { Mishu: string; Skin: string };
  };
  inventory?: { Id: string; Quantity: number; CNName: string }[];
  log: {
    id: number;
    account: string;
    logtime: string;
    text: string;
    level: number;
  }[];
}
