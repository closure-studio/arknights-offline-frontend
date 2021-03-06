import { QVueGlobals, QDialogOptions } from 'quasar';
import VueRouter from 'vue-router';

import { baseStatic } from '../api';

export default {
  async sleep(ms: number) {
    await new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  },
  async dialog(quasar: QVueGlobals, options: QDialogOptions) {
    return await new Promise((resolve, reject) => {
      quasar
        .dialog(options)
        .onCancel(() => reject('cancel'))
        .onOk((data: unknown) => resolve(data));
    });
  },
  async redirect(router: VueRouter, path: string) {
    if (router.currentRoute.path != path) {
      return await router.push(path);
    }
  },
  resource(name: string, ext = 'webp'): string {
    return new URL(`${name}.${ext}`, baseStatic).toString();
  }
};
