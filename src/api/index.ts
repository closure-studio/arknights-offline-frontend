import Vue from 'vue';
import _axios, { AxiosError } from 'axios';
import { Store } from 'vuex';
import { QVueGlobals } from 'quasar';

import * as models from './models';
import { StateInterface } from '../store';

export const baseApi = new URL(
  process.env.API_ADDRESS || 'https://akapi.nai-ve.com'
);
export const baseStatic = new URL(
  process.env.STATIC_ADDRESS || 'https://akres.nai-ve.com'
);

export const axios = _axios.create({
  timeout: 6000,
  baseURL: baseApi.toString(),
  responseType: 'json'
});

async function request<T = unknown>(endpoint: string, data?: unknown) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const store = Vue.prototype.$store as Store<StateInterface>;
  const token = store.state.login.account?.token;
  axios.defaults.headers = token ? { Token: token } : {};

  try {
    const response = await axios.post(endpoint, data);
    return response.data as models.GeneralResponse<T>;
  } catch (err) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const quasar = Vue.prototype.$q as QVueGlobals;
    const error = err as AxiosError<models.GeneralResponse>;

    if (error.response) {
      quasar.notify({
        type: 'negative',
        progress: true,
        position: 'top',
        message: `服务器返回错误 - ${error.response.status}`,
        caption: error.response.data.message
      });
    } else {
      quasar.notify({
        type: 'negative',
        progress: true,
        position: 'top',
        message: '网络请求过程出错',
        caption: error.message
      });
    }

    throw error;
  }
}

export default {
  async userLogin(data: { username: string; password: string }) {
    return await request<models.UserInfoData>('/auth/userlogin', data);
  },
  async verifyToken(data: { uid: number }) {
    return await request<models.TokenRefreshData>('/auth/verifyToken', data);
  },
  async userRegister(data: { username: string; password: string }) {
    return await request<models.UserInfoData>('/auth/useruserregister', data);
  },
  async getGamesAccounts() {
    return await request<models.GameAccountData[]>('/user/getGamesAccounts');
  },
  async createGame(data: {
    account: string;
    password: string;
    platform: number;
  }) {
    return await request<models.GameAccountData[]>('/user/createGame', data);
  },
  async delGame(data: { account: string }) {
    return await request<models.GameAccountData[]>('/user/delGame', {
      ...data,
      password: ''
    });
  },
  async getGameData(data: { account: string }) {
    return await request<models.GameInfoData>('/game/getGameData', data);
  },
  async gameLogin(data: { account: string }) {
    return await request<[]>('/game/gameLogin', data);
  },
  async setGamePause(data: { account: string }) {
    return await request<[]>('/game/setGamePause', data);
  },
  async setGameResume(data: { account: string }) {
    return await request<[]>('/game/setGameResume', data);
  },
  async setAutoBattle(data: {
    account: string;
    autoBattle: boolean;
    autoRecruit: boolean;
    squadSelected: number;
    mapId: string;
    modelName: string;
    reserveAP: number;
  }) {
    return await request<models.GameConfigData>('/game/setAutoBattle', data);
  },
  async setCaptchaData(data: {
    account: string;
    geetest_challenge: string;
    geetest_seccode: string;
    geetest_validate: string;
  }) {
    return await request<models.GameInfoData>('/game/setCaptchaData', data);
  },
  async getSystemInfo() {
    return await request<models.SystemInfoData>('/system/getSystemInfo');
  },
  async getAllModels() {
    return await request<models.GameMapData[]>('/system/getAllModels');
  }
};
