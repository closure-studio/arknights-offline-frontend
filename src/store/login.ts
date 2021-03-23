import { Module, ActionTree, GetterTree, MutationTree } from 'vuex';
import { LocalStorage } from 'quasar';
import { StateInterface } from './index';
import api from '../api';
import Vue from 'vue';
import { QVueGlobals } from 'quasar';

export interface AccountObject {
  username: string;
  id: number;
  token: string;
}

export interface LoginStateInterface {
  account: AccountObject | null;
}

const state = function(): LoginStateInterface {
  return { account: null };
};

const actions: ActionTree<LoginStateInterface, StateInterface> = {
  async refreshToken(state) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const quasar = Vue.prototype.$q as QVueGlobals;
    try {
      const result = await api.verifyToken();
      state.commit('login', {
        username: result.data.name,
        id: result.data.userID,
        token: result.data.token
      });
    } catch (err) {
      state.commit('logout');
      quasar.notify({
        caption: '在刷新登录凭证中出现问题',
        message: String(err),
        color: 'negative',
        closeBtn: true,
        timeout: 10 * 1000,
        progress: true,
        position: 'center'
      });
      throw err;
    }
  },
  async loginAccount(state, account: { username: string; password: string }) {
    const result = await api.userLogin(account.username, account.password);
    state.commit('login', {
      username: result.data.name,
      id: result.data.userID,
      token: result.data.token
    });
  }
};

const mutations: MutationTree<LoginStateInterface> = {
  login(state, account?: AccountObject) {
    account =
      account || (LocalStorage.getItem('account')?.valueOf() as AccountObject);
    if (!account) {
      throw new Error(
        'No account existed in local storage or account argument has not been specified'
      );
    }
    LocalStorage.set('account', account);
    state.account = account;
  },
  logout(state) {
    state.account = null;
    LocalStorage.remove('account');
  }
};

const getters: GetterTree<LoginStateInterface, StateInterface> = {};

const module: Module<LoginStateInterface, StateInterface> = {
  state,
  actions,
  mutations,
  getters,
  namespaced: true
};

export default module;
