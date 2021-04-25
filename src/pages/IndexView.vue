<template>
  <q-page class="row justify-center items-center">
    <q-card class="col-6 shadow-1">
      <q-card-section>
        <div class="text-h4">明日方舟离线托管</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="row justify-center items-center">
          <q-timeline
            color="primary"
            layout="comfortable"
            v-if="!!activitiesList"
            class="col-12 col-md-6"
          >
            <q-timeline-entry
              v-for="activity in activitiesList"
              :key="activity.time"
              :title="activity.account"
              :subtitle="activity.time.toLocaleString()"
              :body="activity.message"
            ></q-timeline-entry>
          </q-timeline>

          <q-banner
            title="免责声明"
            rounded
            class="bg-primary text-white col-12 col-md-6"
          >
            <template v-slot:avatar>
              <q-icon name="warning" />
            </template>
            <div class="text-body1">非盈利性公益项目,且用且珍惜</div>
            <div class="text-body1">请勿泄露您的任何账号</div>
            <div class="text-body1">请勿肆处宣扬本网站</div>
            <div class="text-body1">感谢您的使用</div>
          </q-banner>
        </div>
      </q-card-section>
      <q-separator />

      <q-bar class="row justify-evenly rounded-borders" dark>
        <div class="text-body1">Present by:</div>
        <q-separator vertical />
        <q-chip icon="casino">星灏</q-chip>
        <q-chip icon="code">欧皇大佬GK</q-chip>
        <q-chip icon="palette">32方混淆</q-chip>
        <q-chip icon="more">山鸡</q-chip>
      </q-bar>
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
