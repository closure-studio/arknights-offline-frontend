<template>
  <q-page class="row justify-center items-center">
    <q-card class="col-6 shadow-1">
      <q-card-section>
        <q-timeline color="primary">
          <q-timeline-entry
            v-for="activity in activitiesList"
            :key="activity.time"
            :title="activity.account"
            :subtitle="activity.time.toLocaleString()"
            :body="activity.message"
          ></q-timeline-entry> </q-timeline
      ></q-card-section>
    </q-card>
  </q-page>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { Store } from 'vuex';
import { StateInterface } from '../store';

export default defineComponent({
  props: {},
  data: function () {
    return {};
  },
  methods: {
    makeWebsocketConnection: function () {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const store: Store<StateInterface> = this.$store;
      const token = store.state.login.account?.token;
      if (!token) {
        void this.$router.push('/login');
        return;
      }
      const host = new URL(this.$axios.defaults.baseURL as string).host;
      const ws = new WebSocket(`wss://${host}/ws/?token=${token}`);

      ws.onopen = (event) => {
        store.commit('activity/connect');
        console.timeLog('WebSocket connection opened', event);
        this.$q.notify({
          color: 'positive',
          position: 'top',
          message: 'WebSocket链接已建立',
        });
      };
      ws.onmessage = (event) => {
        const received: Map<string, string> = new Map(
          Object.entries(JSON.parse(event.data as string))
        );
        received.forEach((message, account, map) => {
          store.commit('activity/create', { account, message });
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const store: Store<StateInterface> = this.$store;
      let list = [] as Array<{
        time: Date;
        account: string;
        message: string;
      }>;
      store.state.activity.activities.forEach((activity, account, map) => {
        activity.forEach((message, time, map) => {
          list.push({
            time,
            message,
            account,
          });
        });
      });
      list.sort((a, b) => a.time.getTime() - b.time.getTime()).reverse();
      return list;
    },
  },
  setup(props) {
    return { ...props };
  },
});
</script>
