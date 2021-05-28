<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <div class="text-h6">添加托管帐号</div>
        <div class="text-subtitle">请在下方输入托管帐号信息</div>
      </q-card-section>
      <q-card-section>
        <q-form class="column item-center justify-center q-pa-md">
          <q-input
            v-model="account"
            label="游戏帐号"
            :rules="[isBlank]"
            autofocus
            counter
          />
          <q-input
            v-model="password"
            label="游戏密码"
            type="password"
            :rules="[isBlank]"
            autofocus
            counter
          />
          <q-option-group v-model="device" inline :options="devices" />
        </q-form>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn color="primary" flat label="取消" @click="onCancelClick" /><q-btn
          color="primary"
          flat
          label="确认添加"
          @click="onOKClick"
          :disable="!account || !password || device == null"
        />
      </q-card-actions> </q-card
  ></q-dialog>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { QDialog } from 'quasar';
import api from '../api';

export default defineComponent({
  data: () => {
    return {
      account: '',
      password: '',
      device: 0 as 0 | 1,
      devices: [
        { label: 'iOS', value: 0 },
        { label: 'Android', value: 1 },
        { label: 'B服', value: 2 },
      ] as { label: string; value: number }[],
    };
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
      this.$emit('ok', { account: this.account, password: this.password });
      // or with payload: this.$emit('ok', { ... })
      // then hiding dialog
      this.hide();

      void this.createAccount();
    },
    onCancelClick() {
      // we just need to hide dialog
      this.hide();
    },
    isBlank: function (value: string) {
      return !!value || '此项目为必填项目';
    },

    createAccount: async function () {
      try {
        this.$q.loading.show();
        await api.createGame({
          account: this.account,
          password: this.password,
          platform: this.device,
        });
        this.$q.notify({
          type: 'positive',
          message: '托管帐号添加成功',
          caption: `帐号名: ${this.account}`,
          progress: true,
          position: 'top',
          closeBtn: true,
        });
      } finally {
        this.$q.loading.hide();
      }
    },
  },
  computed: {
    dialog: function (): QDialog {
      return this.$refs.dialog as QDialog;
    },
  },
  setup() {
    return {};
  },
});
</script>
