<template>
  <q-page class="row justify-center items-center">
    <q-img class="col-12 col-md-4" src="~assets/login.webp"
      ><div class="absolute-bottom">
        <div class="text-h4">离线托管</div>
        <div class="text-subtitle">登录/注册</div>
      </div></q-img
    >
    <login-form
      class="col-12 col-md-4"
      @login="login"
      @register="register"
    ></login-form>
  </q-page>
</template>

<script lang="ts">
import LoginForm from 'components/LoginForm.vue';
import { defineComponent } from '@vue/composition-api';
import api from '../api';

export default defineComponent({
  name: 'UserLogin',
  components: { LoginForm },
  methods: {
    login: async function (value: { username: string; password: string }) {
      try {
        this.$q.loading.show();
        await this.$store.dispatch('login/loginAccount', {
          username: value.username,
          password: value.password,
        });
      } finally {
        this.$q.loading.hide();
      }
    },
    register: async function (value: { username: string; password: string }) {
      try {
        this.$q.loading.show();
        await api.userRegister(value.username, value.password);
        await this.login(value);
      } finally {
        this.$q.loading.hide();
      }
    },
  },
  data: () => {
    return { password: '', username: '' };
  },
  setup() {
    return {};
  },
});
</script>
