import { Module, ActionTree, GetterTree, MutationTree } from 'vuex';
import { LocalStorage } from 'quasar';
import { StateInterface } from './index';
import api from '../api';

export interface AccountObject {
  username: string;
  id: number;
  token: string;
}

export interface LoginStateInterface {
  account: AccountObject | null;
  listeners: Array<(account: AccountObject | null) => unknown>;
}

const state = function(): LoginStateInterface {
  return { account: null, listeners: [] };
};

const actions: ActionTree<LoginStateInterface, StateInterface> = {
  async refreshToken(state) {
    try {
      const result = await api.verifyToken();
      state.commit('login', {
        username: result.data.name.name,
        id: result.data.name.ID,
        token: result.data.token
      });
    } catch (err) {
      state.commit('logout');
      throw err;
    }
  },
  async loginAccount(state, account: { username: string; password: string }) {
    const result = await api.userLogin({
      username: account.username,
      password: account.password
    });
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
    } else {
      LocalStorage.set('account', account);
      state.account = account;
      state.listeners.forEach(listener => listener(state.account));
    }
  },
  logout(state) {
    state.account = null;
    LocalStorage.remove('account');
    state.listeners.forEach(listener => listener(null));
  },
  listen(state, callback: (account: AccountObject | null) => unknown) {
    state.listeners.push(callback);
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
