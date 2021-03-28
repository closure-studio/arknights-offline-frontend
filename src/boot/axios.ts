import axios, { AxiosInstance } from 'axios';
import { boot } from 'quasar/wrappers';

declare module 'vue/types/vue' {
  interface Vue {
    $axios: AxiosInstance;
  }
}

axios.defaults.baseURL = 'https://akapi.nai-ve.com';
axios.defaults.timeout = 6000;

axios.interceptors.request.use(request => {
  if (process.env.DEBUGGING) {
    console.debug('Request sent:' + JSON.stringify(request));
  }
  return request;
});

axios.interceptors.response.use(response => {
  if (process.env.DEBUGGING) {
    console.debug('Response received:' + JSON.stringify(response));
  }
  return response;
});

export { axios };
export default boot(({ Vue }) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  Vue.prototype.$axios = axios;
});
