<template>
  <div class="row q-pa-xs" v-if="gameData.PlayerStatus">
    <q-img
      class="shadow-1 col-4"
      ratio="1"
      :src="resourceURL(gameData.PlayerStatus.TouXiang)"
    />
    <q-card class="shadow-1 col-8">
      <q-card-section
        ><div class="text-subtitle">
          欢迎回来: <b>{{ gameData.PlayerStatus.UserName }}</b>
        </div></q-card-section
      >
      <q-separator />
      <q-card-section>
        <q-chip
          icon="mood"
          :color="
            gameData.PlayerStatus.LiZhi >= gameData.PlayerStatus.LiZhiMax
              ? 'warning'
              : 'info'
          "
          >理智: {{ gameData.PlayerStatus.LiZhi }} /
          {{ gameData.PlayerStatus.LiZhiMax }}</q-chip
        >
        <q-chip icon="bolt">等级: {{ gameData.PlayerStatus.Level }}</q-chip>
        <q-space />
        <q-chip icon="catching_pokemon">
          源石: <q-icon name="android" />{{
            gameData.PlayerStatus.YuanShi.Android
          }}
          |<q-icon name="phone_iphone" />{{
            gameData.PlayerStatus.YuanShi.iOS
          }} </q-chip
        ><q-chip icon="payments"
          >龙门币: {{ gameData.PlayerStatus.LongMenBi }}</q-chip
        >
        <q-chip icon="auto_awesome"
          >经验: {{ gameData.PlayerStatus.Exp }}</q-chip
        >
        <q-chip icon="savings"
          >信用: {{ gameData.PlayerStatus.XinYong }}</q-chip
        ></q-card-section
      >
    </q-card>
  </div>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import utils from 'src/utils';
import { GameInfoData } from '../api/models';

export default defineComponent({
  props: {
    data: {
      required: true,
    },
  },
  computed: {
    gameData: function (): GameInfoData {
      return this.data as GameInfoData;
    },
  },
  methods: {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    resourceURL: utils.resource,
  },
  setup(props) {
    return { ...props };
  },
});
</script>
