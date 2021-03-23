<template>
  <q-page class="row justify-center items-center" padding>
    <h4 v-if="!account">请先在右侧选择一个游戏帐号</h4>
    <div
      v-else-if="!account.PlayerStatus || !account.inventory"
      class="text-center"
    >
      <div class="text-h4">请先登录该帐号</div>
      <q-badge color="negative">{{ gameAccount }}</q-badge>
      <div class="text-subtitle">如已登录, 请稍等</div>
      <q-space />
      <q-btn icon="vpn_key" @click="loginGame">登录该帐号</q-btn>
    </div>
    <q-card v-else bordered>
      <q-card-section>
        <div class="text-h4">游戏状态</div>
        <q-badge>帐号: {{ gameAccount }}</q-badge>
        <q-btn icon="refresh" size="lt" flat @click="getGameAccounData"
          >刷新数据</q-btn
        >
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
        <q-tab name="info" label="信息" />
        <q-tab name="inventory" label="背包" />
        <q-tab name="log" label="日志" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="info">
          <div class="text-h6">信息</div>
          <q-separator />
          <q-card-section>
            <q-banner rounded class="shadow-1">
              <q-avatar>
                <q-img
                  class="shadow-1"
                  sizes="100px"
                  :src="resourceURL(account.PlayerStatus.TouXiang)"
              /></q-avatar>
              欢迎回来, <b>{{ account.PlayerStatus.UserName }}</b>

              <q-separator />
            </q-banner>

            <q-space />
            <q-chip icon="payments"
              >龙门币: {{ account.PlayerStatus.LongMenBi }}</q-chip
            >
            <q-chip icon="bolt">等级: {{ account.PlayerStatus.Level }}</q-chip>
            <q-chip
              icon="mood"
              :color="
                account.PlayerStatus.LiZhi >= account.PlayerStatus.LiZhiMax
                  ? 'warning'
                  : 'info'
              "
              >理智: {{ account.PlayerStatus.LiZhi }} /
              {{ account.PlayerStatus.LiZhiMax }}</q-chip
            >

            <q-chip icon="auto_awesome"
              >经验: {{ account.PlayerStatus.Exp }}</q-chip
            >
            <q-chip icon="savings"
              >信用: {{ account.PlayerStatus.XinYong }}</q-chip
            >
            <q-chip icon="catching_pokemon">
              源石: Android:{{ account.PlayerStatus.YuanShi.Android }} iOS:
              {{ account.PlayerStatus.YuanShi.iOS }}
            </q-chip>
          </q-card-section>

          <q-separator />
          <div>
            暂停中:<q-toggle
              v-model="paused"
              color="accent"
              @input="pauseToggle"
            ></q-toggle>
          </div>
          <div>
            下一次运行:
            <q-badge>{{ account.systemInfo.nextAutoRunTime }}</q-badge>
          </div>
        </q-tab-panel>
        <q-tab-panel name="inventory">
          <div class="text-h6">背包</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
          <q-space />
          <q-chip v-for="item in account.inventory" :key="item.Id" size="xl">
            <q-avatar square size="xl">
              <q-img :src="resourceURL(item.Id)" basic></q-img
            ></q-avatar>
            <div>
              {{ item.CNName
              }}<q-badge align="middle" outline color="primary">{{
                item.Quantity
              }}</q-badge>
            </div></q-chip
          >
        </q-tab-panel>

        <q-tab-panel name="log">
          <div class="text-h6">日志</div>
          <q-pagination
            v-model="current"
            :max="Math.ceil(account.log.length / 5) + 1"
            input
          />
          <q-intersection transition="fade">
            <q-timeline color="accent" layout="comfortable">
              <q-timeline-entry
                icon="timeline"
                v-for="log in account.log.slice(5 * (current - 1), 5 * current)"
                :title="log.text"
                :subtitle="log.logtime"
                :key="log.id"
              ></q-timeline-entry> </q-timeline
          ></q-intersection>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
    <q-ajax-bar
      ref="bar"
      position="bottom"
      color="positive"
      size="5px"
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
      current: 1,
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
    pauseToggle: async function (value: boolean) {
      if (!this.gameAccount) {
        return;
      }
      try {
        this.$q.loading.show();
        if (value) {
          await api.setGamePause(this.gameAccount);
        } else {
          await api.setGameResume(this.gameAccount);
        }
      } finally {
        this.$q.loading.hide();
      }
      this.$q.notify({
        message: '暂停状态修改成功',
        caption: `已经修改为 ${String(value)}`,
        type: 'positive',
        position: 'bottom',
        progress: true,
      });
    },
    getGameAccounData: async function () {
      const account = this.gameAccount;
      const bar = this.$refs.bar as QAjaxBar;
      if (!!account) {
        try {
          bar.start();
          const result = await api.getGameData(account);
          this.account = result.data;
        } catch {
          this.account = null;
        } finally {
          bar.stop();
        }
      } else {
        this.account = null;
      }
    },
    loginGame: async function () {
      const account = this.gameAccount;
      if (!!account) {
        try {
          this.$q.loading.show();
          const result = await api.gameLogin(account);
          this.$q.notify({
            color: 'positive',
            position: 'top',
            message: result.message,
          });
        } finally {
          this.$q.loading.hide();
        }
      }
    },
    resourceURL: function (name: string): string {
      return `https://ak.nai-ve.com/res/${name}.png`;
    },
  },
  mounted: function () {
    void this.getGameAccounData();
    setInterval(() => void this.getGameAccounData(), 20 * 500);
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
