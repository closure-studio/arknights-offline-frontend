<template>
  <q-page
    class="row justify-center items-center"
    padding
    :style="backgroundStyle"
  >
    <div v-if="!(gameAccount && account)" class="absolute-center text-center">
      <div class="text-h4">请先在右侧选择一个游戏帐号</div>
      <q-btn icon="refresh" flat @click="getGameAccounData">刷新数据</q-btn>
    </div>
    <!--Game Login Prompt-->
    <q-card
      v-else-if="!(account.PlayerStatus && account.Inventory)"
      class="col-6 shadow-1"
    >
      <q-card-section>
        <div class="text-h5">请先登录该帐号</div>
        <div class="text-subtitle">如已登录, 请稍等</div>
        <q-chip icon="person">帐号: {{ gameAccount }}</q-chip>
      </q-card-section>
      <q-separator spaced />
      <q-card-actions align="evenly">
        <q-btn icon="vpn_key" @click="loginGame" flat color="positive">
          登录该帐号
        </q-btn>
        <q-btn icon="clear" @click="removeGame" flat color="negative">
          删除该帐号
        </q-btn>
        <q-btn icon="refresh" @click="getGameAccounData" flat>刷新数据</q-btn>
      </q-card-actions>
    </q-card>
    <!--Game Detail Card-->
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
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
        @change="$forceUpdate"
      >
        <q-tab name="info" label="信息" icon="info" />
        <q-tab name="inventory" label="库存" icon="inventory" />
        <q-tab name="settings" label="设定" icon="settings" />
        <q-tab name="log" label="日志" icon="article" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated class="shadow-1">
        <q-tab-panel name="info">
          <div class="text-h6">信息</div>
          <q-separator />
          <q-card-section><game-detail-card :data="account" /></q-card-section>

          <q-card-actions align="evenly">
            <q-btn icon="vpn_key" @click="loginGame" flat color="positive">
              立即登录该帐号
            </q-btn>
            <q-btn icon="clear" @click="removeGame" flat color="negative">
              删除该帐号
            </q-btn>
            <div>
              下一次运行:
              <q-badge>{{ account.GameConfig.nextAutoRunTime }}</q-badge>
            </div>
          </q-card-actions>
        </q-tab-panel>

        <q-tab-panel name="inventory">
          <div class="text-h6">库存</div>
          <q-badge>共 {{ account.Inventory.length }} 种物品</q-badge>
          <q-separator />
          <q-card-section class="row">
            <div
              class="col-2 col-md-1 text-center"
              v-for="item in account.Inventory"
              :key="item.Id"
            >
              <q-img :src="resourceURL(item.Id)" :ratio="1" />
              <q-badge>{{ item.Quantity }}</q-badge>
              <q-tooltip>{{ item.CNName }}</q-tooltip>
            </div>
          </q-card-section>
        </q-tab-panel>

        <q-tab-panel name="settings">
          <div class="text-h6">设定</div>
          <q-separator />
          <game-config-controls :data="account" :account="gameAccount" />
        </q-tab-panel>

        <q-tab-panel name="log">
          <div class="text-h6">日志</div>
          <game-log-timeline :data="account" />
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
import GameDetailCard from 'src/components/GameDetailCard.vue';
import utils from '../utils';
import GameLogTimeline from 'src/components/GameLogTimeline.vue';
import GameConfigControls from 'src/components/GameConfigControls.vue';

export default defineComponent({
  components: {
    GameDetailCard,
    GameLogTimeline,
    GameConfigControls,
  },
  props: {},
  data: function () {
    return {
      account: null as GameInfoData | null,
      tab: 'info',
    };
  },
  computed: {
    gameAccount: function () {
      const account = this.$route.params?.account as string | undefined;
      return account;
    },
    backgroundStyle: function (): { [key: string]: string } {
      if (this.account?.PlayerStatus?.Mishu) {
        const url: string = this.resourceURL(
          this.account.PlayerStatus.Mishu.Skin.replace('#', '_'),
          'webp'
        );
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
  methods: {
    async getGameAccounData() {
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
    async loginGame() {
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
    async removeGame() {
      const account = this.gameAccount;
      if (!!account) {
        await utils.dialog(this.$q, {
          title: '删除确认',
          message: `你确认要移除帐号${account}嘛?`,
          cancel: true,
          persistent: true,
        });
        try {
          this.$q.loading.show();
          await api.delGame(account);
          this.$q.notify({
            type: 'positive',
            position: 'center',
            progress: true,
            message: `帐号${account}已被删除`,
            closeBtn: '返回首页',
            onDismiss: () => void utils.redirect(this.$router, '/'),
          });
        } finally {
          this.$q.loading.hide();
        }
      }
    },
    // eslint-disable-next-line @typescript-eslint/unbound-method
    resourceURL: utils.resource,
  },
  mounted: function () {
    void this.getGameAccounData();
    setInterval(() => void this.getGameAccounData(), 20 * 500);
  },
  beforeRouteUpdate: function (to, from, next) {
    this.account = null;
    void this.getGameAccounData();
    next();
  },
  setup(props) {
    return { ...props };
  },
});
</script>