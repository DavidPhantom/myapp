<template>
  <form
    @submit.prevent.stop="save"
    style="max-width: 645px"
    class="q-gutter-md"
  >
    <div class="row">
      <q-input
        v-model="smtp.port"
        filled
        class="col-8"
      />
      <span
        class="col-4 q-pl-lg row items-center"
      >
      {{ $t('portDescription') }}
      </span>
    </div>

    <div class="row">
      <q-input
        v-model="smtp.host"
        filled
        class="col-8"
      />
      <span
        class="col-4 q-pl-lg row items-center"
      >
      {{ $t('hostDescription') }}
      </span>
    </div>

    <div class="row">
      <q-input
        v-model="smtp.login"
        filled
        class="col-8"
      />
      <span
        class="col-4 q-pl-lg row items-center"
      >
      {{ $t('loginDescription') }}
      </span>
    </div>

    <div class="row">
      <q-input
        v-model="smtp.email_from"
        filled
        type="email"
        class="col-8"
        :rules="[val => !!val || 'Email is missing', isValidEmail]"
      />
      <span
        class="col-4 row q-pl-lg items-center"
      >
      {{ $t('emailDescription') }}
      </span>
    </div>

    <div class="row">
      <q-input
        v-model="smtp.password"
        filled
        class="col-8"
        type="password"
      />
      <span
        class="col-4 row q-pl-lg items-center"
      >
      {{ $t('passwordDescription') }}
      </span>
    </div>

    <q-btn label="OK" type="submit" color="primary" />
  </form>
</template>

<script>
import { isValidEmail } from 'src/utils/helper.js';
import { SMTP } from 'src/store/modules/smtp/getters';

export default {
  name: 'Smtp',
  computed: {
    smtp() {
      return this.$store.getters[SMTP];
    },
  },
  methods: {
    isValidEmail,
    save() {
      this.$q.notify({
        message: this.$t('savedSuccessfully'),
        color: 'primary',
      });
    },
  },
};
</script>
