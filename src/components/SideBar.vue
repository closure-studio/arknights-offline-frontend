<template>
  <q-card class="">
    <q-img src="~assets/background.webp"
      ><div class="text-h5 absolute-top text-center">帐号信息</div></q-img
    >
    <q-list bordered separator class="shadow-1">
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
      </q-item>
    </q-list>
  </q-card>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import api from '../api';
import { GameAccountData } from '../api/models';

export default defineComponent({
  props: {},
  data: function () {
    return {
      accounts: [] as GameAccountData[],
      logined: false,
    };
  },
  methods: {
    refreshAccountData: async function () {
      try {
        const result = await api.getGamesAccounts();
        this.accounts = result.data;
      } catch (err) {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        console.error(`Failed to refresh account data, error ${err}`);
      }
    },
    checkUserLogin: async function () {
      try {
        const userTokenData = await api.verifyToken();
        api.token.set(userTokenData.data.token);
        console.info(
          `Succeed to refresh user ${userTokenData.data.userID} JWT token`
        );
        this.logined = true;
      } catch (err) {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        console.error(`Failed to refresh user token, error ${err}`);
        this.logined = false;
      }
    },
  },
  mounted: function () {
    void this.checkUserLogin();
    void this.refreshAccountData();
    setInterval(() => void this.refreshAccountData(), 10 * 1000);
    setInterval(() => void this.checkUserLogin(), 10 * 60 * 1000);
  },
  watch: {
    // logined: function (before: boolean, after: boolean) {
    //   if (after) {
    //     this.$q.notify({
    //       message: '登录已完成',
    //       position: 'center',
    //       color: 'positive',
    //     });
    //     void this.$router.push('/');
    //   } else {
    //     this.$q.notify({
    //       message: '登录已过期',
    //       position: 'center',
    //       color: 'negative',
    //     });
    //     void this.$router.push('/login');
    //   }
    // },
  },
  setup(props) {
    return { ...props };
  },
});
</script>
