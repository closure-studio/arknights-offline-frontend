<template>
  <q-page>
    <q-card class="absolute-full">
      <q-img src="~assets/background.webp"
        ><div class="absolute-bottom text-center">帐号信息</div></q-img
      >
      <q-list bordered separator class="shadow-1" v-if="userData">
        <q-item>
          <q-item-section avatar>
            <q-avatar color="accent" text-color="white">
              {{ userData.username[0].toUpperCase() }}
            </q-avatar></q-item-section
          >
          <q-item-section>
            <q-item-label>
              {{ userData.username }}
            </q-item-label>
            <q-item-label caption>
              共{{ accounts.length }}个帐号正在托管
            </q-item-label>
          </q-item-section>
          <q-item-section side top> UID: {{ userData.id }}</q-item-section>
        </q-item>

        <q-item
          clickable
          v-for="account in accounts"
          :key="account.account"
          :to="`/game/${account.account}`"
          ><q-item-section avatar
            ><q-icon
              :name="
                account.platform ? 'android' : 'phone_iphone'
              " /></q-item-section
          ><q-item-section
            ><q-item-label>{{ account.account }}</q-item-label>
            <q-item-label caption>
              {{ account.platform ? 'Android' : 'iOS' }}
            </q-item-label></q-item-section
          >
          <q-item-section side top>
            {{ accountStatus.get(account.account) || '状态未知' }}
          </q-item-section>
        </q-item>
      </q-list>

      <q-circular-progress
        class="absolute-center"
        size="md"
        color="primary"
        v-if="loading"
        indeterminate
      />

      <q-card-actions class="absolute-bottom" align="evenly">
        <q-btn flat color="primary" @click="newAccount">添加托管帐号</q-btn>
        <q-btn flat icon="refresh" @click="refreshAccountData">刷新数据</q-btn>
      </q-card-actions>
    </q-card>
  </q-page>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import api from '../api';
import { GameAccountData } from '../api/models';
import { Store } from 'vuex';
import { StateInterface } from '../store';

export default defineComponent({
  props: {},
  data: function () {
    return {
      accounts: [] as GameAccountData[],
      loading: false,
      remove: false,
      add: false,
    };
  },
  methods: {
    refreshAccountData: async function () {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const store: Store<StateInterface> = this.$store;
      if (!store.state.login.account) {
        return void this.$router.push('/login');
      }
      try {
        this.loading = true;
        const result = await api.getGamesAccounts();
        this.accounts = result.data;
      } catch (err) {
        console.log(`Failed to refresh account data, error ${String(err)}`);
      } finally {
        this.loading = false;
      }
    },
    removeAccount: async function (account: string) {
      try {
        this.$q.loading.show();
        await api.delGame(account);
      } finally {
        this.$q.loading.hide();
      }
    },
    newAccount: async function () {
      const account: string = await new Promise((resolve, reject) =>
        this.$q
          .dialog({
            title: '录入帐号信息',
            message: '请输入游戏帐号',
            cancel: true,
            persistent: true,
            prompt: {
              model: '',
              type: 'text',
              counter: true,
              isValid: Boolean,
            },
          })
          .onOk((data: string) => resolve(data))
          .onCancel(reject)
      );
      const password: string = await new Promise((resolve, reject) =>
        this.$q
          .dialog({
            title: '录入帐号信息',
            message: `请输入帐号${account}的密码`,
            cancel: true,
            persistent: true,
            prompt: {
              model: '',
              type: 'password',
              counter: true,
              isValid: Boolean,
            },
          })
          .onOk((data: string) => resolve(data))
          .onCancel(reject)
      );
      try {
        this.$q.loading.show();
        await api.createGame(account, password);
        this.$q.notify({
          type: 'positive',
          message: '托管已成功添加',
          caption: `帐号: ${account}`,
          position: 'top',
          progress: true,
        });
      } finally {
        this.$q.loading.hide();
      }
    },
  },
  mounted: function () {
    void this.refreshAccountData();
    setInterval(() => void this.refreshAccountData(), 10 * 1000);
  },
  watch: {},
  computed: {
    userData: function () {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const store: Store<StateInterface> = this.$store;
      return store.state.login.account;
    },
    accountStatus: function () {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const store: Store<StateInterface> = this.$store;
      return store.state.activity.debounce;
    },
  },
  setup(props) {
    return { ...props };
  },
});
</script>
