import geetest from '../utils/geetest';
import { boot } from 'quasar/wrappers';

interface Callback<T = undefined> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (arg0: T): any;
}

interface CaptchaObj {
  appendTo: { (position: string): void };
  bindForm: { (position: string): void };
  getValidate: {
    ():
      | {
          geetest_challenge: string;
          geetest_validate: string;
          geetest_seccode: string;
        }
      | false;
  };
  reset: VoidFunction;
  verify: VoidFunction;
  onReady: Callback;
  onSuccess: Callback;
  onError: Callback;
  onClose: Callback;
  destroy: VoidFunction;
}

interface GeetestInit {
  (
    userConfig: {
      gt: string;
      challenge: string;
      offline: boolean;
      new_captcha: boolean;

      product?: 'float' | 'popup' | 'custom' | 'bind';
      width?: string;
      lang?:
        | 'zh-cn'
        | 'zh-hk'
        | 'zh-tw'
        | 'en'
        | 'ja'
        | 'ko'
        | 'id'
        | 'ru'
        | 'ar'
        | 'es'
        | 'pt-pt'
        | 'fr'
        | 'de';
      https?: boolean;
      timeout?: number;
      remUnit?: number;
      zoomEle?: string;
      hideSuccess?: boolean;
      hideClose?: boolean;
      hideRefresh?: boolean;
    },
    callback: Callback<CaptchaObj>
  ): '';
}

declare global {
  interface Window {
    initGeetest: GeetestInit;
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $initGeetest: GeetestInit;
  }
}

export default boot(({ Vue }) => {
  geetest(window);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  Vue.prototype.$initGeetest = window.initGeetest;
});
