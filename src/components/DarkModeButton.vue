<template>
  <q-toggle
    dense
    color="dark"
    unchecked-icon="light_mode"
    checked-icon="dark_mode"
    v-model="dark"
  />
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { LocalStorage } from 'quasar';

export default defineComponent({
  data: () => {
    return { dark: false };
  },
  watch: {
    dark: function () {
      this.$q.dark.set(this.dark);
      this.$q.notify({
        type: 'info',
        position: 'top',
        progress: true,
        message: `黑夜模式已${this.dark ? '开启' : '关闭'}`,
        timeout: 2.5 * 1000,
      });
      LocalStorage.set('dark', this.dark);
    },
  },
  beforeMount: function () {
    if (LocalStorage.has('dark')) {
      this.dark = LocalStorage.getItem('dark')?.valueOf() as boolean;
    } else {
      this.dark = false;
    }
  },
  setup() {
    return {};
  },
});
</script>
