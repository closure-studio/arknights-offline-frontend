<template>
  <q-btn dense flat round icon="logout" @click="logout" />
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { AccountObject } from '../store/login';
import utils from '../utils';

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
    setInterval(
      () => void this.$store.dispatch('login/refreshToken'),
      10 * 60 * 1000
    );
  },

  setup() {
    return {};
  },
});
</script>
