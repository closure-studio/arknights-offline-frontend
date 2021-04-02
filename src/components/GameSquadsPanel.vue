<template>
  <q-card>
    <q-card-section>
      <q-tabs v-model="tab" class="text-accent">
        <q-tab
          v-for="key in Object.keys(squads)"
          :name="key"
          :key="key"
          :label="squads[key].name"
        ></q-tab>
      </q-tabs>
    </q-card-section>
    <q-separator />
    <q-card
      class="row transparent justify-evenly items-center shadow-3 q-pa-xs"
    >
      <div
        class="col-2 q-pa-xs"
        v-for="member in Object.keys(squads).includes(tab)
          ? squads[tab].slots.filter((value) => !!value)
          : []"
        :key="member"
      >
        <q-img
          class="shadow-1"
          v-if="member"
          :src="resourceURL(`squad_${member.name}`)"
          :ratio="3 / 5"
          position="50% 0%"
        ></q-img>
      </div>
    </q-card>
  </q-card>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { GameInfoData } from '../api/models';
import utils from '../utils';

export default defineComponent({
  data: () => {
    return { tab: '' };
  },
  props: {
    data: {
      required: true,
    },
  },
  setup(props) {
    return { ...props };
  },
  computed: {
    squads: function () {
      const data = this.$props.data as GameInfoData;
      return data.Squads;
    },
  },
  mounted: function () {
    this.tab = Object.keys(this.squads)[0];
  },
  methods: {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    resourceURL: utils.resource,
  },
});
</script>
