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
      :login="login"
      :register="register"
    ></login-form>
  </q-page>
</template>

<script lang="ts">
import { Todo, Meta } from 'components/models';
import LoginForm from 'components/LoginForm.vue';
import { defineComponent, ref } from '@vue/composition-api';
import api from '../api';

export default defineComponent({
  name: 'PageIndex',
  components: { LoginForm },
  methods: {
    login: async function (username: string, password: string) {
      const response = await api.userLogin(username, password);
      api.token.set(response.data.token);
    },
    register: async function (username: string, password: string) {
      const response = await api.userRegister(username, password);
      api.token.set(response.data.token);
    },
  },
  data: () => {
    return { password: '', username: '' };
  },
  setup() {
    const todos = ref<Todo[]>([
      {
        id: 1,
        content: 'ct1',
      },
      {
        id: 2,
        content: 'ct2',
      },
      {
        id: 3,
        content: 'ct3',
      },
      {
        id: 4,
        content: 'ct4',
      },
      {
        id: 5,
        content: 'ct5',
      },
    ]);
    const meta = ref<Meta>({
      totalCount: 1200,
    });
    return { todos, meta };
  },
});
</script>
