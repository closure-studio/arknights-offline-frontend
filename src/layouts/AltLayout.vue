<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title> 明日方舟离线托管 </q-toolbar-title>
        <q-space />
        <q-separator vertical />
        <logout-button />
        <q-separator vertical />
        <q-btn dense flat round icon="menu" @click="right = !right" />
      </q-toolbar>
      <q-toolbar inset>
        <q-space />
        <web-socket-status />
        <dark-mode-button />
      </q-toolbar>

      <q-tabs align="left">
        <q-route-tab to="/" label="主页" />
        <q-route-tab to="/game" label="游戏列表" />
        <q-route-tab to="/login" label="用户登录" />
      </q-tabs>
    </q-header>

    <q-drawer show-if-above v-model="right" side="right" bordered>
      <side-bar />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import SideBar from 'components/SideBar.vue';
import DarkModeButton from 'components/DarkModeButton.vue';
import LogoutButton from 'components/LogoutButton.vue';
import WebSocketStatus from 'src/components/WebSocketStatus.vue';

export default {
  components: { SideBar, DarkModeButton, LogoutButton, WebSocketStatus },
  data() {
    return {
      right: false,
      components: { SideBar },
    };
  },
};
</script>