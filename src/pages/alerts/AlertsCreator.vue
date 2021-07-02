<template>
  <q-dialog v-model="addAlertModalWindowIsOpened">
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Add alert</div>
        <q-space />
        <q-btn addAlertModalWindowIsOpened="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section align="right">
        <form
          @submit.prevent.stop="plug"
          style="min-width: 240px"
        >
          <q-input
            v-model="email"
            filled
            type="email"
            placeholder="email"
            :rules="[val => !!val || 'Email is missing', isValidEmail]"
          />

          <q-btn label="OK" type="submit" color="primary" />
        </form>
      </q-card-section>

    </q-card>
  </q-dialog>
</template>

<script>
import {
  ADD_NEW_ALERT_ACTION,
} from 'src/store/modules/alerts/actions';

import { isValidEmail } from 'src/utils/helper.js';

export default {
  name: 'AlertsCreator',
  data() {
    return {
      addAlertModalWindowIsOpened: false,
      email: '',
    };
  },
  methods: {
    isValidEmail,
    plug() {
      this.$store.dispatch(ADD_NEW_ALERT_ACTION, this.email);
      this.email = '';
      this.addAlertModalWindowIsOpened = false;
      return true;
    },
    open() {
      this.addAlertModalWindowIsOpened = true;
    },
  },
};
</script>
