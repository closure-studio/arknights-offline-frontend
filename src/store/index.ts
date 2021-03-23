import { store } from 'quasar/wrappers';
import Vuex from 'vuex';

import login, { LoginStateInterface } from './login';
import activity, { ActivityStateInterface } from './activity';

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export interface StateInterface {
  // Define your own store structure, using submodules if needed
  // example: ExampleStateInterface;
  // Declared as unknown to avoid linting issue. Best to strongly type as per the line above.
  login: LoginStateInterface;
  activity: ActivityStateInterface;
}

export default store(function({ Vue }) {
  Vue.use(Vuex);

  const Store = new Vuex.Store<StateInterface>({
    modules: {
      login,
      activity
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: !!process.env.DEBUGGING
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  Vue.prototype.$store = Store;
  return Store;
});
