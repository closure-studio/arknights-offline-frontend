import { Module, ActionTree, GetterTree, MutationTree } from 'vuex';
import { StateInterface } from './index';

export interface ActivityStateInterface {
  activities: Map<string, Map<Date, string>>;
  debounce: Map<string, string>;
  websocket: boolean;
}

const state = function(): ActivityStateInterface {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  return { activities: new Map(), debounce: new Map(), websocket: false };
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
  },
  connect(state) {
    state.websocket = true;
  },
  disconnect(state) {
    state.websocket = false;
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
