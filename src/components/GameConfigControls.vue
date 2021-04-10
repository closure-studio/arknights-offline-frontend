<template>
  <div>
    <q-slide-transition>
      <div v-show="modified">
        <q-banner rounded class="bg-primary text-white"
          >设置已经修改,但尚未保存</q-banner
        >
      </div>
    </q-slide-transition>

    <q-expansion-item
      label="战斗编队"
      :caption="`当前选择: ${selectedSquad}`"
      class="q-pa-md"
      expand-separator
      icon="group"
    >
      <game-squads-panel
        :data="data"
        v-model="selectedSquad"
        :highlitght="String(config.squadSelected)"
        @input="modified = true"
    /></q-expansion-item>

    <q-form @change="modified++">
      <div class="row justify-evenly items-center">
        <q-chip icon="pause" square
          >暂停刷图: <q-toggle v-model="paused" color="yellow"
        /></q-chip>
        <q-chip icon="gamepad" square
          >自动战斗: <q-toggle color="positive" v-model="battle"
        /></q-chip>
        <q-chip icon="badge" square
          >自动公招: <q-toggle color="accent" v-model="recurit"
        /></q-chip>
        <q-select
          label="作战地图"
          class="col-6"
          @filter="availableMaps"
          :options="maps"
          v-model="selectedMap"
          clearable
        >
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
              <q-item-section avatar>
                <q-icon name="map" />
              </q-item-section>
              <q-item-section>
                <q-item-label v-html="scope.opt.label" />
                <q-item-label caption>{{ scope.opt.description }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-btn
          flat
          color="positive"
          icon="done"
          type="submit"
          @click="submitConfigChange"
          :disable="!!modified"
          >应用设置</q-btn
        >
      </div>
    </q-form>
  </div>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { GameInfoData } from '../api/models';
import GameSquadsPanel from './GameSquadsPanel.vue';
import api from '../api';

export default defineComponent({
  components: { GameSquadsPanel },
  data: () => {
    return {
      modified: 0,
      maps: null as
        | null
        | {
            label: string;

            value: { map: string; model: string };
            description: string;
          }[],
      selectedSquad: '',
      paused: false,
      battle: false,
      recurit: false,
      selectedMap: null as null | { map: string; model: string },
    };
  },
  props: {
    data: {
      required: true,
    },
    account: { required: true, type: String },
  },
  setup(props) {
    return { ...props };
  },
  computed: {
    config() {
      const data = this.$props.data as GameInfoData;
      return data.GameConfig;
    },
  },
  methods: {
    async availableMaps(
      val: string,
      update: { (): unknown },
      abort: { (): unknown }
    ) {
      if (this.maps) {
        update();
        return;
      } else {
        try {
          const result = await api.getAllModels();
          this.maps = result.data.map((data) => {
            return {
              label: data.mapId,
              value: { map: data.mapId, model: data.modelName },
              description: data.description,
            };
          });
        } catch {
          abort();
        }
        update();
      }
    },
    async submitConfigChange() {
      if (!this.selectedMap) {
        throw new Error();
      }
      try {
        this.$q.loading.show();
        const result = await api.setAutoBattle(
          this.$props.account,
          this.battle,
          this.recurit,
          Number(this.selectedSquad),
          this.selectedMap?.map,
          this.selectedMap?.model
        );
        this.$q.notify({
          message: '游戏设定修改成功',
          caption: result.message,
          type: 'positive',
          position: 'bottom',
          progress: true,
        });
      } finally {
        this.$q.loading.hide();
      }
    },
  },
  watch: {
    config: {
      handler() {
        if (this.modified) {
          return;
        }
        this.paused = this.config.isPause;
        this.battle = this.config.autoBattle;
        this.recurit = this.config.autoRecruit;
      },
      deep: true,
      immediate: true,
    },
  },
});
</script>
