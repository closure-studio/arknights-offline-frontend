<template>
  <q-btn dense flat round icon="logout" v-if="state.account" @click="logout" />
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { LocalStorage } from 'quasar';
import { AccountObject } from '../store/login';
import { AxiosError } from 'axios';
import { GeneralResponse, SystemInfoData } from '../api/models';
import { StateInterface } from '../store';
import { Store } from 'vuex';

import utils from '../utils';
import api from '../api';

export default defineComponent({
  methods: {
    logout() {
      this.$q
        .dialog({
          title: '帐号退出确认',
          message: '您确定要退出当前帐号嘛?',
          cancel: true,
          persistent: true,
        })
        .onOk(() => this.$store.commit('login/logout'));
    },
    accountActivityListener(account: AccountObject | null) {
      if (!account) {
        this.$q.notify({
          type: 'negative',
          message: '您已退出登录',
          closeBtn: '返回登录页面',
          onDismiss: () => void utils.redirect(this.$router, '/login'),
        });
      } else {
        this.$q.notify({
          type: 'positive',
          message: '帐号登录成功',
          caption: `用户名: ${account.username}`,
          closeBtn: '前往首页',
          onDismiss: () => void utils.redirect(this.$router, '/'),
        });
      }
    },
  },
  mounted: function () {
    this.$store.commit('login/listen', (account: AccountObject | null) =>
      this.accountActivityListener(account)
    );
    setInterval(() => {
      const latest: number =
        (LocalStorage.getItem('latest_refresh')?.valueOf() as number) || 0;
      if (Date.now() - latest >= 60 * 60 * 1000) {
        void this.$store.dispatch('login/refreshToken').then(() => {
          LocalStorage.set('latest_refresh', Date.now());
        });
      }
    }, 20 * 1000);
    setInterval(() => {
      if (this.state.account) {
        void api
          .getSystemInfo()
          .catch((error: AxiosError<GeneralResponse<SystemInfoData>>) => {
            if (
              error.isAxiosError &&
              error.response &&
              error.response.status < 500 &&
              error.response.data.code != 1
            ) {
              this.$store.commit('login/logout');
              this.$q.notify({
                message: '登录凭据已失效',
                type: 'negative',
                position: 'center',
              });
            }
          });
      }
    }, 5 * 1000);
  },
  computed: {
    state: function () {
      const store = this.$store as Store<StateInterface>;
      return store.state.login;
    },
  },
  setup() {
    return {};
  },
});
</script>
