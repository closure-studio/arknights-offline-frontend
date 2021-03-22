<template>
  <q-page class="row justify-center items-center">
    <q-card>
      <q-timeline color="primary">
        <q-timeline-entry
          v-for="activity in activitiesList"
          :key="activity.timestamp"
          :title="activity.message"
          :subtitle="activity.time"
          :heading="activity.time"
        ></q-timeline-entry>
      </q-timeline>
    </q-card>
  </q-page>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import api from '../api';

export default defineComponent({
  props: {},
  data: function () {
    return {
      activities: new Map() as Map<string, Map<number, string>>,
      debounce: new Map() as Map<string, string>,
      connected: false,
    };
  },
  methods: {
    makeWebsocketConnection: function () {
      const token = api.token.get()?.toString();
      if (!token) {
        void this.$router.push('/login');
        return;
      }
      const host = new URL(this.$axios.defaults.baseURL as string).host;
      const ws = new WebSocket(`wss://${host}/ws/?token=${token}`);

      ws.onopen = (event) => {
        this.connected = true;
        console.timeLog('WebSocket connection opened', event);
        this.$q.notify({
          color: 'positive',
          position: 'top',
          message: 'WebSocket链接已建立',
        });
      };
      ws.onmessage = (event) => {
        const received = new Map(
          Object.entries(JSON.parse(event.data as string))
        );
        received.forEach((value, key, map) => {
          if (this.debounce.get(key) == value) {
            return;
          }
          this.$q.notify({
            icon: 'notifications',
            message: value as string,
            caption: `帐号: ${key}`,
            position: 'bottom-right',
            color: 'dark',
            progress: true,
            timeout: 10 * 1000,
          });
          this.debounce.set(key, value as string);
          const activity =
            this.activities.get(key) || (new Map() as Map<number, string>);
          activity.set(Date.now(), value as string);
          this.activities.set(key, activity);
        });
      };
      ws.onclose = ws.onerror = (event) => {
        this.$q.notify({
          message: 'WebSocket链接已断开',
          color: 'negative',
          position: 'top',
        });
      };
    },
  },
  mounted: function () {
    void this.makeWebsocketConnection();
  },
  computed: {
    activitiesList: function () {
      let list = [] as Array<{
        time: string;
        timestamp: number;
        account: string;
        message: string;
      }>;
      this.activities.forEach((activity, account, map) => {
        activity.forEach((message, timestamp, map) => {
          list.push({
            time: new Date(timestamp).toLocaleString(),
            timestamp,
            message,
            account,
          });
        });
      });
      list.sort((a, b) => a.timestamp - b.timestamp).reverse();
      return list;
    },
  },
  setup(props) {
    return { ...props };
  },
});
</script>
