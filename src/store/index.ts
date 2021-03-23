import { store } from 'quasar/wrappers';
import Vuex from 'vuex';

import login, { LoginStateInterface } from './login';

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export interface StateInterface {
  // Define your own store structure, using submodules if needed
  // example: ExampleStateInterface;
  // Declared as unknown to avoid linting issue. Best to strongly type as per the line above.
  login: LoginStateInterface;
}

const VueStore = new Vuex.Store<StateInterface>({
  modules: {
    login
  },

  // enable strict mode (adds overhead!)
  // for dev mode only
  strict: !!process.env.DEBUGGING
});

export default store(function({ Vue }) {
  Vue.use(Vuex);

  return VueStore;
});

export { VueStore as store };
