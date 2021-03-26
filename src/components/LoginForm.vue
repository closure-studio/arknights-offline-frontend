<template>
  <q-card ordered class="q-pa-xs col-4 transparent">
    <q-card-section>
      <q-form class="q-gutter-md">
        <q-input
          filled
          clearable
          v-model="username"
          label="用户名"
          :rules="[isBlank]"
        />
        <q-input
          filled
          clearable
          v-model="password"
          :type="isPwd ? 'password' : 'text'"
          label="密码"
          :rules="[isBlank]"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            /> </template
        ></q-input>
      </q-form>
    </q-card-section>
    <q-separator />
    <q-card-actions class="q-px-md" align="right">
      <q-btn
        label="登录"
        size="lg"
        color="primary"
        type="submit"
        @click="login"
        :disable="!completed"
      />
      <q-btn
        label="注册"
        size="lg"
        color="secondary"
        type="submit"
        @click="register"
        :disable="!completed"
      />
    </q-card-actions>
  </q-card>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'LoginForm',
  data: function () {
    return {
      username: '',
      password: '',
      isPwd: true,
    };
  },
  methods: {
    isBlank: function (value: string) {
      return !!value || '此项目为必填项目';
    },
    login: function () {
      this.$emit('login', { username: this.username, password: this.password });
    },
    register: function () {
      this.$emit('register', {
        username: this.username,
        password: this.password,
      });
    },
  },
  computed: {
    completed: function (): boolean {
      return !!this.username && !!this.password;
    },
  },
  setup() {
    return {};
  },
});
</script>
