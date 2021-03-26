import { axios } from '../boot/axios';
import {
  GeneralResponse,
  UserInfoData,
  GameAccountData,
  GameInfoData
} from './models';
import { AxiosError } from 'axios';
import Vue from 'vue';
import { Store } from 'vuex';
import { QVueGlobals } from 'quasar';
import { StateInterface } from '../store';

class ApiConnection {
  private static async _processRequest(endpoint: string, data?: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const store = Vue.prototype.$store as Store<StateInterface>;
    const token = store.state.login.account?.token;
    try {
      const response = await axios.post(endpoint, data || {}, {
        headers: !!token ? { Token: token } : {}
      });
      return response.data as GeneralResponse;
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (typeof err === 'object' && err.isAxiosError === true) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const quasar = Vue.prototype.$q as QVueGlobals;
        const error = err as AxiosError<GeneralResponse>;
        if (!!error.response) {
          quasar.notify({
            progress: true,
            position: 'top',
            type: 'negative',
            message: `服务器返回错误(${error.response.status})`,
            caption: `${error.response.data.message}`
          });
        } else {
          quasar.notify({
            progress: true,
            position: 'top',
            type: 'negative',
            message: '网络请求错误',
            caption: error.message
          });
        }
      }
      throw err;
    }
  }
  static async userLogin(username: string, password: string) {
    return (await this._processRequest('/auth/userlogin', {
      username,
      password
    })) as GeneralResponse<UserInfoData>;
  }
  static async verifyToken() {
    return (await this._processRequest('/auth/verifyToken')) as GeneralResponse<
      UserInfoData
    >;
  }
  static async userRegister(username: string, password: string) {
    return (await this._processRequest('/auth/userregister', {
      username,
      password
    })) as GeneralResponse<UserInfoData>;
  }
  static async getGamesAccounts() {
    return (await this._processRequest(
      '/user/getGamesAccounts'
    )) as GeneralResponse<GameAccountData[]>;
  }
  static async createGame(account: string, password: string, platform: 0 | 1) {
    return (await this._processRequest('/user/createGame', {
      account,
      password,
      platform
    })) as GeneralResponse<GameAccountData[]>;
  }
  static async delGame(account: string) {
    return (await this._processRequest('/user/delGame', {
      account,
      password: ''
    })) as GeneralResponse<GameAccountData[]>;
  }
  static async getGameData(account: string) {
    return (await this._processRequest('/game/getGameData', {
      account
    })) as GeneralResponse<GameInfoData>;
  }
  static async gameLogin(account: string) {
    return (await this._processRequest('/game/gameLogin', {
      account
    })) as GeneralResponse<[]>;
  }
  static async setGamePause(account: string) {
    return (await this._processRequest('/game/setGamePause', {
      account
    })) as GeneralResponse<[]>;
  }
  static async setGameResume(account: string) {
    return (await this._processRequest('/game/setGameResume', {
      account
    })) as GeneralResponse<[]>;
  }
}

export default ApiConnection;
