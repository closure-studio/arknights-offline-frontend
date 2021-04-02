<template>
  <q-page
    class="row justify-center items-center"
    padding
    :style="backgroundStyle"
  >
    <div v-if="!(gameAccount && account)" class="absolute-center text-center">
      <div class="text-h4">请先在右侧选择一个游戏帐号</div>
      <q-btn icon="refresh" size="md" flat @click="getGameAccounData"
        >刷新数据</q-btn
      >
    </div>

    <q-card
      v-else-if="!(account.PlayerStatus && account.Inventory)"
      class="text-center col-6 shadow-1"
    >
      <q-card-section>
        <div class="text-h4">请先登录该帐号</div>
        <q-badge color="negative">{{ gameAccount }}</q-badge>
        <div class="text-subtitle">如已登录, 请稍等</div>
      </q-card-section>
      <q-separator spaced />
      <q-card-actions align="evenly">
        <q-btn icon="vpn_key" @click="loginGame" flat color="positive"
          >登录该帐号</q-btn
        >
        <q-btn icon="clear" @click="removeGame" flat color="negative"
          >删除该帐号</q-btn
        ></q-card-actions
      >
    </q-card>
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
        <q-tab name="inventory" label="库存" />
        <q-tab name="squads" label="编队" />
        <q-tab name="log" label="日志" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated class="shadow-1">
        <q-tab-panel name="info">
          <div class="text-h6">信息</div>
          <q-separator />
          <q-card-section> <game-detail-card :data="account" /></q-card-section>

          <q-card-actions align="evenly">
            <div>
              暂停中:<q-toggle
                v-model="paused"
                color="accent"
                @input="pauseToggle"
              ></q-toggle>
            </div>
            <q-btn icon="vpn_key" @click="loginGame" flat color="positive"
              >立即登录该帐号</q-btn
            >
            <q-btn icon="clear" @click="removeGame" flat color="negative"
              >删除该帐号</q-btn
            >
            <div>
              下一次运行:
              <q-badge>{{ account.GameConfig.nextAutoRunTime }}</q-badge>
            </div>
          </q-card-actions>
        </q-tab-panel>
        <q-tab-panel name="inventory">
          <div class="text-h6">库存</div>
          共 {{ account.Inventory.length }} 种物品
          <q-separator />
          <q-intersection transition="fade">
            <q-chip
              v-for="item in account.Inventory"
              :key="item.Id"
              size="xl"
              class="shadow-1"
            >
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

        <q-tab-panel name="squads">
          <div class="text-h6">编队</div>
          <q-expansion-item
            icon="people"
            label="战斗编队"
            :caption="`目前已选择: ${
              Object.keys(account.Squads).includes(squad)
                ? account.Squads[squad].name
                : undefined
            }`"
          >
            <game-squads-panel :data="account" v-model="squad"
          /></q-expansion-item>
          <q-card-actions align="evenly"
            ><q-chip icon="gamepad" square
              >自动战斗:<q-toggle color="accent"
            /></q-chip>
            <q-chip icon="badge" square
              >自动公招:<q-toggle color="accent"
            /></q-chip>
            <q-btn flat color="positive" icon="done">应用设置</q-btn>
          </q-card-actions>
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
import GameSquadsPanel from 'src/components/GameSquadsPanel.vue';
import GameLogTimeline from 'src/components/GameLogTimeline.vue';

export default defineComponent({
  components: { GameDetailCard, GameSquadsPanel, GameLogTimeline },
  props: {},
  data: function () {
    return {
      account: null as GameInfoData | null,
      tab: 'info',
      paused: false,
      squad: '',
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
        this.paused = newer.GameConfig.isPause;
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
    removeGame: async function () {
      const account = this.gameAccount;
      if (!!account) {
        await new Promise((resolve, reject) => {
          this.$q
            .dialog({
              title: '删除确认',
              message: `你确认要移除帐号${account}嘛?`,
              cancel: true,
              persistent: true,
            })
            .onOk(resolve)
            .onCancel(reject);
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