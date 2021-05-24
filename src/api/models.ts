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
export interface TokenRefreshData {
  name: {
    ID: number;
    name: string;
    password: string;
    isactivity: number;
    isadmin: number;
    registertime: string;
    token: null | string;
  };
  userID: number;
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
  PlayerStatus: {
    LongMenBi: number;
    YuanShi: {
      Android: number;
      iOS: number;
    };
    UserName: string;
    Level: number;
    Exp: number;
    XinYong: number;
    LiZhi: number;
    LiZhiMax: number;
    XunFangTicket: number;
    ShiLianTicket: number;
    GongZhaoJuan: number;
    LizhiHuiFu: [number, number];
    TouXiang: string;
    YueKa: {
      Has: boolean;
      Start: number;
      End: number;
    };
    Mishu: {
      Mishu: string;
      Skin: string;
    };
  };
  Inventory: {
    Id: string;
    Quantity: number;
    CNName: string;
  }[];
  Squads: {
    [key: string]: {
      squadId: string;
      name: string;
      slots: ({
        charInstId: number;
        skillIndex: number;
        name: string;
      } | null)[];
    };
  };
  Log: {
    id: number;
    account: string;
    logtime: string;
    text: string;
    level: number;
  }[];
  GameConfig: {
    isPause: boolean;
    nextAutoRunTime: string;
    isAutoBattle: boolean;
    squadSelected: number;
    mapId: string;
    modelName: string;
    reserveAP: number;
    autoRecruit: boolean;
    captchaData?: {
      result: number;
      error: string;
      captcha: {
        success: number;
        challenge: string;
        gt: string;
        new_captcha: boolean;
      };
    };
  };
}
export interface GameConfigData {
  isPause: boolean;
  nextAutoRunTime: string;
  autoBattle: boolean;
  squadSelected: number;
  mapId: string;
  modelName: string;
}
export interface GameMapData {
  id: 1;
  mapId: string;
  modelName: string;
  forceChar: string;
  description: string;
}
