import { QVueGlobals, QDialogOptions } from 'quasar';
import VueRouter from 'vue-router';

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
        .onDismiss(() => reject('dismiss'))
        .onOk((data: unknown) => resolve(data));
    });
  },
  async redirect(router: VueRouter, path: string) {
    if (router.currentRoute.path != path) {
      return await router.push(path);
    }
  },
  resource(name: string, ext?: string): string {
    ext = ext || 'png';
    return `https://akres.nai-ve.com/${name}.${ext}`;
  }
};
