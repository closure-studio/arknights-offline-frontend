<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <div class="text-h6">输入验证码</div>
        <q-separator spaced />
        <q-slide-transition>
          <q-banner
            rounded
            dense
            class="bg-primary text-white"
            v-show="!loaded"
          >
            验证码正在加载中
          </q-banner>
        </q-slide-transition>
      </q-card-section>
      <q-card-section>
        <div
          id="captcha"
          :style="{
            width: '300px',
            height: '44px',
          }"
          class="q-mx-auto"
        />
        <q-inner-loading :showing="!loaded">
          <q-spinner size="md" color="primary" />
        </q-inner-loading>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          flat
          dense
          color="negative"
          label="取消"
          @click="onCancelClick"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { QDialog } from 'quasar';
import api from '../api';

export default defineComponent({
  data: () => {
    return {
      loaded: false,
    };
  },
  props: {
    gt: {
      required: true,
      type: String,
    },
    challenge: {
      required: true,
      type: String, //
    },
    account: {
      required: true,
      type: String,
    },
  },
  computed: {
    dialog(): QDialog {
      return this.$refs.dialog as QDialog;
    },
  },
  methods: {
    // following method is REQUIRED
    // (don't change its name --> "show")
    show() {
      this.dialog.show();
    },
    // following method is REQUIRED
    // (don't change its name --> "hide")
    hide() {
      this.dialog.hide();
    },
    onDialogHide() {
      // required to be emitted
      // when QDialog emits "hide" event
      this.$emit('hide');
    },
    onOKClick() {
      // on OK, it is REQUIRED to
      // emit "ok" event (with optional payload)
      // before hiding the QDialog
      this.$emit('ok');
      // or with payload: this.$emit('ok', { ... })

      // then hiding dialog
      this.hide();
    },
    onCancelClick() {
      // we just need to hide dialog
      this.hide();
    },

    async submitCaptcha(challenge: string, seccode: string, validate: string) {
      try {
        this.$q.loading.show();
        const result = await api.setCaptchaData({
          account: this.$props.account,
          geetest_challenge: challenge,
          geetest_seccode: seccode,
          geetest_validate: validate,
        });
        this.$q.notify({
          type: 'positive',
          position: 'top',
          message: '验证码提交成功',
          progress: true,
          caption: result.message,
        });
      } finally {
        this.$q.loading.hide();
      }
    },
    loadCaptcha() {
      this.$initGeetest(
        {
          product: 'float',
          gt: this.$props.gt,
          challenge: this.$props.challenge,
          new_captcha: true,
          offline: false,
          https: true,
        },
        (obj) => {
          obj.onError(() => this.onCancelClick());
          obj.onReady(() => {
            this.loaded = true;
            obj.appendTo('#captcha');
          });
          obj.onSuccess(() => {
            const data = obj.getValidate();
            if (!data) {
              throw new Error();
            }
            void this.submitCaptcha(
              data.geetest_challenge,
              data.geetest_seccode,
              data.geetest_validate
            );
            this.onOKClick();
            obj.destroy();
          });
        }
      );
    },
  },
  setup(props) {
    return { ...props };
  },
  mounted() {
    this.loadCaptcha();
  },
});
</script>
>