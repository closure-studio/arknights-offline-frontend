<template>
  <q-page
    class="row justify-center items-center"
    padding
    :style="backgroundStyle"
  >
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
    <q-card v-else bordered class="col-12 col-md-6">
      <q-card-section>
        <div class="text-h4">游戏状态</div>
        <q-badge>帐号: {{ gameAccount }}</q-badge>
        <q-btn icon="refresh" size="md" flat @click="getGameAccounData"
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

      <q-tab-panels v-model="tab" animated class="shadow-1">
        <q-tab-panel name="info">
          <div class="text-h6">信息</div>
          <q-separator />
          <q-card-section>
            <div class="row q-pa-xs">
              <q-img
                class="shadow-1 col-4"
                ratio="1"
                :src="resourceURL(account.PlayerStatus.TouXiang)"
              />
              <q-card class="shadow-1 col-8">
                <q-card-section
                  ><div class="text-subtitle">
                    欢迎回来: <b>{{ account.PlayerStatus.UserName }}</b>
                  </div></q-card-section
                >
                <q-separator />
                <q-card-section>
                  <q-chip
                    icon="mood"
                    :color="
                      account.PlayerStatus.LiZhi >=
                      account.PlayerStatus.LiZhiMax
                        ? 'warning'
                        : 'info'
                    "
                    >理智: {{ account.PlayerStatus.LiZhi }} /
                    {{ account.PlayerStatus.LiZhiMax }}</q-chip
                  >
                  <q-chip icon="bolt"
                    >等级: {{ account.PlayerStatus.Level }}</q-chip
                  >
                  <q-space />
                  <q-chip icon="catching_pokemon">
                    源石: <q-icon name="android" />{{
                      account.PlayerStatus.YuanShi.Android
                    }}
                    |<q-icon name="phone_iphone" />{{
                      account.PlayerStatus.YuanShi.iOS
                    }} </q-chip
                  ><q-chip icon="payments"
                    >龙门币: {{ account.PlayerStatus.LongMenBi }}</q-chip
                  >
                  <q-chip icon="auto_awesome"
                    >经验: {{ account.PlayerStatus.Exp }}</q-chip
                  >
                  <q-chip icon="savings"
                    >信用: {{ account.PlayerStatus.XinYong }}</q-chip
                  ></q-card-section
                >
              </q-card>
            </div>
          </q-card-section>

          <q-card-actions>
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
            </div></q-card-actions
          >
        </q-tab-panel>
        <q-tab-panel name="inventory">
          <div class="text-h6">背包</div>
          共 {{ account.inventory.length }} 种物品
          <q-separator />
          <q-intersection transition="fade">
            <q-chip v-for="item in account.inventory" :key="item.Id" size="xl">
              <q-avatar square size="xl">
                <q-img :src="resourceURL(item.Id)" ratio="1"></q-img
              ></q-avatar>
              <div>
                {{ item.CNName
                }}<q-badge align="middle" outline color="primary">{{
                  item.Quantity
                }}</q-badge>
              </div></q-chip
            >
          </q-intersection>
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
    <!-- <q-img
      class="absolute-bottom-left"
      v-if="account?.PlayerStatus"
      :src="
        resourceURL(account.PlayerStatus.Mishu.Skin, 'webp').replace('#', '_')
      "
    /> -->
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
    backgroundStyle: function () {
      if (this.account?.PlayerStatus?.Mishu) {
        const url: string = this.resourceURL(
          this.account.PlayerStatus.Mishu.Skin,
          'webp'
        ).replace('#', '_');
        return {
          'background-image': `url(${url})`,
          'background-repeat': 'no-repeat',
          'background-size': ' 40%',
          'background-position': 'bottom left',
        };
      } else {
        return {};
      }
    },
    loadingBar: function (): QAjaxBar {
      return this.$refs.bar as QAjaxBar;
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
      if (!!account) {
        try {
          this.loadingBar.start();
          const result = await api.getGameData(account);
          this.account = result.data;
        } catch {
          this.account = null;
        } finally {
          this.loadingBar.stop();
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
    resourceURL: function (name: string, suffix?: string): string {
      suffix = suffix || 'png';
      return `https://ak.nai-ve.com/res/${name}.${suffix}`;
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
