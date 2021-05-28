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
          ><q-item-section avatar>
            <q-icon :name="platformName(account.platform).icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ account.account }}</q-item-label>
            <q-item-section caption class="text-grey">
              {{ accountStatus.get(account.account) || '状态未知' }}
            </q-item-section>
          </q-item-section>
          <q-item-label side top class="text-grey">
            {{ platformName(account.platform).name }}
          </q-item-label>
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
import GameAccountForm from '../components/GameAccountForm.vue';
import utils from '../utils';

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
      if (this.userData) {
        try {
          this.loading = true;
          const result = await api.getGamesAccounts();
          this.accounts = result.data;
        } catch (err) {
          console.log(`Failed to refresh account data, error ${String(err)}`);
        } finally {
          this.loading = false;
        }
      } else {
        console.log('Account is not login, stop data refresh');
      }
    },
    removeAccount: async function (account: string) {
      try {
        this.$q.loading.show();
        await api.delGame({ account });
      } finally {
        this.$q.loading.hide();
      }
    },
    newAccount: async function () {
      const data = (await utils.dialog(this.$q, {
        component: GameAccountForm,
        parent: this,
      })) as { account: string; password: string };
      void utils.dialog(this.$q, { message: String(data) });
    },
    platformName: function (platform: number): { icon: string; name: string } {
      switch (platform) {
        case 0:
          return { icon: 'phone_iphone', name: 'iOS' };
        case 1:
          return { icon: 'android', name: 'Android' };
        case 2:
          return { icon: 'live_tv', name: 'Bilibili' };
        default:
          return { icon: 'help', name: 'Unknown' };
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
