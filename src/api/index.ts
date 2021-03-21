import { axios } from '../boot/axios';
import {
  GeneralResponse,
  UserLoginData,
  UserRegisterData,
  VerifyTokenData,
  GameAccountData,
  GameInfoData
} from './models';
import { LocalStorage } from 'quasar';
import { AxiosError } from 'axios';
import Vue from 'vue';
import { QVueGlobals } from 'quasar';

class ApiConnection {
  private static async _processRequest(endpoint: string, data?: unknown) {
    const token = this.token.get();
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
            color: 'accent',
            position: 'top',
            message: `Code ${error.response.status}: ${error.response.data.message}`
          });
        } else {
          quasar.notify({
            color: 'red',
            position: 'top',
            message: `Network Error: ${error.message}`
          });
        }
      }
      throw err;
    }
  }
  static token = {
    get() {
      return LocalStorage.getItem('JWT');
    },
    set(token: string) {
      LocalStorage.set('JWT', token);
    }
  };
  static async userLogin(username: string, password: string) {
    return (await this._processRequest('/auth/userlogin', {
      username,
      password
    })) as GeneralResponse<UserLoginData>;
  }
  static async verifyToken() {
    return (await this._processRequest('/auth/verifyToken')) as GeneralResponse<
      VerifyTokenData
    >;
  }
  static async userRegister(username: string, password: string) {
    return (await this._processRequest('/auth/userregister', {
      username,
      password
    })) as GeneralResponse<UserRegisterData>;
  }
  static async getGamesAccounts() {
    return (await this._processRequest(
      '/user/getGamesAccounts'
    )) as GeneralResponse<GameAccountData[]>;
  }
  static async createGame(account: string, password: string) {
    return (await this._processRequest('/user/createGame', {
      account,
      password
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
