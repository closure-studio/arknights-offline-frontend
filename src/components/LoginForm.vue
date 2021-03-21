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
        @click="login_callback"
        :disable="!completed"
      />
      <q-btn
        label="注册"
        size="lg"
        color="secondary"
        type="submit"
        @click="register_callback"
        :disable="!completed"
      />
    </q-card-actions>
  </q-card>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { LoginFunc } from './models';

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
    login_callback: function () {
      var login = this.$props.login as LoginFunc;
      this.$q.loading.show();
      login(this.username, this.password).finally(() => {
        this.$q.loading.hide();
      });
    },
    register_callback: function () {
      var register = this.$props.register as LoginFunc;
      this.$q.loading.show();
      register(this.username, this.password).finally(() => {
        this.$q.loading.hide();
      });
    },
    isBlank: function (value: string) {
      return !!value || '此项目为必填项目';
    },
  },
  computed: {
    completed: function (): boolean {
      return !!this.username && !!this.password;
    },
  },
  props: {
    login: {
      type: Function,
      required: true,
    },
    register: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    return { ...props };
  },
});
</script>
