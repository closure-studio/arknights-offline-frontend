<template>
  <q-page class="row justify-center items-center">
    <login-form :login="login" :register="register"></login-form>
  </q-page>
</template>

<script lang="ts">
import { Todo, Meta } from 'components/models';
import LoginForm from 'components/LoginForm.vue';
import { defineComponent, ref } from '@vue/composition-api';
import api from '../api';

function sleep(ms: number): Promise<null> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default defineComponent({
  name: 'PageIndex',
  components: { LoginForm },
  methods: {
    login: api.userLogin,
    register: api.userRegister,
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
