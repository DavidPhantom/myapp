<template>
  <form
    @submit.prevent.stop=""
    style="max-width: 400px"
    class="q-gutter-md"
  >
    <q-input
      v-model="smtp.port"
      filled
    />

    <q-input
      v-model="smtp.host"
      filled
    />

    <q-input
      v-model="smtp.login"
      filled
    />

    <q-input
      v-model="smtp.email_from"
      filled
      type="email"
      :rules="[val => !!val || 'Email is missing', isValidEmail]"
    />
    <q-input
      v-model="smtp.password"
      filled
      type="password"
    />

    <q-btn label="OK" type="submit" color="primary" />
  </form>
</template>

<script>
import { isValidEmail } from 'src/utils/helper.js';

export default {
  name: 'Smtp',
  data() {
    return {
      smtp: {
        port: '',
        host: '',
        login: '',
        email_from: '',
        password: '',
      },
    };
  },
  methods: {
    isValidEmail,
  },
};
</script>
