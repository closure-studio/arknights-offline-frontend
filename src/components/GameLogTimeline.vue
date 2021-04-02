<template>
  <div>
    <q-pagination v-model="page" :max="total" boundary-numbers />
    <v-separator />
    <q-timeline color="accent" layout="comfortable">
      <q-timeline-entry
        icon="timeline"
        v-for="log in logSlice(page)"
        :title="log.text"
        :subtitle="log.logtime"
        :key="log.id"
      ></q-timeline-entry
    ></q-timeline>
  </div>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { GameInfoData } from '../api/models';

export default defineComponent({
  data: () => {
    return { page: 1 };
  },
  props: {
    data: {
      required: true,
    },
    size: {
      type: Number,
      required: false,
    },
  },
  setup(props) {
    return { ...props };
  },
  computed: {
    logs: function () {
      const data = this.$props.data as GameInfoData;
      return data.Log;
    },
    total: function (): number {
      const size = this.$props.size || 5;
      return Math.ceil(this.logs.length / size);
    },
  },
  methods: {
    logSlice: function (page: number) {
      const size = this.$props.size || 5;
      return this.logs.slice(size * (page - 1), size * page);
    },
  },
});
</script>
