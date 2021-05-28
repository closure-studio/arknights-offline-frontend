<template>
  <div>
    <q-slide-transition>
      <div v-show="modified">
        <q-banner rounded class="bg-warning text-white"
          >设置已经修改,但尚未保存</q-banner
        >
      </div>
    </q-slide-transition>

    <q-expansion-item
      label="战斗编队"
      :caption="`当前选择: ${getSquadName(selectedSquad)}`"
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
        <q-chip icon="pause" square>
          暂停托管:
          <q-toggle v-model="paused" color="yellow" @input="applyPauseChange" />
        </q-chip>

        <q-chip icon="gamepad" square>
          自动战斗:
          <q-toggle color="positive" v-model="battle" @input="modified++" />
        </q-chip>

        <q-chip icon="badge" square>
          自动公招:
          <q-toggle color="accent" v-model="recurit" @input="modified++" />
        </q-chip>

        <q-input
          clearable
          class="col-12 col-md-4"
          label="保留理智"
          type="number"
          v-model.number="reserveAP"
          @input="modified++"
        />

        <q-select
          clearable
          v-model="selectedMap"
          label="作战地图"
          class="col-12 col-md-4"
          @filter="availableMaps"
          @input="modified++"
          :options="maps"
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
          class="col-12 q-pa-md"
          flat
          color="positive"
          icon="done"
          type="submit"
          @click="submitConfigChange"
          :disable="!modified"
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

interface MapSection {
  label: string;
  description?: string;
  map: string;
  model: string;
}

export default defineComponent({
  components: { GameSquadsPanel },
  data: () => {
    return {
      modified: 0,
      maps: null as null | MapSection[],
      selectedSquad: '',
      selectedMap: null as null | MapSection,
      paused: false,
      battle: false,
      recurit: false,
      reserveAP: 0,
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
    info() {
      const data = this.$props.data as GameInfoData;
      return data.PlayerStatus;
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
              label: data.mapId + '/' + data.modelName,
              description: data.description,
              map: data.mapId,
              model: data.modelName,
            };
          });
        } catch {
          abort();
        }
        update();
      }
    },
    async submitConfigChange() {
      try {
        this.$q.loading.show();
        const result = await api.setAutoBattle({
          account: this.$props.account,
          autoBattle: this.battle,
          autoRecruit: this.recurit,
          squadSelected: Number(this.selectedSquad),
          mapId: this.selectedMap?.map || '',
          modelName: this.selectedMap?.model || '',
          reserveAP: this.reserveAP,
        });
        this.$q.notify({
          message: '游戏设定修改完成',
          caption: result.message,
          type: 'positive',
          position: 'bottom',
          progress: true,
        });
      } finally {
        this.$q.loading.hide();
      }
      this.modified = 0;
    },
    async applyPauseChange(value: boolean) {
      try {
        this.$q.loading.show();
        if (value) {
          await api.setGamePause({ account: this.$props.account });
        } else {
          await api.setGameResume({ account: this.$props.account });
        }
        this.$q.notify({
          message: '暂停状态修改成功',
          caption: `已经修改为 ${String(value)}`,
          type: 'positive',
          position: 'bottom',
          progress: true,
        });
      } finally {
        this.$q.loading.hide();
      }
    },
    getSquadName(id: string): string | undefined {
      const data = this.$props.data as GameInfoData;
      return Object.keys(data.Squads).includes(id)
        ? data.Squads[id].name
        : undefined;
    },
  },
  watch: {
    config: {
      handler() {
        if (this.modified) {
          return;
        }

        this.selectedSquad = String(this.config.squadSelected);
        this.paused = this.config.isPause;
        this.battle = this.config.isAutoBattle;
        this.recurit = this.config.autoRecruit;
        this.selectedMap = {
          label: this.config.mapId + '/' + this.config.modelName,
          map: this.config.mapId,
          model: this.config.modelName,
        };
        this.reserveAP = this.config.reserveAP;
      },
      deep: true,
      immediate: true,
    },
    reserveAP() {
      if (this.reserveAP <= 0) {
        this.reserveAP = 0;
      } else if (this.reserveAP >= 60) {
        this.reserveAP = 60;
      }
      if (this.info.LiZhiMax >= 0 && this.info.LiZhiMax < this.reserveAP) {
        this.reserveAP = this.info.LiZhiMax;
      }
    },
  },
});
</script>
