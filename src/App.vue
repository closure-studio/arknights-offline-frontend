<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'App',
  beforeMount: function () {
    try {
      this.$store.commit('login/login');
    } catch (err) {
      console.log(`Failed to find account info locally: ${String(err)}`);
    }
  },
});
</script>
