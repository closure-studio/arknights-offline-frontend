<template>
  <q-chip
    class="shadow-1"
    text-color="white"
    :color="activity.websocket ? 'positive' : 'negative'"
    :icon="activity.websocket ? 'link' : 'link_off'"
    >{{ activity.websocket ? '已连接到服务器' : '服务器连接断开' }}</q-chip
  >
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { Store } from 'vuex';
import { StateInterface } from '../store';
import { baseApi } from '../api';

export default defineComponent({
  data: () => {
    return { connection: null as WebSocket | null };
  },
  methods: {
    makeWebsocketConnection: function () {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const store: Store<StateInterface> = this.$store;

      const token = store.state.login.account?.token;

      if (!token) {
        return;
      }

      const ws = new WebSocket(
        new URL('/ws/?token=' + token, baseApi).toString()
      );

      ws.addEventListener('open', (event) => {
        store.commit('activity/connect');
        this.$q.notify({
          color: 'positive',
          position: 'top',
          message: 'WebSocket链接已建立',
          caption: String(event),
        });
      });

      ws.addEventListener('message', (event) => {
        const received: Map<string, string> = new Map(
          Object.entries(JSON.parse(event.data as string))
        );
        received.forEach((message, account) => {
          store.commit('activity/create', { account, message });
        });
      });

      ws.addEventListener('close', (event) => {
        store.commit('activity/disconnect');
        this.$q.notify({
          message: 'WebSocket链接已断开',
          caption: `Code ${event.code}:${event.reason}`,
          color: 'negative',
          position: 'top',
        });
        this.connection = null;
      });

      this.connection = ws;
    },
    onWsActivity: function (account: string, message: string) {
      this.$q.notify({
        type: 'info',
        color: 'black',
        position: 'bottom-left',
        progress: true,
        closeBtn: true,
        message: message,
        caption: `帐号 ${account}`,
      });
    },
  },
  mounted: function () {
    this.$store.commit('activity/listen', (account: string, message: string) =>
      this.onWsActivity(account, message)
    );
    setInterval(() => {
      if (!this.connection) {
        this.makeWebsocketConnection();
      }
    }, 1000);
  },
  computed: {
    activity: function () {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const store: Store<StateInterface> = this.$store;
      return store.state.activity;
    },
  },
  setup() {
    return {};
  },
});
</script>
