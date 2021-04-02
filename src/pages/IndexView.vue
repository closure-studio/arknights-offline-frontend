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
  computed: {
    activitiesList: function () {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const store: Store<StateInterface> = this.$store;
      let list = [] as Array<{
        time: Date;
        account: string;
        message: string;
      }>;
      store.state.activity.activities.forEach((activity, account) => {
        activity.forEach((message, time) => {
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
