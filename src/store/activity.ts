import { Module, ActionTree, GetterTree, MutationTree } from 'vuex';
import { StateInterface } from './index';

export interface ActivityStateInterface {
  activities: Map<string, Map<Date, string>>;
  debounce: Map<string, string>;
  websocket: boolean;
  listeners: Array<(account: string, message: string) => unknown>;
}

const state = function(): ActivityStateInterface {
  return {
    activities: new Map() as Map<string, Map<Date, string>>,
    debounce: new Map() as Map<string, string>,
    websocket: false,
    listeners: []
  };
};

const actions: ActionTree<ActivityStateInterface, StateInterface> = {};

const mutations: MutationTree<ActivityStateInterface> = {
  create(state, message: { account: string; message: string }) {
    if (state.debounce.get(message.account) == message.message) {
      return;
    }
    const activity =
      state.activities.get(message.account) || (new Map() as Map<Date, string>);
    activity.set(new Date(), message.message);
    state.activities.set(message.account, activity);
    state.debounce.set(message.account, message.message);
    state.listeners.forEach(listener =>
      listener(message.account, message.message)
    );
  },
  connect(state) {
    state.websocket = true;
  },
  disconnect(state) {
    state.websocket = false;
  },
  listen(state, callback: (account: string, message: string) => unknown) {
    state.listeners.push(callback);
  }
};

const getters: GetterTree<ActivityStateInterface, StateInterface> = {};

const module: Module<ActivityStateInterface, StateInterface> = {
  namespaced: true,
  getters,
  actions,
  mutations,
  state
};

export default module;
