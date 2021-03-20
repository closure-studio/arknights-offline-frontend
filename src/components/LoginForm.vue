<template>
  <div class="column col-6">
    <div class="row">
      <h3>离线托管</h3>
    </div>

    <div class="row">
      <q-img src="~assets/login.webp" class="col-6 shadow-1" basic
        ><div class="absolute-bottom text-h5">登录/注册</div></q-img
      >
      <q-card ordered class="q-pa-xs col-4 transparent">
        <q-card-section>
          <q-form class="q-gutter-md">
            <q-input
              filled
              clearable
              v-model="username"
              label="用户名"
              :disable="loading"
              :loading="loading"
              :rules="[isBlank]"
            />
            <q-input
              filled
              clearable
              v-model="password"
              :type="isPwd ? 'password' : 'text'"
              label="密码"
              :disable="loading"
              :loading="loading"
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
            :disable="loading || !completed"
          />
          <q-btn
            label="注册"
            size="lg"
            color="secondary"
            type="submit"
            @click="register_callback"
            :disable="loading || !completed"
          />
        </q-card-actions>
      </q-card>
    </div>
  </div>
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
      loading: true,
      isPwd: true,
    };
  },
  methods: {
    login_callback: function () {
      var login = this.$props.login as LoginFunc;
      this.loading = true;
      login(this.username, this.password).finally(() => {
        this.loading = false;
      });
    },
    register_callback: function () {
      var register = this.$props.register as LoginFunc;
      this.loading = true;
      register(this.username, this.password).finally(() => {
        this.loading = false;
      });
    },
    isBlank: function (value: string) {
      return !!value || '此项目为必填项目';
    },
  },
  mounted: function () {
    this.loading = false;
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
