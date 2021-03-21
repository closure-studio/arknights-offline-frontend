<template>
  <q-page class="row justify-center items-center"
    ><h4 v-if="!account">请先在右侧选择一个游戏帐号</h4>
    <q-card v-if="account">
      <q-card-section>
        <div class="text-h4">游戏状态</div>
        <q-badge>帐号: {{ gameAccount }}</q-badge>
      </q-card-section>
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="info" label="游戏信息" />
        <q-tab name="mails" label="Mails" />
        <q-tab name="alarms" label="Alarms" />
        <q-tab name="movies" label="Movies" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="info">
          <div class="text-h6">游戏信息</div>
          <q-separator />
          <q-chip icon="recent_actors"
            >欢迎回来, {{ account.PlayerStatus.UserName }}</q-chip
          >
          <q-chip icon="payments">{{ account.PlayerStatus.LongMenBi }}</q-chip>
          <q-chip icon="bolt">{{ account.PlayerStatus.Level }}</q-chip>
          <q-chip icon="mood"
            >{{ account.PlayerStatus.LiZhi }} /
            {{ account.PlayerStatus.LiZhiMax }}</q-chip
          >
          <q-separator />
          <div>
            暂停中:<q-toggle v-model="paused" color="accent"></q-toggle>
          </div>
          <div>
            下一次运行:
            <q-badge>{{ account.systemInfo.nextAutoRunTime }}</q-badge>
          </div>
        </q-tab-panel>
        <q-tab-panel name="mails">
          <div class="text-h6">Mails</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </q-tab-panel>

        <q-tab-panel name="alarms">
          <div class="text-h6">Alarms</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </q-tab-panel>

        <q-tab-panel name="movies">
          <div class="text-h6">Movies</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
    <q-ajax-bar
      ref="bar"
      position="bottom"
      color="accent"
      size="1%"
      skip-hijack
    />
  </q-page>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import api from '../api';
import { GameInfoData } from '../api/models';
import { QAjaxBar } from 'quasar';

export default defineComponent({
  props: {},
  data: function () {
    return {
      account: null as GameInfoData | null,
      tab: 'info',
      paused: false,
    };
  },
  computed: {
    gameAccount: function () {
      const account = this.$route.params?.account as string | undefined;
      return account;
    },
  },
  watch: {
    account(elder: GameInfoData | undefined, newer: GameInfoData | undefined) {
      if (!!newer) {
        this.paused = newer.systemInfo.isPause;
      }
    },
  },
  methods: {
    getGameAccounData: async function () {
      const account = this.gameAccount;
      const bar = this.$refs.bar as QAjaxBar;
      if (!!account) {
        try {
          bar.start();
          const result = await api.getGameData(account);
          this.account = result.data;
        } finally {
          bar.stop();
        }
      } else {
        this.account = null;
      }
    },
  },
  mounted: function () {
    void this.getGameAccounData();
    setInterval(() => void this.getGameAccounData(), 20 * 1000);
  },
  beforeRouteUpdate: function (to, from, next) {
    void this.getGameAccounData();
    next();
  },
  setup(props) {
    return { ...props };
  },
});
</script>
